import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h } from 'vue'
import Button from '../src/components/Button.vue'
import ButtonGroup from '../src/components/ButtonGroup.vue'

const buttons = (wrapper: ReturnType<typeof mount>) => wrapper.findAll('[data-slot="button"]')

describe('ButtonGroup', () => {
  it('passes variant and size to its Buttons, a Button\'s own props win', () => {
    const wrapper = mount(ButtonGroup, {
      props: { variant: 'outline', size: 'sm' },
      slots: { default: () => [h(Button, () => 'A'), h(Button, { variant: 'danger' }, () => 'B')] },
    })
    const [a, b] = buttons(wrapper)
    expect(a!.classes()).toContain('border')
    expect(a!.classes()).toContain('px-3')
    expect(b!.classes()).not.toContain('border')
  })

  it('disables its Buttons unless a Button sets disabled=false', () => {
    const wrapper = mount(ButtonGroup, {
      props: { disabled: true },
      slots: { default: () => [h(Button, () => 'A'), h(Button, { disabled: false }, () => 'B')] },
    })
    expect(wrapper.attributes()).toMatchObject({ 'role': 'group', 'aria-disabled': 'true', 'data-disabled': 'true' })
    const [a, b] = buttons(wrapper)
    expect(a!.attributes('disabled')).toBeDefined()
    expect(b!.attributes('disabled')).toBeUndefined()
  })

  it('renders a separator in each Button only with `separator`', () => {
    const slots = { default: () => [h(Button, () => 'A'), h(Button, () => 'B')] }
    expect(mount(ButtonGroup, { slots }).findAll('[data-slot="button-group-separator"]')).toHaveLength(0)
    const seps = mount(ButtonGroup, { props: { separator: true }, slots }).findAll('[data-slot="button-group-separator"]')
    expect(seps).toHaveLength(2)
    expect(seps[0]!.attributes('aria-hidden')).toBe('true')
  })

  it('does not leak group props into a Button nested inside a Button', () => {
    const wrapper = mount(ButtonGroup, {
      props: { variant: 'outline', disabled: true },
      slots: { default: () => h(Button, { as: 'div' }, () => h(Button, () => 'inner')) },
    })
    const inner = wrapper.find('button[data-slot="button"]')
    expect(inner.attributes('disabled')).toBeUndefined()
    expect(inner.classes()).not.toContain('border')
  })

  it('lets a user rounded-* class replace the group edge radii', () => {
    const wrapper = mount(ButtonGroup, { slots: { default: () => h(Button, { class: 'rounded-none' }, () => 'A') } })
    const classes = buttons(wrapper)[0]!.classes()
    expect(classes.filter(c => /^rounded/.test(c))).toEqual(['rounded-none'])
  })
})
