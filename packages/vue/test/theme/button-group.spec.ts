import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h } from 'vue'

import ButtonGroup from '@/components/button-group/ButtonGroup.vue'
import Button from '@/components/button/Button.vue'

const buttons = (wrapper: ReturnType<typeof mount>) => wrapper.findAll('[data-slot="button"]')

describe('ButtonGroup theme', () => {
  it("styles its Buttons with the group variant and size, a Button's own variant wins", () => {
    const wrapper = mount(ButtonGroup, {
      props: { variant: 'outline', size: 'sm' },
      slots: { default: () => [h(Button, () => 'A'), h(Button, { variant: 'danger' }, () => 'B')] },
    })

    const [a, b] = buttons(wrapper)
    expect(a!.classes()).toEqual(expect.arrayContaining(['h-button--outline', 'h-button--sm']))
    expect(b!.classes()).toContain('h-button--danger')
    expect(b!.classes()).not.toContain('h-button--outline')
  })

  it('does not style a Button nested inside a Button with the group variant', () => {
    const wrapper = mount(ButtonGroup, {
      props: { variant: 'outline', disabled: true },
      slots: { default: () => h(Button, { as: 'div' }, () => h(Button, () => 'inner')) },
    })

    expect(wrapper.find('button[data-slot="button"]').classes()).not.toContain('h-button--outline')

    expect(wrapper.find('button[data-slot="button"]').classes()).not.toContain(
      'h-button-group__button',
    )

    expect(wrapper.find('div[data-slot="button"]').classes()).toContain('h-button-group__button')
  })

  it('lets a user rounded-* class replace the group edge radii', () => {
    const wrapper = mount(ButtonGroup, {
      slots: { default: () => h(Button, { class: 'rounded-none' }, () => 'A') },
    })

    const classes = buttons(wrapper)[0]!.classes()
    expect(classes.filter((c) => c.startsWith('rounded'))).toEqual(['rounded-none'])
  })
})
