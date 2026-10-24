import type { DateValue } from '@internationalized/date'
import { DateFormatter, getLocalTimeZone } from '@internationalized/date'

import type { DateRangePickerProps, DateRangeValue } from './DateRangePicker.types'

/** The picker props the builtin range validation reads. */
export type DateRangeConstraints = Pick<
  DateRangePickerProps,
  'locale' | 'minValue' | 'maxValue' | 'isDateUnavailable'
>

const formatDateBoundary = (value: DateValue, locale = 'en-US') => {
  const formatter = new DateFormatter(locale, { dateStyle: 'medium' })

  return formatter.format(value.toDate(getLocalTimeZone()))
}

const validateDate = (value: DateValue, constraints: DateRangeConstraints) => {
  const { minValue, maxValue, locale } = constraints
  const errors: string[] = []

  if (minValue && value.compare(minValue) < 0) {
    errors.push(`Value must be ${formatDateBoundary(minValue, locale)} or later.`)
  }

  if (maxValue && value.compare(maxValue) > 0) {
    errors.push(`Value must be ${formatDateBoundary(maxValue, locale)} or earlier.`)
  }

  // Outside the calendar there is no in-progress selection, so React Aria passes a `null` anchor.
  const isUnavailable = constraints.isDateUnavailable?.(value, null)
  if (isUnavailable) errors.push('Selected date unavailable.')

  return errors
}

/**
 * React Aria's builtin range validation (`validateDateRange`): each end against min/max/unavailable,
 * plus a reversed range. Returns `undefined` when the range is valid.
 */
export const validateDateRange = (range: DateRangeValue, constraints: DateRangeConstraints) => {
  const startErrors = validateDate(range.start, constraints)
  const endErrors = validateDate(range.end, constraints)

  // Both ends usually fail the same way (e.g. both before `minValue`); report each message once.
  const errors = [...new Set([...startErrors, ...endErrors])]

  const isReversed = range.end.compare(range.start) < 0
  if (isReversed) errors.push('Start date must be before end date.')

  return errors.length > 0 ? errors : undefined
}
