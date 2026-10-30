import type { MaybeRefOrGetter } from 'vue'
import { onBeforeUnmount, toValue, watch } from 'vue'

type TocPanelOptions = {
  trigger: 'hover' | 'press'
  delay: number
  closeDelay: number
}

type UseTocPanelOptions = {
  isOpen: () => boolean
  setOpen: (value: boolean) => void
  options: MaybeRefOrGetter<TocPanelOptions>
}

/**
 * Opening logic of the floating panel. With `trigger: 'hover'`, resting a mouse or pen on the marks opens the panel
 * after `delay`, and leaving both the marks and the panel closes it after `closeDelay`. A click toggles it, or pins
 * a hover-opened panel so it stays open until dismissed. Touch input only clicks.
 */
export const useTocPanel = ({ isOpen, setOpen, options }: UseTocPanelOptions) => {
  let openTimer: ReturnType<typeof setTimeout> | undefined
  let closeTimer: ReturnType<typeof setTimeout> | undefined

  // Opened by a click (or pinned by one): hover no longer closes it, and focus moves into it.
  let isPinned = false

  const clearTimers = () => {
    clearTimeout(openTimer)
    clearTimeout(closeTimer)
  }

  const isHoverInput = (event: PointerEvent) => {
    return toValue(options).trigger === 'hover' && event.pointerType !== 'touch'
  }

  const onPointerEnter = (event: PointerEvent) => {
    if (!isHoverInput(event)) return

    clearTimeout(closeTimer)
    if (isOpen()) return

    openTimer = setTimeout(() => setOpen(true), toValue(options).delay)
  }

  const onPointerLeave = (event: PointerEvent) => {
    if (!isHoverInput(event)) return

    clearTimeout(openTimer)
    if (!isOpen() || isPinned) return

    closeTimer = setTimeout(() => setOpen(false), toValue(options).closeDelay)
  }

  const onTriggerClick = () => {
    clearTimers()

    const isHoverOpen = isOpen() && !isPinned
    if (isHoverOpen && toValue(options).trigger === 'hover') {
      isPinned = true
      return
    }

    isPinned = !isOpen()
    setOpen(!isOpen())
  }

  watch(isOpen, (value) => {
    if (value) return

    isPinned = false
    clearTimers()
  })

  onBeforeUnmount(clearTimers)

  return {
    onPointerEnter,
    onPointerLeave,
    onTriggerClick,
    isPinned: () => isPinned,
  }
}
