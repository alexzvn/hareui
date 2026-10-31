import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import Tabs from '@/components/tabs/Tabs.vue'

describe('Tabs theme', () => {
  it('renders a string item icon as the icon class', () => {
    const wrapper = mount(Tabs, {
      props: { items: [{ label: 'Overview', value: 'overview', icon: 'icon-overview' }] },
    })

    expect(wrapper.get('[data-slot=tabs-tab-icon]').classes()).toContain('icon-overview')
  })
})

describe('Tabs indicator placement', () => {
  it('anchors the indicator to the physical left edge so RTL offsets measured from the left still apply', () => {
    const wrapper = mount(Tabs, {
      props: { items: [{ label: 'Overview', value: 'overview' }], defaultValue: 'overview' },
    })

    const classes = wrapper.get('[data-slot=tabs-indicator]').classes()
    expect(classes).toContain('left-0')
    expect(classes).not.toContain('start-0')
  })
})
