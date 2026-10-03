import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Tabs from '../src/components/Tabs.vue'

const items = [
  { label: 'Overview', value: 'overview', content: 'Overview content' },
  { label: 'Analytics', value: 'analytics', content: 'Analytics content' },
  { label: 'Reports', value: 'reports', content: 'Reports content' },
]

describe('Tabs', () => {
  it('clicking a tab switches the visible panel and the model', async () => {
    const wrapper = mount(Tabs, { props: { items, defaultValue: 'overview' }, attachTo: document.body })
    expect(wrapper.find('[data-slot=tabs-panel]').text()).toBe('Overview content')

    const tabs = wrapper.findAll('[data-slot=tabs-tab]')
    await tabs[1]!.trigger('mousedown', { button: 0 })

    expect(wrapper.find('[data-slot=tabs-panel]').text()).toBe('Analytics content')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['analytics'])
    wrapper.unmount()
  })

  it('[item.slot] overrides #content for that item', () => {
    const wrapper = mount(Tabs, {
      props: { items: [{ label: 'A', value: 'a', slot: 'custom' }], defaultValue: 'a' },
      slots: {
        content: 'fallback content',
        custom: 'custom slot content',
      },
    })
    expect(wrapper.find('[data-slot=tabs-panel]').text()).toBe('custom slot content')
  })

  it('falls back to #content when no [item.slot] is set', () => {
    const wrapper = mount(Tabs, {
      props: { items: [{ label: 'A', value: 'a' }], defaultValue: 'a' },
      slots: { content: 'fallback content' },
    })
    expect(wrapper.find('[data-slot=tabs-panel]').text()).toBe('fallback content')
  })
})
