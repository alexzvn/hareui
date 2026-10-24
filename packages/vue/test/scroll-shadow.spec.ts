import type { VNode } from 'vue'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { defineComponent, h, nextTick } from 'vue'
import ScrollShadow from '../src/components/scroll-shadow/ScrollShadow.vue'
import { expectAccessible } from './a11y'

const mountAll = (children: () => VNode[]) => mount(defineComponent(() => () => h('div', children())), { attachTo: document.body })

describe('scrollShadow', () => {
  it('manual visibility sets the matching data flag and manual mode', async () => {
    const wrapper = mount(ScrollShadow, { props: { visibility: 'both' } })
    const root = wrapper.find('[data-slot=scroll-shadow]')
    expect(root.attributes('data-scroll-shadow-mode')).toBe('manual')
    expect(root.attributes('data-top-bottom-scroll')).toBe('true')

    await wrapper.setProps({ orientation: 'horizontal', visibility: 'left' })
    expect(root.attributes('data-left-scroll')).toBe('true')
    expect(root.attributes('data-top-bottom-scroll')).toBeUndefined()

    await wrapper.setProps({ visibility: 'none' })
    expect(Object.keys(root.attributes()).filter(a => a.endsWith('-scroll'))).toEqual([])
  })

  it('auto mode publishes no flags until measured, and disabled detection is manual', () => {
    const auto = mount(ScrollShadow)
    expect(auto.attributes('data-scroll-shadow-mode')).toBe('auto')
    expect(Object.keys(auto.attributes()).filter(a => a.endsWith('-scroll'))).toEqual([])
    expect(mount(ScrollShadow, { props: { enabled: false } }).attributes('data-scroll-shadow-mode')).toBe('manual')
  })

  it('is accessible in auto and manual modes', async () => {
    const wrapper = mountAll(() => [
      h(ScrollShadow, null, () => h('p', 'Long text')),
      h(ScrollShadow, { visibility: 'both', orientation: 'horizontal', hideScrollBar: true }, () => h('p', 'Wide text')),
    ])
    await nextTick()
    await expectAccessible(wrapper)
    wrapper.unmount()
  })

  it('a text-only scroller can be made a labelled, keyboard-focusable region (tabindex, role and name pass through)', async () => {
    const region = mount(ScrollShadow, {
      attrs: { 'tabindex': '0', 'role': 'region', 'aria-label': 'Terms of service' },
      slots: { default: () => h('p', 'Long text') },
      attachTo: document.body,
    })
    expect(region.attributes()).toMatchObject({ 'tabindex': '0', 'role': 'region', 'aria-label': 'Terms of service' })
    await expectAccessible(region)
    ;(region.element as HTMLElement).focus()
    expect(document.activeElement).toBe(region.element)
    region.unmount()
  })

  it('never hides content from assistive tech while toggling shadows', async () => {
    const wrapper = mount(ScrollShadow, { props: { visibility: 'both' }, slots: { default: () => h('p', 'Long text') } })
    await wrapper.setProps({ visibility: 'none' })
    expect(wrapper.attributes('aria-hidden')).toBeUndefined()
    expect(wrapper.text()).toBe('Long text')
    wrapper.unmount()
  })
})
