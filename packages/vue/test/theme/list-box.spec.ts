import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import ListBox from '@/components/list-box/ListBox.vue'

describe('ListBox theme', () => {
  it('renders a string item icon as the icon class', () => {
    const wrapper = mount(ListBox, {
      props: { items: [{ value: 'a', label: 'Alpha', icon: 'icon-alpha' }] },
    })

    expect(wrapper.get('[data-slot=list-box-item-icon]').classes()).toContain('icon-alpha')
  })
})
