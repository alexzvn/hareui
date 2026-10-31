// Internal: consumer focus / change events of the form controls whose root isn't their focusable element.
import type { WritableComputedRef } from 'vue'
import { computed } from 'vue'

// `@focus` / `@blur` with any modifier (`onFocusOnce`, `onBlurCapture`), matched case-insensitively like the
// field attributes in `splitInputAttrs`
const FOCUS_LISTENER = /^on(?:focus|blur)(?:once|passive|capture)*$/i

/**
 * Splits a control's fallthrough attributes into its `@focus` / `@blur` listeners and the rest. `focus` and `blur`
 * don't bubble, so the listeners go on the focusable element (input or trigger) while the rest stays on the wrapper.
 */
export const splitFocusListeners = (attrs: Record<string, unknown>) => {
  const focus: Record<string, unknown> = {}
  const rest: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(attrs)) {
    if (FOCUS_LISTENER.test(key)) {
      focus[key] = value
      continue
    }

    rest[key] = value
  }

  return { focus, rest }
}

/** The payload of a control's `change` event: a plain `change` Event, dispatched on no element. */
export const createChangeEvent = () => new Event('change')

const isEmpty = (value: unknown) => value == null || (Array.isArray(value) && value.length === 0)

const isSameValue = (a: unknown, b: unknown) => {
  if (isEmpty(a) && isEmpty(b)) return true
  if (!Array.isArray(a) || !Array.isArray(b)) return Object.is(a, b)

  return a.length === b.length && a.every((item, index) => Object.is(item, b[index]))
}

/**
 * A writable view of a selection that calls `onChange` after each write that changes it (arrays compared item by
 * item, `null` and `[]` both empty). Writes made on `source` itself, such as a form reset, emit nothing.
 */
export const withChangeEvent = <T>(
  source: WritableComputedRef<T, T | undefined>,
  onChange: (event: Event) => void,
) => {
  return computed<T, T | undefined>({
    get: () => source.value,
    set: (value) => {
      const previous = source.value
      source.value = value
      if (!isSameValue(previous, value)) onChange(createChangeEvent())
    },
  })
}
