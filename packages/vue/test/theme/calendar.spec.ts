import { CalendarDate } from '@internationalized/date'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import Calendar from '@/components/calendar/Calendar.vue'
import RangeCalendar from '@/components/range-calendar/RangeCalendar.vue'

const focused = new CalendarDate(2025, 1, 15)

describe('Calendar theme', () => {
  it('marks the week and day views on the root', () => {
    const week = mount(Calendar, {
      props: { defaultPlaceholder: focused, visibleDuration: { weeks: 1 } },
    })

    const day = mount(Calendar, {
      props: { defaultPlaceholder: focused, visibleDuration: { days: 3 } },
    })

    const month = mount(Calendar, { props: { defaultPlaceholder: focused } })

    expect(week.classes()).toContain('h-calendar--week-view')
    expect(day.classes()).toContain('h-calendar--day-view')
    expect(month.classes()).not.toContain('h-calendar--week-view')
    expect(month.classes()).not.toContain('h-calendar--day-view')
  })

  it('keeps user utilities next to the component classes', () => {
    const wrapper = mount(Calendar, {
      props: { defaultPlaceholder: focused, class: 'w-80', ui: { cell: 'rounded-md' } },
    })

    expect(wrapper.classes()).toEqual(expect.arrayContaining(['h-calendar', 'w-80']))

    expect(wrapper.get('[data-slot=calendar-cell]').classes()).toEqual(
      expect.arrayContaining(['h-calendar__cell', 'rounded-md']),
    )
  })
})

describe('RangeCalendar theme', () => {
  it('shares the calendar shell with range day cells', () => {
    const wrapper = mount(RangeCalendar, { props: { defaultPlaceholder: focused } })

    expect(wrapper.classes()).toEqual(expect.arrayContaining(['h-calendar', 'h-calendar--range']))
    expect(wrapper.get('[data-slot=range-calendar-grid]').classes()).toContain('h-calendar__grid')

    expect(wrapper.get('[data-slot=range-calendar-cell]').classes()).toContain(
      'h-calendar__range-cell',
    )

    expect(wrapper.get('[data-slot=range-calendar-cell-button]').classes()).toContain(
      'h-calendar__range-cell-button',
    )
  })

  it('styles the week view cells as range cells', () => {
    const wrapper = mount(RangeCalendar, {
      props: { defaultPlaceholder: focused, visibleDuration: { weeks: 1 } },
    })

    expect(wrapper.classes()).toContain('h-calendar--week-view')

    expect(wrapper.get('[data-slot=range-calendar-cell]').classes()).toContain(
      'h-calendar__range-cell',
    )
  })
})
