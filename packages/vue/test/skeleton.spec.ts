import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { nextTick } from 'vue'

import Skeleton from '@/components/skeleton/Skeleton.vue'

import { expectAccessible } from './a11y'

const mountSkeleton = async (props: Record<string, unknown> = {}) => {
  const wrapper = mount(Skeleton, { props, attachTo: document.body })
  await nextTick()

  return wrapper
}

describe('Skeleton', () => {
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
