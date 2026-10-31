import type { VueWrapper } from '@vue/test-utils'
import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import type { Component } from 'vue'
import { defineComponent, h, nextTick, ref } from 'vue'

import CheckboxGroup from '@/components/checkbox-group/CheckboxGroup.vue'
import Checkbox from '@/components/checkbox/Checkbox.vue'
import DatePicker from '@/components/date-picker/DatePicker.vue'
import DropZone from '@/components/drop-zone/DropZone.vue'
import FormField from '@/components/form-field/FormField.vue'
import Form from '@/components/form/Form.vue'
import type { Form as FormInstance } from '@/components/form/types'
import Input from '@/components/input/Input.vue'
import NumberField from '@/components/number-field/NumberField.vue'
import RadioGroup from '@/components/radio-group/RadioGroup.vue'
import Select from '@/components/select/Select.vue'
import Slider from '@/components/slider/Slider.vue'
import Switch from '@/components/switch/Switch.vue'
import TextField from '@/components/text-field/TextField.vue'
import { useFormField } from '@/composables/useFormField'

import { expectAccessible } from './a11y'

let wrapper: VueWrapper | undefined
afterEach(() => {
  wrapper?.unmount()
  wrapper = undefined
})

const mountAttached = (render: () => ReturnType<typeof h>) => {
  wrapper = mount(render, { attachTo: document.body })

  return wrapper
}

/** The text of every element the control's `aria-describedby` points at. */
const descriptions = (el: Element) =>
  (el.getAttribute('aria-describedby') ?? '')
    .split(' ')
    .filter(Boolean)
    .map((id) => document.getElementById(id)?.textContent?.trim())

/** The text of the control's accessible label, via `<label for>` or `aria-labelledby`. */
const labelText = (el: Element) => {
  const labelledBy = el.getAttribute('aria-labelledby')
  if (labelledBy) return document.getElementById(labelledBy)?.textContent?.trim()

  return document.querySelector(`label[for="${el.id}"]`)?.textContent?.trim()
}

describe('FormField', () => {
  it('renders the label, hint, description and help', () => {
    const w = mount(FormField, {
      props: {
        label: 'Email',
        hint: 'Optional',
        description: 'Work address',
        help: 'We never share it',
      },
    })

    expect(w.get('label').text()).toBe('Email')
    expect(w.text()).toContain('Optional')
    expect(w.text()).toContain('Work address')
    expect(w.text()).toContain('We never share it')
  })

  it('renders each part from its slot', () => {
    const w = mount(FormField, {
      props: { error: 'Required' },
      slots: {
        label: () => 'Slot label',
        hint: () => 'Slot hint',
        description: () => 'Slot description',
        error: ({ error }: { error: string | true | undefined }) => `Slot ${error}`,
      },
    })

    expect(w.get('label').text()).toBe('Slot label')
    expect(w.text()).toContain('Slot hint')
    expect(w.text()).toContain('Slot description')
    expect(w.get('[role=alert]').text()).toBe('Slot Required')
  })

  it('shows the error as an alert in place of the help', () => {
    const w = mount(FormField, { props: { help: 'Pick a strong one', error: 'Too short' } })

    expect(w.get('[role=alert]').text()).toBe('Too short')
    expect(w.text()).not.toContain('Pick a strong one')
  })

  it('error=false hides the error message', () => {
    const w = mount(FormField, { props: { help: 'Pick a strong one', error: false } })

    expect(w.find('[role=alert]').exists()).toBe(false)
    expect(w.text()).toContain('Pick a strong one')
  })

  it('passes the error to the default slot', () => {
    const w = mount(FormField, {
      props: { error: 'Taken' },
      slots: { default: ({ error }: { error: string | true | undefined }) => `got ${error}` },
    })

    expect(w.text()).toContain('got Taken')
  })

  it('required adds the marker state to the label', () => {
    const w = mount(FormField, { props: { label: 'Name', required: true } })

    expect(w.get('[data-slot=form-field]').attributes('data-required')).toBe('true')
  })

  it('a TextField inside takes the field id, so the field label names its input', () => {
    const w = mountAttached(() =>
      h(FormField, { label: 'Email' }, () => h(TextField, { label: 'Ignored' })),
    )

    const input = w.get('input').element
    expect(labelText(input)).toBe('Email')
    expect(w.findAll('label')).toHaveLength(1)
  })

  it('a TextField inside points aria-describedby at the description and help', () => {
    const w = mountAttached(() =>
      h(
        FormField,
        { label: 'Email', description: 'Work address', help: 'We reply within a day' },
        () => h(TextField),
      ),
    )

    expect(descriptions(w.get('input').element)).toEqual(['Work address', 'We reply within a day'])
  })

  it('a TextField inside points aria-describedby at the error in place of the help', () => {
    const w = mountAttached(() =>
      h(
        FormField,
        {
          label: 'Email',
          description: 'Work address',
          help: 'We reply within a day',
          error: 'Already taken',
        },
        () => h(TextField),
      ),
    )

    expect(descriptions(w.get('input').element)).toEqual(['Work address', 'Already taken'])
  })

  it('a TextField inside renders none of its own label, description or error', async () => {
    const w = mountAttached(() =>
      h(FormField, { label: 'Email', description: 'Work address' }, () =>
        h(TextField, {
          label: 'Own label',
          description: 'Own description',
          errorMessage: 'Own error',
          invalid: true,
        }),
      ),
    )

    // The field shows the control's errors once the control has registered
    await nextTick()
    expect(w.text()).not.toContain('Own label')
    expect(w.text()).not.toContain('Own description')
    expect(w.findAll('[role=alert]')).toHaveLength(1)
    expect(w.get('[role=alert]').text()).toBe('Own error')
  })

  it('the error prop marks the inner field invalid', () => {
    const w = mountAttached(() =>
      h(FormField, { label: 'Email', error: 'Already taken' }, () => h(TextField)),
    )

    expect(w.get('input').attributes('aria-invalid')).toBe('true')
  })

  it('a bare error attribute marks the inner field invalid', () => {
    const w = mountAttached(() => h(FormField, { label: 'Code', error: '' }, () => h(TextField)))

    expect(w.get('input').attributes('aria-invalid')).toBe('true')
  })

  it('a bare Input inside takes the field id, name and description ids', () => {
    const w = mountAttached(() =>
      h(FormField, { label: 'City', name: 'city', help: 'Where you live' }, () => h(Input)),
    )

    const input = w.get('input').element
    expect(labelText(input)).toBe('City')
    expect(input.getAttribute('name')).toBe('city')
    expect(descriptions(input)).toEqual(['Where you live'])
  })

  it('a native input in the default slot can use the provided ids', () => {
    const w = mountAttached(() =>
      h(
        FormField,
        { label: 'Code', name: 'code', description: 'Six digits', error: 'Expired' },
        {
          default: (slot: { id: string; name: string; describedBy: string; invalid: boolean }) =>
            h('input', {
              id: slot.id,
              name: slot.name,
              'aria-describedby': slot.describedBy,
              'aria-invalid': slot.invalid ? 'true' : undefined,
            }),
        },
      ),
    )

    const input = w.get('input').element
    expect(labelText(input)).toBe('Code')
    expect(input.getAttribute('name')).toBe('code')
    expect(input.getAttribute('aria-invalid')).toBe('true')
    expect(descriptions(input)).toEqual(['Six digits', 'Expired'])
  })

  it('useFormField gives a custom control the ids and error state', () => {
    const Custom = defineComponent({
      setup() {
        const { id, ariaAttrs } = useFormField()

        return () => h('input', { id: id.value, ...ariaAttrs.value })
      },
    })

    const w = mountAttached(() =>
      h(FormField, { label: 'Handle', error: 'Taken' }, () => h(Custom)),
    )

    const input = w.get('input').element
    expect(labelText(input)).toBe('Handle')
    expect(input.getAttribute('aria-invalid')).toBe('true')
    expect(descriptions(input)).toEqual(['Taken'])
  })

  it('a group inside is named by the field label through aria-labelledby', async () => {
    const w = mountAttached(() =>
      h(FormField, { label: 'Toppings' }, () => h(CheckboxGroup, { label: 'Own label' })),
    )

    await nextTick()
    const group = w.get('[role=group]').element
    expect(labelText(group)).toBe('Toppings')
    expect(w.get('label').attributes('for')).toBeUndefined()
  })

  describe('a Slider inside', () => {
    const mountSlider = async () => {
      const w = mountAttached(() =>
        h(FormField, { label: 'Volume', description: 'Speaker level', error: 'Too loud' }, () =>
          h(Slider, { label: 'Own label', defaultValue: 30 }),
        ),
      )

      await nextTick()

      return { w, thumb: w.get('[role=slider]').element }
    }

    it('is named by the field label instead of its own', async () => {
      const { w, thumb } = await mountSlider()

      expect(labelText(thumb)).toBe('Volume')
      expect(w.text()).not.toContain('Own label')
      expect(w.get('label').attributes('for')).toBeUndefined()
    })

    it('is described by the field description and error', async () => {
      const { thumb } = await mountSlider()

      expect(descriptions(thumb)).toEqual(['Speaker level', 'Too loud'])
    })

    it('is marked invalid by the field error', async () => {
      const { thumb } = await mountSlider()

      expect(thumb.getAttribute('aria-invalid')).toBe('true')
    })
  })

  it('a Form error for the field name shows in the field and marks the inner field invalid', async () => {
    const form = ref<FormInstance<never>>()
    const w = mountAttached(() =>
      h(Form, { ref: form, 'aria-label': 'Profile' }, () =>
        h(FormField, { label: 'Email', name: 'email' }, () => h(TextField)),
      ),
    )

    form.value!.setErrors([{ name: 'email', message: 'Already registered' }])
    await flushPromises()

    expect(w.get('[role=alert]').text()).toBe('Already registered')
    expect(w.get('input').attributes('aria-invalid')).toBe('true')
    expect(descriptions(w.get('input').element)).toEqual(['Already registered'])
  })

  it('a Form error for the field name shows for a custom control', async () => {
    const form = ref<FormInstance<never>>()
    const w = mountAttached(() =>
      h(Form, { ref: form, 'aria-label': 'Profile' }, () =>
        h(
          FormField,
          { label: 'Code', name: 'code' },
          { default: (slot: { id: string }) => h('input', { id: slot.id }) },
        ),
      ),
    )

    form.value!.setErrors([{ name: 'code', message: 'Wrong code' }])
    await nextTick()

    expect(w.get('[role=alert]').text()).toBe('Wrong code')
  })

  it('a labelled field around a TextField has no axe violations', async () => {
    const w = mountAttached(() =>
      h(
        FormField,
        { label: 'Email', description: 'Work address', hint: 'Optional', error: 'Taken' },
        () => h(TextField),
      ),
    )

    await expectAccessible(w)
  })
})

describe('Fields outside FormField', () => {
  it('a TextField renders its own label and description', () => {
    const w = mountAttached(() => h(TextField, { label: 'Email', description: 'Work address' }))

    expect(labelText(w.get('input').element)).toBe('Email')
    expect(descriptions(w.get('input').element)).toEqual(['Work address'])
  })
})

describe('FormField name on submitted inputs', () => {
  const fields: [string, Component, Record<string, unknown>][] = [
    ['Select', Select, { items: [{ label: 'Cat', value: 'cat' }], defaultValue: 'cat' }],
    ['Checkbox', Checkbox, {}],
    ['Switch', Switch, {}],
    ['NumberField', NumberField, { defaultValue: 1 }],
    ['RadioGroup', RadioGroup, { items: [{ label: 'Cat', value: 'cat' }], defaultValue: 'cat' }],
    ['DatePicker', DatePicker, {}],
    ['DropZone', DropZone, {}],
  ]

  it.each(fields)('%s submits under the FormField name', (_, field, props) => {
    mountAttached(() => h('form', [h(FormField, { name: 'pet' }, () => h(field, props))]))
    expect(document.querySelectorAll('form [name="pet"]').length).toBeGreaterThan(0)
  })

  it.each(fields)('%s keeps its own name over the FormField name', (_, field, props) => {
    mountAttached(() =>
      h('form', [h(FormField, { name: 'pet' }, () => h(field, { ...props, name: 'own' }))]),
    )

    expect(document.querySelectorAll('form [name="own"]').length).toBeGreaterThan(0)
    expect(document.querySelector('form [name="pet"]')).toBeNull()
  })
})
