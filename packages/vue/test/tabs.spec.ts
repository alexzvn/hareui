import { flushPromises, mount } from '@vue/test-utils'
import { ConfigProvider } from 'reka-ui'
import { afterEach, describe, expect, it } from 'vitest'
import { h } from 'vue'

import type { TabsProps } from '@/components/tabs/Tabs.types'
import Tabs from '@/components/tabs/Tabs.vue'

import { expectAccessible } from './a11y'

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
    const wrapper = mount(Tabs, {
      props: { items, defaultValue: 'overview' },
      attachTo: document.body,
    })

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

  const activeTabLabel = (): string => {
    const active = document.activeElement
    return active?.matches('[data-slot=tabs-tab]')
      ? active.textContent!.trim()
      : `<${active?.tagName.toLowerCase()}>`
  }

  const pressKey = (el: Element, key: string) => {
    el.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }))
  }

  // behaviour-final-check H3 (T1)
  it('keeps focus on the newly selected tab after ArrowRight and ArrowLeft', async () => {
    const wrapper = mount(Tabs, {
      props: { items, defaultValue: 'overview' },
      attachTo: document.body,
    })

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
      props: {
        items: [
          { label: 'One', value: 'one' },
          { label: 'Two', value: 'two' },
        ],
        defaultValue: 'one',
      },
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
    expect(tabs.map((t) => t.attributes('data-state'))).toEqual(['inactive', 'active', 'inactive'])
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
    expect(tabs.map((t) => t.attributes('tabindex'))).toEqual(['-1', '0', '-1'])
    wrapper.unmount()
  })
})

describe('Tabs keyboard and focus parity', () => {
  afterEach(() => {
    document.body.innerHTML = ''
  })

  // behaviour-final-check T6: RAC's tab list ignores PageUp / PageDown
  it('PageUp / PageDown neither move focus nor change the selected tab', async () => {
    const wrapper = mount(Tabs, {
      props: { items, defaultValue: 'analytics' },
      attachTo: document.body,
    })

    await flushPromises()
    const tab = wrapper.findAll('[data-slot=tabs-tab]')[1]!
    ;(tab.element as HTMLElement).focus()

    for (const key of ['PageUp', 'PageDown']) {
      tab.element.dispatchEvent(
        new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }),
      )

      await flushPromises()
      expect(document.activeElement).toBe(tab.element)
      expect(wrapper.find('[data-slot=tabs-panel]').text()).toBe('Analytics content')
    }

    wrapper.unmount()
  })

  // behaviour-final-check T7: the tablist itself is not focusable (RAC), only the selected tab is a tab stop
  it('makes the selected tab the only tab stop and keeps the tablist out of focus', async () => {
    const wrapper = mount(Tabs, {
      props: { items, defaultValue: 'reports' },
      attachTo: document.body,
    })

    await flushPromises()
    expect(wrapper.get('[role=tablist]').attributes('tabindex')).toBeUndefined()

    expect(wrapper.findAll('[data-slot=tabs-tab]').map((t) => t.attributes('tabindex'))).toEqual([
      '-1',
      '-1',
      '0',
    ])

    wrapper.unmount()
  })

  // HeroUI renders the selection indicator inside the selected tab: in document order it follows that tab
  it('keeps one indicator, placed right after the selected tab', async () => {
    const wrapper = mount(Tabs, {
      props: { items, defaultValue: 'overview' },
      attachTo: document.body,
    })

    await flushPromises()

    const order = () =>
      [...wrapper.get('[data-slot=tabs-list]').element.children]
        .map((el) =>
          el.getAttribute('data-slot') === 'tabs-indicator' ? '|' : el.textContent!.trim(),
        )
        .join(' ')

    expect(order()).toBe('Overview | Analytics Reports')
    await wrapper.findAll('[data-slot=tabs-tab]')[1]!.trigger('mousedown')
    await flushPromises()
    expect(order()).toBe('Overview Analytics | Reports')
    expect(wrapper.findAll('[data-slot=tabs-indicator]')).toHaveLength(1)
    wrapper.unmount()
  })

  // behaviour-final-check T2: the panel is a tab stop only while it has no tabbable content
  it('makes a panel without tabbable content a tab stop', async () => {
    const wrapper = mount(Tabs, {
      props: { items, defaultValue: 'overview' },
      attachTo: document.body,
    })

    await flushPromises()
    expect(wrapper.get('[data-slot=tabs-panel]').attributes('tabindex')).toBe('0')
    wrapper.unmount()
  })
})

describe('Tabs accessibility', () => {
  afterEach(() => {
    document.body.innerHTML = ''
  })

  const withDisabled = [
    { label: 'Overview', value: 'overview', content: 'Overview content' },
    { label: 'Analytics', value: 'analytics', content: 'Analytics content', disabled: true },
    { label: 'Reports', value: 'reports', content: 'Reports content' },
  ]

  const press = async (key: string) => {
    document.activeElement!.dispatchEvent(
      new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }),
    )

    await flushPromises()
  }

  const focused = () => document.activeElement?.textContent?.trim()

  it('passes axe with the default, vertical, separator, disabled-tab, tabbable-panel and panel-less setups', async () => {
    const cases: Pick<TabsProps, keyof TabsProps>[] = [
      { items, defaultValue: 'overview' },
      { items, defaultValue: 'analytics', orientation: 'vertical' },
      { items, defaultValue: 'reports', separator: true, variant: 'secondary' },
      { items: withDisabled },
      { items, content: false },
    ]

    for (const props of cases) {
      const wrapper = mount(Tabs, { props, attachTo: document.body })
      await flushPromises()
      await expectAccessible(wrapper)
      wrapper.unmount()
    }

    const tabbable = mount(Tabs, {
      props: { items },
      slots: { content: '<button type="button">Inner action</button>' },
      attachTo: document.body,
    })

    await flushPromises()
    await expectAccessible(tabbable)
    tabbable.unmount()
  })

  it('wires tablist, tabs and the panel: only the selected tab controls the rendered panel, which it names', async () => {
    const wrapper = mount(Tabs, {
      props: { items, defaultValue: 'analytics' },
      attachTo: document.body,
    })

    await flushPromises()
    const list = wrapper.get('[role=tablist]')
    expect(list.attributes('aria-orientation')).toBe('horizontal')
    const tabs = wrapper.findAll('[role=tab]')
    expect(tabs.map((t) => t.attributes('aria-selected'))).toEqual(['false', 'true', 'false'])
    const panel = wrapper.get('[role=tabpanel]')
    expect(tabs[1]!.attributes('aria-controls')).toBe(panel.attributes('id'))

    expect(tabs.filter((_, i) => i !== 1).map((t) => t.attributes('aria-controls'))).toEqual([
      undefined,
      undefined,
    ])

    expect(document.getElementById(panel.attributes('aria-labelledby')!)).toBe(tabs[1]!.element)

    await tabs[2]!.trigger('mousedown', { button: 0 })
    await flushPromises()
    const next = wrapper.get('[role=tabpanel]')

    expect(wrapper.findAll('[role=tab]').map((t) => t.attributes('aria-selected'))).toEqual([
      'false',
      'false',
      'true',
    ])

    expect(wrapper.findAll('[role=tab]')[2]!.attributes('aria-controls')).toBe(
      next.attributes('id'),
    )

    expect(document.getElementById(next.attributes('aria-labelledby')!)).toBe(
      wrapper.findAll('[role=tab]')[2]!.element,
    )

    wrapper.unmount()
  })

  it('a vertical tab list reports its orientation', async () => {
    const wrapper = mount(Tabs, {
      props: { items, orientation: 'vertical' },
      attachTo: document.body,
    })

    await flushPromises()
    expect(wrapper.get('[role=tablist]').attributes('aria-orientation')).toBe('vertical')
    wrapper.unmount()
  })

  it('arrow keys wrap around the ends, Home / End jump to the first / last tab, and selection follows focus', async () => {
    const wrapper = mount(Tabs, {
      props: { items, defaultValue: 'overview' },
      attachTo: document.body,
    })

    await flushPromises()
    ;(wrapper.findAll('[role=tab]')[0]!.element as HTMLElement).focus()

    await press('ArrowLeft')
    expect(focused()).toBe('Reports')
    expect(wrapper.get('[role=tabpanel]').text()).toBe('Reports content')
    await press('ArrowRight')
    expect(focused()).toBe('Overview')
    await press('End')
    expect(focused()).toBe('Reports')
    await press('Home')
    expect(focused()).toBe('Overview')
    expect(wrapper.get('[role=tabpanel]').text()).toBe('Overview content')

    expect(wrapper.emitted('update:modelValue')!.map(([v]) => v)).toEqual([
      'reports',
      'overview',
      'reports',
      'overview',
    ])

    wrapper.unmount()
  })

  it('horizontal tabs ignore ArrowUp / ArrowDown', async () => {
    const wrapper = mount(Tabs, {
      props: { items, defaultValue: 'analytics' },
      attachTo: document.body,
    })

    await flushPromises()
    ;(wrapper.findAll('[role=tab]')[1]!.element as HTMLElement).focus()
    await press('ArrowDown')
    await press('ArrowUp')
    expect(focused()).toBe('Analytics')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    wrapper.unmount()
  })

  it('vertical tabs move with ArrowDown / ArrowUp, and also with ArrowRight / ArrowLeft like React Aria', async () => {
    const wrapper = mount(Tabs, {
      props: { items, defaultValue: 'overview', orientation: 'vertical' },
      attachTo: document.body,
    })

    await flushPromises()
    ;(wrapper.findAll('[role=tab]')[0]!.element as HTMLElement).focus()
    await press('ArrowDown')
    expect(focused()).toBe('Analytics')
    await press('ArrowUp')
    expect(focused()).toBe('Overview')
    await press('ArrowRight')
    expect(focused()).toBe('Analytics')
    await press('ArrowLeft')
    expect(focused()).toBe('Overview')
    expect(wrapper.get('[role=tabpanel]').text()).toBe('Overview content')
    wrapper.unmount()
  })

  it('in a right-to-left vertical list ArrowLeft moves to the next tab', async () => {
    const wrapper = mount(
      () =>
        h(ConfigProvider, { dir: 'rtl' }, () =>
          h(Tabs, { items, defaultValue: 'overview', orientation: 'vertical' }),
        ),
      { attachTo: document.body },
    )

    await flushPromises()
    ;(wrapper.findAll('[role=tab]')[0]!.element as HTMLElement).focus()
    await press('ArrowLeft')
    expect(focused()).toBe('Analytics')
    await press('ArrowRight')
    expect(focused()).toBe('Overview')
    wrapper.unmount()
  })

  it('keyboard navigation skips disabled tabs, which are exposed as disabled', async () => {
    const wrapper = mount(Tabs, {
      props: { items: withDisabled, defaultValue: 'overview' },
      attachTo: document.body,
    })

    await flushPromises()
    const tabs = wrapper.findAll('[role=tab]')
    expect((tabs[1]!.element as HTMLButtonElement).disabled).toBe(true)
    ;(tabs[0]!.element as HTMLElement).focus()
    await press('ArrowRight')
    expect(focused()).toBe('Reports')
    await press('ArrowLeft')
    expect(focused()).toBe('Overview')
    expect(wrapper.emitted('update:modelValue')!.map(([v]) => v)).not.toContain('analytics')
    wrapper.unmount()
  })

  it('Enter and Space on a focused tab keep it selected without moving focus', async () => {
    const wrapper = mount(Tabs, {
      props: { items, defaultValue: 'overview' },
      attachTo: document.body,
    })

    await flushPromises()
    ;(wrapper.findAll('[role=tab]')[2]!.element as HTMLElement).focus()
    await flushPromises()

    for (const key of ['Enter', ' ']) {
      await press(key)
      expect(focused()).toBe('Reports')
      expect(wrapper.get('[role=tabpanel]').text()).toBe('Reports content')
    }

    wrapper.unmount()
  })

  it('the scroll buttons are named and kept out of the Tab order', async () => {
    const wrapper = mount(Tabs, { props: { items }, attachTo: document.body })
    await flushPromises()
    const buttons = wrapper.findAll('[data-slot=tabs-list-container] > button')
    expect(buttons.map((b) => [b.attributes('aria-label'), b.attributes('tabindex')])).toEqual([
      ['Scroll tabs left', '-1'],
      ['Scroll tabs right', '-1'],
    ])

    wrapper.unmount()
  })
})
