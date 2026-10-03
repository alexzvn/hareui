import type { DateValue } from '@internationalized/date'
import type { WritableComputedRef } from 'vue'
import { getLocalTimeZone, today } from '@internationalized/date'
import { computed, shallowRef } from 'vue'

/**
 * The month/year a calendar displays. Bound to Reka as a controlled `placeholder`, but backed by
 * local state so the view (and the year picker) still moves when `v-model:placeholder` isn't used.
 * `seed` is the initial view when no placeholder is given (e.g. the first selected date).
 */
export function useCalendarPlaceholder(
  placeholder: () => DateValue | undefined,
  seed: DateValue | undefined,
  onUpdate: (value: DateValue) => void,
): WritableComputedRef<DateValue> {
  const internal = shallowRef<DateValue>(placeholder() ?? seed ?? today(getLocalTimeZone()))
  return computed<DateValue>({
    get: () => placeholder() ?? internal.value,
    set: (value) => {
      internal.value = value
      onUpdate(value)
    },
  })
}
