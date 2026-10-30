import type { DateValue } from '@internationalized/date'
import { CalendarDate, parseDate } from '@internationalized/date'
import type { VueWrapper } from '@vue/test-utils'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { nextTick } from 'vue'

import type { CalendarProps } from '@/components/calendar/Calendar.types'
import Calendar from '@/components/calendar/Calendar.vue'

import { expectAccessible } from './a11y'

const focused = new CalendarDate(2025, 1, 15)

describe('calendar', () => {
  it('clicking a day selects it and emits update:modelValue', async () => {
    const wrapper = mount(Calendar, { props: { defaultPlaceholder: focused } })
    const day10 = wrapper.findAll('[data-slot=calendar-cell]').find((cell) => cell.text() === '10')!
    await day10.trigger('click')

    expect(wrapper.emitted('update:modelValue')?.[0]?.[0]).toMatchObject({
      year: 2025,
      month: 1,
      day: 10,
    })

    expect(day10.attributes('data-selected')).toBe('true')
    wrapper.unmount()
  })

  it('min/max bounds mark out-of-range days disabled and unclickable', async () => {
    const wrapper = mount(Calendar, {
      props: {
        defaultPlaceholder: focused,
        minValue: new CalendarDate(2025, 1, 10),
        maxValue: new CalendarDate(2025, 1, 20),
      },
    })

    const day5 = wrapper.findAll('[data-slot=calendar-cell]').find((cell) => cell.text() === '5')!
    expect(day5.attributes('data-disabled')).toBe('')

    await day5.trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    wrapper.unmount()
  })

  it('isDateUnavailable blocks selection of matching dates', async () => {
    const wrapper = mount(Calendar, {
      props: {
        defaultPlaceholder: focused,
        isDateUnavailable: (date) => date.day === 18,
      },
    })

    const day18 = wrapper.findAll('[data-slot=calendar-cell]').find((cell) => cell.text() === '18')!
    expect(day18.attributes('data-unavailable')).toBe('')

    await day18.trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    wrapper.unmount()
  })

  it('disabled prevents selection of any date', async () => {
    const wrapper = mount(Calendar, { props: { defaultPlaceholder: focused, disabled: true } })
    const day10 = wrapper.findAll('[data-slot=calendar-cell]').find((cell) => cell.text() === '10')!
    await day10.trigger('click')

    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    wrapper.unmount()
  })

  it('year picker trigger opens the year grid and selecting a year keeps month/day, only swapping the year', async () => {
    const wrapper = mount(Calendar, { props: { defaultPlaceholder: focused, yearPicker: true } })
    const trigger = wrapper.find('[data-slot=calendar-year-picker-trigger]')
    expect(trigger.text()).toContain('2025')

    await trigger.trigger('click')
    await nextTick()

    expect(wrapper.find('[data-slot=calendar-year-picker-grid]').attributes('data-open')).toBe(
      'true',
    )

    const year2030 = wrapper
      .findAll('[data-slot=calendar-year-picker-year-cell]')
      .find((cell) => cell.text() === '2030')!

    await year2030.trigger('click')
    await nextTick()

    expect(
      wrapper.find('[data-slot=calendar-year-picker-grid]').attributes('data-open'),
    ).toBeUndefined()

    expect(trigger.text()).toContain('2030')

    expect(wrapper.emitted('update:placeholder')?.[0]?.[0]).toMatchObject({
      year: 2030,
      month: 1,
      day: 15,
    })

    wrapper.unmount()
  })

  it('numberOfMonths renders one panel per month with shared prev/next paging by the full width', async () => {
    const wrapper = mount(Calendar, { props: { defaultPlaceholder: focused, numberOfMonths: 2 } })
    const panels = wrapper.findAll('[data-slot=calendar-panel]')
    expect(panels).toHaveLength(2)
    expect(panels[0].text()).toContain('January')
    expect(panels[1].text()).toContain('February')

    // Only the first panel gets a prev button, only the last gets a next button.
    expect(panels[0].find('[data-slot=calendar-nav-button]').exists()).toBe(true)
    expect(panels[1].findAll('[data-slot=calendar-nav-button]')).toHaveLength(1)

    await panels[1].find('[data-slot=calendar-nav-button]').trigger('click')
    expect(panels[0].text()).toContain('March')
    expect(panels[1].text()).toContain('April')
    wrapper.unmount()
  })

  it('invalid sets aria-invalid/data-invalid on the root', () => {
    const wrapper = mount(Calendar, { props: { defaultPlaceholder: focused, invalid: true } })
    const root = wrapper.find('[data-slot=calendar]')
    expect(root.attributes('aria-invalid')).toBe('true')
    expect(root.attributes('data-invalid')).toBe('')
    wrapper.unmount()
  })
})

describe('calendar week/day view (visibleDuration)', () => {
  const cells = (w: Pick<VueWrapper, 'findAll'>) => w.findAll('[data-slot=calendar-cell]')

  it('week view renders one 7-day row with a range heading, and pages by the visible weeks', async () => {
    const wrapper = mount(Calendar, {
      props: {
        ariaLabel: 'Week',
        locale: 'en-US',
        visibleDuration: { weeks: 1 },
        defaultPlaceholder: parseDate('2025-01-15'),
      },
    })

    expect(cells(wrapper).map((c) => c.text())).toEqual(['12', '13', '14', '15', '16', '17', '18'])

    expect(wrapper.get('[data-slot=calendar-heading]').text().replace(/\s/g, ' ')).toBe(
      'January 12 – 18, 2025',
    )

    await wrapper.findAll('[data-slot=calendar-nav-button]')[1]!.trigger('click')
    expect(cells(wrapper)[0]!.text()).toBe('19')
  })

  it('day view (< 7 days) shows only the visible days with matching weekday headers', () => {
    const wrapper = mount(Calendar, {
      props: {
        ariaLabel: 'Days',
        locale: 'en-US',
        visibleDuration: { days: 5 },
        defaultPlaceholder: parseDate('2025-01-15'),
      },
    })

    expect(cells(wrapper).map((c) => c.text())).toEqual(['13', '14', '15', '16', '17'])

    expect(wrapper.findAll('[data-slot=calendar-header-cell]').map((c) => c.text())).toEqual([
      'Mon',
      'Tue',
      'Wed',
      'Thu',
      'Fri',
    ])
  })

  it('day view (>= 7 days) shows week rows with leading days disabled', () => {
    const wrapper = mount(Calendar, {
      props: {
        ariaLabel: 'Days',
        locale: 'en-US',
        visibleDuration: { days: 10 },
        defaultPlaceholder: parseDate('2025-01-15'),
      },
    })

    const all = cells(wrapper)
    expect(all[0]!.text()).toBe('5')
    expect(all[0]!.attributes('data-disabled')).toBe('')
    expect(all[3]!.attributes('data-disabled')).toBeUndefined()
    expect(all.at(-1)!.text()).toBe('17')
  })

  it('clicking selects, arrow keys move focus across pages, Enter selects', async () => {
    const wrapper = mount(Calendar, {
      props: {
        ariaLabel: 'Week',
        locale: 'en-US',
        visibleDuration: { weeks: 1 },
        defaultPlaceholder: parseDate('2025-01-15'),
      },
      attachTo: document.body,
    })

    await cells(wrapper)[1]!.trigger('click')

    expect((wrapper.emitted('update:modelValue')!.at(-1)![0] as DateValue).toString()).toBe(
      '2025-01-13',
    )

    const grid = wrapper.get('[data-slot=calendar-grid]')
    for (let i = 0; i < 6; i++) await grid.trigger('keydown', { key: 'ArrowRight' })
    expect(cells(wrapper)[0]!.text()).toBe('19')
    await grid.trigger('keydown', { key: 'Enter' })

    expect((wrapper.emitted('update:modelValue')!.at(-1)![0] as DateValue).toString()).toBe(
      '2025-01-19',
    )

    wrapper.unmount()
  })
})

describe('calendar keyboard paging and re-selection', () => {
  const heading = (w: { get: (s: string) => { text: () => string } }) =>
    w.get('[data-slot=calendar-heading]').text()

  const activeDate = () => document.activeElement?.getAttribute('data-value')
  const mountFocused = async () => {
    const wrapper = mount(Calendar, {
      props: { locale: 'en-US', defaultValue: parseDate('2025-01-15') },
      attachTo: document.body,
    })

    ;(wrapper.get('[data-value="2025-01-15"]').element as HTMLElement).focus()
    expect(activeDate()).toBe('2025-01-15')

    return wrapper
  }

  const press = async (init: KeyboardEventInit) => {
    document.activeElement!.dispatchEvent(
      new KeyboardEvent('keydown', { bubbles: true, cancelable: true, ...init }),
    )

    await nextTick()
    await nextTick()
  }

  // behaviour-final-check C1
  it('Home and End move focus to the first and last day of the month', async () => {
    const wrapper = await mountFocused()
    await press({ key: 'Home', code: 'Home' })
    expect(activeDate()).toBe('2025-01-01')
    await press({ key: 'End', code: 'End' })
    expect(activeDate()).toBe('2025-01-31')
    expect(heading(wrapper)).toBe('January 2025')
    wrapper.unmount()
  })

  // behaviour-final-check C1
  it('PageDown and PageUp move focus by one month, keeping the day of the month', async () => {
    const wrapper = await mountFocused()
    await press({ key: 'PageDown', code: 'PageDown' })
    expect(heading(wrapper)).toBe('February 2025')
    expect(activeDate()).toBe('2025-02-15')
    await press({ key: 'PageUp', code: 'PageUp' })
    await press({ key: 'PageUp', code: 'PageUp' })
    expect(heading(wrapper)).toBe('December 2024')
    expect(activeDate()).toBe('2024-12-15')
    wrapper.unmount()
  })

  // behaviour-final-check C1
  it('Shift+PageDown and Shift+PageUp move focus by one year, keeping month and day', async () => {
    const wrapper = await mountFocused()
    await press({ key: 'PageDown', code: 'PageDown', shiftKey: true })
    expect(heading(wrapper)).toBe('January 2026')
    expect(activeDate()).toBe('2026-01-15')
    await press({ key: 'PageUp', code: 'PageUp', shiftKey: true })
    await press({ key: 'PageUp', code: 'PageUp', shiftKey: true })
    expect(heading(wrapper)).toBe('January 2024')
    expect(activeDate()).toBe('2024-01-15')
    wrapper.unmount()
  })

  // behaviour-final-check C2
  it('clicking the already-selected date keeps it selected', async () => {
    const wrapper = mount(Calendar, {
      props: { locale: 'en-US', defaultValue: parseDate('2025-01-15') },
    })

    const cell = wrapper.get('[data-value="2025-01-15"]')
    expect(cell.attributes('data-selected')).toBe('true')
    await cell.trigger('click')
    expect(cell.attributes('data-selected')).toBe('true')
    wrapper.unmount()
  })

  // behaviour-final-check C2
  it('pressing Enter or Space on the already-selected date keeps it selected', async () => {
    const wrapper = await mountFocused()
    const cell = wrapper.get('[data-value="2025-01-15"]')
    await press({ key: 'Enter', code: 'Enter' })
    expect(cell.attributes('data-selected')).toBe('true')
    await press({ key: ' ', code: 'Space' })
    expect(cell.attributes('data-selected')).toBe('true')
    wrapper.unmount()
  })

  // behaviour-final-check C3
  it('clicking a leading outside-month day neither navigates nor selects', async () => {
    const wrapper = mount(Calendar, {
      props: { locale: 'en-US', defaultValue: parseDate('2025-01-15') },
    })

    const outside = wrapper.get('[data-value="2024-12-30"]')
    expect(outside.attributes('data-outside-view')).toBeDefined()
    await outside.trigger('click')
    await nextTick()
    expect(heading(wrapper)).toBe('January 2025')
    expect(wrapper.get('[data-value="2025-01-15"]').attributes('data-selected')).toBe('true')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    wrapper.unmount()
  })

  // behaviour-final-check C3
  it('clicking a trailing outside-month day neither navigates nor selects', async () => {
    const wrapper = mount(Calendar, {
      props: { locale: 'en-US', defaultValue: parseDate('2025-01-15') },
    })

    const outside = wrapper.get('[data-value="2025-02-01"]')
    expect(outside.attributes('data-outside-view')).toBeDefined()
    await outside.trigger('click')
    await nextTick()
    expect(heading(wrapper)).toBe('January 2025')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    wrapper.unmount()
  })
})

describe('calendar navigation buttons', () => {
  // behaviour-final-check C4/C6
  it('prev/next keep the focused day of month and are named Previous/Next', async () => {
    const wrapper = mount(Calendar, {
      props: { locale: 'en-US', defaultValue: parseDate('2025-01-15') },
    })

    const [prev, next] = wrapper.findAll('[data-slot=calendar-nav-button]')
    expect([prev!.attributes('aria-label'), next!.attributes('aria-label')]).toEqual([
      'Previous',
      'Next',
    ])

    await next!.trigger('click')
    expect(wrapper.get('[data-slot=calendar-heading]').text()).toBe('February 2025')
    expect(wrapper.get('[data-value="2025-02-15"]').attributes('tabindex')).toBe('0')
    wrapper.unmount()
  })

  // behaviour-final-check C2 (DatePicker closes on it)
  it('re-selecting the selected date emits that date', async () => {
    const value = parseDate('2025-01-15')
    const wrapper = mount(Calendar, { props: { locale: 'en-US', modelValue: value } })
    await wrapper.get('[data-value="2025-01-15"]').trigger('click')
    expect(String(wrapper.emitted('update:modelValue')?.at(-1)?.[0])).toBe(value.toString())
    wrapper.unmount()
  })
})

describe('Calendar accessibility', () => {
  const flush = () => new Promise((r) => setTimeout(r, 0))

  const press = (key: string) =>
    document.activeElement!.dispatchEvent(
      new KeyboardEvent('keydown', { key, code: key, bubbles: true, cancelable: true }),
    )

  const date = new CalendarDate(2025, 1, 15)

  it('passes axe idle, selected, disabled, read-only, invalid, unavailable, multi-select, multi-month and week view', async () => {
    const cases: CalendarProps[] = [
      { defaultPlaceholder: date },
      { defaultValue: date, ariaLabel: 'Event date' },
      { defaultValue: date, disabled: true },
      { defaultValue: date, readonly: true },
      { defaultValue: date, invalid: true },
      {
        defaultValue: date,
        minValue: new CalendarDate(2025, 1, 5),
        isDateUnavailable: (d: DateValue) => d.day === 18,
      },
      { defaultValue: [date, date.add({ days: 2 })], selectionMode: 'multiple' as const },
      { defaultValue: date, numberOfMonths: 2 },
      { defaultValue: date, visibleDuration: { weeks: 1 } },
      { defaultValue: date, yearPicker: true },
    ]

    for (const props of cases) {
      const wrapper = mount(Calendar, { props, attachTo: document.body })
      await nextTick()
      await expectAccessible(wrapper)
      wrapper.unmount()
    }
  })

  it('passes axe with the year picker open', async () => {
    const wrapper = mount(Calendar, {
      props: { defaultValue: date, yearPicker: true },
      attachTo: document.body,
    })

    await wrapper.get('[data-slot=calendar-year-picker-trigger]').trigger('click')
    await flush()
    await expectAccessible(wrapper)
    wrapper.unmount()
  })

  it('is an application with a grid per month, each named by the calendar label and its month', () => {
    const wrapper = mount(Calendar, {
      props: { defaultValue: date, ariaLabel: 'Event date', numberOfMonths: 2 },
      attachTo: document.body,
    })

    expect(wrapper.attributes('role')).toBe('application')
    expect(wrapper.attributes('aria-label')).toContain('Event date')
    const grids = wrapper.findAll('[data-slot=calendar-grid]')
    expect(grids.map((g) => g.attributes('role'))).toEqual(['grid', 'grid'])

    expect(grids.map((g) => g.attributes('aria-label'))).toEqual([
      'Event date, January 2025',
      'Event date, February 2025',
    ])

    expect(grids[0]!.attributes('aria-multiselectable')).toBeUndefined()
    wrapper.unmount()
  })

  it('multiple selection marks the grid multiselectable and every selected cell aria-selected', () => {
    const wrapper = mount(Calendar, {
      props: { defaultValue: [date, date.add({ days: 2 })], selectionMode: 'multiple' },
      attachTo: document.body,
    })

    expect(wrapper.get('[data-slot=calendar-grid]').attributes('aria-multiselectable')).toBe('true')

    const selected = wrapper
      .findAll('td[aria-selected=true] [data-slot=calendar-cell]')
      .map((c) => c.attributes('data-value'))

    expect(selected).toEqual(['2025-01-15', '2025-01-17'])
    wrapper.unmount()
  })

  it('days are named with their full date; the selected day is aria-selected and out-of-range days aria-disabled', () => {
    const wrapper = mount(Calendar, {
      props: { defaultValue: date, minValue: new CalendarDate(2025, 1, 5) },
    })

    const selected = wrapper.get('[data-value="2025-01-15"]')
    expect(selected.attributes('role')).toBe('button')
    expect(selected.attributes('aria-label')).toBe('Wednesday, January 15, 2025')
    expect(selected.element.closest('td')!.getAttribute('aria-selected')).toBe('true')

    expect(
      wrapper.get('[data-value="2025-01-16"]').element.closest('td')!.hasAttribute('aria-selected'),
    ).toBe(false)

    expect(wrapper.get('[data-value="2025-01-04"]').attributes('aria-disabled')).toBe('true')

    expect(
      wrapper.get('[data-value="2025-01-04"]').element.closest('td')!.getAttribute('aria-disabled'),
    ).toBe('true')

    wrapper.unmount()
  })

  it('only the selected day is in the tab order, and the tab stop follows arrow-key focus', async () => {
    const wrapper = mount(Calendar, { props: { defaultValue: date }, attachTo: document.body })
    const tabbable = () =>
      wrapper
        .findAll('[data-slot=calendar-cell][tabindex="0"]')
        .map((c) => c.attributes('data-value'))

    expect(tabbable()).toEqual(['2025-01-15'])
    ;(wrapper.get('[data-value="2025-01-15"]').element as HTMLElement).focus()
    press('ArrowDown')
    await nextTick()
    expect((document.activeElement as HTMLElement).dataset.value).toBe('2025-01-22')
    expect(tabbable()).toEqual(['2025-01-22'])
    wrapper.unmount()
  })

  it('year picker: the trigger reports expanded, focus lands on the selected year, and arrows/Home/End move it', async () => {
    const wrapper = mount(Calendar, {
      props: { defaultValue: date, yearPicker: true },
      attachTo: document.body,
    })

    const trigger = wrapper.get('[data-slot=calendar-year-picker-trigger]')
    const grid = wrapper.get('[data-slot=calendar-year-picker-grid]')
    expect(trigger.attributes('aria-expanded')).toBe('false')
    expect(grid.attributes('aria-hidden')).toBe('true')

    await trigger.trigger('click')
    await flush()
    expect(trigger.attributes('aria-expanded')).toBe('true')
    expect(grid.attributes('aria-hidden')).toBe('false')
    expect(grid.attributes('role')).toBe('listbox')
    expect(grid.attributes('aria-label')).toBe('year')
    const active = () => document.activeElement as HTMLElement
    expect(active().dataset.year).toBe('2025')
    expect(active().getAttribute('role')).toBe('option')
    expect(active().getAttribute('aria-selected')).toBe('true')
    expect(grid.findAll('[tabindex="0"]').map((c) => c.attributes('data-year'))).toEqual(['2025'])

    press('ArrowRight')
    expect(active().dataset.year).toBe('2026')
    press('ArrowDown')
    expect(active().dataset.year).toBe('2029')
    press('ArrowUp')
    press('ArrowLeft')
    expect(active().dataset.year).toBe('2025')
    press('Home')
    expect(active()).toBe(grid.find('[data-year]').element)
    press('End')
    expect(active()).toBe(grid.findAll('[data-year]').at(-1)!.element)
    wrapper.unmount()
  })

  it('year picker: Escape closes it and returns focus to its trigger', async () => {
    const wrapper = mount(Calendar, {
      props: { defaultValue: date, yearPicker: true },
      attachTo: document.body,
    })

    const trigger = wrapper.get('[data-slot=calendar-year-picker-trigger]')
    await trigger.trigger('click')
    await flush()
    press('Escape')
    await flush()
    expect(trigger.attributes('aria-expanded')).toBe('false')

    expect(wrapper.get('[data-slot=calendar-year-picker-grid]').attributes('aria-hidden')).toBe(
      'true',
    )

    expect(document.activeElement).toBe(trigger.element)
    wrapper.unmount()
  })

  it('year picker: choosing a year closes it and returns focus to its trigger instead of the hidden year cell', async () => {
    const wrapper = mount(Calendar, {
      props: { defaultValue: date, yearPicker: true },
      attachTo: document.body,
    })

    const trigger = wrapper.get('[data-slot=calendar-year-picker-trigger]')
    await trigger.trigger('click')
    await flush()
    const year = wrapper.get('[data-year="2027"]')
    ;(year.element as HTMLElement).focus()
    await year.trigger('click')
    await flush()
    expect(trigger.attributes('aria-expanded')).toBe('false')
    expect(document.activeElement).toBe(trigger.element)
    expect(trigger.attributes('aria-label')).toContain('2027')
    wrapper.unmount()
  })
})
