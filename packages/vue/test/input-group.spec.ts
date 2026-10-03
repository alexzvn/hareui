import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h } from 'vue'
import InputGroup from '../src/components/input-group/InputGroup.vue'
import TextField from '../src/components/text-field/TextField.vue'

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
})
