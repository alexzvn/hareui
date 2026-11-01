import type { DateValue } from '@internationalized/date'
import { DateFormatter, getLocalTimeZone } from '@internationalized/date'

import type { Translate } from '@/composables/useLocale'

import type { DateRangePickerProps, DateRangeValue } from './DateRangePicker.types'

/** The picker props the builtin range validation reads. */
type DateRangeConstraints = Pick<
  DateRangePickerProps,
  'locale' | 'minValue' | 'maxValue' | 'isDateUnavailable'
>

/** What the builtin range validation checks against, and the `t` its messages come from. */
export type DateRangeValidationOptions = {
  constraints: DateRangeConstraints
  t: Translate
}

const formatDateBoundary = (value: DateValue, locale = 'en-US') => {
  const formatter = new DateFormatter(locale, { dateStyle: 'medium' })

  return formatter.format(value.toDate(getLocalTimeZone()))
}

const validateDate = (value: DateValue, { constraints, t }: DateRangeValidationOptions) => {
  const { minValue, maxValue, locale } = constraints
  const errors: string[] = []

  if (minValue && value.compare(minValue) < 0) {
    errors.push(t('validation.min', { value: formatDateBoundary(minValue, locale) }))
  }

  if (maxValue && value.compare(maxValue) > 0) {
    errors.push(t('validation.max', { value: formatDateBoundary(maxValue, locale) }))
  }

  // Outside the calendar there is no in-progress selection, so React Aria passes a `null` anchor.
  const isUnavailable = constraints.isDateUnavailable?.(value, null)
  if (isUnavailable) errors.push(t('validation.unavailable'))

  return errors
}

/**
 * React Aria's builtin range validation (`validateDateRange`): each end against min/max/unavailable,
 * plus a reversed range, with messages from `t`. Returns `undefined` when the range is valid.
 */
export const validateDateRange = (range: DateRangeValue, options: DateRangeValidationOptions) => {
  const { t } = options
  const startErrors = validateDate(range.start, options)
  const endErrors = validateDate(range.end, options)

  // Both ends usually fail the same way (e.g. both before `minValue`); report each message once.
  const errors = [...new Set([...startErrors, ...endErrors])]

  const isReversed = range.end.compare(range.start) < 0
  if (isReversed) errors.push(t('validation.rangeReversed'))

  return errors.length > 0 ? errors : undefined
}
