import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import type { VNode } from 'vue'
import { defineComponent, h } from 'vue'

import Separator from '../src/components/separator/Separator.vue'
import Toolbar from '../src/components/toolbar/Toolbar.vue'
import { expectAccessible } from './a11y'

const mountAll = (children: () => VNode[]) =>
  mount(
    defineComponent(() => () => h('div', children())),
    { attachTo: document.body },
  )

describe('Separator', () => {
  it('defaults to horizontal orientation with role="separator"', () => {
    const wrapper = mount(Separator)
    expect(wrapper.attributes('data-orientation')).toBe('horizontal')
    expect(wrapper.attributes('role')).toBe('separator')
    expect(wrapper.attributes('data-slot')).toBe('separator')
  })

  it('vertical orientation sets data-orientation and aria-orientation', () => {
    const wrapper = mount(Separator, { props: { orientation: 'vertical' } })
    expect(wrapper.attributes('data-orientation')).toBe('vertical')
    expect(wrapper.attributes('aria-orientation')).toBe('vertical')
  })

  it('renders as a div by default', () => {
    const wrapper = mount(Separator)
    expect(wrapper.element.tagName).toBe('DIV')
  })

  it('is accessible horizontal and vertical', async () => {
    const wrapper = mountAll(() => [h(Separator), h(Separator, { orientation: 'vertical' })])
    await expectAccessible(wrapper)
    wrapper.unmount()
  })

  it('inside a horizontal Toolbar it is exposed as a vertical separator between the buttons', async () => {
    const wrapper = mount(Toolbar, {
      attrs: { 'aria-label': 'Formatting' },
      slots: {
        default: () => [
          h('button', { type: 'button' }, 'Bold'),
          h(Separator),
          h('button', { type: 'button' }, 'Link'),
        ],
      },
      attachTo: document.body,
    })
    const sep = wrapper.get('[data-slot=separator]')
    expect(sep.attributes('role')).toBe('separator')
    expect(sep.attributes('aria-orientation')).toBe('vertical')
    await expectAccessible(wrapper)
    wrapper.unmount()
  })

  it('is not focusable', () => {
    const wrapper = mount(Separator)
    expect(wrapper.attributes('tabindex')).toBeUndefined()
    wrapper.unmount()
  })
})
