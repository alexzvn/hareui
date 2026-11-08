const SCROLLABLE = /auto|scroll|overlay/

/**
 * The nearest element from `element` up that scrolls and overflows along `axis`, or `undefined` when only the page
 * itself scrolls.
 */
export const getScrollParent = (
  element: HTMLElement | null,
  axis: 'x' | 'y' = 'y',
): HTMLElement | undefined => {
  for (let node = element; node; node = node.parentElement) {
    if (node === document.body || node === document.documentElement) return undefined

    const style = getComputedStyle(node)
    const isScrollable = SCROLLABLE.test(axis === 'y' ? style.overflowY : style.overflowX)

    const isOverflowing =
      axis === 'y' ? node.scrollHeight > node.clientHeight : node.scrollWidth > node.clientWidth

    if (isScrollable && isOverflowing) return node
  }

  return undefined
}
