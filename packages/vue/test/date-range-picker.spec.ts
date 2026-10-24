import { CalendarDate } from '@internationalized/date'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import DateRangePicker from '../src/components/date-range-picker/DateRangePicker.vue'
import { expectAccessible } from './a11y'

const trigger = '[data-slot=date-range-picker-trigger]'
const flush = () => new Promise((r) => setTimeout(r, 0))
const range = { start: new CalendarDate(2025, 1, 10), end: new CalendarDate(2025, 1, 15) }

function cell(day: number) {
  return [
    ...document.querySelectorAll<HTMLElement>(
      '[data-slot=range-calendar-cell]:not([data-outside-view])',
    ),
  ].find((c) => c.textContent?.trim() === String(day))!
}

describe('dateRangePicker', () => {
  it('renders start and end inputs around the range separator, with the trigger in the suffix', () => {
    const wrapper = mount(DateRangePicker, { props: { label: 'Trip dates', defaultValue: range } })
    const inputs = wrapper.findAll('[data-slot=date-input-group-input]')
    expect(inputs.map((i) => i.attributes('slot'))).toEqual(['start', 'end'])
    expect(wrapper.get('[data-slot=date-range-picker-range-separator]').text()).toBe('-')
    expect(wrapper.get('[data-slot=date-input-group-suffix]').find(trigger).exists()).toBe(true)
    expect(inputs[0].text()).toContain('10')
    expect(inputs[1].text()).toContain('15')
  })

  it('startName/endName: submits each end as its own hidden input', () => {
    const wrapper = mount(DateRangePicker, {
      props: { startName: 'from', endName: 'to', defaultValue: range },
    })
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
    const wrapper = mount(DateRangePicker, {
      props: { invalid: true, description: 'Help', errorMessage: 'Bad range' },
    })
    expect(wrapper.find('[data-slot=description]').exists()).toBe(false)
    expect(wrapper.get('[data-slot=field-error]').text()).toBe('Bad range')
    expect(wrapper.get('[data-slot=date-input-group]').attributes('data-invalid')).toBe('true')
  })

  it('minValue: aria validation reports the out-of-range start', () => {
    const wrapper = mount(DateRangePicker, {
      props: {
        defaultValue: range,
        minValue: new CalendarDate(2025, 1, 12),
        validationBehavior: 'aria',
      },
    })
    expect(wrapper.get('[data-slot=field-error]').text()).toContain('or later')
  })

  it('required: shows a validation error once the empty field is submitted', async () => {
    const wrapper = mount(
      {
        components: { DateRangePicker },
        template:
          '<form><DateRangePicker required label="Trip" start-name="s" end-name="e" /></form>',
      },
      { attachTo: document.body },
    )
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
        calendar:
          '<button data-testid="custom" @click="onSelect({ start: value?.start, end: value?.end })">x</button>',
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

  // behaviour-final-check D1
  it('opening the popover focuses the start date of the selected range, not the placeholder', async () => {
    const wrapper = mount(DateRangePicker, {
      props: {
        label: 'Trip dates',
        defaultValue: range,
        defaultPlaceholder: new CalendarDate(2025, 1, 1),
      },
      attachTo: document.body,
    })
    await wrapper.get(trigger).trigger('click')
    await flush()

    expect(document.activeElement?.getAttribute('data-value')).toBe('2025-01-10')
    wrapper.unmount()
  })

  // behaviour-final-check D5
  it('typing a full 4-digit year in the end date keeps focus on that segment instead of jumping to the trigger', async () => {
    const wrapper = mount(DateRangePicker, {
      props: { label: 'Trip dates', defaultPlaceholder: new CalendarDate(2024, 3, 1) },
      attachTo: document.body,
    })
    const endSegments = wrapper
      .findAll('[data-slot=date-input-group-input]')[1]
      .findAll('[role=spinbutton]')
    const endYear = endSegments[endSegments.length - 1]
    ;(endYear.element as HTMLElement).focus()
    for (const key of ['2', '0', '2', '4']) await endYear.trigger('keydown', { key })

    expect(document.activeElement).not.toBe(wrapper.get(trigger).element)
    expect(document.activeElement).toBe(endYear.element)
    wrapper.unmount()
  })

  // behaviour-final-check D6
  it('a reversed range is not marked invalid while the user is still editing a segment', async () => {
    const wrapper = mount(DateRangePicker, {
      props: {
        label: 'Trip dates',
        defaultValue: { start: new CalendarDate(2024, 3, 15), end: new CalendarDate(2024, 3, 20) },
      },
      attachTo: document.body,
    })
    const startMonth = wrapper
      .findAll('[data-slot=date-input-group-input]')[0]
      .find('[role=spinbutton]')
    ;(startMonth.element as HTMLElement).focus()
    // March -> April: the start (Apr 15) now falls after the end (Mar 20)
    await startMonth.trigger('keydown', { key: 'ArrowUp' })
    await flush()

    expect(
      wrapper.findAll('[role=spinbutton]').map((s) => s.attributes('aria-invalid')),
    ).not.toContain('true')
    expect(wrapper.get('[data-slot=date-input-group]').attributes('data-invalid')).toBeUndefined()
    expect(wrapper.find('[data-slot=field-error]').exists()).toBe(false)
    wrapper.unmount()
  })
})

describe('DateRangePicker accessibility', () => {
  const popover = () => document.querySelector<HTMLElement>('[data-slot=date-range-picker-popover]')
  const nameOf = (ids: string) =>
    ids
      .split(' ')
      .map((id) => {
        const el = document.getElementById(id)!
        return el.getAttribute('aria-label') ?? el.textContent!.trim()
      })
      .join(' ')

  async function open(
    props: Record<string, unknown> = { label: 'Trip dates', defaultValue: range },
  ) {
    const wrapper = mount(DateRangePicker, { props: props as any, attachTo: document.body })
    await wrapper.get(trigger).trigger('click')
    await flush()
    return wrapper
  }

  it('passes axe idle, filled with description, aria-labelled, invalid with error, disabled and read-only', async () => {
    const cases = [
      { label: 'Trip dates' },
      { label: 'Trip dates', description: 'Up to two weeks', defaultValue: range },
      { 'aria-label': 'Trip dates' },
      { label: 'Trip dates', invalid: true, errorMessage: 'Too long', defaultValue: range },
      { label: 'Trip dates', disabled: true, defaultValue: range },
      { label: 'Trip dates', readonly: true, defaultValue: range },
      { label: 'Trip dates', inputContainer: true, defaultValue: range },
    ]
    for (const props of cases) {
      const wrapper = mount(DateRangePicker, { props: props as any, attachTo: document.body })
      await expectAccessible(wrapper)
      wrapper.unmount()
    }
  })

  it('passes axe with the range calendar popover open', async () => {
    const wrapper = await open()
    try {
      await expectAccessible()
    } finally {
      wrapper.unmount()
    }
  })

  it("passes axe with the popover's year picker open", async () => {
    const wrapper = await open({ label: 'Trip dates', defaultValue: range, yearPicker: true })
    document.querySelector<HTMLElement>('[data-slot=calendar-year-picker-trigger]')!.click()
    await flush()
    try {
      await expectAccessible()
    } finally {
      wrapper.unmount()
    }
  })

  it('the trigger announces a dialog popup, the field description and its expanded state, and controls the open dialog', async () => {
    const wrapper = mount(DateRangePicker, {
      props: { label: 'Trip dates', description: 'Up to two weeks' },
      attachTo: document.body,
    })
    const button = wrapper.get(trigger)
    expect(button.attributes('aria-haspopup')).toBe('dialog')
    expect(nameOf(button.attributes('aria-labelledby')!)).toBe('Calendar Trip dates')
    expect(nameOf(button.attributes('aria-describedby')!)).toBe('Up to two weeks')
    expect(button.attributes('aria-expanded')).toBe('false')
    await button.trigger('click')
    await flush()
    expect(button.attributes('aria-expanded')).toBe('true')
    expect(button.attributes('aria-controls')).toBe(popover()!.id)
    wrapper.unmount()
  })

  it('the popover is a dialog named by the trigger and the field label', async () => {
    const wrapper = await open()
    expect(popover()!.getAttribute('role')).toBe('dialog')
    expect(nameOf(popover()!.getAttribute('aria-labelledby')!)).toBe('Calendar Trip dates')
    wrapper.unmount()
  })

  it('focus is contained in the open dialog', async () => {
    const outside = document.createElement('button')
    document.body.appendChild(outside)
    const wrapper = await open()
    outside.focus()
    await flush()
    expect(popover()!.contains(document.activeElement)).toBe(true)
    wrapper.unmount()
    outside.remove()
  })

  it('Escape on a day closes the dialog, collapses the trigger and returns focus to it', async () => {
    const wrapper = await open()
    expect(popover()!.contains(document.activeElement)).toBe(true)
    document.activeElement!.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }),
    )
    await flush()
    expect(popover()).toBeNull()
    expect(wrapper.get(trigger).attributes('aria-expanded')).toBe('false')
    expect(document.activeElement).toBe(wrapper.get(trigger).element)
    wrapper.unmount()
  })

  it('Alt+ArrowDown on a segment opens the dialog; disabled and read-only pickers cannot open it', async () => {
    const wrapper = mount(DateRangePicker, {
      props: { label: 'Trip dates', defaultValue: range },
      attachTo: document.body,
    })
    await wrapper.get('[role=spinbutton]').trigger('keydown', { key: 'ArrowDown', altKey: true })
    await flush()
    expect(popover()).not.toBeNull()
    wrapper.unmount()

    for (const props of [{ disabled: true }, { readonly: true }]) {
      const blocked = mount(DateRangePicker, {
        props: { label: 'Trip dates', defaultValue: range, ...props },
        attachTo: document.body,
      })
      expect(blocked.get(trigger).attributes('disabled')).toBeDefined()
      await blocked.get(trigger).trigger('click')
      await blocked.get('[role=spinbutton]').trigger('keydown', { key: 'ArrowDown', altKey: true })
      await flush()
      expect(popover()).toBeNull()
      blocked.unmount()
    }
  })

  it('start and end segments are named Start Date / End Date with the label, and the first one carries the description', () => {
    const wrapper = mount(DateRangePicker, {
      props: { label: 'Trip dates', description: 'Up to two weeks', defaultValue: range },
      attachTo: document.body,
    })
    const segments = wrapper.findAll('[role=spinbutton]')
    expect(segments.map((s) => nameOf(s.attributes('aria-labelledby')!))).toEqual([
      'month, Start Date,  Trip dates',
      'day, Start Date,  Trip dates',
      'year, Start Date,  Trip dates',
      'month, End Date,  Trip dates',
      'day, End Date,  Trip dates',
      'year, End Date,  Trip dates',
    ])
    expect(
      segments.map(
        (s) => s.attributes('aria-describedby') && nameOf(s.attributes('aria-describedby')!),
      ),
    ).toEqual(['Up to two weeks', undefined, undefined, 'Up to two weeks', undefined, undefined])
    wrapper.unmount()
  })
})
