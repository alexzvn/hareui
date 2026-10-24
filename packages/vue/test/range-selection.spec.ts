import type { DateValue } from '@internationalized/date'
import { CalendarDate } from '@internationalized/date'
import { describe, expect, it } from 'vitest'

import type {
  DayRange,
  UseRangeSelectionOptions,
} from '../src/components/calendar/useRangeSelection'
import {
  availableRun,
  boundsWithinRun,
  exceedsMaximumDays,
  isDaySelectedInRange,
  makeRange,
  useRangeSelection,
} from '../src/components/calendar/useRangeSelection'

const d = (day: number, month = 3) => new CalendarDate(2025, month, day)
const iso = (date: DateValue | undefined) => date?.toString()
const unavailableOn =
  (...days: number[]) =>
  (date: DateValue) =>
    date.month === 3 && days.includes(date.day)

function setup(overrides: Partial<UseRangeSelectionOptions> = {}) {
  const anchored: DateValue[] = []
  const committed: DayRange[] = []
  const selection = useRangeSelection({
    isDateUnavailable: () => undefined,
    allowNonContiguousRanges: () => false,
    minValue: () => d(1, 1),
    maxValue: () => d(31, 12),
    span: () => ({ months: 1 }),
    onAnchor: (date) => anchored.push(date),
    onCommit: (range) => committed.push(range),
    ...overrides,
  })
  return { selection, anchored, committed }
}

describe('makeRange', () => {
  it('orders reversed picks and keeps same-day picks', () => {
    expect(makeRange(d(20), d(5))).toEqual({ start: d(5), end: d(20) })
    expect(makeRange(d(5), d(20))).toEqual({ start: d(5), end: d(20) })
    expect(makeRange(d(7), d(7))).toEqual({ start: d(7), end: d(7) })
  })
})

describe('availableRun', () => {
  it('stops one day short of the first unavailable date on each side', () => {
    const run = availableRun(d(15), unavailableOn(10, 12, 18, 20), { months: 1 })
    expect(iso(run.start)).toBe('2025-03-13')
    expect(iso(run.end)).toBe('2025-03-17')
  })

  it('is unbounded on a side with no unavailable date within the span', () => {
    const run = availableRun(d(15), unavailableOn(18), { days: 5 })
    expect(run.start).toBeUndefined()
    expect(iso(run.end)).toBe('2025-03-17')
  })

  it('finds an unavailable day up to one past the span limit', () => {
    expect(iso(availableRun(d(15), unavailableOn(20), { days: 5 }).end)).toBe('2025-03-19')
    expect(iso(availableRun(d(15), unavailableOn(21), { days: 5 }).end)).toBe('2025-03-20')
    expect(availableRun(d(15), unavailableOn(22), { days: 5 }).end).toBeUndefined()
  })

  it('collapses to the anchor when both neighbours are unavailable', () => {
    const run = availableRun(d(15), unavailableOn(14, 16), { months: 1 })
    expect(iso(run.start)).toBe('2025-03-15')
    expect(iso(run.end)).toBe('2025-03-15')
  })
})

describe('boundsWithinRun', () => {
  it('takes the tighter of min/max and the run on each side', () => {
    expect(boundsWithinRun(d(10), d(25), { start: d(12), end: d(28) })).toEqual({
      min: d(12),
      max: d(25),
    })
    expect(boundsWithinRun(d(10), d(25), { start: d(5), end: d(20) })).toEqual({
      min: d(10),
      max: d(20),
    })
    expect(boundsWithinRun(d(10), d(25), null)).toEqual({ min: d(10), max: d(25) })
  })
})

describe('exceedsMaximumDays', () => {
  it('disables days maximumDays or more away from the anchor on either side', () => {
    expect(exceedsMaximumDays(d(17), d(15), 3)).toBe(false)
    expect(exceedsMaximumDays(d(18), d(15), 3)).toBe(true)
    expect(exceedsMaximumDays(d(13), d(15), 3)).toBe(false)
    expect(exceedsMaximumDays(d(12), d(15), 3)).toBe(true)
  })

  it('does nothing without an anchor or a limit', () => {
    expect(exceedsMaximumDays(d(30), null, 3)).toBe(false)
    expect(exceedsMaximumDays(d(30), d(1), undefined)).toBe(false)
    expect(exceedsMaximumDays(d(30), d(1), 0)).toBe(false)
  })
})

describe('isDaySelectedInRange', () => {
  it('selects unavailable days only inside an invalid range', () => {
    expect(
      isDaySelectedInRange({ inRange: true, disabled: false, unavailable: true, invalid: false }),
    ).toBe(false)
    expect(
      isDaySelectedInRange({ inRange: true, disabled: false, unavailable: true, invalid: true }),
    ).toBe(true)
    expect(
      isDaySelectedInRange({ inRange: true, disabled: false, unavailable: false, invalid: false }),
    ).toBe(true)
  })

  it('never selects disabled or out-of-range days', () => {
    expect(
      isDaySelectedInRange({ inRange: true, disabled: true, unavailable: false, invalid: true }),
    ).toBe(false)
    expect(
      isDaySelectedInRange({ inRange: false, disabled: false, unavailable: false, invalid: true }),
    ).toBe(false)
  })
})

describe('useRangeSelection', () => {
  it('anchors on the first pick and commits the ordered range on the second', () => {
    const { selection, anchored, committed } = setup()
    selection.select(d(20))
    expect(anchored).toEqual([d(20)])
    expect(committed).toEqual([])
    expect(selection.anchor.value).toEqual(d(20))
    selection.select(d(5))
    expect(committed).toEqual([{ start: d(5), end: d(20) }])
    expect(selection.anchor.value).toBeNull()
  })

  it('cancel drops the anchor so the next pick anchors again', () => {
    const { selection, anchored, committed } = setup()
    expect(selection.cancel()).toBe(false)
    selection.select(d(10))
    expect(selection.cancel()).toBe(true)
    expect(selection.anchor.value).toBeNull()
    selection.select(d(12))
    expect(anchored).toEqual([d(10), d(12)])
    expect(committed).toEqual([])
  })

  it('narrows min/max to the available run while anchored, and restores them after', () => {
    const { selection } = setup({
      isDateUnavailable: () => unavailableOn(10, 20),
      minValue: () => d(12),
      maxValue: () => d(31),
    })
    expect(iso(selection.effectiveMin.value)).toBe('2025-03-12')
    selection.select(d(15))
    // min beats the run on the left (12 > 11), the run beats max on the right
    expect(iso(selection.effectiveMin.value)).toBe('2025-03-12')
    expect(iso(selection.effectiveMax.value)).toBe('2025-03-19')
    expect(selection.isOutsideWindow(d(19))).toBe(false)
    expect(selection.isOutsideWindow(d(20))).toBe(true)
    expect(selection.isOutsideWindow(d(11))).toBe(true)
    selection.cancel()
    expect(iso(selection.effectiveMax.value)).toBe('2025-03-31')
  })

  it('passes the anchor to the matcher', () => {
    const seen: (DateValue | null)[] = []
    const { selection } = setup({
      isDateUnavailable: () => (_date, anchor) => {
        seen.push(anchor)
        return false
      },
    })
    selection.isUnavailable.value!(d(1))
    selection.select(d(15))
    selection.isUnavailable.value!(d(1))
    expect(seen[0]).toBeNull()
    expect(seen.at(-1)).toEqual(d(15))
  })

  it('keeps the full window with non-contiguous ranges or when disabled', () => {
    for (const overrides of [{ allowNonContiguousRanges: () => true }, { enabled: () => false }]) {
      const { selection } = setup({ isDateUnavailable: () => unavailableOn(20), ...overrides })
      selection.select(d(15))
      expect(iso(selection.effectiveMax.value)).toBe('2025-12-31')
    }
  })

  it('applies maximumDays from the anchor in the window check', () => {
    const { selection } = setup({ maximumDays: () => 3 })
    expect(selection.isOutsideWindow(d(25))).toBe(false)
    selection.select(d(15))
    expect(selection.isOutsideWindow(d(17))).toBe(false)
    expect(selection.isOutsideWindow(d(18))).toBe(true)
    expect(selection.isOutsideWindow(d(12))).toBe(true)
  })
})
