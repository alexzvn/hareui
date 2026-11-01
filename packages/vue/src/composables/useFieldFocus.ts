// Internal: field-level `focus` / `blur` for a control whose focus moves between its parts (wrapper, popover).
import { onScopeDispose } from 'vue'

type FieldFocusOptions = {
  /** Focus entered the field from outside it, with the part's native `focus` event. */
  onFocus: (event: FocusEvent) => void
  /** Focus left the field, with the last part's native `blur` event. */
  onBlur: (event: FocusEvent) => void
}

/**
 * Tracks focus across every part of a field: bind the returned handlers as capture listeners
 * (`@focus.capture` / `@blur.capture`) on the field's root and on its popover content. `focus` and `blur` don't
 * bubble but do capture, so the payloads are the parts' own `FocusEvent`s (`type` 'focus' / 'blur', with `target`
 * and `relatedTarget`), as on a native control. Focus moving between parts (trigger → list, list → trigger on
 * close) emits nothing: a `blur` settles a task later, so the `focus` of the part that takes focus next (or the
 * popover handing focus back to the trigger as it unmounts) cancels it.
 */
export const useFieldFocus = ({ onFocus, onBlur }: FieldFocusOptions) => {
  let isFocused = false
  let pendingBlur: ReturnType<typeof setTimeout> | undefined

  const cancelBlur = () => {
    clearTimeout(pendingBlur)
    pendingBlur = undefined
  }

  const onFocusCapture = (event: FocusEvent) => {
    cancelBlur()
    if (isFocused) return

    isFocused = true
    onFocus(event)
  }

  const onBlurCapture = (event: FocusEvent) => {
    if (!isFocused) return

    cancelBlur()

    pendingBlur = setTimeout(() => {
      pendingBlur = undefined
      isFocused = false
      onBlur(event)
    })
  }

  onScopeDispose(cancelBlur)

  return { onFocusCapture, onBlurCapture }
}
