const SCROLLABLE = /auto|scroll|overlay/

/**
 * The nearest element from `element` up that scrolls vertically and overflows, or `undefined` when only the page
 * itself scrolls.
 */
export const getScrollParent = (element: HTMLElement | null): HTMLElement | undefined => {
  for (let node = element; node; node = node.parentElement) {
    if (node === document.body || node === document.documentElement) return undefined

    const isScrollable = SCROLLABLE.test(getComputedStyle(node).overflowY)
    if (isScrollable && node.scrollHeight > node.clientHeight) return node
  }

  return undefined
}
