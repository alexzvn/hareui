import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import Tabs from '../src/components/tabs/Tabs.vue'

const items = [
  { label: 'Overview', value: 'overview', content: 'Overview content' },
  { label: 'Analytics', value: 'analytics', content: 'Analytics content' },
  { label: 'Reports', value: 'reports', content: 'Reports content' },
]

describe('Tabs', () => {
  afterEach(() => {
    document.body.innerHTML = ''
  })

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

  function activeTabLabel(): string {
    const active = document.activeElement
    return active?.matches('[data-slot=tabs-tab]') ? active.textContent!.trim() : `<${active?.tagName.toLowerCase()}>`
  }

  function pressKey(el: Element, key: string) {
    el.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }))
  }

  // behaviour-final-check H3 (T1)
  it('keeps focus on the newly selected tab after ArrowRight and ArrowLeft', async () => {
    const wrapper = mount(Tabs, { props: { items, defaultValue: 'overview' }, attachTo: document.body })
    await flushPromises()
    const getTabs = () => wrapper.findAll('[data-slot=tabs-tab]')
    ;(getTabs()[0]!.element as HTMLElement).focus()
    expect(activeTabLabel()).toBe('Overview')

    pressKey(document.activeElement!, 'ArrowRight')
    await flushPromises()
    expect(wrapper.find('[data-slot=tabs-panel]').text()).toBe('Analytics content')
    expect(activeTabLabel()).toBe('Analytics')

    pressKey(document.activeElement!, 'ArrowRight')
    await flushPromises()
    expect(wrapper.find('[data-slot=tabs-panel]').text()).toBe('Reports content')
    expect(activeTabLabel()).toBe('Reports')

    pressKey(document.activeElement!, 'ArrowLeft')
    await flushPromises()
    expect(wrapper.find('[data-slot=tabs-panel]').text()).toBe('Analytics content')
    expect(activeTabLabel()).toBe('Analytics')
    wrapper.unmount()
  })

  // behaviour-final-check T2
  it('does not make the panel a tab stop when it contains a tabbable child', () => {
    const wrapper = mount(Tabs, {
      props: { items: [{ label: 'One', value: 'one' }, { label: 'Two', value: 'two' }], defaultValue: 'one' },
      slots: { content: '<button type="button">Inner action</button>' },
      attachTo: document.body,
    })
    const panel = wrapper.find('[data-slot=tabs-panel]')
    expect(panel.find('button').exists()).toBe(true)
    expect(panel.attributes('tabindex')).not.toBe('0')
    wrapper.unmount()
  })

  // behaviour-final-check T3
  it('selects the first enabled tab when the first tab is disabled and no defaultValue is given', async () => {
    const wrapper = mount(Tabs, {
      props: {
        items: [
          { label: 'Tab 1', value: 'one', disabled: true, content: 'Panel 1' },
          { label: 'Tab 2', value: 'two', content: 'Panel 2' },
          { label: 'Tab 3', value: 'three', content: 'Panel 3' },
        ],
      },
      attachTo: document.body,
    })
    await wrapper.vm.$nextTick()

    const tabs = wrapper.findAll('[data-slot=tabs-tab]')
    expect(tabs.map(t => t.attributes('data-state'))).toEqual(['inactive', 'active', 'inactive'])
    expect(wrapper.find('[data-slot=tabs-panel]').text()).toBe('Panel 2')
    wrapper.unmount()
  })

  // behaviour-final-check T3
  it('keeps exactly one tab focusable when the first tab is disabled and no defaultValue is given', async () => {
    const wrapper = mount(Tabs, {
      props: {
        items: [
          { label: 'Tab 1', value: 'one', disabled: true },
          { label: 'Tab 2', value: 'two' },
          { label: 'Tab 3', value: 'three' },
        ],
      },
      attachTo: document.body,
    })
    await flushPromises()

    const tabs = wrapper.findAll('[data-slot=tabs-tab]')
    expect(tabs.map(t => t.attributes('tabindex'))).toEqual(['-1', '0', '-1'])
    wrapper.unmount()
  })
})
