import { mount } from '@vue/test-utils'
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'

// Pay the cold SFC transform once, outside the per-test timeout.
beforeAll(async () => {
  await import('@/components/skeleton/Skeleton.vue')
}, 30_000)

afterEach(() => {
  document.documentElement.style.removeProperty('--skeleton-animation')
  vi.resetModules()
})

// Dynamic import is intentional: `--skeleton-animation` is cached at module level (once per
// page), so each test needs a fresh module instance after `vi.resetModules()`.
const mountSkeleton = async (props: Record<string, unknown> = {}) => {
  const { default: Skeleton } = await import('@/components/skeleton/Skeleton.vue')
  const wrapper = mount(Skeleton, { props, attachTo: document.body })
  await nextTick()

  return wrapper
}

describe('Skeleton theme', () => {
  it('defaults to the shimmer animation', async () => {
    const wrapper = await mountSkeleton()
    expect(wrapper.classes()).toContain('after:animate-skeleton')
    expect(wrapper.classes()).not.toContain('animate-pulse')
    wrapper.unmount()
  })

  it('follows --skeleton-animation on :root when animationType is omitted', async () => {
    document.documentElement.style.setProperty('--skeleton-animation', 'pulse')
    const wrapper = await mountSkeleton()
    expect(wrapper.classes()).toContain('animate-pulse')
    expect(wrapper.classes()).not.toContain('after:animate-skeleton')
    wrapper.unmount()
  })

  it('animationType overrides --skeleton-animation', async () => {
    document.documentElement.style.setProperty('--skeleton-animation', 'pulse')
    const wrapper = await mountSkeleton({ animationType: 'none' })
    expect(wrapper.classes()).not.toContain('animate-pulse')
    expect(wrapper.classes()).not.toContain('after:animate-skeleton')
    wrapper.unmount()
  })

  it('user classes win over theme classes', async () => {
    const wrapper = await mountSkeleton({ class: 'rounded-full bg-neutral-200' })
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['rounded-full', 'bg-neutral-200']))
    expect(wrapper.classes()).not.toContain('rounded-sm')
    expect(wrapper.classes()).not.toContain('bg-surface-tertiary/70')
    wrapper.unmount()
  })
})
