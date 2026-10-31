import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { defineComponent, h, markRaw } from 'vue'

import type { ButtonProps } from '@/components/button/Button.types'
import Button from '@/components/button/Button.vue'

const Star = markRaw(defineComponent(() => () => h('svg')))

describe('Button theme', () => {
  it.each<[string, ButtonProps]>([
    ['a leading icon', { leadingIcon: Star }],
    ['a trailing icon', { trailingIcon: Star }],
    ['an avatar', { avatar: { fallback: 'MO' } }],
  ])('is square with only %s', (_, props) => {
    const wrapper = mount(Button, { props })
    expect(wrapper.classes()).toContain('w-(--button-height)')
  })

  it('keeps its padding when an icon comes with a label', () => {
    const wrapper = mount(Button, { props: { leadingIcon: Star, label: 'Star' } })
    expect(wrapper.classes()).not.toContain('w-(--button-height)')
  })

  it('keeps its padding when an icon comes with a default slot', () => {
    const wrapper = mount(Button, { props: { leadingIcon: Star }, slots: { default: 'Star' } })
    expect(wrapper.classes()).not.toContain('w-(--button-height)')
  })

  it('renders a string trailing icon as the icon class', () => {
    const wrapper = mount(Button, { props: { label: 'Save', trailingIcon: 'i-arrow' } })
    expect(wrapper.get('[data-slot=button-trailing-icon]').classes()).toContain('i-arrow')
  })
})
