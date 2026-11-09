import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import Typography from '@/components/typography/Typography.vue'

describe('Typography theme', () => {
  it('keeps the type styles when as overrides the element', () => {
    const wrapper = mount(Typography, { props: { as: 'h2', type: 'h1' } })
    expect(wrapper.element.tagName).toBe('H2')
    expect(wrapper.classes()).toContain('h-typography--h1')
  })

  it('adds the weight after the type, so it overrides the type font weight', () => {
    const classes = mount(Typography, { props: { type: 'h1', weight: 'normal' } }).classes()
    expect(classes.indexOf('h-typography--weight-normal')).toBeGreaterThan(
      classes.indexOf('h-typography--h1'),
    )
  })

  it('truncate adds the truncate modifier', () => {
    const wrapper = mount(Typography, { props: { truncate: true } })
    expect(wrapper.classes()).toContain('h-typography--truncate')
  })

  it('keeps the start alignment and adds no class for the default color', () => {
    const wrapper = mount(Typography)
    expect(wrapper.classes()).toEqual([
      'h-typography',
      'h-typography--body',
      'h-typography--align-start',
    ])
  })

  it('prose ignores the type styles', () => {
    const wrapper = mount(Typography, { props: { prose: true, type: 'h1' } })
    expect(wrapper.classes()).toEqual(['h-typography-prose'])
  })

  it('keeps a class utility next to the component classes', () => {
    const wrapper = mount(Typography, { props: { type: 'h1', class: 'text-sm' } })
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['h-typography--h1', 'text-sm']))
  })

  it('ui.base overrides merge into the root class', () => {
    const wrapper = mount(Typography, { props: { ui: { base: 'italic' } } })
    expect(wrapper.classes()).toContain('italic')
  })
})
