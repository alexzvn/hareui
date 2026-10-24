import { flushPromises, mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import type { ComponentOptions } from 'vue'
import { defineComponent, nextTick, ref } from 'vue'

import type { NumberFieldProps } from '@/components/number-field/NumberField.vue'
import NumberField from '@/components/number-field/NumberField.vue'

import { expectAccessible } from './a11y'

const inc = '[data-slot=number-field-increment-button]'
const dec = '[data-slot=number-field-decrement-button]'
const input = '[data-slot=number-field-input]'

describe('NumberField', () => {
  it('steps with the arrow keys, emits update:modelValue and follows external v-model changes', async () => {
    const wrapper = mount(NumberField, {
      props: { defaultValue: 10, step: 5 },
      attachTo: document.body,
    })
    await wrapper.get(input).trigger('keydown', { key: 'ArrowUp' })
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([15])
    await nextTick()
    expect((wrapper.get(input).element as HTMLInputElement).value).toBe('15')
    await wrapper.setProps({ modelValue: 40 })
    expect((wrapper.get(input).element as HTMLInputElement).value).toBe('40')
    wrapper.unmount()
  })

  it('disables decrement at min and clamps typed values on blur', async () => {
    const wrapper = mount(NumberField, {
      props: { defaultValue: 0, min: 0, max: 10 },
      attachTo: document.body,
    })
    expect(wrapper.get(dec).attributes('disabled')).toBeDefined()
    expect(wrapper.get(inc).attributes('disabled')).toBeUndefined()
    const el = wrapper.get(input)
    ;(el.element as HTMLInputElement).value = '42'
    await el.trigger('input')
    await el.trigger('blur')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([10])
    wrapper.unmount()
  })

  it('readonly blocks changes from buttons and keys', async () => {
    const wrapper = mount(NumberField, {
      props: { defaultValue: 3, readonly: true },
      attachTo: document.body,
    })
    expect(wrapper.get(inc).attributes('disabled')).toBeDefined()
    await wrapper.get(input).trigger('keydown', { key: 'ArrowUp' })
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    wrapper.unmount()
  })

  it('links label, description and error to the input', () => {
    const wrapper = mount(NumberField, {
      props: {
        id: 'w',
        label: 'Width',
        description: 'Pixels',
        errorMessage: 'Too small',
        invalid: true,
      },
    })
    const el = wrapper.get(input)
    expect(wrapper.get('label').attributes('for')).toBe('w')
    expect(el.attributes('id')).toBe('w')
    expect(el.attributes('aria-describedby')).toBe('w-error')
    expect(el.attributes('aria-invalid')).toBe('true')
    expect(wrapper.get('[data-slot=number-field-group]').attributes('data-invalid')).toBe('true')
  })

  it('hides buttons when increment / decrement are false', () => {
    const wrapper = mount(NumberField, { props: { increment: false, decrement: false } })
    expect(wrapper.find(inc).exists()).toBe(false)
    expect(wrapper.find(dec).exists()).toBe(false)
  })

  it('submits the raw number (not the formatted text) under `name`', async () => {
    const form = document.createElement('form')
    document.body.append(form)
    const wrapper = mount(NumberField, {
      props: { name: 'pct', defaultValue: 0.5, step: 0.1, formatOptions: { style: 'percent' } },
      attachTo: form,
    })
    expect((wrapper.get(input).element as HTMLInputElement).value).toBe('50%')
    expect(new FormData(form).getAll('pct')).toEqual(['0.5'])
    await wrapper.get(input).trigger('keydown', { key: 'ArrowUp' })
    expect(new FormData(form).getAll('pct')).toEqual(['0.6'])
    wrapper.unmount()
    form.remove()
  })

  it('clamps an out-of-range value for display and submission without emitting (RAC snap)', () => {
    const form = document.createElement('form')
    document.body.append(form)
    const wrapper = mount(NumberField, {
      props: { name: 'q', modelValue: -5, min: 0 },
      attachTo: form,
    })
    expect((wrapper.get(input).element as HTMLInputElement).value).toBe('0')
    expect(new FormData(form).get('q')).toBe('0')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    const pct = mount(NumberField, {
      props: { modelValue: 1.5, min: 0, max: 1, step: 0.1, formatOptions: { style: 'percent' } },
    })
    expect((pct.get(input).element as HTMLInputElement).value).toBe('100%')
    wrapper.unmount()
    form.remove()
  })

  // behaviour-final-check H12: RAC commits an emptied input as "no value" (change(NaN), hidden input '')
  const clearAndCommit = async (commit: (el: ReturnType<typeof mount>) => Promise<void>) => {
    const form = document.createElement('form')
    document.body.append(form)
    const wrapper = mount(NumberField, { props: { name: 'qty', defaultValue: 5 }, attachTo: form })
    const el = wrapper.get(input)
    await el.trigger('focus')
    ;(el.element as HTMLInputElement).value = ''
    await el.trigger('input')
    await commit(wrapper)
    await nextTick()
    const result = {
      emitted: wrapper.emitted('update:modelValue')?.at(-1)?.[0],
      formValue: new FormData(form).get('qty'),
      shown: (el.element as HTMLInputElement).value,
    }
    wrapper.unmount()
    form.remove()
    return result
  }

  it('commits an emptied input on blur as no value: v-model empties and the named form value is empty', async () => {
    const result = await clearAndCommit((w) => w.get(input).trigger('blur'))
    expect(result.formValue).toBe('')
    expect(result.shown).toBe('')
    expect([null, undefined, Number.NaN]).toContainEqual(result.emitted)
  })

  it('commits an emptied input on Enter as no value: v-model empties and the named form value is empty', async () => {
    const result = await clearAndCommit((w) => w.get(input).trigger('keydown', { key: 'Enter' }))
    expect(result.formValue).toBe('')
    expect(result.shown).toBe('')
    expect([null, undefined, Number.NaN]).toContainEqual(result.emitted)
  })

  it('PageUp / PageDown move by one step like RAC, not ten', async () => {
    // behaviour-final-check NumberField page keys
    const wrapper = mount(NumberField, {
      props: { defaultValue: 10, step: 5 },
      attachTo: document.body,
    })
    await wrapper.get(input).trigger('keydown', { key: 'PageUp' })
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([15])
    await wrapper.get(input).trigger('keydown', { key: 'PageDown' })
    await wrapper.get(input).trigger('keydown', { key: 'PageDown' })
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([5])
    wrapper.unmount()
  })

  it.each<[string, NumberFieldProps & { 'aria-label'?: string }]>([
    ['idle with a visible label', { label: 'Width', defaultValue: 4 }],
    ['named by aria-label only', { 'aria-label': 'Width', defaultValue: 4 }],
    ['with a description', { label: 'Width', description: 'In pixels', defaultValue: 4 }],
    [
      'invalid with an error message',
      { label: 'Width', errorMessage: 'Too small', invalid: true, defaultValue: 4 },
    ],
    ['required', { label: 'Width', required: true }],
    ['disabled', { label: 'Width', disabled: true, defaultValue: 4 }],
    ['read-only', { label: 'Width', readonly: true, defaultValue: 4 }],
    ['at the minimum (decrement disabled)', { label: 'Width', min: 0, defaultValue: 0 }],
  ])('has no axe violations: %s', async (_, props) => {
    const wrapper = mount(NumberField, { props, attachTo: document.body })
    await nextTick()
    await expectAccessible(wrapper)
    wrapper.unmount()
  })

  it('the input is the only tab stop; the stepper buttons stay out of the tab order', () => {
    const wrapper = mount(NumberField, { props: { label: 'Width' } })
    expect(wrapper.get(input).attributes('tabindex')).not.toBe('-1')
    expect(wrapper.get(inc).attributes('tabindex')).toBe('-1')
    expect(wrapper.get(dec).attributes('tabindex')).toBe('-1')
  })

  it('ArrowDown decrements, Home / End jump to min / max (spinbutton keys)', async () => {
    const wrapper = mount(NumberField, {
      props: { label: 'Width', defaultValue: 5, min: 1, max: 9 },
      attachTo: document.body,
    })
    const el = wrapper.get(input)
    await el.trigger('keydown', { key: 'ArrowDown' })
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([4])
    await el.trigger('keydown', { key: 'End' })
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([9])
    await el.trigger('keydown', { key: 'Home' })
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([1])
    wrapper.unmount()
  })

  it('Enter commits a typed value', async () => {
    const wrapper = mount(NumberField, {
      props: { label: 'Width', defaultValue: 5 },
      attachTo: document.body,
    })
    const el = wrapper.get(input)
    ;(el.element as HTMLInputElement).value = '12'
    await el.trigger('input')
    await el.trigger('keydown', { key: 'Enter' })
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([12])
    wrapper.unmount()
  })

  it('pressing a stepper button keeps focus in the input', async () => {
    const wrapper = mount(NumberField, {
      props: { label: 'Width', defaultValue: 5 },
      attachTo: document.body,
    })
    await flushPromises()
    ;(wrapper.get(input).element as HTMLElement).focus()
    const down = new PointerEvent('pointerdown', {
      bubbles: true,
      cancelable: true,
      button: 0,
      pointerType: 'mouse',
    })
    wrapper.get(inc).element.dispatchEvent(down)
    wrapper
      .get(inc)
      .element.dispatchEvent(
        new PointerEvent('pointerup', { bubbles: true, button: 0, pointerType: 'mouse' }),
      )
    await nextTick()
    expect(down.defaultPrevented).toBe(true)
    expect(document.activeElement).toBe(wrapper.get(input).element)
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([6])
    wrapper.unmount()
  })

  it('exposes the spin button value range and names the stepper buttons after the field', async () => {
    const wrapper = mount(NumberField, {
      props: { id: 'w', label: 'Width', defaultValue: 5, min: 0, max: 10 },
      attachTo: document.body,
    })
    const el = wrapper.get(input)
    expect(el.attributes()).toMatchObject({
      role: 'spinbutton',
      'aria-valuenow': '5',
      'aria-valuemin': '0',
      'aria-valuemax': '10',
    })
    expect(wrapper.get(inc).attributes()).toMatchObject({
      'aria-label': 'Increase Width',
      'aria-controls': 'w',
    })
    expect(wrapper.get(dec).attributes()).toMatchObject({
      'aria-label': 'Decrease Width',
      'aria-controls': 'w',
    })
    await el.trigger('keydown', { key: 'ArrowUp' })
    expect(el.attributes('aria-valuenow')).toBe('6')
    wrapper.unmount()
  })

  it('aria-label names the input and the stepper buttons, not the wrapper', () => {
    const wrapper = mount(NumberField, { props: { 'aria-label': 'Quantity' } })
    expect(wrapper.get(input).attributes('aria-label')).toBe('Quantity')
    expect(wrapper.get('[data-slot=number-field]').attributes('aria-label')).toBeUndefined()
    expect(wrapper.get(inc).attributes('aria-label')).toBe('Increase Quantity')
  })

  it('reflects disabled, read-only and required on the input', () => {
    const disabled = mount(NumberField, { props: { label: 'Width', disabled: true } })
    expect(disabled.get(input).attributes('disabled')).toBeDefined()
    expect([inc, dec].map((s) => disabled.get(s).attributes('disabled'))).toEqual(['', ''])
    const readonly = mount(NumberField, {
      props: { label: 'Width', readonly: true, required: true },
    })
    expect(readonly.get(input).attributes('readonly')).toBeDefined()
    expect(readonly.get(input).attributes('required')).toBeDefined()
  })

  it('drops the error from aria-describedby once the field is valid again', async () => {
    const wrapper = mount(NumberField, {
      props: {
        id: 'w',
        label: 'Width',
        description: 'Pixels',
        errorMessage: 'Too small',
        invalid: true,
      },
    })
    expect(wrapper.get('#w-error').text()).toBe('Too small')
    expect(wrapper.find('#w-description').exists()).toBe(false)
    await wrapper.setProps({ invalid: false })
    expect(wrapper.get(input).attributes('aria-describedby')).toBe('w-description')
    expect(wrapper.get(input).attributes('aria-invalid')).toBeUndefined()
    expect(wrapper.find('#w-error').exists()).toBe(false)
  })
})

describe('NumberField stepper button slots', () => {
  it('#decrement / #increment render inside the buttons; a parent v-if switches back to the default icons', async () => {
    const show = ref(true)
    const wrapper = mount(
      defineComponent({
        components: { NumberField },
        setup: () => ({ show }),
        template: `<NumberField :default-value="1">
        <template v-if="show" #decrement><i data-test="minus" /></template>
        <template v-if="show" #increment><i data-test="plus" /></template>
      </NumberField>`,
      }),
    )
    const decIcon = () => wrapper.get(dec).find('[data-slot=number-field-decrement-button-icon]')
    const incIcon = () => wrapper.get(inc).find('[data-slot=number-field-increment-button-icon]')
    expect(wrapper.get(dec).find('[data-test=minus]').exists()).toBe(true)
    expect(wrapper.get(inc).find('[data-test=plus]').exists()).toBe(true)
    expect(decIcon().exists()).toBe(false)
    expect(incIcon().exists()).toBe(false)

    show.value = false
    await nextTick()
    expect(wrapper.find('[data-test=minus]').exists()).toBe(false)
    expect(wrapper.find('[data-test=plus]').exists()).toBe(false)
    expect(decIcon().element.tagName.toLowerCase()).toBe('svg')
    expect(incIcon().element.tagName.toLowerCase()).toBe('svg')

    show.value = true
    await nextTick()
    expect(wrapper.get(dec).find('[data-test=minus]').exists()).toBe(true)
    expect(wrapper.get(inc).find('[data-test=plus]').exists()).toBe(true)
    expect(decIcon().exists()).toBe(false)
    expect(incIcon().exists()).toBe(false)
  })

  it('changing only `description` does not re-render the stepper buttons', async () => {
    let buttonUpdates = 0
    const countButtonUpdates: ComponentOptions = {
      updated() {
        if (this.$el instanceof Element && this.$el.matches(`${inc}, ${dec}`)) buttonUpdates++
      },
    }
    const wrapper = mount(NumberField, {
      props: { label: 'Width', description: 'A', defaultValue: 1 },
      global: { mixins: [countButtonUpdates] },
    })
    // reka's form-control check is computed before the input mounts and catches up on the first update of any kind
    await wrapper.setProps({ description: 'B' })
    buttonUpdates = 0
    await wrapper.setProps({ description: 'C' })
    expect(wrapper.get('[data-slot=description]').text()).toBe('C')
    expect(wrapper.find(inc).exists()).toBe(true)
    expect(wrapper.find(dec).exists()).toBe(true)
    expect(buttonUpdates).toBe(0)
  })
})
