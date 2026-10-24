import NumberFlow from '@number-flow/vue'
import type { VueWrapper } from '@vue/test-utils'
import { flushPromises, mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import type { ComponentOptions } from 'vue'
import { defineComponent, h, nextTick, reactive, ref } from 'vue'
import * as z from 'zod'

import Form from '../src/components/form/Form.vue'
import type { NumberStepperProps } from '../src/components/number-stepper/NumberStepper.vue'
import NumberStepper from '../src/components/number-stepper/NumberStepper.vue'
import { expectAccessible } from './a11y'

const inc = '[data-slot=number-stepper-increment-button]'
const dec = '[data-slot=number-stepper-decrement-button]'
const value = '[data-slot=number-stepper-value]'
const input = '[data-slot=number-stepper-input]'

async function press(target: { element: Element }) {
  // Reka's press-and-hold binds its pointerdown listener in a post-flush watcher, after mount
  await flushPromises()
  target.element.dispatchEvent(
    new PointerEvent('pointerdown', {
      bubbles: true,
      cancelable: true,
      button: 0,
      pointerType: 'mouse',
    }),
  )
  target.element.dispatchEvent(
    new PointerEvent('pointerup', { bubbles: true, button: 0, pointerType: 'mouse' }),
  )
  await nextTick()
}

// The value renders through number-flow; assert what it's given, not its (animated) DOM
function shown(wrapper: VueWrapper) {
  return wrapper.findComponent(NumberFlow).props('value')
}

describe('NumberStepper', () => {
  it('steps with the buttons and emits update:modelValue', async () => {
    const wrapper = mount(NumberStepper, { props: { defaultValue: 1 }, attachTo: document.body })
    expect(shown(wrapper)).toBe(1)
    await press(wrapper.get(inc))
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([2])
    await nextTick()
    expect(shown(wrapper)).toBe(2)
    await press(wrapper.get(dec))
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([1])
    wrapper.unmount()
  })

  it('steps with the arrow keys and clamps to min / max', async () => {
    const wrapper = mount(NumberStepper, {
      props: { defaultValue: 4, min: 0, max: 5 },
      attachTo: document.body,
    })
    await wrapper.get(input).trigger('keydown', { key: 'ArrowUp' })
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([5])
    await nextTick()
    expect(wrapper.get(inc).attributes('disabled')).toBeDefined()
    await wrapper.get(input).trigger('keydown', { key: 'ArrowUp' })
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([5])
    await wrapper.get(input).trigger('keydown', { key: 'Home' })
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([0])
    await nextTick()
    expect(wrapper.get(dec).attributes('disabled')).toBeDefined()
    wrapper.unmount()
  })

  it('PageUp / PageDown move by one step, not ten', async () => {
    const wrapper = mount(NumberStepper, {
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

  it('steps by `step` and clamps an out-of-range v-model for display', async () => {
    const wrapper = mount(NumberStepper, {
      props: { modelValue: 0, min: 0, step: 5 },
      attachTo: document.body,
    })
    await wrapper.get(input).trigger('keydown', { key: 'ArrowUp' })
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([5])
    await wrapper.setProps({ modelValue: -20 })
    expect(shown(wrapper)).toBe(0)
    wrapper.unmount()
  })

  it('follows external v-model changes', async () => {
    const wrapper = mount(NumberStepper, { props: { modelValue: 5 } })
    await wrapper.setProps({ modelValue: 8 })
    expect(shown(wrapper)).toBe(8)
    expect(wrapper.get(input).attributes('aria-valuenow')).toBe('8')
  })

  it('formats the value with formatOptions and submits the raw number', () => {
    const form = document.createElement('form')
    document.body.append(form)
    const wrapper = mount(NumberStepper, {
      props: {
        name: 'price',
        defaultValue: 10,
        locale: 'en-US',
        formatOptions: { style: 'currency', currency: 'USD' },
      },
      attachTo: form,
    })
    const flow = wrapper.findComponent(NumberFlow)
    expect(flow.props('value')).toBe(10)
    expect(flow.props('format')).toEqual({ style: 'currency', currency: 'USD' })
    expect(flow.props('locales')).toBe('en-US')
    expect((wrapper.get(input).element as HTMLInputElement).value).toBe('$10.00')
    expect(new FormData(form).get('price')).toBe('10')
    wrapper.unmount()
    form.remove()
  })

  it('exposes the value and formatted value to the value slot', () => {
    const wrapper = mount(NumberStepper, {
      props: { defaultValue: 3 },
      slots: {
        value: ({
          value: v,
          formattedValue,
        }: {
          value: number | undefined
          formattedValue: string
        }) => `${formattedValue} items (${v})`,
      },
    })
    expect(wrapper.get(value).text()).toBe('3 items (3)')
  })

  it('disables both buttons and the input when disabled', async () => {
    const wrapper = mount(NumberStepper, {
      props: { defaultValue: 3, disabled: true },
      attachTo: document.body,
    })
    expect(wrapper.get('[data-slot=number-stepper]').attributes('data-disabled')).toBe('true')
    expect(wrapper.get(inc).attributes('disabled')).toBeDefined()
    expect(wrapper.get(dec).attributes('disabled')).toBeDefined()
    expect(wrapper.get(input).attributes('disabled')).toBeDefined()
    await wrapper.get(input).trigger('keydown', { key: 'ArrowUp' })
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    wrapper.unmount()
  })

  it('names the buttons after the field and links label and description to the input', () => {
    const wrapper = mount(NumberStepper, {
      props: { id: 'g', label: 'Guests', description: 'Up to 10' },
    })
    expect(wrapper.get('label').attributes('for')).toBe('g')
    expect(wrapper.get(input).attributes('id')).toBe('g')
    expect(wrapper.get(input).attributes('aria-describedby')).toBe('g-description')
    expect(wrapper.get(inc).attributes('aria-label')).toBe('Increase Guests')
    expect(wrapper.get(dec).attributes('aria-label')).toBe('Decrease Guests')
  })

  it('renders a Button when increment / decrement receive Button props', async () => {
    const wrapper = mount(NumberStepper, {
      props: { defaultValue: 1, increment: { variant: 'primary', size: 'sm' }, decrement: false },
      attachTo: document.body,
    })
    expect(wrapper.find(dec).exists()).toBe(false)
    const button = wrapper.get(inc)
    expect(button.attributes('data-slot')).toBe('number-stepper-increment-button')
    expect(button.attributes('aria-label')).toBe('Increase')
    await press(button)
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([2])
    wrapper.unmount()
  })

  it('joins a Form: schema errors block submit and route to the field by name', async () => {
    const state = reactive({ guests: 1 })
    const onSubmit = vi.fn()
    const schema = z.object({ guests: z.number().min(2, 'At least 2 guests') })
    const wrapper = mount(
      () =>
        h(Form, { schema, state, onSubmit }, () =>
          h(NumberStepper, {
            label: 'Guests',
            name: 'guests',
            modelValue: state.guests,
            'onUpdate:modelValue': (v: number | null | undefined) => {
              state.guests = v ?? Number.NaN
            },
          }),
        ),
      { attachTo: document.body },
    )
    const submit = () => {
      wrapper.get('form').element.dispatchEvent(new Event('submit', { cancelable: true }))
      return flushPromises()
    }
    await submit()
    expect(wrapper.get('[data-slot=field-error]').text()).toBe('At least 2 guests')
    expect(wrapper.get(input).attributes('aria-invalid')).toBe('true')
    expect(onSubmit).not.toHaveBeenCalled()

    await wrapper.get(input).trigger('keydown', { key: 'ArrowUp' })
    await submit()
    expect(wrapper.find('[data-slot=field-error]').exists()).toBe(false)
    expect(onSubmit.mock.calls[0]![0].data).toEqual({ guests: 2 })
    wrapper.unmount()
  })

  it.each<[string, NumberStepperProps & { 'aria-label'?: string }]>([
    ['idle with a visible label', { label: 'Guests', defaultValue: 2 }],
    ['named by aria-label only', { 'aria-label': 'Guests', defaultValue: 2 }],
    ['with a description', { label: 'Guests', description: 'Up to 10', defaultValue: 2 }],
    [
      'invalid with an error message',
      { label: 'Guests', errorMessage: 'Too many', invalid: true, defaultValue: 2 },
    ],
    ['required', { label: 'Guests', required: true }],
    ['disabled', { label: 'Guests', disabled: true, defaultValue: 2 }],
    ['read-only', { label: 'Guests', readonly: true, defaultValue: 2 }],
    ['at the maximum (increment disabled)', { label: 'Guests', max: 2, defaultValue: 2 }],
    [
      'with Button steppers',
      {
        label: 'Guests',
        defaultValue: 2,
        increment: { variant: 'primary' },
        decrement: { variant: 'secondary' },
      },
    ],
  ])('has no axe violations: %s', async (_, props) => {
    const wrapper = mount(NumberStepper, { props, attachTo: document.body })
    await nextTick()
    await expectAccessible(wrapper)
    wrapper.unmount()
  })

  it('the spin button is the only tab stop; the stepper buttons stay out of the tab order', () => {
    const cases: NumberStepperProps[] = [
      { label: 'Guests' },
      { label: 'Guests', increment: { variant: 'primary' }, decrement: { variant: 'primary' } },
    ]
    for (const props of cases) {
      const wrapper = mount(NumberStepper, { props })
      expect(wrapper.get(input).attributes('tabindex')).not.toBe('-1')
      expect(wrapper.get(inc).attributes('tabindex')).toBe('-1')
      expect(wrapper.get(dec).attributes('tabindex')).toBe('-1')
      wrapper.unmount()
    }
  })

  it('ArrowDown decrements and End jumps to max (spinbutton keys)', async () => {
    const wrapper = mount(NumberStepper, {
      props: { label: 'Guests', defaultValue: 5, min: 1, max: 9 },
      attachTo: document.body,
    })
    await wrapper.get(input).trigger('keydown', { key: 'ArrowDown' })
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([4])
    await wrapper.get(input).trigger('keydown', { key: 'End' })
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([9])
    wrapper.unmount()
  })

  it('pressing a stepper button keeps focus in the spin button', async () => {
    const wrapper = mount(NumberStepper, {
      props: { label: 'Guests', defaultValue: 5 },
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
    wrapper.get(dec).element.dispatchEvent(down)
    wrapper
      .get(dec)
      .element.dispatchEvent(
        new PointerEvent('pointerup', { bubbles: true, button: 0, pointerType: 'mouse' }),
      )
    await nextTick()
    expect(down.defaultPrevented).toBe(true)
    expect(document.activeElement).toBe(wrapper.get(input).element)
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([4])
    wrapper.unmount()
  })

  it('exposes the value range on the spin button, hides the animated duplicate and wires the buttons to it', async () => {
    const wrapper = mount(NumberStepper, {
      props: { id: 'g', label: 'Guests', defaultValue: 3, min: 1, max: 9 },
    })
    expect(wrapper.get(input).attributes()).toMatchObject({
      role: 'spinbutton',
      'aria-valuenow': '3',
      'aria-valuemin': '1',
      'aria-valuemax': '9',
    })
    expect(wrapper.get(value).attributes('aria-hidden')).toBe('true')
    expect(wrapper.get(inc).attributes('aria-controls')).toBe('g')
    expect(wrapper.get(dec).attributes('aria-controls')).toBe('g')
  })

  it('aria-label names the spin button and the buttons, not the wrapper', () => {
    const wrapper = mount(NumberStepper, { props: { 'aria-label': 'Guests' } })
    expect(wrapper.get(input).attributes('aria-label')).toBe('Guests')
    expect(wrapper.get('[data-slot=number-stepper]').attributes('aria-label')).toBeUndefined()
    expect(wrapper.get(inc).attributes('aria-label')).toBe('Increase Guests')
    expect(wrapper.get(dec).attributes('aria-label')).toBe('Decrease Guests')
  })

  it('wires an invalid field: aria-invalid and the error id in aria-describedby', async () => {
    const wrapper = mount(NumberStepper, {
      props: {
        id: 'g',
        label: 'Guests',
        description: 'Up to 10',
        errorMessage: 'Too many',
        invalid: true,
      },
    })
    expect(wrapper.get(input).attributes('aria-invalid')).toBe('true')
    expect(wrapper.get(input).attributes('aria-describedby')).toBe('g-error')
    expect(wrapper.get('#g-error').text()).toBe('Too many')
    await wrapper.setProps({ invalid: false })
    expect(wrapper.get(input).attributes('aria-invalid')).toBeUndefined()
    expect(wrapper.get(input).attributes('aria-describedby')).toBe('g-description')
  })

  it('read-only blocks the keys and the buttons and marks the spin button read-only', async () => {
    const wrapper = mount(NumberStepper, {
      props: { label: 'Guests', defaultValue: 3, readonly: true },
      attachTo: document.body,
    })
    expect(wrapper.get(input).attributes('readonly')).toBeDefined()
    expect(wrapper.get(inc).attributes('disabled')).toBeDefined()
    await wrapper.get(input).trigger('keydown', { key: 'ArrowUp' })
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    wrapper.unmount()
  })
})

describe('NumberStepper slot outlets', () => {
  it('#decrement / #increment / #value toggled by a parent v-if switch between custom content and the fallback', async () => {
    const show = ref(true)
    const wrapper = mount(
      defineComponent({
        components: { NumberStepper },
        setup: () => ({ show }),
        template: `<NumberStepper :default-value="1">
        <template v-if="show" #decrement><i data-test="minus" /></template>
        <template v-if="show" #increment><i data-test="plus" /></template>
        <template v-if="show" #value="{ value, formattedValue }"><b data-test="value">{{ value }}|{{ formattedValue }}</b></template>
      </NumberStepper>`,
      }),
    )
    const custom = () =>
      ['minus', 'plus', 'value'].map((t) => wrapper.find(`[data-test=${t}]`).exists())
    expect(custom()).toEqual([true, true, true])
    expect(wrapper.get('[data-test=value]').text()).toBe('1|1')
    expect(wrapper.get(dec).find('svg').exists()).toBe(false)

    show.value = false
    await nextTick()
    expect(custom()).toEqual([false, false, false])
    expect(wrapper.get(dec).find('svg').exists()).toBe(true)
    expect(wrapper.get(inc).find('svg').exists()).toBe(true)
    expect(wrapper.findComponent(NumberFlow).exists()).toBe(true)

    show.value = true
    await nextTick()
    expect(custom()).toEqual([true, true, true])
    expect(wrapper.get(inc).find('svg').exists()).toBe(false)
    wrapper.unmount()
  })

  it('changing only `description` does not re-render the stepper buttons', async () => {
    let buttonUpdates = 0
    const countButtonUpdates: ComponentOptions = {
      updated() {
        if (this.$el instanceof Element && this.$el.matches(`${inc}, ${dec}`)) buttonUpdates++
      },
    }
    const wrapper = mount(NumberStepper, {
      props: { label: 'Guests', description: 'A', defaultValue: 1 },
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
    wrapper.unmount()
  })
})
