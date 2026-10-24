import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h, ref } from 'vue'

import type { InputOtpProps } from '@/components/input-otp/InputOtp.vue'
import InputOtp from '@/components/input-otp/InputOtp.vue'

import { expectAccessible } from './a11y'

const controlled = (initial = '', props: Record<string, unknown> = {}) => {
  const model = ref(initial)
  const wrapper = mount(() =>
    h(InputOtp, {
      modelValue: model.value,
      'onUpdate:modelValue': (v: unknown) => (model.value = String(v ?? '')),
      ...props,
    }),
  )

  return { model, wrapper, field: wrapper.findComponent(InputOtp), input: wrapper.get('input') }
}

// happy-dom has no native text editing, so these replay what the browser does to the invisible <input> for a
// key press, given the selection the component left on it: replace the selection, honour `maxlength`, leave a
// collapsed caret after the edit, then fire `input`.
type Wrapper = ReturnType<typeof controlled>['input']

const edit = async (
  input: Wrapper,
  replacement: string,
  deleting: 'backward' | 'forward' | null = null,
) => {
  const el = input.element as HTMLInputElement
  let start = el.selectionStart ?? el.value.length
  const end = el.selectionEnd ?? start
  if (start === end && deleting === 'backward') start = Math.max(0, start - 1)
  const stop = start === end && deleting === 'forward' ? end + 1 : end
  const next = el.value.slice(0, start) + replacement + el.value.slice(stop)
  if (next.length > el.maxLength) return
  el.value = next
  el.setSelectionRange(start + replacement.length, start + replacement.length)
  await input.trigger('input')
  await input.trigger('keyup')
}

const type = (input: Wrapper, text: string) => edit(input, text)

const press = (input: Wrapper, key: 'Delete' | 'Backspace') =>
  edit(input, '', key === 'Delete' ? 'forward' : 'backward')

// The browser moves the caret natively for navigation keys; `keyup` is where the component can observe it.
const moveCaret = async (input: Wrapper, key: string, position: number) => {
  const el = input.element as HTMLInputElement
  await input.trigger('keydown', { key })
  el.setSelectionRange(position, position)
  await input.trigger('keyup', { key })
}

const selection = (input: Wrapper) => [
  (input.element as HTMLInputElement).selectionStart,
  (input.element as HTMLInputElement).selectionEnd,
]

describe('inputOtp', () => {
  it('renders HeroUI data-slots: the box, one group per size and a separator between groups', () => {
    const wrapper = mount(InputOtp, { props: { length: 6, groups: [3, 3] } })
    expect(wrapper.find('[data-slot=input-otp]').exists()).toBe(true)
    expect(wrapper.findAll('[data-slot=input-otp-group]')).toHaveLength(2)
    expect(wrapper.findAll('[data-slot=input-otp-slot]')).toHaveLength(6)
    expect(wrapper.find('[data-slot=input-otp-separator]').exists()).toBe(true)
  })

  it('defaults to a single group with no separator', () => {
    const wrapper = mount(InputOtp, { props: { length: 4 } })
    expect(wrapper.findAll('[data-slot=input-otp-group]')).toHaveLength(1)
    expect(wrapper.find('[data-slot=input-otp-separator]').exists()).toBe(false)
  })

  it('typing fills slots left to right and advances the active slot', async () => {
    const { model, wrapper, input } = controlled('', { length: 4 })
    await input.trigger('focus')
    expect(wrapper.findAll('[data-slot=input-otp-slot]')[0].attributes('data-active')).toBe('true')

    await input.setValue('1')
    expect(model.value).toBe('1')
    const slots = wrapper.findAll('[data-slot=input-otp-slot]')
    expect(slots[0].attributes('data-filled')).toBe('true')
    expect(slots[0].get('[data-slot=input-otp-slot-value]').text()).toBe('1')
    expect(slots[1].attributes('data-active')).toBe('true')

    await input.setValue('12')
    expect(model.value).toBe('12')
    expect(wrapper.findAll('[data-slot=input-otp-slot]')[2].attributes('data-active')).toBe('true')
  })

  it('backspace removes the last character and the active slot moves back', async () => {
    const { model, wrapper, input } = controlled('12', { length: 4 })
    await input.trigger('focus')
    await input.setValue('1')
    expect(model.value).toBe('1')
    const slots = wrapper.findAll('[data-slot=input-otp-slot]')
    expect(slots[1].attributes('data-filled')).toBeUndefined()
    expect(slots[1].attributes('data-active')).toBe('true')
  })

  it('pasting fills every slot from the clipboard text at once', async () => {
    const { model, wrapper, input } = controlled('', { length: 6 })
    await input.trigger('paste', { clipboardData: { getData: () => '123456' } })
    expect(model.value).toBe('123456')
    expect(wrapper.findAll('[data-slot=input-otp-slot][data-filled=true]')).toHaveLength(6)
  })

  it('emits complete exactly once per transition into a fully-filled value', async () => {
    const { field, input } = controlled('12345', { length: 6 })
    await input.setValue('123456')
    expect(field.emitted('complete')).toEqual([['123456']])

    await input.setValue('12345')
    await input.setValue('123456')
    expect(field.emitted('complete')).toHaveLength(2)
  })

  it('rejects characters that fail the digits pattern, keeping the previous value', async () => {
    const { model, input } = controlled('12', { length: 6, pattern: 'digits' })
    await input.setValue('12a')
    expect(model.value).toBe('12')
    expect(input.element.value).toBe('12')
  })

  it('accepts digits-only input under the digits pattern', async () => {
    const { model, input } = controlled('', { length: 4, pattern: 'digits' })
    await input.setValue('12')
    expect(model.value).toBe('12')
  })

  it('disabled marks the box and input, and blocks paste', async () => {
    const wrapper = mount(InputOtp, { props: { modelValue: '12', disabled: true, length: 4 } })
    expect(wrapper.get('[data-slot=input-otp]').attributes('data-disabled')).toBe('true')
    const input = wrapper.get('input')
    expect(input.attributes('disabled')).toBeDefined()
    await input.trigger('paste', { clipboardData: { getData: () => '9999' } })
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('validate drives invalid state, aria-invalid and the error slot', async () => {
    const wrapper = mount(InputOtp, {
      props: {
        modelValue: '123',
        length: 6,
        validate: (v: string) => (v.length < 6 ? 'Incomplete code' : null),
      },
    })

    await wrapper.get('input').trigger('change')
    expect(wrapper.get('input').attributes('aria-invalid')).toBe('true')
    expect(wrapper.get('[data-slot=field-error]').text()).toBe('Incomplete code')
  })

  it('renders the label and description and associates them with the input', () => {
    const wrapper = mount(InputOtp, {
      props: { label: 'Verify account', description: 'Check your email', length: 4 },
    })

    expect(wrapper.get('[data-slot=label]').text()).toBe('Verify account')
    const input = wrapper.get('input')
    const id = input.attributes('id')
    expect(wrapper.get('[data-slot=label]').attributes('for')).toBe(id)
    expect(input.attributes('aria-describedby')).toContain(`${id}-description`)
    expect(wrapper.get('[data-slot=description]').text()).toBe('Check your email')
  })

  it('typing on a full field replaces the last slot', async () => {
    // behaviour-final-check OTP-1
    const { model, input } = controlled('', { length: 6 })
    await input.trigger('focus')
    for (const ch of '123456') await type(input, ch)
    expect(model.value).toBe('123456')
    await type(input, '7')
    expect(model.value).toBe('123457')
  })

  it('clicking into a full field selects the last slot so typing replaces it', async () => {
    // behaviour-final-check OTP-1
    const { model, input } = controlled('123456', { length: 6 })
    await input.trigger('focus')

    // the browser's caret placement after the click
    ;(input.element as HTMLInputElement).setSelectionRange(6, 6)
    await input.trigger('click')
    await type(input, '9')
    expect(model.value).toBe('123459')
  })

  it('navigating with the arrow keys selects the active slot, so typing replaces it instead of inserting', async () => {
    // behaviour-final-check OTP-2
    const { model, input } = controlled('78', { length: 6 })
    await input.trigger('focus')
    await moveCaret(input, 'ArrowLeft', 1)
    await moveCaret(input, 'ArrowLeft', 0)
    expect(selection(input)).toEqual([0, 1])
    await type(input, '5')
    expect(model.value).toBe('58')
  })

  it('Home selects the first slot, so typing replaces it', async () => {
    // behaviour-final-check OTP-2
    const { model, input } = controlled('1234', { length: 6 })
    await input.trigger('focus')
    await moveCaret(input, 'Home', 0)
    expect(selection(input)).toEqual([0, 1])
    await type(input, '9')
    expect(model.value).toBe('9234')
  })

  it('after typing over a slot the next slot is selected, so Delete removes it', async () => {
    // behaviour-final-check OTP-2
    const { model, input } = controlled('78', { length: 6 })
    await input.trigger('focus')
    await moveCaret(input, 'ArrowLeft', 1)
    await moveCaret(input, 'ArrowLeft', 0)
    await type(input, '5')
    expect(model.value).toBe('58')
    await press(input, 'Delete')
    expect(model.value).toBe('5')
  })

  it('pasting into a full field replaces from the active slot, keeping the earlier slots', async () => {
    // behaviour-final-check OTP-3
    const { model, input } = controlled('123456', { length: 6 })
    await input.trigger('focus')
    ;(input.element as HTMLInputElement).setSelectionRange(6, 6)
    await input.trigger('click')
    await input.trigger('paste', { clipboardData: { getData: () => '12' } })
    expect(model.value).toBe('123451')
  })

  it.each<[string, InputOtpProps & { 'aria-label'?: string }]>([
    ['idle with a visible label', { label: 'Verification code' }],
    ['named by aria-label only', { 'aria-label': 'Verification code' }],
    ['with a description', { label: 'Verification code', description: 'Sent to your email' }],
    [
      'partially filled, split in groups',
      { label: 'Verification code', modelValue: '123', groups: [3, 3] },
    ],
    [
      'invalid with an error message',
      {
        label: 'Verification code',
        modelValue: '12',
        invalid: true,
        errorMessage: 'Incomplete code',
      },
    ],
    ['required', { label: 'Verification code', required: true, name: 'otp' }],
    ['disabled', { label: 'Verification code', modelValue: '12', disabled: true }],
  ])('has no axe violations: %s', async (_, props) => {
    const wrapper = mount(InputOtp, { props, attachTo: document.body })
    await expectAccessible(wrapper)
    wrapper.unmount()
  })

  it('has no axe violations while focused with an active slot', async () => {
    const wrapper = mount(InputOtp, {
      props: { label: 'Verification code', modelValue: '1' },
      attachTo: document.body,
    })

    ;(wrapper.get('input').element as HTMLElement).focus()
    await wrapper.get('input').trigger('focus')
    expect(wrapper.find('[data-active=true]').exists()).toBe(true)
    await expectAccessible(wrapper)
    wrapper.unmount()
  })

  it('is a single tab stop: one focusable input behind the slots, reached from its label', () => {
    const wrapper = mount(InputOtp, {
      props: { id: 'otp-tab', label: 'Verification code', length: 6 },
      attachTo: document.body,
    })

    const focusable = wrapper
      .findAll('input, button, [tabindex]')
      .filter((el) => el.attributes('tabindex') !== '-1')

    expect(focusable).toHaveLength(1)
    expect(focusable[0]!.element).toBe(wrapper.get('input').element)

    expect(
      document.getElementById((wrapper.get('label').element as HTMLLabelElement).htmlFor),
    ).toBe(wrapper.get('input').element)

    wrapper.unmount()
  })

  it('aria-label / aria-labelledby name the input, not the wrapper', () => {
    const wrapper = mount(InputOtp, {
      props: { 'aria-label': 'Verification code' },
      attrs: { 'data-test': 'root' },
    })

    expect(wrapper.get('input').attributes('aria-label')).toBe('Verification code')
    expect(wrapper.get('[data-test=root]').attributes('aria-label')).toBeUndefined()
    const labelled = mount(InputOtp, { attrs: { 'aria-labelledby': 'heading' } })
    expect(labelled.get('input').attributes('aria-labelledby')).toBe('heading')
  })

  it('exposes the code constraints to assistive tech and autofill', () => {
    const wrapper = mount(InputOtp, {
      props: { label: 'Code', length: 4, pattern: 'digits', required: true },
    })

    expect(wrapper.get('input').attributes()).toMatchObject({
      autocomplete: 'one-time-code',
      maxlength: '4',
      inputmode: 'numeric',
    })

    expect(wrapper.get('input').attributes('required')).toBeDefined()

    expect(
      mount(InputOtp, { props: { pattern: 'alphanumeric' } })
        .get('input')
        .attributes('inputmode'),
    ).toBe('text')
  })

  it('wires an invalid field: aria-invalid and the error id in aria-describedby, removed once valid', async () => {
    const wrapper = mount(InputOtp, {
      props: {
        id: 'otp',
        label: 'Code',
        description: 'Check your email',
        errorMessage: 'Wrong code',
        invalid: true,
      },
    })

    const input = wrapper.get('input')
    expect(input.attributes('aria-invalid')).toBe('true')
    expect(input.attributes('aria-describedby')).toBe('otp-description otp-error')
    expect(wrapper.get('#otp-error').text()).toBe('Wrong code')
    await wrapper.setProps({ invalid: false })
    expect(input.attributes('aria-invalid')).toBeUndefined()
    expect(input.attributes('aria-describedby')).toBe('otp-description')
  })
})
