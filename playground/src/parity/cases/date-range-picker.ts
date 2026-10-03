import type { VNode } from 'vue'
import { CalendarDate, CalendarDateTime } from '@internationalized/date'
import { DateRangePicker } from '@hareui/vue'
import { h } from 'vue'

const base = { label: 'Trip dates', calendarLabel: 'Trip dates', startName: 'startDate', endName: 'endDate', class: 'w-80' }
const range = { start: new CalendarDate(2024, 3, 15), end: new CalendarDate(2024, 3, 20) }
const selected = { ...base, defaultValue: range }

export const cases: Record<string, () => VNode> = {
  'date-range-picker-default': () => h(DateRangePicker, { ...selected, fullWidth: true }),
  'date-range-picker-empty': () => h(DateRangePicker, { ...base, fullWidth: true }),
  'date-range-picker-secondary': () => h(DateRangePicker, { ...selected, fullWidth: true, variant: 'secondary' }),
  'date-range-picker-required': () => h(DateRangePicker, { ...selected, fullWidth: true, required: true }),
  'date-range-picker-disabled': () => h(DateRangePicker, { ...selected, fullWidth: true, disabled: true, description: 'This date range picker is disabled.' }),
  'date-range-picker-invalid': () => h(DateRangePicker, { ...selected, fullWidth: true, invalid: true, errorMessage: 'Select a valid range starting today or later.' }),
  'date-range-picker-full-width': () => h(DateRangePicker, { ...selected, fullWidth: true, class: 'w-full' }),
  'date-range-picker-input-container': () => h(DateRangePicker, {
    ...base,
    // Inline instead of `w-full max-w-2xs min-w-80`: the reference server's Tailwind scan doesn't pick up new case files
    class: undefined,
    style: { width: '100%', maxWidth: '18rem', minWidth: '20rem' },
    inputContainer: true,
    granularity: 'second',
    hourCycle: 12,
    defaultValue: { start: new CalendarDateTime(2026, 2, 3, 8, 45), end: new CalendarDateTime(2026, 2, 10, 18, 45) },
  }),
  'date-range-picker-open': () => h(DateRangePicker, { ...selected, fullWidth: true, defaultOpen: true }),
  'date-range-picker-open-unavailable': () => h(DateRangePicker, {
    ...base,
    fullWidth: true,
    defaultOpen: true,
    defaultPlaceholder: new CalendarDate(2024, 3, 1),
    minValue: new CalendarDate(2024, 3, 10),
    maxValue: new CalendarDate(2024, 3, 20),
  }),
}
