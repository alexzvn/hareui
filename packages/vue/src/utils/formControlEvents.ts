// Internal: consumer focus / change events of the form controls whose root isn't their focusable element.
import type { WritableComputedRef } from 'vue'
import { computed } from 'vue'

// `@focus` / `@blur` with any modifier (`onFocusOnce`, `onBlurCapture`), matched case-insensitively like the other
// field attributes `splitInputAttrs` forwards to the input
const FOCUS_LISTENER = /^on(?:focus|blur)(?:once|passive|capture)*$/i

/** Whether a fallthrough attribute key is an `@focus` / `@blur` listener, with or without modifiers. */
export const isFocusListener = (key: string) => FOCUS_LISTENER.test(key)

/**
 * Splits a control's fallthrough attributes into its `@focus` / `@blur` listeners and the rest. `focus` and `blur`
 * don't bubble, so the listeners go on the focusable element (input or trigger) while the rest stays on the wrapper.
 */
export const splitFocusListeners = (attrs: Record<string, unknown>) => {
  const focus: Record<string, unknown> = {}
  const rest: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(attrs)) {
    if (isFocusListener(key)) {
      focus[key] = value
      continue
    }

    rest[key] = value
  }

  return { focus, rest }
}

/** The payload of a control's `change` event: a plain `change` Event, dispatched on no element. */
export const createChangeEvent = () => new Event('change')

const isEmptySelection = (value: unknown) => {
  return value == null || (Array.isArray(value) && value.length === 0)
}

const isSameValue = (a: unknown, b: unknown) => {
  if (isEmptySelection(a) && isEmptySelection(b)) return true
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
