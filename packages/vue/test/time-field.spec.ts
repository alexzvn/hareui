import { Time } from '@internationalized/date'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import TimeField from '../src/components/time-field/TimeField.vue'

// Local stand-in for Promise.withResolvers, so the library's tsconfig `lib` doesn't need ES2024.
function withResolvers<T>() {
  let resolve!: (value: T) => void
  const promise = new Promise<T>((res) => {
    resolve = res
  })
  return { promise, resolve }
}

describe('timeField', () => {
  it('renders the label and links description/error via aria-describedby', () => {
    const wrapper = mount(TimeField, { props: { id: 't', label: 'Time', description: 'Pick a time' } })
    expect(wrapper.find('[data-slot="label"]').text()).toBe('Time')
    expect(wrapper.find('[data-slot="date-input-group"]').attributes('aria-labelledby')).toBe('t-label')
    expect(wrapper.find('[data-slot="description"]').attributes('id')).toBe('t-description')
    expect(wrapper.attributes('aria-describedby')).toBe('t-description')
  })

  it('v-model: pressing ArrowUp on the hour segment commits the incremented time', async () => {
    const wrapper = mount(TimeField, { props: { defaultValue: new Time(9, 30), label: 'Time' } })
    const hour = wrapper.find('[data-reka-time-field-segment="hour"]')
    await hour.trigger('focus')
    await hour.trigger('keydown', { key: 'ArrowUp' })
    const emitted = wrapper.emitted('update:modelValue')!
    expect((emitted[emitted.length - 1][0] as Time).hour).toBe(10)
  })

  it('keyboard: ArrowRight moves focus to the next editable segment, skipping literals', async () => {
    const wrapper = mount(TimeField, { props: { defaultValue: new Time(9, 30) }, attachTo: document.body })
    const hour = wrapper.find('[data-reka-time-field-segment="hour"]').element as HTMLElement
    const minute = wrapper.find('[data-reka-time-field-segment="minute"]').element as HTMLElement
    hour.focus()
    await wrapper.find('[data-slot="date-input-group"]').trigger('keydown', { key: 'ArrowRight' })
    expect(document.activeElement).toBe(minute)
    wrapper.unmount()
  })

  it('disabled: sets data-disabled on the group and makes segments non-editable', () => {
    const wrapper = mount(TimeField, { props: { disabled: true, defaultValue: new Time(9, 30) } })
    expect(wrapper.find('[data-slot="date-input-group"]').attributes('data-disabled')).toBe('')
    expect(wrapper.find('[data-slot="date-input-group-segment"]').attributes('contenteditable')).toBe('false')
  })

  it('invalid: hides the description, shows the error, and marks the group invalid', () => {
    const wrapper = mount(TimeField, { props: { invalid: true, description: 'help', errorMessage: 'Enter a valid time' } })
    expect(wrapper.find('[data-slot="description"]').exists()).toBe(false)
    expect(wrapper.find('[data-slot="field-error"]').text()).toBe('Enter a valid time')
    expect(wrapper.find('[data-slot="date-input-group"]').attributes('data-invalid')).toBe('true')
  })

  it('required: shows a validation error once the (empty) field is submitted', async () => {
    const wrapper = mount({
      components: { TimeField },
      template: '<form><TimeField required label="Time" name="t" /></form>',
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

  it('minValue/maxValue: native behavior (default) hides the field-level error until committed', async () => {
    const wrapper = mount(TimeField, { props: { defaultValue: new Time(8, 0), minValue: new Time(9, 0) } })
    expect(wrapper.find('[data-slot="date-input-group"]').attributes('data-invalid')).toBeUndefined()
    expect(wrapper.find('[data-slot="field-error"]').exists()).toBe(false)

    const hour = wrapper.find('[data-reka-time-field-segment="hour"]')
    await hour.trigger('focus')
    await hour.trigger('keydown', { key: 'ArrowDown' })
    expect(wrapper.find('[data-slot="date-input-group"]').attributes('data-invalid')).toBe('true')
    expect(wrapper.find('[data-slot="field-error"]').text()).toContain('or later')
  })

  it('minValue/maxValue: aria behavior shows the field-level error immediately, without committing', () => {
    const wrapper = mount(TimeField, { props: { defaultValue: new Time(8, 0), minValue: new Time(9, 0), validationBehavior: 'aria' } })
    expect(wrapper.find('[data-slot="date-input-group"]').attributes('data-invalid')).toBe('true')
    expect(wrapper.find('[data-slot="field-error"]').text()).toContain('or later')
  })

  it('invalid={false} overrides native min/max invalidity', () => {
    const wrapper = mount(TimeField, { props: { defaultValue: new Time(8, 0), minValue: new Time(9, 0), invalid: false } })
    expect(wrapper.find('[data-slot="date-input-group"]').attributes('data-invalid')).toBeUndefined()
  })

  it('slots: renders prefix and suffix content inside the group', () => {
    const wrapper = mount(TimeField, {
      props: { defaultValue: new Time(9, 30) },
      slots: { prefix: '<span data-testid="prefix-icon" />', suffix: '<span data-testid="suffix-icon" />' },
    })
    expect(wrapper.find('[data-slot="date-input-group-prefix"] [data-testid="prefix-icon"]').exists()).toBe(true)
    expect(wrapper.find('[data-slot="date-input-group-suffix"] [data-testid="suffix-icon"]').exists()).toBe(true)
  })

  it('fullWidth: applies w-full to the root and forwards it to the group', () => {
    const wrapper = mount(TimeField, { props: { fullWidth: true } })
    expect(wrapper.classes()).toContain('w-full')
    expect(wrapper.find('[data-slot="date-input-group"]').classes()).toContain('w-full')
  })

  it('granularity: "second" renders a second segment', () => {
    const wrapper = mount(TimeField, { props: { defaultValue: new Time(9, 30, 15), granularity: 'second' } })
    const segments = wrapper.findAll('[data-slot="date-input-group-segment"]')
    expect(segments.some(s => s.element.getAttribute('data-reka-time-field-segment') === 'second')).toBe(true)
  })

  // behaviour-final-check F1/T2: React Aria cycles the 12-hour hour segment within the current period
  it('12-hour: ArrowUp on the hour segment wraps within the period instead of crossing AM/PM', async () => {
    const wrapper = mount(TimeField, { props: { defaultValue: new Time(10, 30, 15), granularity: 'second', hourCycle: 12 } })
    const hour = wrapper.find('[data-reka-time-field-segment="hour"]')
    await hour.trigger('focus')
    await hour.trigger('keydown', { key: 'ArrowUp' })
    await hour.trigger('keydown', { key: 'ArrowUp' })
    const emitted = wrapper.emitted('update:modelValue')!
    // 10 AM -> 11 AM -> 12 AM (hour 0), not 12 PM (hour 12)
    expect((emitted[emitted.length - 1][0] as Time).hour).toBe(0)
  })

  // behaviour-final-check T1
  it('Home and End set the focused segment to its minimum and maximum', async () => {
    const wrapper = mount(TimeField, { props: { defaultValue: new Time(9, 30), hourCycle: 24 } })
    const hour = wrapper.find('[data-reka-time-field-segment="hour"]')
    await hour.trigger('focus')
    await hour.trigger('keydown', { key: 'Home' })
    expect(hour.text()).toBe('00')
    await hour.trigger('keydown', { key: 'End' })
    expect(hour.text()).toBe('23')
  })

  // behaviour-final-check T1
  it('PageUp and PageDown step the focused segment by its large step', async () => {
    const wrapper = mount(TimeField, { props: { defaultValue: new Time(9, 30), hourCycle: 24 } })
    const minute = wrapper.find('[data-reka-time-field-segment="minute"]')
    await minute.trigger('focus')
    await minute.trigger('keydown', { key: 'PageUp' })
    // React Aria PAGE_STEP: minute is 15
    expect(minute.text()).toBe('45')
    await minute.trigger('keydown', { key: 'PageDown' })
    expect(minute.text()).toBe('30')
  })

  // behaviour-final-check F5 (shared DateInputGroup)
  it('invalid: marks every segment aria-invalid and the input element data-invalid', () => {
    const wrapper = mount(TimeField, { props: { invalid: true, defaultValue: new Time(9, 30) } })
    expect(wrapper.findAll('[role=spinbutton]').map(s => s.attributes('aria-invalid'))).toEqual(['true', 'true', 'true'])
    expect(wrapper.get('[data-slot="date-input-group-input"]').attributes('data-invalid')).toBeDefined()
  })
})
