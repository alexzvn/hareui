import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import Typography from '@/components/typography/Typography.vue'

describe('Typography theme', () => {
  it('keeps the type styles when as overrides the element', () => {
    const wrapper = mount(Typography, { props: { as: 'h2', type: 'h1' } })
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

  it('prose ignores the type styles', () => {
    const wrapper = mount(Typography, { props: { prose: true, type: 'h1' } })
    expect(wrapper.classes()).not.toContain('text-4xl')
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
