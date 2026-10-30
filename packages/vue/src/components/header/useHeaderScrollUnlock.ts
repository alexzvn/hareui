import type { Ref } from 'vue'
import { onBeforeUnmount, watch } from 'vue'

export type UseHeaderScrollUnlockOptions = {
  /** Whether the menu is open. */
  open: Ref<boolean>
  /** The `shouldBlockScroll` prop. */
  shouldBlockScroll: () => boolean
}

type BodyStyles = Pick<CSSStyleDeclaration, 'overflow' | 'paddingRight' | 'marginRight'>

const bodyStyleKeys = ['overflow', 'paddingRight', 'marginRight'] as const

/**
 * Reka locks page scroll on every modal overlay. With `shouldBlockScroll: false` the body styles it applies are put
 * back as they land (it sets them a tick after the overlay mounts, hence the observer rather than a one-off reset).
 */
export const useHeaderScrollUnlock = (options: UseHeaderScrollUnlockOptions) => {
  const { open, shouldBlockScroll } = options

  let bodyStyles: BodyStyles | null = null
  let observer: MutationObserver | null = null

  const restoreBodyStyles = () => {
    if (!bodyStyles) return

    // Only write on a difference: writing an identical value still queues a mutation record, which would loop the observer.
    const { style } = document.body
    for (const key of bodyStyleKeys) {
      if (style[key] !== bodyStyles[key]) style[key] = bodyStyles[key]
    }
  }

  const stopRestoring = () => {
    observer?.disconnect()
    observer = null
  }

  const startRestoring = () => {
    observer = new MutationObserver(restoreBodyStyles)
    observer.observe(document.body, { attributes: true, attributeFilter: ['style'] })
    restoreBodyStyles()
  }

  // Snapshot the body styles before the overlay mounts and Reka locks scroll.
  watch(
    open,
    (isOpen) => {
      if (!isOpen) return

      const { overflow, paddingRight, marginRight } = document.body.style
      bodyStyles = { overflow, paddingRight, marginRight }
    },
    { flush: 'sync' },
  )

  watch([open, shouldBlockScroll], ([isOpen, isBlocking]) => {
    stopRestoring()
    if (isOpen && !isBlocking) startRestoring()
  })

  onBeforeUnmount(stopRestoring)
}
