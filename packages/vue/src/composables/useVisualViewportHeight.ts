import { onBeforeUnmount, onMounted, ref } from 'vue'

// HeroUI's visual-viewport-aware overlay height, so overlays never get clipped by mobile browser
// chrome / the on-screen keyboard. Shared by every Modal/Drawer/AlertDialog: reading the viewport in
// setup forced a layout per instance, so one module-level value is measured on first mount and kept
// current by a single ref-counted listener pair.
const height = ref('100dvh')
let subscribers = 0

const update = () => {
  height.value = `${window.visualViewport?.height ?? window.innerHeight}px`
}

export const useVisualViewportHeight = () => {
  onMounted(() => {
    if (subscribers++ === 0) {
      // The viewport may have changed while nothing listened, so re-measure on (re)attach.
      update()
      window.visualViewport?.addEventListener('resize', update)
      window.addEventListener('resize', update)
    }
  })
  onBeforeUnmount(() => {
    if (--subscribers === 0) {
      window.visualViewport?.removeEventListener('resize', update)
      window.removeEventListener('resize', update)
    }
  })
  return height
}
