import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import Kbd from '@/components/kbd/Kbd.vue'
import { kbdKeysLabelMap } from '@/components/kbd/kbdKeys'
import type { KbdKey } from '@/components/kbd/kbdKeys'

import { expectAccessible } from './a11y'

describe('Kbd', () => {
  it('renders each key as an abbr symbol titled with its name, then the content', () => {
    const wrapper = mount(Kbd, {
      props: { keys: ['command', 'shift'] },
      slots: { default: () => 'Z' },
    })

    expect(wrapper.element.tagName).toBe('KBD')
    const abbrs = wrapper.findAll('abbr')
    expect(abbrs.map((a) => [a.text(), a.attributes('title')])).toEqual([
      ['⌘', 'Command'],
      ['⇧', 'Shift'],
    ])

    expect(wrapper.find('span').text()).toBe('Z')
  })

  it('accepts a single key and renders no content wrapper without a default slot', () => {
    const wrapper = mount(Kbd, { props: { keys: 'escape' } })
    expect(wrapper.get('abbr').text()).toBe('⎋')
    expect(wrapper.find('span').exists()).toBe(false)
  })

  it.each([
    ['with keys and content', { keys: ['command', 'shift'] }, 'K'],
    ['with content only', {}, 'Esc'],
    ['with a key only', { keys: 'enter' }, undefined],
    ['in the light variant', { variant: 'light', keys: 'ctrl' }, 'C'],
  ])('is accessible %s', async (_, props, content) => {
    const wrapper = mount(Kbd, {
      props,
      attachTo: document.body,
      slots: content ? { default: () => content } : {},
    })

    await expectAccessible(wrapper)
    wrapper.unmount()
  })

  it('gives every key symbol a spoken name through its abbr title and stays out of the tab order', () => {
    const keys = Object.keys(kbdKeysLabelMap) as KbdKey[]
    const wrapper = mount(Kbd, { props: { keys } })
    const titles = wrapper.findAll('abbr').map((a) => a.attributes('title'))
    expect(titles).toEqual(keys.map((k) => kbdKeysLabelMap[k]))
    expect(titles.every((t) => !!t && t.trim().length > 0)).toBe(true)
    expect(wrapper.find('[tabindex]').exists()).toBe(false)
    wrapper.unmount()
  })
})
