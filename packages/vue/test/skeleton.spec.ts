import { mount } from '@vue/test-utils'
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import { expectAccessible } from './a11y'

// Pay the cold SFC transform once, outside the per-test timeout.
beforeAll(async () => {
  await import('../src/components/skeleton/Skeleton.vue')
}, 30_000)

afterEach(() => {
  document.documentElement.style.removeProperty('--skeleton-animation')
  vi.resetModules()
})

// Dynamic import is intentional: `--skeleton-animation` is cached at module level (once per
// page), so each test needs a fresh module instance after `vi.resetModules()`.
async function mountSkeleton(props: Record<string, unknown> = {}) {
  const { default: Skeleton } = await import('../src/components/skeleton/Skeleton.vue')
  const wrapper = mount(Skeleton, { props, attachTo: document.body })
  await nextTick()
  return wrapper
}

describe('Skeleton', () => {
  it('defaults to the shimmer animation', async () => {
    const wrapper = await mountSkeleton()
    expect(wrapper.classes()).toContain('after:animate-skeleton')
    expect(wrapper.classes()).not.toContain('animate-pulse')
  })

  it('follows --skeleton-animation on :root when animationType is omitted', async () => {
    document.documentElement.style.setProperty('--skeleton-animation', 'pulse')
    const wrapper = await mountSkeleton()
    expect(wrapper.classes()).toContain('animate-pulse')
    expect(wrapper.classes()).not.toContain('after:animate-skeleton')
  })

  it('animationType overrides --skeleton-animation', async () => {
    document.documentElement.style.setProperty('--skeleton-animation', 'pulse')
    const wrapper = await mountSkeleton({ animationType: 'none' })
    expect(wrapper.classes()).not.toContain('animate-pulse')
    expect(wrapper.classes()).not.toContain('after:animate-skeleton')
  })

  it('user classes win over theme classes', async () => {
    const wrapper = await mountSkeleton({ class: 'rounded-full bg-neutral-200' })
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['rounded-full', 'bg-neutral-200']))
    expect(wrapper.classes()).not.toContain('rounded-sm')
    expect(wrapper.classes()).not.toContain('bg-surface-tertiary/70')
  })

  it('is accessible as a bare placeholder and hidden from assistive tech with aria-hidden', async () => {
    const bare = await mountSkeleton({ class: 'h-3 w-24' })
    await expectAccessible(bare)
    bare.unmount()
    const hidden = await mountSkeleton({ 'aria-hidden': 'true' })
    expect(hidden.attributes('aria-hidden')).toBe('true')
    await expectAccessible(hidden)
    hidden.unmount()
  })
})
