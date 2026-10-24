import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h } from 'vue'
import InputGroup from '../src/components/input-group/InputGroup.vue'
import TextField from '../src/components/text-field/TextField.vue'
import { expectAccessible } from './a11y'

describe('InputGroup', () => {
  it('v-model syncs standalone', async () => {
    const wrapper = mount(InputGroup, {
      props: { 'modelValue': 'a', 'onUpdate:modelValue': (v: string | number | undefined) => wrapper.setProps({ modelValue: v }) },
    })
    const input = wrapper.get('[data-slot=input-group-input]')
    expect((input.element as HTMLInputElement).value).toBe('a')
    await input.setValue('abc')
    expect(wrapper.props('modelValue')).toBe('abc')
  })

  it('defaultValue seeds an uncontrolled group', () => {
    const wrapper = mount(InputGroup, { props: { defaultValue: 'jane' } })
    expect((wrapper.get('[data-slot=input-group-input]').element as HTMLInputElement).value).toBe('jane')
  })

  it('renders prefix and suffix only when provided, as props or slots', () => {
    const none = mount(InputGroup)
    expect(none.find('[data-slot=input-group-prefix]').exists()).toBe(false)
    expect(none.find('[data-slot=input-group-suffix]').exists()).toBe(false)

    const withProps = mount(InputGroup, { props: { prefix: '$', suffix: 'USD' } })
    expect(withProps.get('[data-slot=input-group-prefix]').text()).toBe('$')
    expect(withProps.get('[data-slot=input-group-suffix]').text()).toBe('USD')

    const withSlots = mount(InputGroup, { slots: { prefix: () => 'https://', suffix: () => '.com' } })
    expect(withSlots.get('[data-slot=input-group-prefix]').text()).toBe('https://')
    expect(withSlots.get('[data-slot=input-group-suffix]').text()).toBe('.com')
  })

  it('inside a TextField reads field state; explicit props win', () => {
    const wrapper = mount(TextField, {
      props: { id: 'f', disabled: true, invalid: true, description: 'Help' },
      slots: {
        default: () => [
          h(InputGroup, { 'data-test': 'ctx' }),
        ],
      },
    })
    const input = wrapper.get('[data-test=ctx] [data-slot=input-group-input]')
    expect(input.attributes('id')).toBe('f')
    expect(input.attributes('disabled')).toBeDefined()
    expect(input.attributes('aria-invalid')).toBe('true')
    expect(input.attributes('aria-describedby')).toBe('f-description')
    expect(wrapper.get('[data-test=ctx]').attributes('data-disabled')).toBe('true')
    expect(wrapper.get('[data-test=ctx]').attributes('data-invalid')).toBe('true')

    const ownOverride = mount(TextField, {
      props: { id: 'g', disabled: true },
      slots: { default: () => h(InputGroup, { disabled: false }) },
    })
    expect(ownOverride.get('[data-slot=input-group-input]').attributes('disabled')).toBeUndefined()
  })

  it('variant falls back to the surrounding TextField variant', () => {
    const wrapper = mount(TextField, {
      props: { variant: 'secondary' },
      slots: { default: () => h(InputGroup, { 'data-test': 'g' }) },
    })
    // secondary variant drops the shadow utility present on primary
    expect(wrapper.get('[data-test=g]').classes()).not.toContain('shadow-field')
  })

  it('clicking the group (not the input) focuses the input', async () => {
    const wrapper = mount(InputGroup, { props: { prefix: '$' }, attachTo: document.body })
    const prefix = wrapper.get('[data-slot=input-group-prefix]')
    await prefix.trigger('click')
    expect(document.activeElement).toBe(wrapper.get('[data-slot=input-group-input]').element)
    wrapper.unmount()
  })

  it('readonly blocks edits and is reflected on the input', () => {
    const wrapper = mount(InputGroup, { props: { readonly: true, defaultValue: 'x' } })
    expect(wrapper.get('[data-slot=input-group-input]').attributes('readonly')).toBeDefined()
  })

  it('textarea mode renders a textarea wired to the TextField like the input', async () => {
    const wrapper = mount(TextField, {
      props: { id: 't', name: 'bio', validate: (v: string | number) => (String(v).length > 3 ? 'Too long' : null), validationBehavior: 'aria' },
      slots: { default: () => h(InputGroup, { textarea: true, rows: 4 }) },
    })
    expect(wrapper.find('[data-slot=input-group-input]').exists()).toBe(false)
    const area = wrapper.get('textarea[data-slot=input-group-textarea]')
    expect(area.attributes()).toMatchObject({ id: 't', name: 'bio', rows: '4' })
    await area.setValue('line one\nline two')
    expect(area.attributes('aria-invalid')).toBe('true')
    expect(wrapper.get('[data-slot=field-error]').text()).toBe('Too long')
  })

  it('activating a button in the suffix keeps focus on the button instead of moving it to the input', async () => {
    // behaviour-final-check H14
    const wrapper = mount(InputGroup, {
      props: { defaultValue: '12' },
      slots: { suffix: () => h('button', { type: 'button', 'data-test': 'copy' }, 'Copy') },
      attachTo: document.body,
    })
    const button = wrapper.get('[data-test=copy]')
    ;(button.element as HTMLElement).focus()
    expect(document.activeElement).toBe(button.element)
    // Enter / Space on a focused button, and a mouse click, all arrive as a click event
    await button.trigger('click')
    expect(document.activeElement).toBe(button.element)
    wrapper.unmount()
  })

  const searchIcon = () => h('svg', { 'aria-hidden': 'true', 'viewBox': '0 0 16 16' }, h('path', { d: 'M0 0h16v16H0z' }))

  it.each([
    ['idle', {}],
    ['with description', { description: 'Your public profile URL' }],
    ['invalid with error message', { invalid: true, errorMessage: 'That handle is taken' }],
    ['disabled', { disabled: true }],
    ['read-only', { readonly: true, defaultValue: 'jane' }],
    ['required', { required: true }],
  ])('inside a labelled TextField with a prefix and a suffix button (%s), it has no axe violations', async (_, props: Record<string, unknown>) => {
    const wrapper = mount(TextField, {
      props: { label: 'Website', ...props },
      slots: {
        default: () => h(InputGroup, null, {
          prefix: searchIcon,
          suffix: () => h('button', { 'type': 'button', 'aria-label': 'Copy' }, searchIcon()),
        }),
      },
      attachTo: document.body,
    })
    const input = wrapper.get('[data-slot=input-group-input]').element as HTMLInputElement
    expect([...input.labels!].map(l => l.textContent?.trim())).toEqual(['Website'])
    expect(wrapper.get('[data-slot=input-group]').attributes('aria-disabled')).toBe(props.disabled ? 'true' : undefined)
    await expectAccessible(wrapper)
    wrapper.unmount()
  })

  it('textarea mode inside a labelled TextField has no axe violations', async () => {
    const wrapper = mount(TextField, {
      props: { label: 'Prompt', description: 'Markdown supported' },
      slots: { default: () => h(InputGroup, { textarea: true }, { suffix: () => h('button', { 'type': 'button', 'aria-label': 'Send' }, 'Send') }) },
      attachTo: document.body,
    })
    expect(wrapper.get('textarea').attributes('aria-describedby')).toBe(wrapper.get('[data-slot=description]').attributes('id'))
    await expectAccessible(wrapper)
    wrapper.unmount()
  })

  it('standalone, aria-label and autocomplete go to the input, not the group, with no axe violations', async () => {
    const wrapper = mount(InputGroup, {
      props: { type: 'email' },
      attrs: { 'aria-label': 'Email', 'autocomplete': 'email', 'aria-describedby': 'hint', 'data-testid': 'group' },
      slots: { prefix: searchIcon },
      attachTo: document.body,
    })
    const group = wrapper.get('[data-slot=input-group]')
    const input = wrapper.get('[data-slot=input-group-input]')
    expect(input.attributes()).toMatchObject({ 'aria-label': 'Email', 'autocomplete': 'email', 'aria-describedby': 'hint' })
    expect(group.attributes('aria-label')).toBeUndefined()
    expect(group.attributes('aria-describedby')).toBeUndefined()
    expect(group.attributes('data-testid')).toBe('group')
    expect(group.attributes('role')).toBe('group')
    wrapper.unmount()
    // Audit without the dangling `hint` reference
    const labelled = mount(InputGroup, { attrs: { 'aria-label': 'Email' }, slots: { prefix: searchIcon }, attachTo: document.body })
    await expectAccessible(labelled)
    labelled.unmount()
  })

  it('a standalone Label names the input through the group id', async () => {
    const wrapper = mount(() => h('div', [h('label', { for: 'price' }, 'Price'), h(InputGroup, { id: 'price', prefix: '$', suffix: 'USD' })]), { attachTo: document.body })
    const input = wrapper.get('[data-slot=input-group-input]').element as HTMLInputElement
    expect([...input.labels!].map(l => l.textContent)).toEqual(['Price'])
    await expectAccessible(wrapper)
    wrapper.unmount()
  })

  it('a suffix button stays in the tab order after the input', () => {
    const wrapper = mount(InputGroup, { attrs: { 'aria-label': 'Link' }, slots: { suffix: () => h('button', { type: 'button' }, 'Copy') } })
    const focusable = wrapper.findAll('input, button').map(el => el.element)
    expect(focusable.map(el => el.tagName)).toEqual(['INPUT', 'BUTTON'])
    expect(focusable.every(el => !el.hasAttribute('tabindex'))).toBe(true)
    wrapper.unmount()
  })
})
