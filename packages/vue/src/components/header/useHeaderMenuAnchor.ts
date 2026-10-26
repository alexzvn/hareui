import type { Ref, ShallowRef } from 'vue'
import { onBeforeUnmount, ref, watch } from 'vue'

export type UseHeaderMenuAnchorOptions = {
  /** Whether the menu is open. Tracking runs only while it is. */
  open: Ref<boolean>
  /** The header root (a `Primitive` component instance). */
  root: Readonly<ShallowRef<{ $el: HTMLElement } | null>>
  /** The bar element the menu's own header row lines up with. */
  bar: Readonly<ShallowRef<HTMLElement | null>>
  /** The portalled anchor element the menu renders inside. */
  anchor: Readonly<ShallowRef<HTMLElement | null>>
}

// Properties that make an element the containing block of its `position: fixed` descendants.
const containingBlockProps = [
  'transform',
  'translate',
  'scale',
  'rotate',
  'perspective',
  'filter',
  'backdropFilter',
] as const

// The bar's hide-on-scroll offset (`translate`), so the region is where the bar rests, not where it is mid-slide.
const getBarOffsetY = (el: HTMLElement) => {
  const y = getComputedStyle(el).translate.split(' ')[1]
  if (!y) return 0

  const value = Number.parseFloat(y)
  if (Number.isNaN(value)) return 0

  return y.endsWith('%') ? (value * el.offsetHeight) / 100 : value
}

const isContainingBlock = (style: CSSStyleDeclaration) => {
  // Unsupported properties read as empty, so only an explicit non-`none` value counts.
  const hasContainingProp = containingBlockProps.some((key) => style[key] && style[key] !== 'none')
  const hasContainment = /layout|paint|strict|content/.test(style.contain ?? '')
  const hasWillChange = /transform|perspective|filter/.test(style.willChange ?? '')

  return hasContainingProp || hasContainment || hasWillChange
}

// The box `position: fixed` layers inside the portal target resolve against: the viewport, or the nearest ancestor that
// becomes their containing block (a transform, filter or layout/paint containment, e.g. an app portalling into a panel).
const getFixedContainingBlock = (from: Element | null | undefined): HTMLElement | null => {
  for (let el = from; el && el !== document.documentElement; el = el.parentElement) {
    if (isContainingBlock(getComputedStyle(el))) return el as HTMLElement
  }

  return null
}

// The region `position: fixed` resolves against: the viewport, clamped to the containing block when there is one.
const getFixedOrigin = (anchor: HTMLElement | null) => {
  const viewportHeight = window.visualViewport?.height ?? window.innerHeight
  const block = getFixedContainingBlock(anchor?.parentElement)
  if (!block) return { top: 0, left: 0, bottom: viewportHeight }

  const rect = block.getBoundingClientRect()
  const top = rect.top + block.clientTop

  return {
    top,
    left: rect.left + block.clientLeft,
    bottom: Math.min(viewportHeight, top + block.clientHeight),
  }
}

/**
 * The menu is anchored to the bar rather than the viewport: its region starts at the bar's top edge and spans the bar's
 * width, so the menu's own header row lands exactly on the bar (same brand and toggle position; the toggle morphs in
 * place). For a full-width sticky header that region is the viewport; inside a containing block (a portal target with
 * `contain: layout` or a transform) it is clamped to that block. The Header portals an anchor carrying the region
 * as CSS variables, and renders the overlay inside it unportalled.
 */
export const useHeaderMenuAnchor = (options: UseHeaderMenuAnchorOptions) => {
  const { open, root, bar, anchor } = options
  const anchorStyle = ref<Record<string, string>>({})

  const updateAnchor = () => {
    const el = root.value?.$el
    if (!el || !bar.value) return

    const box = el.getBoundingClientRect()
    const origin = getFixedOrigin(anchor.value)
    const barTop = bar.value.getBoundingClientRect().top - getBarOffsetY(el)
    const top = Math.max(0, origin.top, barTop)

    anchorStyle.value = {
      '--header-menu-top': `${top - origin.top}px`,
      '--header-menu-left': `${box.left - origin.left}px`,
      '--header-menu-width': `${box.width}px`,
      '--header-menu-height': `${Math.max(0, origin.bottom - top)}px`,
    }
  }

  // The frame id is only kept while its callback is pending (`isScheduled`), so a callback that runs before
  // `requestAnimationFrame` returns cannot leave a stale id behind.
  let frame = 0
  let isScheduled = false

  const scheduleUpdate = () => {
    if (isScheduled) return
    isScheduled = true

    frame = requestAnimationFrame(() => {
      isScheduled = false
      updateAnchor()
    })
  }

  const stopTracking = () => {
    window.removeEventListener('resize', scheduleUpdate)
    window.removeEventListener('scroll', scheduleUpdate, true)
    if (!isScheduled) return

    cancelAnimationFrame(frame)
    isScheduled = false
  }

  const startTracking = () => {
    updateAnchor()
    window.addEventListener('resize', scheduleUpdate, { passive: true })
    window.addEventListener('scroll', scheduleUpdate, { capture: true, passive: true })
  }

  // Measured before the menu renders (`flush: 'sync'`), so its first frame is already in place.
  watch(
    open,
    (isOpen) => {
      stopTracking()
      if (isOpen) startTracking()
    },
    { flush: 'sync' },
  )

  onBeforeUnmount(stopTracking)

  return { anchorStyle }
}
