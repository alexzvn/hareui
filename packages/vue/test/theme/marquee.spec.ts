import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import Marquee from '@/components/marquee/Marquee.vue'

const firstCopy = (root: Element) => root.querySelector('[data-slot="marquee-content"]')!

describe('Marquee theme', () => {
  it('pauses the copies when reduced motion is requested', () => {
    const wrapper = mount(Marquee)

    expect(firstCopy(wrapper.element).classList).toContain(
      'motion-reduce:[animation-play-state:paused]',
    )
  })

  it('clips only the horizontal axis when horizontal', () => {
    const classes = mount(Marquee).classes()

    expect(classes).toContain('overflow-x-clip')
    expect(classes).not.toContain('overflow-hidden')
  })

  it('clips only the vertical axis when vertical', () => {
    const classes = mount(Marquee, { props: { orientation: 'vertical' } }).classes()

    expect(classes).toContain('overflow-y-clip')
    expect(classes).not.toContain('overflow-hidden')
  })
})
