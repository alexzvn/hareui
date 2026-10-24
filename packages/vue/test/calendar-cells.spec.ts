import { CalendarDate, CalendarDateTime } from '@internationalized/date'
import { afterEach, describe, expect, it } from 'vitest'

import {
  calendarCellDate,
  calendarCellFrom,
  compareDay,
  focusCalendarCell,
} from '@/components/calendar/calendarCells'

const createGrid = () => {
  const root = document.createElement('div')
  root.innerHTML = `
    <div data-reka-calendar-cell-trigger data-value="2025-02-28" data-outside-view tabindex="-1"></div>
    <div data-reka-calendar-cell-trigger data-value="2025-03-01" tabindex="-1"><span>1</span></div>
    <div data-reka-calendar-cell-trigger data-value="2025-03-02T00:00:00" tabindex="-1"></div>
  `
  document.body.append(root)
  return root
}

afterEach(() => {
  document.body.innerHTML = ''
})

describe('compareDay', () => {
  it('compares by day, ignoring time of day', () => {
    expect(compareDay(new CalendarDateTime(2025, 3, 1, 23), new CalendarDate(2025, 3, 1))).toBe(0)
    expect(compareDay(new CalendarDate(2025, 3, 1), new CalendarDate(2025, 3, 4))).toBeLessThan(0)
    expect(
      compareDay(new CalendarDate(2025, 3, 4), new CalendarDateTime(2025, 3, 1, 8)),
    ).toBeGreaterThan(0)
  })
})

describe('calendarCellFrom', () => {
  it('finds the cell trigger an event target sits in', () => {
    const root = createGrid()
    const span = root.querySelector('span')!
    expect(calendarCellFrom(span, root)?.getAttribute('data-value')).toBe('2025-03-01')
  })

  it('ignores targets outside a cell or outside the root', () => {
    const root = createGrid()
    const other = createGrid()
    expect(calendarCellFrom(root, root)).toBeNull()
    expect(calendarCellFrom(other.querySelector('span'), root)).toBeNull()
    expect(calendarCellFrom(null, root)).toBeNull()
  })
})

describe('calendarCellDate', () => {
  it("reads the cell's day in the value type of the reference date", () => {
    const root = createGrid()
    const cell = root.querySelector<HTMLElement>('[data-value^="2025-03-02"]')!
    const date = calendarCellDate(cell, new CalendarDateTime(2025, 1, 15, 9, 30))
    expect(date).toBeInstanceOf(CalendarDateTime)
    expect(date.toString()).toBe('2025-03-02T09:30:00')
  })
})

describe('focusCalendarCell', () => {
  it('focuses the in-month cell of a date', () => {
    const root = createGrid()
    focusCalendarCell(root, new CalendarDate(2025, 3, 1))
    expect(document.activeElement?.getAttribute('data-value')).toBe('2025-03-01')
  })

  it('skips outside-month cells', () => {
    const root = createGrid()
    focusCalendarCell(root, new CalendarDate(2025, 2, 28))
    expect(document.activeElement).toBe(document.body)
  })
})
