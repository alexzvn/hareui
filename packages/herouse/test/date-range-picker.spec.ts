import { CalendarDate } from '@internationalized/date'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import DateRangePicker from '../src/components/DateRangePicker.vue'

const trigger = '[data-slot=date-range-picker-trigger]'
const flush = () => new Promise(r => setTimeout(r, 0))
const range = { start: new CalendarDate(2025, 1, 10), end: new CalendarDate(2025, 1, 15) }

function cell(day: number) {
  return [...document.querySelectorAll<HTMLElement>('[data-slot=range-calendar-cell]:not([data-outside-view])')].find(c => c.textContent?.trim() === String(day))!
}

describe('dateRangePicker', () => {
  it('renders start and end inputs around the range separator, with the trigger in the suffix', () => {
    const wrapper = mount(DateRangePicker, { props: { label: 'Trip dates', defaultValue: range } })
    const inputs = wrapper.findAll('[data-slot=date-input-group-input]')
    expect(inputs.map(i => i.attributes('slot'))).toEqual(['start', 'end'])
    expect(wrapper.get('[data-slot=date-range-picker-range-separator]').text()).toBe('-')
    expect(wrapper.get('[data-slot=date-input-group-suffix]').find(trigger).exists()).toBe(true)
    expect(inputs[0].text()).toContain('10')
    expect(inputs[1].text()).toContain('15')
  })

  it('startName/endName: submits each end as its own hidden input', () => {
    const wrapper = mount(DateRangePicker, { props: { startName: 'from', endName: 'to', defaultValue: range } })
    expect((wrapper.get('input[name=from]').element as HTMLInputElement).value).toBe('2025-01-10')
    expect((wrapper.get('input[name=to]').element as HTMLInputElement).value).toBe('2025-01-15')
  })

  it('opens a popover with a range calendar; picking two days commits, closes and refocuses the trigger', async () => {
    const wrapper = mount(DateRangePicker, {
      props: { label: 'Trip dates', defaultPlaceholder: new CalendarDate(2025, 1, 1) },
      attachTo: document.body,
    })
    await wrapper.get(trigger).trigger('click')
    await flush()
    expect(document.querySelector('[data-slot=date-range-picker-popover]')).not.toBeNull()

    cell(5).click()
    await flush()
    // A half-picked range is not emitted (React Aria only emits complete ranges)
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    cell(9).click()
    await flush()

    const value = wrapper.emitted('update:modelValue')?.at(-1)?.[0] as typeof range
    expect(value.start.toString()).toBe('2025-01-05')
    expect(value.end.toString()).toBe('2025-01-09')
    expect(document.querySelector('[data-slot=date-range-picker-popover]')).toBeNull()
    expect(document.activeElement).toBe(wrapper.get(trigger).element)
    wrapper.unmount()
  })

  it('defaultOpen / v-model:open', async () => {
    const wrapper = mount(DateRangePicker, { props: { open: false }, attachTo: document.body })
    await wrapper.get(trigger).trigger('click')
    await flush()
    expect(document.querySelector('[data-slot=date-range-picker-popover]')).toBeNull()
    expect(wrapper.emitted('update:open')?.at(-1)).toEqual([true])
    await wrapper.setProps({ open: true })
    await flush()
    expect(document.querySelector('[data-slot=date-range-picker-popover]')).not.toBeNull()
    wrapper.unmount()

    const open = mount(DateRangePicker, { props: { defaultOpen: true }, attachTo: document.body })
    await flush()
    expect(document.querySelector('[data-slot=date-range-picker-popover]')).not.toBeNull()
    open.unmount()
  })

  it('controlled: setting v-model to null clears both inputs', async () => {
    const wrapper = mount(DateRangePicker, { props: { modelValue: range } })
    await wrapper.setProps({ modelValue: null })
    await flush()
    for (const input of wrapper.findAll('[data-slot=date-input-group-input]'))
      expect(input.text()).toContain('mm')
  })

  it('disabled: disables the trigger and the group', () => {
    const wrapper = mount(DateRangePicker, { props: { disabled: true } })
    expect(wrapper.get(trigger).attributes('disabled')).toBeDefined()
    expect(wrapper.get('[data-slot=date-input-group]').attributes('data-disabled')).toBe('')
  })

  it('invalid: hides the description, shows the error, and marks the group invalid', () => {
    const wrapper = mount(DateRangePicker, { props: { invalid: true, description: 'Help', errorMessage: 'Bad range' } })
    expect(wrapper.find('[data-slot=description]').exists()).toBe(false)
    expect(wrapper.get('[data-slot=field-error]').text()).toBe('Bad range')
    expect(wrapper.get('[data-slot=date-input-group]').attributes('data-invalid')).toBe('true')
  })

  it('minValue: aria validation reports the out-of-range start', () => {
    const wrapper = mount(DateRangePicker, {
      props: { defaultValue: range, minValue: new CalendarDate(2025, 1, 12), validationBehavior: 'aria' },
    })
    expect(wrapper.get('[data-slot=field-error]').text()).toContain('or later')
  })

  it('required: shows a validation error once the empty field is submitted', async () => {
    const wrapper = mount({
      components: { DateRangePicker },
      template: '<form><DateRangePicker required label="Trip" start-name="s" end-name="e" /></form>',
    }, { attachTo: document.body })
    ;(wrapper.find('form').element as HTMLFormElement).requestSubmit()
    await flush()
    expect(wrapper.find('[data-slot=field-error]').exists()).toBe(true)
    wrapper.unmount()
  })

  it('inputContainer: wraps both inputs and the separator in a scroll container', () => {
    const wrapper = mount(DateRangePicker, { props: { inputContainer: true } })
    const container = wrapper.get('[data-slot=date-input-group-input-container]')
    expect(container.findAll('[data-slot=date-input-group-input]')).toHaveLength(2)
    expect(container.find('[data-slot=date-range-picker-range-separator]').exists()).toBe(true)
  })

  it('slots: indicator, separator and calendar', async () => {
    const wrapper = mount(DateRangePicker, {
      slots: {
        indicator: '<i data-testid="icon" />',
        separator: 'to',
        calendar: '<button data-testid="custom" @click="onSelect({ start: value?.start, end: value?.end })">x</button>',
      },
      attachTo: document.body,
    })
    expect(wrapper.find('[data-testid=icon]').exists()).toBe(true)
    expect(wrapper.get('[data-slot=date-range-picker-range-separator]').text()).toBe('to')
    await wrapper.get(trigger).trigger('click')
    await flush()
    expect(document.querySelector('[data-testid=custom]')).not.toBeNull()
    wrapper.unmount()
  })
})
