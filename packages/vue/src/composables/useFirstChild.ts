import type { Ref, ShallowRef } from 'vue'
import { onBeforeUnmount, onMounted, shallowRef, watch } from 'vue'

/**
 * Tracks the first element child of a group root. HeroUI places `ButtonGroup.Separator` /
 * `ToggleButtonGroup.Separator` in every button except the first, so HareUI's buttons render their
 * separator element only when they are not this element (keeps the `[data-slot]` sequence identical).
 */
export const useFirstChild = (root: Ref<Element | { $el?: unknown } | null | undefined>) => {
  // Observed DOM state, not a template ref: no element binds it.
  const firstChild: ShallowRef<Element | null> = shallowRef(null)
  let observer: MutationObserver | undefined

  const resolve = () => refElement(root.value)

  const attach = () => {
    observer?.disconnect()
    const el = resolve()
    if (!el) return

    const update = () => {
      firstChild.value = el.firstElementChild
    }

    update()
    observer = new MutationObserver(update)
    observer.observe(el, { childList: true })
  }

  onMounted(attach)
  watch(resolve, attach, { flush: 'post' })
  onBeforeUnmount(() => observer?.disconnect())

  return firstChild
}

/** Resolves a component/element template ref to its DOM element. `null` during SSR, where `Element` is undefined. */
export const refElement = (value: unknown): Element | null => {
  if (typeof Element === 'undefined') return null
  if (value instanceof Element) return value
  const el = (value as { $el?: unknown } | null | undefined)?.$el

  return el instanceof Element ? el : null
}
