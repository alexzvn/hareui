import type { Ref } from 'vue'
import { onBeforeUnmount, ref, watch } from 'vue'

/**
 * The hamburger -> X morph starts two frames after opening: the menu's own toggle is mounted closed, and needs one
 * rendered frame in that state for its transition to run in step with the bar's toggle underneath.
 */
export const useHeaderToggleIcon = (open: Ref<boolean>) => {
  const isIconOpen = ref(open.value)
  let frame = 0

  const openIconAfterTwoFrames = () => {
    frame = requestAnimationFrame(() => {
      frame = requestAnimationFrame(() => {
        isIconOpen.value = true
      })
    })
  }

  watch(open, (isOpen) => {
    cancelAnimationFrame(frame)

    if (!isOpen) {
      isIconOpen.value = false
      return
    }

    openIconAfterTwoFrames()
  })

  onBeforeUnmount(() => cancelAnimationFrame(frame))

  return { isIconOpen }
}
