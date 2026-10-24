// Internal: where ListBox's own navigation keys move focus, over the enabled option elements in DOM order.

type PageTargetOptions = {
  options: HTMLElement[]
  /** The focused option the page is measured from. */
  from: HTMLElement | undefined
  list: HTMLElement
  /** PageDown when `true`, PageUp otherwise. */
  isDown: boolean
}

type RangeTargetContext = {
  options: HTMLElement[]
  focused: HTMLElement | undefined
  /** Position of `focused` in `options`, `-1` when there is none. */
  index: number
}

const isScrollable = (el: HTMLElement) => {
  const overflow = getComputedStyle(el).overflowY
  const isOverflowing = el.scrollHeight > el.clientHeight

  return isOverflowing && (overflow === 'auto' || overflow === 'scroll')
}

/** The nearest scrolling element from `el` up, below `document.body`. */
const getScrollParent = (el: HTMLElement | null): HTMLElement | undefined => {
  for (let node = el; node && node !== document.body; node = node.parentElement) {
    if (isScrollable(node)) return node
  }

  return undefined
}

/**
 * RAC `getKeyPageBelow/Above`: the last option within one page (the scroll container's height) of `from`.
 * An unscrollable list pages to its ends.
 */
export const getPageTarget = ({ options, from, list, isDown }: PageTargetOptions) => {
  const scroller = getScrollParent(list)
  if (!scroller || !from) return isDown ? options.at(-1) : options[0]

  const page = scroller.clientHeight - from.offsetHeight
  const top = from.getBoundingClientRect().top
  const offset = (el: HTMLElement) => el.getBoundingClientRect().top - top

  if (isDown) return options.filter((el) => offset(el) >= 0 && offset(el) <= page).at(-1)

  return options.find((el) => offset(el) <= 0 && -offset(el) <= page)
}

// Shift+key moves of a multiple selection, which extend the range to the target
const rangeTargets = {
  ArrowDown: ({ options, focused, index }) => options[index + 1] ?? focused,
  ArrowUp: ({ options, focused, index }) =>
    index === -1 ? options.at(-1) : (options[index - 1] ?? focused),
  Home: ({ options }) => options[0],
  End: ({ options }) => options.at(-1),
} as const satisfies Record<string, (context: RangeTargetContext) => HTMLElement | undefined>

type RangeKey = keyof typeof rangeTargets

const isRangeKey = (key: string): key is RangeKey => Object.hasOwn(rangeTargets, key)

/** The option a Shift+`key` range move goes to; `undefined` for any other key. */
export const getRangeTarget = (
  key: string,
  { options, focused }: Pick<RangeTargetContext, 'options' | 'focused'>,
) => {
  if (!isRangeKey(key)) return undefined

  const index = focused ? options.indexOf(focused) : -1

  return rangeTargets[key]({ options, focused, index })
}
