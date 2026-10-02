import type { DateRange } from '../src/components/RangeCalendar.vue'
import { CalendarDate, parseDate } from '@internationalized/date'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import RangeCalendar from '../src/components/RangeCalendar.vue'

const focused = new CalendarDate(2025, 1, 15)

describe('rangeCalendar', () => {
  it('clicking a start then an end day selects the range and emits update:modelValue', async () => {
    const wrapper = mount(RangeCalendar, { props: { defaultPlaceholder: focused } })
    const day10 = wrapper.findAll('[data-slot=range-calendar-cell]').find(cell => cell.text() === '10')!
    const day20 = wrapper.findAll('[data-slot=range-calendar-cell]').find(cell => cell.text() === '20')!
    await day10.trigger('mouseenter')
    await day10.trigger('click')
    await day20.trigger('mouseenter')
    await day20.trigger('click')

    const lastEmit = wrapper.emitted('update:modelValue')?.at(-1)?.[0] as DateRange
    expect(lastEmit.start).toMatchObject({ year: 2025, month: 1, day: 10 })
    expect(lastEmit.end).toMatchObject({ year: 2025, month: 1, day: 20 })
    wrapper.unmount()
  })

  it('min/max bounds mark out-of-range days disabled and unclickable', async () => {
    const wrapper = mount(RangeCalendar, {
      props: {
        defaultPlaceholder: focused,
        minValue: new CalendarDate(2025, 1, 10),
        maxValue: new CalendarDate(2025, 1, 20),
      },
    })
    const day5 = wrapper.findAll('[data-slot=range-calendar-cell]').find(cell => cell.text() === '5')!
    expect(day5.attributes('data-disabled')).toBe('')

    await day5.trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    wrapper.unmount()
  })

  it('isDateUnavailable blocks a range from being anchored on that date', async () => {
    const wrapper = mount(RangeCalendar, {
      props: {
        defaultPlaceholder: focused,
        isDateUnavailable: date => date.day === 18,
      },
    })
    const day18 = wrapper.findAll('[data-slot=range-calendar-cell]').find(cell => cell.text() === '18')!
    expect(day18.attributes('data-unavailable')).toBe('')

    await day18.trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    wrapper.unmount()
  })

  it('isDateUnavailable receives the in-progress anchor date, resetting once the range completes', async () => {
    const wrapper = mount(RangeCalendar, {
      props: {
        defaultPlaceholder: focused,
        // Dates more than 7 days from the anchor become unavailable mid-selection, matching
        // HeroUI's anchor-unavailable-dates demo (React Aria's isDateUnavailable(date, anchorDate)).
        isDateUnavailable: (date, anchor) => anchor !== null && Math.abs(date.day - anchor.day) > 7,
      },
    })
    const cell = (d: number) => wrapper.findAll('[data-slot=range-calendar-cell]').find(c => c.text() === String(d))!

    expect(cell(25).attributes('data-unavailable')).toBeUndefined()
    await cell(10).trigger('mouseenter')
    await cell(10).trigger('click')
    expect(cell(25).attributes('data-unavailable')).toBe('')
    expect(cell(15).attributes('data-unavailable')).toBeUndefined()

    await cell(15).trigger('mouseenter')
    await cell(15).trigger('click')
    expect(cell(25).attributes('data-unavailable')).toBeUndefined()
    wrapper.unmount()
  })

  it('disabled prevents selecting any date', async () => {
    const wrapper = mount(RangeCalendar, { props: { defaultPlaceholder: focused, disabled: true } })
    const day10 = wrapper.findAll('[data-slot=range-calendar-cell]').find(cell => cell.text() === '10')!
    await day10.trigger('click')

    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    wrapper.unmount()
  })

  it('year picker trigger shows the start date month and selecting a year keeps month/day', async () => {
    const wrapper = mount(RangeCalendar, {
      props: {
        modelValue: { start: new CalendarDate(2025, 6, 5), end: new CalendarDate(2025, 6, 12) },
        yearPicker: true,
      },
    })
    const trigger = wrapper.find('[data-slot=calendar-year-picker-trigger]')
    expect(trigger.text()).toContain('2025')
    expect(trigger.text()).toMatch(/June/)

    await trigger.trigger('click')
    await nextTick()
    expect(wrapper.find('[data-slot=calendar-year-picker-grid]').attributes('data-open')).toBe('true')

    const year2030 = wrapper.findAll('[data-slot=calendar-year-picker-year-cell]').find(cell => cell.text() === '2030')!
    await year2030.trigger('click')
    await nextTick()

    expect(wrapper.find('[data-slot=calendar-year-picker-grid]').attributes('data-open')).toBeUndefined()
    expect(trigger.text()).toContain('2030')
    expect(trigger.text()).toMatch(/June/)
    expect(wrapper.emitted('update:placeholder')?.[0]?.[0]).toMatchObject({ year: 2030, month: 6, day: 5 })
    wrapper.unmount()
  })

  it('numberOfMonths renders one panel per month with shared prev/next paging by the full width', async () => {
    const wrapper = mount(RangeCalendar, { props: { defaultPlaceholder: focused, numberOfMonths: 2 } })
    const panels = wrapper.findAll('[data-slot=calendar-panel]')
    expect(panels).toHaveLength(2)
    expect(panels[0].text()).toContain('January')
    expect(panels[1].text()).toContain('February')
    expect(panels[0].find('[data-slot=range-calendar-nav-button]').exists()).toBe(true)
    expect(panels[1].findAll('[data-slot=range-calendar-nav-button]')).toHaveLength(1)

    await panels[1].find('[data-slot=range-calendar-nav-button]').trigger('click')
    expect(panels[0].text()).toContain('March')
    expect(panels[1].text()).toContain('April')
    wrapper.unmount()
  })

  it('maximumDays restricts how far the end date can be from the start', async () => {
    const wrapper = mount(RangeCalendar, { props: { defaultPlaceholder: focused, maximumDays: 5 } })
    const day10 = wrapper.findAll('[data-slot=range-calendar-cell]').find(cell => cell.text() === '10')!
    const day20 = wrapper.findAll('[data-slot=range-calendar-cell]').find(cell => cell.text() === '20')!
    await day10.trigger('mouseenter')
    await day10.trigger('click')
    await day20.trigger('mouseenter')

    // day20 is 10 days after day10, past the 5-day cap, so Reka disables it...
    expect(day20.attributes('data-disabled')).toBe('')
    await day20.trigger('click')
    // ...and clicking a disabled cell cannot close the range.
    expect(wrapper.emitted('update:modelValue')).toHaveLength(1)
    wrapper.unmount()
  })

  it('invalid sets aria-invalid/data-invalid on the root', () => {
    const wrapper = mount(RangeCalendar, { props: { defaultPlaceholder: focused, invalid: true } })
    const root = wrapper.find('[data-slot=range-calendar]')
    expect(root.attributes('aria-invalid')).toBe('true')
    expect(root.attributes('data-invalid')).toBe('')
    wrapper.unmount()
  })
})

describe('range calendar week/day view (visibleDuration)', () => {
  it('two clicks select a range in day view; the anchor is passed to isDateUnavailable', async () => {
    const anchors: (string | null)[] = []
    const wrapper = mount(RangeCalendar, {
      props: {
        ariaLabel: 'Trip',
        locale: 'en-US',
        visibleDuration: { days: 10 },
        defaultPlaceholder: parseDate('2025-01-15'),
        isDateUnavailable: (_d: any, anchor: any) => { anchors.push(anchor?.toString() ?? null); return false },
      },
    })
    const cell = (day: string) => wrapper.findAll('[data-slot=range-calendar-cell]').find(c => c.text() === day)!
    await cell('9').trigger('click')
    expect(anchors.at(-1)).toBe('2025-01-09')
    await cell('12').trigger('click')
    const value = wrapper.emitted('update:modelValue')!.at(-1)![0] as any
    expect([value.start.toString(), value.end.toString()]).toEqual(['2025-01-09', '2025-01-12'])
    expect(cell('9').attributes('data-selection-start')).toBe('true')
    expect(cell('12').attributes('data-selection-end')).toBe('true')
  })
})

describe('range calendar anchor-dependent unavailable dates', () => {
  it('anchoring caps the cell on both sides and limits paging to the available run', async () => {
    const wrapper = mount(RangeCalendar, {
      props: {
        ariaLabel: 'Trip',
        defaultPlaceholder: parseDate('2025-01-15'),
        isDateUnavailable: (date: any, anchor: any) => anchor != null && Math.abs(date.compare(anchor)) > 7,
      },
      attachTo: document.body,
    })
    const day10 = wrapper.get('[data-value="2025-01-10"]')
    await day10.trigger('mouseenter')
    await day10.trigger('click')
    expect(day10.attributes('data-selection-start')).toBe('true')
    expect(day10.attributes('data-selection-end')).toBe('true')
    expect(wrapper.get('[data-value="2025-01-18"]').attributes('data-unavailable')).toBe('')
    const [, next] = wrapper.findAll('[data-slot=range-calendar-nav-button]')
    expect(next!.attributes('disabled')).toBeDefined()
    await wrapper.get('[data-value="2025-01-14"]').trigger('mouseenter')
    await wrapper.get('[data-value="2025-01-14"]').trigger('click')
    expect(wrapper.get('[data-value="2025-01-18"]').attributes('data-unavailable')).toBeUndefined()
    wrapper.unmount()
  })
})
