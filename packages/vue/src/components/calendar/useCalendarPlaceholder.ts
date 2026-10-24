import type { DateValue } from '@internationalized/date'
import { getLocalTimeZone, today } from '@internationalized/date'
import type { WritableComputedRef } from 'vue'
import { computed, shallowRef } from 'vue'

export type UseCalendarPlaceholderOptions = {
  /** The controlled `v-model:placeholder`, `undefined` when not bound. */
  placeholder: () => DateValue | undefined
  /** The initial view when no placeholder is given (e.g. the first selected date). */
  seed: DateValue | undefined
  onUpdate: (value: DateValue) => void
}

/**
 * The month/year a calendar displays. Bound to Reka as a controlled `placeholder`, but backed by
 * local state so the view (and the year picker) still moves when `v-model:placeholder` isn't used.
 */
export const useCalendarPlaceholder = (
  options: UseCalendarPlaceholderOptions,
): WritableComputedRef<DateValue> => {
  const { placeholder, seed, onUpdate } = options
  const internal = shallowRef<DateValue>(placeholder() ?? seed ?? today(getLocalTimeZone()))

  return computed<DateValue>({
    get: () => placeholder() ?? internal.value,
    set: (value) => {
      internal.value = value
      onUpdate(value)
    },
  })
}
