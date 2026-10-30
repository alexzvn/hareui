import { computed, onBeforeUnmount, onMounted, shallowReactive } from 'vue'

// HeroUI's visual-viewport-aware overlay box, so overlays never get clipped by mobile browser
// chrome / the on-screen keyboard. Shared by every Modal/Drawer/AlertDialog: reading the viewport in
// setup forced a layout per instance, so one module-level value is measured on first mount and kept
// current by a single ref-counted set of listeners.
const viewport = shallowReactive({ height: '100dvh', top: '0px' })
let subscribers = 0

const style = computed(() => ({
  '--visual-viewport-height': viewport.height,
  '--visual-viewport-top': viewport.top,
}))

const update = () => {
  viewport.height = `${window.visualViewport?.height ?? window.innerHeight}px`

  // iOS scrolls the visual viewport inside the layout viewport when the keyboard opens; `fixed`
  // boxes stay on the layout viewport, so overlays move down by the scroll to stay in view.
  viewport.top = `${window.visualViewport?.offsetTop ?? 0}px`
}

/** Style binding for an overlay backdrop: `--visual-viewport-height` and `--visual-viewport-top`. */
export const useVisualViewport = () => {
  // Suspense can unmount a pending branch that never mounted; counting that unmount would detach the
  // listeners while other overlays still use them.
  let isMounted = false

  onMounted(() => {
    isMounted = true
    if (subscribers++ > 0) return

    // The viewport may have changed while nothing listened, so re-measure on (re)attach.
    update()
    window.visualViewport?.addEventListener('resize', update)
    window.visualViewport?.addEventListener('scroll', update)
    window.addEventListener('resize', update)
  })

  onBeforeUnmount(() => {
    if (!isMounted || --subscribers > 0) return

    window.visualViewport?.removeEventListener('resize', update)
    window.visualViewport?.removeEventListener('scroll', update)
    window.removeEventListener('resize', update)
  })

  return style
}
