import type { VNode } from 'vue'
import { CalendarDate } from '@internationalized/date'
import { DatePicker } from 'herouse'
import { h } from 'vue'

const base = { label: 'Date', calendarLabel: 'Event date', name: 'date', class: 'w-72' }
const selected = { ...base, defaultValue: new CalendarDate(2024, 3, 15) }

export const cases: Record<string, () => VNode> = {
  'date-picker-default': () => h(DatePicker, selected),
  'date-picker-focus': () => h(DatePicker, selected),
  'date-picker-secondary': () => h(DatePicker, { ...selected, variant: 'secondary' }),
  'date-picker-required': () => h(DatePicker, { ...selected, required: true }),
  'date-picker-disabled': () => h(DatePicker, { ...selected, disabled: true }),
  'date-picker-invalid': () => h(DatePicker, { ...selected, invalid: true, errorMessage: 'Date must be in the future' }),
  'date-picker-full-width': () => h(DatePicker, { ...selected, fullWidth: true, class: 'w-full' }),
  'date-picker-open': () => h(DatePicker, { ...selected, defaultOpen: true }),
  'date-picker-open-unavailable': () => h(DatePicker, {
    ...base,
    defaultOpen: true,
    defaultPlaceholder: new CalendarDate(2024, 3, 1),
    minValue: new CalendarDate(2024, 3, 10),
    maxValue: new CalendarDate(2024, 3, 20),
  }),
}
