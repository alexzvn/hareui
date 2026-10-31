// Internal: field-level `focus` / `blur` for a control whose focus moves between its wrapper and a portaled popover.
import { onScopeDispose } from 'vue'

type FieldFocusOptions = {
  /** Focus entered the field from outside it. */
  onFocus: (event: FocusEvent) => void
  /** Focus left the field. */
  onBlur: (event: FocusEvent) => void
}

/**
 * Tracks focus across every part of a field: bind the returned `onFocusin` / `onFocusout` on the field's root and on
 * its popover content. Focus moving between parts (trigger → list, list → trigger on close) emits nothing. A
 * `focusout` settles a task later, so the `focusin` of the part that takes focus next (or the popover handing focus
 * back to the trigger as it unmounts) cancels it.
 */
export const useFieldFocus = ({ onFocus, onBlur }: FieldFocusOptions) => {
  let isFocused = false
  let pendingBlur: ReturnType<typeof setTimeout> | undefined

  const cancelBlur = () => {
    clearTimeout(pendingBlur)
    pendingBlur = undefined
  }

  const onFocusin = (event: FocusEvent) => {
    cancelBlur()
    if (isFocused) return

    isFocused = true
    onFocus(event)
  }

  const onFocusout = (event: FocusEvent) => {
    if (!isFocused) return

    cancelBlur()

    pendingBlur = setTimeout(() => {
      pendingBlur = undefined
      isFocused = false
      onBlur(event)
    })
  }

  onScopeDispose(cancelBlur)

  return { onFocusin, onFocusout }
}
