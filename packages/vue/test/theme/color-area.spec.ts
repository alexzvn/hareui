import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import ColorArea from '@/components/color-area/ColorArea.vue'

const area = '[data-slot=color-area]'

describe('ColorArea theme', () => {
  it('showDots adds the dot overlay classes', () => {
    const on = mount(ColorArea, { props: { showDots: true, defaultValue: '#0485F7' } })
    const off = mount(ColorArea, { props: { defaultValue: '#0485F7' } })
    expect(on.find(area).classes().join(' ')).toContain('after:')
    expect(off.find(area).classes().join(' ')).not.toContain('after:')
  })

  it('a user class on the root is merged and wins over the default size', () => {
    const wrapper = mount(ColorArea, {
      props: { class: 'size-44 rounded-3xl', defaultValue: '#0485F7' },
    })

    const cls = wrapper.find(area).classes()
    expect(cls).toContain('size-44')
    expect(cls).toContain('rounded-3xl')
    expect(cls).not.toContain('rounded-2xl')
  })
})
