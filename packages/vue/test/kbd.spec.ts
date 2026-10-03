import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Kbd from '../src/components/kbd/Kbd.vue'

describe('Kbd', () => {
  it('renders each key as an abbr symbol titled with its name, then the content', () => {
    const wrapper = mount(Kbd, { props: { keys: ['command', 'shift'] }, slots: { default: () => 'Z' } })
    expect(wrapper.element.tagName).toBe('KBD')
    const abbrs = wrapper.findAll('abbr')
    expect(abbrs.map(a => [a.text(), a.attributes('title')])).toEqual([['⌘', 'Command'], ['⇧', 'Shift']])
    expect(wrapper.find('span').text()).toBe('Z')
  })

  it('accepts a single key and renders no content wrapper without a default slot', () => {
    const wrapper = mount(Kbd, { props: { keys: 'escape' } })
    expect(wrapper.get('abbr').text()).toBe('⎋')
    expect(wrapper.find('span').exists()).toBe(false)
  })

  it('applies the light variant and per-slot overrides', () => {
    const wrapper = mount(Kbd, { props: { variant: 'light', keys: 'up', ui: { abbr: 'font-bold' } } })
    expect(wrapper.classes()).toContain('bg-transparent')
    expect(wrapper.classes()).not.toContain('bg-default')
    expect(wrapper.get('abbr').classes()).toContain('font-bold')
  })
})
