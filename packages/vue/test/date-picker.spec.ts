import { CalendarDate } from '@internationalized/date'
import type { ComponentMountingOptions } from '@vue/test-utils'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import DatePicker from '@/components/date-picker/DatePicker.vue'

import { expectAccessible } from './a11y'

// Local stand-in for Promise.withResolvers, so the library's tsconfig `lib` doesn't need ES2024.
const withResolvers = <T>() => {
  let resolve!: (value: T) => void
  const promise = new Promise<T>((res) => {
    resolve = res
  })

  return { promise, resolve }
}

const trigger = '[data-slot=date-picker-trigger]'
const flush = () => new Promise((r) => setTimeout(r, 0))

describe('datePicker', () => {
  it('renders the label and links description/error via aria-describedby', () => {
    const wrapper = mount(DatePicker, { props: { label: 'Date', description: 'Enter a date' } })
    expect(wrapper.get('[data-slot=label]').text()).toBe('Date')
    const id = wrapper.get('[data-slot=date-picker]').attributes('aria-describedby')
    expect(wrapper.get(`#${id}`).text()).toBe('Enter a date')
  })

  it('clicking the trigger opens a popover with a calendar', async () => {
    const wrapper = mount(DatePicker, { props: { label: 'Date' }, attachTo: document.body })
    expect(document.querySelector('[data-slot=date-picker-popover]')).toBeNull()

    await wrapper.get(trigger).trigger('click')
    await flush()
    expect(document.querySelector('[data-slot=date-picker-popover]')).not.toBeNull()
    expect(document.querySelectorAll('[data-slot=calendar-cell]').length).toBeGreaterThan(0)
    wrapper.unmount()
  })

  it('defaultOpen: renders the popover open initially, uncontrolled', async () => {
    const wrapper = mount(DatePicker, {
      props: { label: 'Date', defaultOpen: true },
      attachTo: document.body,
    })

    await flush()
    expect(document.querySelector('[data-slot=date-picker-popover]')).not.toBeNull()
    wrapper.unmount()
  })

  it('open: a controlled prop keeps the popover state in sync and emits update:open', async () => {
    const wrapper = mount(DatePicker, {
      props: { label: 'Date', open: false },
      attachTo: document.body,
    })

    expect(document.querySelector('[data-slot=date-picker-popover]')).toBeNull()

    await wrapper.get(trigger).trigger('click')
    await flush()

    // Controlled: clicking alone must not open it without the parent updating the prop
    expect(document.querySelector('[data-slot=date-picker-popover]')).toBeNull()
    expect(wrapper.emitted('update:open')?.at(-1)).toEqual([true])

    await wrapper.setProps({ open: true })
    await flush()
    expect(document.querySelector('[data-slot=date-picker-popover]')).not.toBeNull()
    wrapper.unmount()
  })

  it('selecting a day commits the value, closes the popover, and refocuses the trigger', async () => {
    const wrapper = mount(DatePicker, {
      props: { label: 'Date', defaultPlaceholder: new CalendarDate(2025, 1, 15) },
      attachTo: document.body,
    })

    await wrapper.get(trigger).trigger('click')
    await flush()

    const day10 = [...document.querySelectorAll<HTMLElement>('[data-slot=calendar-cell]')].find(
      (cell) => cell.textContent?.trim() === '10',
    )!

    day10.click()
    await flush()

    expect(wrapper.emitted('update:modelValue')?.at(-1)?.[0]).toMatchObject({
      year: 2025,
      month: 1,
      day: 10,
    })

    expect(document.querySelector('[data-slot=date-picker-popover]')).toBeNull()
    expect(document.activeElement).toBe(wrapper.get(trigger).element)
    wrapper.unmount()
  })

  it('disabled: disables the trigger button and segments', () => {
    const wrapper = mount(DatePicker, { props: { disabled: true } })
    expect(wrapper.get(trigger).attributes('disabled')).toBeDefined()
    expect(wrapper.get('[data-slot=date-input-group]').attributes('data-disabled')).toBe('')
  })

  it('invalid: hides the description, shows the error, and marks the group invalid', () => {
    const wrapper = mount(DatePicker, {
      props: { invalid: true, description: 'Help', errorMessage: 'Required' },
    })

    expect(wrapper.find('[data-slot=description]').exists()).toBe(false)
    expect(wrapper.get('[data-slot=field-error]').text()).toBe('Required')
    expect(wrapper.get('[data-slot=date-input-group]').attributes('data-invalid')).toBe('true')
  })

  it('required: shows a validation error once the (empty) field is submitted', async () => {
    const wrapper = mount(
      {
        components: { DatePicker },
        template: '<form><DatePicker required label="Date" name="d" /></form>',
      },
      { attachTo: document.body },
    )

    const form = wrapper.find('form').element as HTMLFormElement
    form.requestSubmit()
    await wrapper.vm.$nextTick()
    const { promise, resolve } = withResolvers<void>()
    setTimeout(resolve, 0)
    await promise
    expect(wrapper.find('[data-slot=field-error]').exists()).toBe(true)
    wrapper.unmount()
  })

  it('minValue/maxValue: native behavior (default) hides the field-level error until committed', async () => {
    const wrapper = mount(DatePicker, {
      props: { defaultValue: new CalendarDate(2024, 1, 1), minValue: new CalendarDate(2024, 6, 1) },
    })

    expect(wrapper.find('[data-slot=date-input-group]').attributes('data-invalid')).toBeUndefined()
    expect(wrapper.find('[data-slot=field-error]').exists()).toBe(false)

    const month = wrapper.find('[data-slot=date-input-group-segment]')
    await month.trigger('focus')
    await month.trigger('keydown', { key: 'ArrowUp' })
    expect(wrapper.find('[data-slot=date-input-group]').attributes('data-invalid')).toBe('true')
    expect(wrapper.find('[data-slot=field-error]').text()).toContain('or later')
  })

  it('invalid={false} overrides native min/max invalidity', () => {
    const wrapper = mount(DatePicker, {
      props: {
        defaultValue: new CalendarDate(2024, 1, 1),
        minValue: new CalendarDate(2024, 6, 1),
        invalid: false,
      },
    })

    expect(wrapper.find('[data-slot=date-input-group]').attributes('data-invalid')).toBeUndefined()
  })

  it('slots: calendar slot replaces the default calendar, receiving value and onSelect', async () => {
    const wrapper = mount(DatePicker, {
      props: { label: 'Date' },
      slots: {
        calendar: '<button data-testid="custom-calendar" @click="onSelect(value)">custom</button>',
      },
      attachTo: document.body,
    })

    await wrapper.get(trigger).trigger('click')
    await flush()
    expect(document.querySelector('[data-testid=custom-calendar]')).not.toBeNull()
    wrapper.unmount()
  })

  // behaviour-final-check P1
  it('Alt+ArrowDown on a segment opens the popover and focuses the selected date, leaving the segment value alone', async () => {
    const wrapper = mount(DatePicker, {
      props: { label: 'Date', defaultValue: new CalendarDate(2024, 3, 15) },
      attachTo: document.body,
    })

    const month = wrapper.get('[data-reka-date-field-segment="month"]')
    ;(month.element as HTMLElement).focus()
    await month.trigger('keydown', { key: 'ArrowDown', altKey: true })
    await flush()

    expect(document.querySelector('[data-slot=date-picker-popover]')).not.toBeNull()

    expect(document.activeElement).toBe(
      document.querySelector('[data-slot=calendar-cell][data-value="2024-03-15"]'),
    )

    expect(month.text()).toBe('3')
    wrapper.unmount()
  })

  // behaviour-final-check P2
  it('returns focus to the trigger after an outside click closes the popover', async () => {
    const outside = document.createElement('button')
    document.body.appendChild(outside)

    const wrapper = mount(DatePicker, {
      props: { label: 'Date', defaultValue: new CalendarDate(2025, 1, 15) },
      attachTo: document.body,
    })

    await wrapper.get(trigger).trigger('click')
    await flush()
    expect(document.querySelector('[data-slot=date-picker-popover]')).not.toBeNull()

    outside.focus()

    outside.dispatchEvent(
      new PointerEvent('pointerdown', {
        bubbles: true,
        button: 0,
        pointerType: 'mouse',
        ctrlKey: false,
      }),
    )

    outside.dispatchEvent(
      new PointerEvent('pointerup', { bubbles: true, button: 0, pointerType: 'mouse' }),
    )

    outside.click()
    await flush()

    expect(document.querySelector('[data-slot=date-picker-popover]')).toBeNull()
    expect(document.activeElement).toBe(wrapper.get(trigger).element)
    wrapper.unmount()
    outside.remove()
  })

  // behaviour-final-check P3
  it('clicking the already-selected date closes the popover and returns focus to the trigger', async () => {
    const wrapper = mount(DatePicker, {
      props: { label: 'Date', defaultValue: new CalendarDate(2025, 1, 15) },
      attachTo: document.body,
    })

    await wrapper.get(trigger).trigger('click')
    await flush()

    document
      .querySelector<HTMLElement>('[data-slot=calendar-cell][data-value="2025-01-15"]')!
      .click()

    await flush()

    expect(document.querySelector('[data-slot=date-picker-popover]')).toBeNull()
    expect(document.activeElement).toBe(wrapper.get(trigger).element)
    wrapper.unmount()
  })

  // behaviour-final-check P4
  it('Escape while the year picker is open closes the whole popover and focuses the trigger', async () => {
    const wrapper = mount(DatePicker, {
      props: { label: 'Date', defaultValue: new CalendarDate(2025, 1, 15) },
      attachTo: document.body,
    })

    await wrapper.get(trigger).trigger('click')
    await flush()
    document.querySelector<HTMLElement>('[data-slot=calendar-year-picker-trigger]')!.click()
    await flush()

    expect(
      document.querySelector('[data-slot=calendar-year-picker-grid]')?.getAttribute('data-open'),
    ).toBe('true')

    const target = document.activeElement ?? document.body
    target.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }),
    )

    await flush()

    expect(document.querySelector('[data-slot=date-picker-popover]')).toBeNull()
    expect(document.activeElement).toBe(wrapper.get(trigger).element)
    wrapper.unmount()
  })

  // behaviour-final-check F5 (shared DateInputGroup)
  it('invalid: marks every segment aria-invalid and the input element data-invalid', () => {
    const wrapper = mount(DatePicker, {
      props: { invalid: true, defaultValue: new CalendarDate(2024, 3, 15) },
    })

    expect(wrapper.findAll('[role=spinbutton]').map((s) => s.attributes('aria-invalid'))).toEqual([
      'true',
      'true',
      'true',
    ])

    expect(
      wrapper.get('[data-slot=date-input-group-input]').attributes('data-invalid'),
    ).toBeDefined()
  })

  // behaviour-final-check P6
  it('names the trigger "Calendar", together with the field label', () => {
    const wrapper = mount(DatePicker, { props: { label: 'Date' } })
    const button = wrapper.get(trigger)
    expect(button.attributes('aria-label')).toBe('Calendar')
    const [self, label] = button.attributes('aria-labelledby')!.split(' ')
    expect(self).toBe(button.attributes('id'))
    expect(wrapper.get(`#${label}`).text()).toBe('Date')
  })
})

describe('DatePicker accessibility', () => {
  const date = new CalendarDate(2025, 1, 15)
  const popover = () => document.querySelector<HTMLElement>('[data-slot=date-picker-popover]')

  const nameOf = (ids: string) =>
    ids
      .split(' ')
      .map((id) => {
        const el = document.getElementById(id)!
        return el.getAttribute('aria-label') ?? el.textContent!.trim()
      })
      .join(' ')

  const open = async (
    props: ComponentMountingOptions<typeof DatePicker>['props'] = {
      label: 'Due date',
      defaultValue: date,
    },
  ) => {
    const wrapper = mount(DatePicker, { props, attachTo: document.body })
    await wrapper.get(trigger).trigger('click')
    await flush()

    return wrapper
  }

  it('passes axe idle, filled with description, aria-labelled, invalid with error, disabled and read-only', async () => {
    const cases: ComponentMountingOptions<typeof DatePicker>['props'][] = [
      { label: 'Due date' },
      { label: 'Due date', description: 'Pick a weekday', defaultValue: date },
      { 'aria-label': 'Due date' },
      { label: 'Due date', invalid: true, errorMessage: 'Pick a later date', defaultValue: date },
      { label: 'Due date', disabled: true, defaultValue: date },
      { label: 'Due date', readonly: true, defaultValue: date },
    ]

    for (const props of cases) {
      const wrapper = mount(DatePicker, { props, attachTo: document.body })
      await expectAccessible(wrapper)
      wrapper.unmount()
    }
  })

  it('passes axe with the calendar popover open', async () => {
    const wrapper = await open()
    try {
      await expectAccessible()
    } finally {
      wrapper.unmount()
    }
  })

  it("passes axe with the popover's year picker open", async () => {
    const wrapper = await open()
    document.querySelector<HTMLElement>('[data-slot=calendar-year-picker-trigger]')!.click()
    await flush()

    try {
      await expectAccessible()
    } finally {
      wrapper.unmount()
    }
  })

  it('the trigger announces a dialog popup, the field description and its expanded state, and controls the open dialog', async () => {
    const wrapper = mount(DatePicker, {
      props: { label: 'Due date', description: 'Pick a weekday' },
      attachTo: document.body,
    })

    const button = wrapper.get(trigger)
    expect(button.attributes('aria-haspopup')).toBe('dialog')
    expect(nameOf(button.attributes('aria-describedby')!)).toBe('Pick a weekday')
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
    expect(nameOf(popover()!.getAttribute('aria-labelledby')!)).toBe('Calendar Due date')
    wrapper.unmount()
  })

  it('without a visible label the dialog is still named by the trigger', async () => {
    const wrapper = await open({ 'aria-label': 'Due date' })
    expect(nameOf(popover()!.getAttribute('aria-labelledby')!)).toBe('Calendar')
    wrapper.unmount()
  })

  it('opening with the trigger moves focus to the selected date', async () => {
    const wrapper = await open()

    expect(document.activeElement).toBe(
      document.querySelector('[data-slot=calendar-cell][data-value="2025-01-15"]'),
    )

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

    document.activeElement!.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }),
    )

    await flush()
    expect(popover()).toBeNull()
    expect(wrapper.get(trigger).attributes('aria-expanded')).toBe('false')
    expect(document.activeElement).toBe(wrapper.get(trigger).element)
    wrapper.unmount()
  })

  it('disabled and read-only pickers cannot open the dialog', async () => {
    for (const props of [{ disabled: true }, { readonly: true }]) {
      const wrapper = mount(DatePicker, {
        props: { label: 'Due date', defaultValue: date, ...props },
        attachTo: document.body,
      })

      expect(wrapper.get(trigger).attributes('disabled')).toBeDefined()
      await wrapper.get(trigger).trigger('click')
      const month = wrapper.get('[data-reka-date-field-segment="month"]')
      await month.trigger('keydown', { key: 'ArrowDown', altKey: true })
      await flush()
      expect(popover()).toBeNull()
      wrapper.unmount()
    }
  })

  it('segments are named by their field and the label, and described by the description', () => {
    const wrapper = mount(DatePicker, {
      props: { label: 'Due date', description: 'Pick a weekday', defaultValue: date },
      attachTo: document.body,
    })

    const segments = wrapper.findAll('[role=spinbutton]')
    expect(segments.map((s) => nameOf(s.attributes('aria-labelledby')!))).toEqual([
      'month,  Due date',
      'day,  Due date',
      'year,  Due date',
    ])

    expect(nameOf(segments[0]!.attributes('aria-describedby')!)).toBe('Pick a weekday')
    wrapper.unmount()
  })
})
