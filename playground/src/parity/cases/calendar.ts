import type { DateValue } from '@internationalized/date'
import type { VNode } from 'vue'
import { isWeekend, parseDate } from '@internationalized/date'
import { Calendar } from 'herouse'
import { h } from 'vue'

export const cases: Record<string, () => VNode> = {}

// January 2025 never contains "today", so the grid is deterministic.
const focused = parseDate('2025-01-15')
const base = { ariaLabel: 'Event date', defaultPlaceholder: focused }

cases['calendar-basic'] = () => h(Calendar, base)
cases['calendar-selected'] = () => h(Calendar, { ...base, defaultValue: parseDate('2025-01-15') })
cases['calendar-disabled'] = () => h(Calendar, { ...base, disabled: true })
cases['calendar-read-only'] = () => h(Calendar, { ...base, readonly: true, defaultValue: parseDate('2025-01-15') })
cases['calendar-unavailable'] = () => h(Calendar, { ...base, isDateUnavailable: (date: DateValue) => isWeekend(date, 'en-US') })
cases['calendar-min-max'] = () => h(Calendar, { ...base, minValue: parseDate('2025-01-10'), maxValue: parseDate('2025-01-20') })
// March 2024 spans 6 calendar weeks (Fri Mar 1 -> Sun Mar 31); regression guard for the
// placeholder seeding bug where the embedded Calendar inside DatePicker defaulted to today's
// month instead of the picker's value, rendering a 5-week grid instead of 6.
cases['calendar-six-week-month'] = () => h(Calendar, { ariaLabel: 'Event date', defaultValue: parseDate('2024-03-15') })
cases['calendar-indicator'] = () => h(Calendar, { ...base, defaultValue: parseDate('2025-01-15'), indicator: (date: DateValue) => [3, 15, 22].includes(date.day) })
