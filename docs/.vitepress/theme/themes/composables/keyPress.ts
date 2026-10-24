// Port of HeroUI docs `hooks/use-key-press.tsx`: window shortcut, ignored while typing in a field.
// Modifiers must match exactly; `ctrl` also matches ⌘.
import type { MaybeRefOrGetter } from 'vue'
import { onBeforeUnmount, onMounted, toValue } from 'vue'

export interface UseKeyPressOptions {
  alt?: boolean
  ctrl?: boolean
  shift?: boolean
  enabled?: MaybeRefOrGetter<boolean>
}

export function useKeyPress(
  key: string,
  callback: (event: KeyboardEvent) => void,
  options: UseKeyPressOptions = {},
) {
  const { alt = false, ctrl = false, enabled = true, shift = false } = options

  const onKeyDown = (event: KeyboardEvent) => {
    if (!toValue(enabled)) return
    const target = event.target as HTMLElement
    if (
      target.tagName === 'INPUT' ||
      target.tagName === 'TEXTAREA' ||
      target.tagName === 'SELECT' ||
      target.isContentEditable
    )
      return
    const modifiersMatch =
      (event.ctrlKey || event.metaKey) === ctrl && event.shiftKey === shift && event.altKey === alt
    if (event.key.toLowerCase() !== key.toLowerCase() || !modifiersMatch) return
    if (ctrl || shift || alt) event.preventDefault()
    callback(event)
  }

  onMounted(() => window.addEventListener('keydown', onKeyDown))
  onBeforeUnmount(() => window.removeEventListener('keydown', onKeyDown))
}
