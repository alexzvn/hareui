import type { DateValue } from '@internationalized/date'
import type { VNode } from 'vue'
import { isWeekend, parseDate } from '@internationalized/date'
import { RangeCalendar } from 'herouse'
import { h } from 'vue'

export const cases: Record<string, () => VNode> = {}

// January 2025 never contains "today", so the grid is deterministic.
const focused = parseDate('2025-01-15')
const base = { ariaLabel: 'Event dates', defaultPlaceholder: focused }

cases['range-calendar-basic'] = () => h(RangeCalendar, base)
cases['range-calendar-selected'] = () => h(RangeCalendar, { ...base, defaultValue: { start: parseDate('2025-01-10'), end: parseDate('2025-01-15') } })
cases['range-calendar-disabled'] = () => h(RangeCalendar, { ...base, disabled: true })
cases['range-calendar-read-only'] = () => h(RangeCalendar, { ...base, readonly: true, defaultValue: { start: parseDate('2025-01-10'), end: parseDate('2025-01-15') } })
cases['range-calendar-unavailable'] = () => h(RangeCalendar, { ...base, isDateUnavailable: (date: DateValue) => isWeekend(date, 'en-US') })
cases['range-calendar-min-max'] = () => h(RangeCalendar, { ...base, minValue: parseDate('2025-01-10'), maxValue: parseDate('2025-01-20') })
cases['range-calendar-indicator'] = () => h(RangeCalendar, { ...base, defaultValue: { start: parseDate('2025-01-10'), end: parseDate('2025-01-15') }, indicator: (date: DateValue) => [3, 15, 22].includes(date.day) })
cases['range-calendar-non-contiguous'] = () => h(RangeCalendar, { ...base, defaultValue: { start: parseDate('2025-01-10'), end: parseDate('2025-01-18') }, isDateUnavailable: (date: DateValue) => isWeekend(date, 'en-US'), allowNonContiguousRanges: true })
