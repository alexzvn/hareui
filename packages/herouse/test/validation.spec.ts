import type { VueWrapper } from '@vue/test-utils'
import type { ValidationErrors } from '../src/components/formContext'
import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import { h, nextTick, ref } from 'vue'
import Checkbox from '../src/components/Checkbox.vue'
import Form from '../src/components/Form.vue'
import Input from '../src/components/Input.vue'
import NumberField from '../src/components/NumberField.vue'
import RadioGroup from '../src/components/RadioGroup.vue'
import Switch from '../src/components/Switch.vue'
import TextField from '../src/components/TextField.vue'

const minLength3 = (v: string | number) => String(v).length < 3 ? 'Too short' : null

let wrapper: VueWrapper | undefined
afterEach(() => {
  wrapper?.unmount()
  wrapper = undefined
})

function mountInForm(children: () => any, formProps: Record<string, unknown> = {}) {
  wrapper = mount(() => h(Form, formProps, children), { attachTo: document.body })
  return wrapper
}

async function type(input: HTMLInputElement, value: string) {
  input.value = value
  input.dispatchEvent(new Event('input'))
  await nextTick()
}

async function commit(input: Element) {
  input.dispatchEvent(new Event('change', { bubbles: true }))
  await flushPromises()
}

const error = () => document.querySelector('[data-slot="field-error"]')?.textContent?.trim()

describe('validation: native (default)', () => {
  it('shows validate() errors only once committed, and blocks submission meanwhile', async () => {
    const w = mountInForm(() => h(TextField, { label: 'Name', name: 'name', validate: minLength3 }))
    const input = w.get('input').element
    await type(input, 'ab')
    expect(error()).toBeUndefined()
    expect(input.getAttribute('aria-invalid')).toBeNull()
    expect(w.get('form').element.checkValidity()).toBe(false)

    await commit(input)
    expect(error()).toBe('Too short')
    expect(input.getAttribute('aria-invalid')).toBe('true')
    expect(input.getAttribute('aria-describedby')).toContain(document.querySelector('[data-slot="field-error"]')!.id)

    await type(input, 'abc')
    expect(error()).toBe('Too short')
    await commit(input)
    expect(error()).toBeUndefined()
    expect(w.get('form').element.checkValidity()).toBe(true)
  })

  it('displays native constraint errors when the form is validated, and focuses the first invalid field', async () => {
    const w = mountInForm(() => [
      h(TextField, { label: 'A', name: 'a', required: true }),
      h(TextField, { label: 'B', name: 'b', required: true }),
    ])
    const [a, b] = w.findAll('input').map(i => i.element)
    w.get('form').element.checkValidity()
    await flushPromises()
    const errors = document.querySelectorAll('[data-slot="field-error"]')
    expect(errors).toHaveLength(2)
    expect(errors[0]!.textContent!.trim()).toBe(a!.validationMessage)
    expect(document.activeElement).toBe(a)
    expect(b!.getAttribute('aria-invalid')).toBe('true')
  })

  it('form reset clears displayed errors and restores defaultValue', async () => {
    const w = mountInForm(() => h(TextField, { label: 'Name', name: 'name', defaultValue: 'x', validate: minLength3 }))
    const input = w.get('input').element
    await commit(input)
    expect(error()).toBe('Too short')
    await type(input, 'changed')
    w.get('form').element.reset()
    await flushPromises()
    expect(error()).toBeUndefined()
    expect(input.value).toBe('x')
  })
})

describe('validation: aria', () => {
  it('shows validate() errors in realtime and never blocks submission', async () => {
    const w = mountInForm(() => h(TextField, { label: 'Name', name: 'name', validate: minLength3 }), { validationBehavior: 'aria' })
    expect(w.get('form').attributes('novalidate')).toBeDefined()
    const input = w.get('input').element
    expect(error()).toBe('Too short')
    await type(input, 'abcd')
    expect(error()).toBeUndefined()
    await type(input, 'a')
    expect(error()).toBe('Too short')
    expect(input.checkValidity()).toBe(true)
  })

  it('a field-level validationBehavior overrides the form', async () => {
    mountInForm(() => h(TextField, { label: 'Name', name: 'name', validate: minLength3, validationBehavior: 'aria' }))
    await nextTick()
    expect(error()).toBe('Too short')
  })
})

describe('validation: precedence', () => {
  it('controlled `invalid` overrides validate(), both ways', async () => {
    const invalid = ref<boolean | undefined>(false)
    wrapper = mount(() => h(TextField, { label: 'N', invalid: invalid.value, validationBehavior: 'aria', validate: () => 'Bad', errorMessage: 'Custom' }), { attachTo: document.body })
    expect(error()).toBeUndefined()
    invalid.value = true
    await nextTick()
    expect(error()).toBe('Custom')
    invalid.value = undefined
    await nextTick()
    expect(error()).toBe('Custom')
    expect(wrapper.get('input').attributes('aria-invalid')).toBe('true')
  })

  it('server errors show immediately, clear once the user commits a change, and return with a new errors object', async () => {
    const errors = ref<ValidationErrors>({ email: 'Email taken' })
    wrapper = mount(() => h(Form, { validationErrors: errors.value }, () => h(TextField, { label: 'Email', name: 'email' })), { attachTo: document.body })
    const input = wrapper.get('input').element
    expect(error()).toBe('Email taken')
    expect(wrapper.get('form').element.checkValidity()).toBe(false)
    await type(input, 'new@x.io')
    await commit(input)
    expect(error()).toBeUndefined()
    expect(wrapper.get('form').element.checkValidity()).toBe(true)
    errors.value = { email: ['Still taken', 'Try another'] }
    await nextTick()
    expect(error()).toBe('Still taken Try another')
  })
})

describe('validation: toggles', () => {
  it('Checkbox: required blocks submission, shows the error on submit, clears when checked', async () => {
    const w = mountInForm(() => h(Checkbox, { label: 'Terms', name: 'terms', required: true, errorMessage: 'Accept the terms' }))
    await flushPromises()
    w.get('form').element.checkValidity()
    await flushPromises()
    expect(error()).toBe('Accept the terms')
    expect(w.get('[data-slot="checkbox"]').attributes('data-invalid')).toBe('true')
    expect(document.activeElement).toBe(w.get('[role="checkbox"]').element)
    await w.get('[role="checkbox"]').trigger('click')
    await flushPromises()
    expect(error()).toBeUndefined()
    expect(w.get('form').element.checkValidity()).toBe(true)
  })

  it('Checkbox: form reset restores defaultValue and keeps errors hidden until the next submit', async () => {
    const w = mountInForm(() => h(Checkbox, { label: 'Terms', name: 'terms', required: true, errorMessage: 'Accept the terms' }))
    await flushPromises()
    await w.get('[role="checkbox"]').trigger('click')
    await w.get('[role="checkbox"]').trigger('click')
    await flushPromises()
    expect(error()).toBe('Accept the terms')
    await w.get('[role="checkbox"]').trigger('click')
    w.get('form').element.reset()
    await flushPromises()
    expect(w.get('[role="checkbox"]').attributes('aria-checked')).toBe('false')
    expect(error()).toBeUndefined()
  })

  it('NumberField: a stepper press commits validate() in native mode', async () => {
    const w = mountInForm(() => h(NumberField, { label: 'Qty', name: 'qty', defaultValue: 1, validate: (n: number) => n > 2 ? 'Max 2' : null }))
    await flushPromises()
    const inc = w.get('[data-slot="number-field-increment-button"]')
    await inc.trigger('pointerdown')
    await inc.trigger('pointerup')
    await flushPromises()
    expect(error()).toBeUndefined()
    await inc.trigger('pointerdown')
    await inc.trigger('pointerup')
    await flushPromises()
    expect(error()).toBe('Max 2')
    expect(w.get('[data-slot="number-field-input"]').attributes('aria-invalid')).toBe('true')
    expect(w.get('form').element.checkValidity()).toBe(false)
  })

  it('Switch: validate() receives the on/off state', async () => {
    mountInForm(() => h(Switch, { label: 'Wi-Fi', name: 'wifi', validate: (on: boolean) => on || 'Turn it on' }), { validationBehavior: 'aria' })
    await nextTick()
    expect(error()).toBe('Turn it on')
    await wrapper!.get('[role="switch"]').trigger('click')
    expect(error()).toBeUndefined()
  })

  it('RadioGroup: required in a native form shows the #error slot with validation props', async () => {
    const w = mountInForm(() => h(RadioGroup, { name: 'plan', required: true, items: [{ value: 'a', label: 'A' }, { value: 'b', label: 'B' }] }, {
      error: ({ validationDetails }: { validationDetails: { valueMissing: boolean } }) => validationDetails.valueMissing ? 'Pick a plan' : 'Other',
    }))
    await flushPromises()
    w.get('form').element.checkValidity()
    await flushPromises()
    expect(error()).toBe('Pick a plan')
    await w.findAll('[role="radio"]')[1]!.trigger('click')
    await flushPromises()
    expect(error()).toBeUndefined()
  })

  it('RadioGroup: validate() gets the selected value and is skipped while nothing is selected', async () => {
    mountInForm(() => h(RadioGroup, { name: 'plan', items: [{ value: 'a', label: 'A' }, { value: 'b', label: 'B' }], validate: (v: string) => v === 'b' ? 'B is sold out' : null }), { validationBehavior: 'aria' })
    await nextTick()
    expect(error()).toBeUndefined()
    await wrapper!.findAll('[role="radio"]')[1]!.trigger('click')
    expect(error()).toBe('B is sold out')
  })
})

describe('TextField with a slotted Input', () => {
  it('validate() sees what the user typed; name and type come from the TextField; reset restores defaultValue', async () => {
    const w = mountInForm(() => h(TextField, { label: 'Email', name: 'email', type: 'email', defaultValue: 'x', validate: minLength3 }, { default: () => h(Input, { class: 'custom' }) }))
    const input = w.get('input.custom').element as HTMLInputElement
    expect(input.name).toBe('email')
    expect(input.type).toBe('email')
    expect(input.value).toBe('x')
    await type(input, 'a@b.io')
    await commit(input)
    expect(error()).toBeUndefined()
    expect(new FormData(w.get('form').element).get('email')).toBe('a@b.io')
    await type(input, 'ab')
    await commit(input)
    expect(error()).toBe('Too short')
    w.get('form').element.reset()
    await flushPromises()
    expect(input.value).toBe('x')
    expect(error()).toBeUndefined()
  })

  it('a slotted Input with its own v-model mirrors into the field', async () => {
    const value = ref('ab')
    wrapper = mount(() => h(TextField, { label: 'N', validate: minLength3, validationBehavior: 'aria' }, {
      default: () => h(Input, { 'modelValue': value.value, 'onUpdate:modelValue': (v: string | number | undefined) => (value.value = String(v)) }),
    }), { attachTo: document.body })
    await nextTick()
    expect(error()).toBe('Too short')
    value.value = 'abcd'
    await nextTick()
    expect(error()).toBeUndefined()
    await type(wrapper.get('input').element, 'z')
    expect(value.value).toBe('z')
    expect(error()).toBe('Too short')
  })
})

describe('NumberField reset', () => {
  it('form reset restores defaultValue and does not re-show errors', async () => {
    const w = mountInForm(() => h(NumberField, { label: 'Qty', name: 'qty', defaultValue: 3, validate: (n: number) => n > 2 ? 'Max 2' : null }))
    await flushPromises()
    w.get('form').element.checkValidity()
    await flushPromises()
    expect(error()).toBe('Max 2')
    w.get('form').element.reset()
    await flushPromises()
    expect(error()).toBeUndefined()
    expect((w.get('[data-slot="number-field-input"]').element as HTMLInputElement).value).toBe('3')
  })
})

describe('TextField input attributes', () => {
  it('forwards input attrs (any casing) to the input and keeps the rest on the wrapper', () => {
    wrapper = mount(TextField, { attrs: { 'maxlength': 5, 'minLength': 2, 'autocomplete': 'email', 'inputmode': 'email', 'pattern': '[a-z]+', 'data-testid': 'field', 'aria-describedby': 'hint' }, props: { description: 'Desc' } })
    const input = wrapper.get('input')
    expect(input.attributes()).toMatchObject({ maxlength: '5', minlength: '2', autocomplete: 'email', inputmode: 'email', pattern: '[a-z]+' })
    expect(input.attributes('aria-describedby')).toMatch(/^hint \S+-description$/)
    expect(wrapper.attributes('data-testid')).toBe('field')
    expect(wrapper.attributes('maxlength')).toBeUndefined()
    expect(wrapper.attributes('aria-describedby')).toBeUndefined()
  })

  it('focus and blur listeners fire for the input', async () => {
    const events: string[] = []
    wrapper = mount(TextField, { attrs: { onFocus: () => events.push('focus'), onBlur: () => events.push('blur') } })
    await wrapper.get('input').trigger('focus')
    await wrapper.get('input').trigger('blur')
    expect(events).toEqual(['focus', 'blur'])
  })
})
