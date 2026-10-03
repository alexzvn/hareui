import type { DateValue } from '@internationalized/date'
import { CalendarDate, CalendarDateTime } from '@internationalized/date'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import DateField from '../src/components/date-field/DateField.vue'

// Local stand-in for Promise.withResolvers, so the library's tsconfig `lib` doesn't need ES2024.
function withResolvers<T>() {
  let resolve!: (value: T) => void
  const promise = new Promise<T>((res) => {
    resolve = res
  })
  return { promise, resolve }
}

describe('dateField', () => {
  it('renders the label and links description/error via aria-describedby', () => {
    const wrapper = mount(DateField, { props: { id: 'd', label: 'Date', description: 'Pick a date' } })
    expect(wrapper.find('[data-slot="label"]').text()).toBe('Date')
    expect(wrapper.find('[data-slot="date-input-group"]').attributes('aria-labelledby')).toBe('d-label')
    expect(wrapper.find('[data-slot="description"]').attributes('id')).toBe('d-description')
    expect(wrapper.attributes('aria-describedby')).toBe('d-description')
  })

  it('v-model: pressing ArrowUp on a segment commits the incremented date', async () => {
    const wrapper = mount(DateField, {
      props: { modelValue: new CalendarDate(2024, 3, 15), 'onUpdate:modelValue': (v: DateValue | null | undefined) => wrapper.setProps({ modelValue: v }) },
    })
    const month = wrapper.find('[data-slot="date-input-group-segment"]')
    await month.trigger('focus')
    await month.trigger('keydown', { key: 'ArrowUp' })
    const emitted = wrapper.emitted('update:modelValue')!
    expect((emitted[emitted.length - 1][0] as CalendarDate).month).toBe(4)
  })

  it('keyboard: ArrowRight moves focus to the next editable segment, skipping literals', async () => {
    const wrapper = mount(DateField, { props: { defaultValue: new CalendarDate(2024, 3, 15) }, attachTo: document.body })
    const segments = wrapper.findAll('[data-slot="date-input-group-segment"]')
    const month = segments[0].element as HTMLElement
    const day = segments[2].element as HTMLElement
    month.focus()
    await wrapper.find('[data-slot="date-input-group"]').trigger('keydown', { key: 'ArrowRight' })
    expect(document.activeElement).toBe(day)
    wrapper.unmount()
  })

  it('disabled: sets data-disabled on the group and makes segments non-editable', () => {
    const wrapper = mount(DateField, { props: { disabled: true, defaultValue: new CalendarDate(2024, 3, 15) } })
    expect(wrapper.find('[data-slot="date-input-group"]').attributes('data-disabled')).toBe('')
    expect(wrapper.find('[data-slot="date-input-group-segment"]').attributes('contenteditable')).toBe('false')
  })

  it('invalid: hides the description, shows the error, and marks the group invalid', () => {
    const wrapper = mount(DateField, { props: { invalid: true, description: 'help', errorMessage: 'Enter a valid date' } })
    expect(wrapper.find('[data-slot="description"]').exists()).toBe(false)
    expect(wrapper.find('[data-slot="field-error"]').text()).toBe('Enter a valid date')
    expect(wrapper.find('[data-slot="date-input-group"]').attributes('data-invalid')).toBe('true')
  })

  it('required: shows a validation error once the (empty) field is submitted', async () => {
    const wrapper = mount({
      components: { DateField },
      template: '<form><DateField required label="Date" name="d" /></form>',
    }, { attachTo: document.body })
    const form = wrapper.find('form').element as HTMLFormElement
    form.requestSubmit()
    await wrapper.vm.$nextTick()
    const { promise, resolve } = withResolvers<void>()
    setTimeout(resolve, 0)
    await promise
    expect(wrapper.find('[data-slot="field-error"]').exists()).toBe(true)
    wrapper.unmount()
  })

  it('unavailable: isDateUnavailable marks the matching segments immediately (Reka-internal, unaffected by validationBehavior)', () => {
    const target = new CalendarDate(2024, 3, 15)
    const wrapper = mount(DateField, {
      props: { defaultValue: target, isDateUnavailable: (date: DateValue) => date.compare(target) === 0 },
    })
    const segments = wrapper.findAll('[data-slot="date-input-group-segment"]')
    expect(segments.some(s => s.attributes('data-invalid') === '')).toBe(true)
  })

  it('minValue/maxValue/isDateUnavailable: native behavior (default) hides the field-level error until committed', async () => {
    const wrapper = mount(DateField, {
      props: { defaultValue: new CalendarDate(2024, 1, 1), minValue: new CalendarDate(2024, 6, 1) },
    })
    expect(wrapper.find('[data-slot="date-input-group"]').attributes('data-invalid')).toBeUndefined()
    expect(wrapper.find('[data-slot="field-error"]').exists()).toBe(false)

    const month = wrapper.find('[data-slot="date-input-group-segment"]')
    await month.trigger('focus')
    await month.trigger('keydown', { key: 'ArrowUp' })
    expect(wrapper.find('[data-slot="date-input-group"]').attributes('data-invalid')).toBe('true')
    expect(wrapper.find('[data-slot="field-error"]').text()).toContain('or later')
  })

  it('minValue/maxValue: aria behavior shows the field-level error immediately, without committing', () => {
    const wrapper = mount(DateField, {
      props: { defaultValue: new CalendarDate(2024, 1, 1), minValue: new CalendarDate(2024, 6, 1), validationBehavior: 'aria' },
    })
    expect(wrapper.find('[data-slot="date-input-group"]').attributes('data-invalid')).toBe('true')
    expect(wrapper.find('[data-slot="field-error"]').text()).toContain('or later')
  })

  it('invalid={false} overrides native min/max invalidity', () => {
    const wrapper = mount(DateField, {
      props: { defaultValue: new CalendarDate(2024, 1, 1), minValue: new CalendarDate(2024, 6, 1), invalid: false },
    })
    expect(wrapper.find('[data-slot="date-input-group"]').attributes('data-invalid')).toBeUndefined()
  })

  it('slots: renders prefix and suffix content inside the group', () => {
    const wrapper = mount(DateField, {
      props: { defaultValue: new CalendarDate(2024, 3, 15) },
      slots: { prefix: '<span data-testid="prefix-icon" />', suffix: '<span data-testid="suffix-icon" />' },
    })
    expect(wrapper.find('[data-slot="date-input-group-prefix"] [data-testid="prefix-icon"]').exists()).toBe(true)
    expect(wrapper.find('[data-slot="date-input-group-suffix"] [data-testid="suffix-icon"]').exists()).toBe(true)
  })

  it('fullWidth: applies w-full to the root and forwards it to the group', () => {
    const wrapper = mount(DateField, { props: { fullWidth: true } })
    expect(wrapper.classes()).toContain('w-full')
    expect(wrapper.find('[data-slot="date-input-group"]').classes()).toContain('w-full')
  })

  // behaviour-final-check F1: React Aria cycles the 12-hour hour segment within the current period
  it('12-hour: ArrowUp on the hour segment wraps within the period instead of crossing AM/PM', async () => {
    const wrapper = mount(DateField, {
      props: { defaultValue: new CalendarDateTime(2024, 3, 15, 10, 30, 15), granularity: 'second', hourCycle: 12 },
    })
    const hour = wrapper.find('[data-reka-date-field-segment="hour"]')
    await hour.trigger('focus')
    await hour.trigger('keydown', { key: 'ArrowUp' })
    await hour.trigger('keydown', { key: 'ArrowUp' })
    const emitted = wrapper.emitted('update:modelValue')!
    // 10 AM -> 11 AM -> 12 AM (hour 0), not 12 PM (hour 12)
    expect((emitted[emitted.length - 1][0] as CalendarDateTime).hour).toBe(0)
  })

  // behaviour-final-check F2
  it('Home and End set the focused segment to its minimum and maximum', async () => {
    const wrapper = mount(DateField, { props: { defaultValue: new CalendarDate(2024, 3, 15) } })
    const month = wrapper.find('[data-reka-date-field-segment="month"]')
    await month.trigger('focus')
    await month.trigger('keydown', { key: 'Home' })
    expect(month.text()).toBe('1')
    await month.trigger('keydown', { key: 'End' })
    expect(month.text()).toBe('12')
  })

  // behaviour-final-check F2
  it('PageUp and PageDown step the focused segment by its large step', async () => {
    const wrapper = mount(DateField, { props: { defaultValue: new CalendarDate(2024, 6, 15) } })
    const day = wrapper.find('[data-reka-date-field-segment="day"]')
    await day.trigger('focus')
    await day.trigger('keydown', { key: 'PageUp' })
    // React Aria PAGE_STEP: day is 7
    expect(day.text()).toBe('22')
    await day.trigger('keydown', { key: 'PageDown' })
    expect(day.text()).toBe('15')
  })

  // behaviour-final-check F5
  it('invalid: marks every segment aria-invalid', () => {
    const wrapper = mount(DateField, { props: { invalid: true, defaultValue: new CalendarDate(2024, 3, 15) } })
    const segments = wrapper.findAll('[role=spinbutton]')
    expect(segments.length).toBe(3)
    expect(segments.map(s => s.attributes('aria-invalid'))).toEqual(['true', 'true', 'true'])
  })

  // behaviour-final-check F5
  it('invalid: marks the input element data-invalid', () => {
    const wrapper = mount(DateField, { props: { invalid: true, defaultValue: new CalendarDate(2024, 3, 15) } })
    expect(wrapper.get('[data-slot="date-input-group-input"]').attributes('data-invalid')).toBeDefined()
  })
})
