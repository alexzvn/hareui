import { onBeforeUnmount, onMounted } from 'vue'

const NATIVE_FOCUSABLE =
  'a[href], area[href], button, input, select, textarea, iframe, summary, audio[controls], video[controls], [contenteditable]:not([contenteditable="false"])'

const isVisible = (el: HTMLElement, container: HTMLElement) => {
  for (
    let node: HTMLElement | null = el;
    node && node !== container.parentElement;
    node = node.parentElement
  ) {
    if (node.hidden || node.hasAttribute('inert')) return false
    const style = getComputedStyle(node)
    if (style.display === 'none' || style.visibility === 'hidden') return false
  }

  return true
}

/**
 * Elements a Tab press may land on, in DOM order. Only elements that are tabbable by markup count: a native control
 * or an explicit `tabindex >= 0`. Chrome's keyboard-focusable scrollers (an overflowing `modal-body` / `drawer-body`)
 * are left out, as in React Aria's FocusScope tree walker.
 */
export const getTabbables = (container: HTMLElement): HTMLElement[] => {
  return [...container.querySelectorAll<HTMLElement>(`${NATIVE_FOCUSABLE}, [tabindex]`)].filter(
    (el) => {
      if (el.tabIndex < 0 || (el as HTMLButtonElement).disabled) return false
      if (el instanceof HTMLInputElement && el.type === 'hidden') return false
      if (!el.hasAttribute('tabindex') && !el.matches(NATIVE_FOCUSABLE)) return false

      return isVisible(el, container)
    },
  )
}

type TabMove = { active: HTMLElement; container: HTMLElement; isBackward: boolean }

// Focus is on something that isn't tabbable (e.g. a clicked scroller): continue from its position in the DOM.
const getTabbableFromPosition = (
  tabbables: HTMLElement[],
  { active, isBackward }: Omit<TabMove, 'container'>,
): HTMLElement | undefined => {
  const after = tabbables.findIndex(
    (el) => active.compareDocumentPosition(el) & Node.DOCUMENT_POSITION_FOLLOWING,
  )

  if (!isBackward) return tabbables[after === -1 ? 0 : after]

  return tabbables[(after === -1 ? tabbables.length : after) - 1] ?? tabbables[tabbables.length - 1]
}

const getNextTabbable = (
  tabbables: HTMLElement[],
  { active, container, isBackward }: TabMove,
): HTMLElement | undefined => {
  if (active === container) return isBackward ? tabbables[tabbables.length - 1] : tabbables[0]

  const index = tabbables.indexOf(active)
  if (index === -1) return getTabbableFromPosition(tabbables, { active, isBackward })

  return tabbables[(index + (isBackward ? -1 : 1) + tabbables.length) % tabbables.length]
}

/**
 * React Aria's FocusScope moves focus itself on every Tab inside a dialog; Reka's FocusScope only wraps at the first
 * and last tabbable and leaves the other Tabs to the browser, which also stops on scrollable containers. This handles
 * those middle Tabs. It listens on the document in the bubble phase, so Reka's edge wrap (and any child that handles
 * Tab itself and prevents the default) runs first and is left alone.
 */
export const useTabbableFocusLoop = (getContainer: () => HTMLElement | null | undefined) => {
  const onKeydown = (event: KeyboardEvent) => {
    if (
      event.key !== 'Tab' ||
      event.altKey ||
      event.ctrlKey ||
      event.metaKey ||
      event.defaultPrevented
    )
      return

    const container = getContainer()
    const active = document.activeElement as HTMLElement | null
    if (!container || !active || !container.contains(active)) return
    const tabbables = getTabbables(container)
    if (!tabbables.length) return
    const next = getNextTabbable(tabbables, { active, container, isBackward: event.shiftKey })

    if (!next || next === active) return
    event.preventDefault()
    next.focus()
  }

  onMounted(() => document.addEventListener('keydown', onKeydown))
  onBeforeUnmount(() => document.removeEventListener('keydown', onKeydown))
}
