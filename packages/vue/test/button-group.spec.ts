import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h, nextTick } from 'vue'

import ButtonGroup from '@/components/button-group/ButtonGroup.vue'
import Button from '@/components/button/Button.vue'

import { expectAccessible } from './a11y'

const buttons = (wrapper: ReturnType<typeof mount>) => wrapper.findAll('[data-slot="button"]')

describe('ButtonGroup', () => {
  it("passes variant and size to its Buttons, a Button's own props win", () => {
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
    expect(wrapper.attributes()).toMatchObject({
      role: 'group',
      'aria-disabled': 'true',
      'data-disabled': 'true',
    })
    const [a, b] = buttons(wrapper)
    expect(a!.attributes('disabled')).toBeDefined()
    expect(b!.attributes('disabled')).toBeUndefined()
  })

  it('renders a separator in each Button but the first, only with `separator` (like HeroUI)', async () => {
    const slots = {
      default: () => [h(Button, () => 'A'), h(Button, () => 'B'), h(Button, () => 'C')],
    }
    expect(
      mount(ButtonGroup, { slots }).findAll('[data-slot="button-group-separator"]'),
    ).toHaveLength(0)
    const wrapper = mount(ButtonGroup, { props: { separator: true }, slots })
    await nextTick()
    const buttons = wrapper.findAll('[data-slot="button"]')
    expect(buttons[0]!.find('[data-slot="button-group-separator"]').exists()).toBe(false)
    const seps = wrapper.findAll('[data-slot="button-group-separator"]')
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
    const wrapper = mount(ButtonGroup, {
      slots: { default: () => h(Button, { class: 'rounded-none' }, () => 'A') },
    })
    const classes = buttons(wrapper)[0]!.classes()
    expect(classes.filter((c) => /^rounded/.test(c))).toEqual(['rounded-none'])
  })

  it.each([
    ['idle', {}],
    ['with separators', { separator: true }],
    ['disabled', { disabled: true }],
  ])('is an accessible labelled group when %s', async (_, props) => {
    const wrapper = mount(ButtonGroup, {
      props,
      attachTo: document.body,
      attrs: { 'aria-label': 'Text alignment' },
      slots: {
        default: () => [
          h(Button, () => 'Left'),
          h(Button, () => 'Center'),
          h(Button, { iconOnly: true, 'aria-label': 'Right' }, () =>
            h('svg', { 'aria-hidden': 'true' }),
          ),
        ],
      },
    })
    await nextTick()
    expect(wrapper.attributes()).toMatchObject({ role: 'group', 'aria-label': 'Text alignment' })
    await expectAccessible(wrapper)
    wrapper.unmount()
  })

  it('a disabled group takes its Buttons out of the focus order', () => {
    const wrapper = mount(ButtonGroup, {
      props: { disabled: true },
      attachTo: document.body,
      slots: {
        default: () => [
          h(Button, { id: 'a' }, () => 'A'),
          h(Button, { id: 'b', disabled: false }, () => 'B'),
        ],
      },
    })
    const [a, b] = ['#a', '#b'].map((id) => wrapper.get(id).element as HTMLElement)
    a!.focus()
    expect(document.activeElement).not.toBe(a)
    b!.focus()
    expect(document.activeElement).toBe(b)
    wrapper.unmount()
  })
})
