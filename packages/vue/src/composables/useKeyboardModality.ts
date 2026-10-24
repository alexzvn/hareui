import type { InjectionKey, Ref } from 'vue'
import { onBeforeUnmount, onMounted, readonly, ref } from 'vue'

/**
 * RAC's interaction modality, tracked from mount by capture listeners on `document`: `true` after a keyboard
 * interaction (and before any), `false` after a pointer press. Focus or a highlight is focus-visible only in
 * keyboard modality, so opening a list with the mouse shows no focus ring on its options.
 */
export function useKeyboardModality(): Readonly<Ref<boolean>> {
  const keyboard = ref(true)
  const onPointerdown = () => {
    keyboard.value = false
  }
  const onKeydown = () => {
    keyboard.value = true
  }
  onMounted(() => {
    document.addEventListener('pointerdown', onPointerdown, true)
    document.addEventListener('keydown', onKeydown, true)
  })
  onBeforeUnmount(() => {
    document.removeEventListener('pointerdown', onPointerdown, true)
    document.removeEventListener('keydown', onKeydown, true)
  })
  return readonly(keyboard)
}

/**
 * The modality ListBox options read. A component whose list mounts after the press that opens it (Select's popover)
 * provides its own, tracked since before that press; ListBox otherwise provides one for its options.
 */
export const keyboardModalityKey: InjectionKey<Readonly<Ref<boolean>>> = Symbol(
  'hareui-keyboard-modality',
)
