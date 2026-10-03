import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Typography from '../src/components/typography/Typography.vue'

describe('Typography', () => {
  it('defaults to a <p> body element', () => {
    const wrapper = mount(Typography, { slots: { default: 'Hello' } })
    expect(wrapper.element.tagName).toBe('P')
    expect(wrapper.attributes('data-slot')).toBe('typography')
    expect(wrapper.attributes('data-type')).toBe('body')
    expect(wrapper.text()).toBe('Hello')
  })

  it.each([
    ['h1', 'H1'],
    ['h2', 'H2'],
    ['h3', 'H3'],
    ['h4', 'H4'],
    ['h5', 'H5'],
    ['h6', 'H6'],
    ['body', 'P'],
    ['body-sm', 'P'],
    ['body-xs', 'P'],
    ['code', 'CODE'],
  ] as const)('renders %s as a <%s>', (type, tag) => {
    const wrapper = mount(Typography, { props: { type } })
    expect(wrapper.element.tagName).toBe(tag)
    expect(wrapper.attributes('data-type')).toBe(type)
  })

  it('as overrides the element implied by type', () => {
    const wrapper = mount(Typography, { props: { as: 'h2', type: 'h1' } })
    expect(wrapper.element.tagName).toBe('H2')
    expect(wrapper.attributes('data-type')).toBe('h1')
    expect(wrapper.classes()).toContain('text-4xl')
  })

  it('weight overrides the type default font weight', () => {
    const wrapper = mount(Typography, { props: { type: 'h1', weight: 'normal' } })
    expect(wrapper.classes()).toContain('font-normal')
  })

  it('truncate adds block truncate classes', () => {
    const wrapper = mount(Typography, { props: { truncate: true } })
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['block', 'truncate']))
  })

  it('prose renders a div[data-slot=prose] without typography data-attrs, ignoring type', () => {
    const wrapper = mount(Typography, {
      props: { prose: true, type: 'h1' },
      slots: { default: '<h1>Title</h1><p>Body</p>' },
    })
    expect(wrapper.element.tagName).toBe('DIV')
    expect(wrapper.attributes('data-slot')).toBe('prose')
    expect(wrapper.attributes('data-type')).toBeUndefined()
    expect(wrapper.classes()).not.toContain('text-4xl')
    expect(wrapper.find('h1').exists()).toBe(true)
    expect(wrapper.find('p').exists()).toBe(true)
  })

  it('class prop wins over theme classes (tailwind-merge)', () => {
    const wrapper = mount(Typography, { props: { type: 'h1', class: 'text-sm' } })
    expect(wrapper.classes()).toContain('text-sm')
    expect(wrapper.classes()).not.toContain('text-4xl')
  })

  it('ui.base overrides merge into the root class', () => {
    const wrapper = mount(Typography, { props: { ui: { base: 'italic' } } })
    expect(wrapper.classes()).toContain('italic')
  })
})
