import { prefersReducedMotion } from '@/utils/motion'
import { getScrollParent } from '@/utils/scrollParent'

const getScrollBehavior = (): ScrollBehavior => (prefersReducedMotion() ? 'auto' : 'smooth')

/**
 * Brings a heading to the top of its scroll container, honouring its `scroll-margin-top`. Only the closest scrolling
 * ancestor moves, so a table of contents inside a scrolling card doesn't scroll the page too.
 */
export const scrollToHeading = (heading: HTMLElement) => {
  const behavior = getScrollBehavior()
  const container = getScrollParent(heading.parentElement)
  if (!container) {
    heading.scrollIntoView({ behavior, block: 'start' })
    return
  }

  const margin = Number.parseFloat(getComputedStyle(heading).scrollMarginTop) || 0
  const offset = heading.getBoundingClientRect().top - container.getBoundingClientRect().top
  container.scrollTo({ top: container.scrollTop + offset - margin, behavior })
}

/** Scrolls only the container, never the page, to center one of its elements in it. */
export const centerInContainer = ({
  container,
  target,
}: {
  container: HTMLElement
  target: HTMLElement
}) => {
  const containerRect = container.getBoundingClientRect()
  const targetRect = target.getBoundingClientRect()
  const targetOffset = targetRect.top - containerRect.top + container.scrollTop
  const top = targetOffset - container.clientHeight / 2 + targetRect.height / 2

  container.scrollTo({ top, behavior: getScrollBehavior() })
}
