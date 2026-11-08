import type {
  SheetAxis,
  SheetGeometryInput,
  SheetPlacement,
  SheetSnapPoint,
  SheetStackEntry,
  SheetSwipeConfig,
  SheetViewportMetrics,
} from './Sheet.types'

// Inline styles of React Aria's scroll-snap sheet (react-aria-components 1.22 `Sheet`), which HeroUI's Sheet is built
// on: an oversized scroll container holds a viewport-sized stage one viewport into its content, with snap markers at
// both ends. Scrolling the container moves the sheet in and out of view, so swiping is native scrolling. Styles are
// strings because csstype doesn't type every scroll-driven animation property.

/** Keyframes driven by the sheet's scroll position (styles/keyframes.css). */
const BACKDROP_ANIMATION = 'heroui-sheet-backdrop'
const STACK_ANIMATION = 'heroui-sheet-scale-back'

const hasViewTimeline = typeof CSS !== 'undefined' && CSS.supports('animation-timeline: view()')

/** `[x, y]` flex alignment of the sheet inside its stage. */
const ALIGNMENT: Record<SheetPlacement, [string, string]> = {
  top: ['center', 'flex-start'],
  bottom: ['center', 'flex-end'],
  left: ['flex-start', 'center'],
  right: ['flex-end', 'center'],
}

/** Serialises declarations into an inline `style` string, skipping `undefined` values. */
const toStyle = (declarations: Record<string, string | undefined>) =>
  Object.entries(declarations)
    .flatMap(([property, value]) => (value === undefined ? [] : [`${property}: ${value}`]))
    .join('; ')

const viewportLength = (axis: SheetAxis) => (axis === 'y' ? '100dvh' : '100dvw')

/** Overscroll padding on the sheet's edge: one viewport, so overscrolling never shows a gap. */
const overscrollInset = (axis: SheetAxis) => (axis === 'y' ? '100vh' : '100vw')

const toLength = (point: SheetSnapPoint) => (typeof point === 'number' ? `${point}px` : point)

/** The fully expanded sheet is always the last position, so a trailing full-size value is dropped. */
export const normalizeSnapPoints = (points: readonly SheetSnapPoint[] | undefined) => {
  if (!points?.length) return []
  const last = points.at(-1)

  return last === 1 || last === '1' || last === '100%' ? points.slice(0, -1) : [...points]
}

export const getSwipeConfig = (placement: SheetPlacement): SheetSwipeConfig => {
  const isAfter = placement === 'bottom' || placement === 'right'

  return {
    axis: placement === 'top' || placement === 'bottom' ? 'y' : 'x',
    after: isAfter,
    enteredScroll: isAfter ? 1 : 0,
    containerOffset: isAfter ? 0 : -100,
    viewRange: isAfter ? 'entry' : 'exit',
    viewDirection: isAfter ? 'normal' : 'reverse',
  }
}

/** The scroll container, its end snap markers and the stage the sheet is laid out in. */
export const sheetGeometry = (input: SheetGeometryInput) => {
  const { config, clamped, travel } = input
  const { axis, after } = config
  const isVertical = axis === 'y'
  const viewport = viewportLength(axis)
  const [alignX, alignY] = ALIGNMENT[input.placement]
  const stageStart = clamped && after ? travel : `calc(${viewport} + ${input.padding})`
  const endMarker =
    clamped && !after ? `calc(${travel} + ${viewport})` : `calc(${stageStart} + ${viewport})`

  const snapMarker = (point: string, align: string) =>
    toStyle({
      position: 'absolute',
      top: isVertical ? point : '0',
      left: isVertical ? '0' : point,
      width: isVertical ? '1px' : '100dvw',
      height: isVertical ? '100dvh' : '1px',
      'scroll-snap-align': align,
    })

  return {
    scroller: toStyle({
      position: 'absolute',
      top: isVertical
        ? `calc(${input.scrollY}px + ${config.containerOffset}dvh)`
        : `${input.scrollY}px`,
      left: isVertical
        ? `${input.scrollX}px`
        : `calc(${input.scrollX}px + ${config.containerOffset}dvw)`,
      width: isVertical ? '100dvw' : '200dvw',
      height: isVertical ? '200dvh' : '100dvh',
      'overflow-x': isVertical ? 'hidden' : 'auto',
      'overflow-y': isVertical ? 'auto' : 'hidden',
      'scroll-snap-type': input.snapDisabled ? 'none' : `${axis} mandatory`,
      'overscroll-behavior-x': isVertical ? 'none' : 'contain',
      'overscroll-behavior-y': isVertical ? 'contain' : 'none',
      'scrollbar-width': 'none',
      direction: 'ltr',
    }),
    // Closed position of bottom/right sheets; a clamped sheet can't rest there.
    startSnap: snapMarker('0', clamped && after ? 'none' : 'start'),
    stage: toStyle({
      position: 'absolute',
      top: isVertical ? stageStart : '0',
      left: isVertical ? '0' : stageStart,
      width: '100dvw',
      height: '100dvh',
      display: 'flex',
      'flex-direction': isVertical ? 'column' : 'row',
      'align-items': isVertical ? alignX : alignY,
      'justify-content': isVertical ? alignY : alignX,
    }),
    // Closed position of top/left sheets.
    endSnap: snapMarker(endMarker, clamped && !after ? 'none' : 'end'),
  }
}

/** Fills the visible part of the sheet (without its overscroll padding); holds the snap point markers. */
export const detentLayerStyle = (placement: SheetPlacement, hasOverscroll: boolean) =>
  toStyle({
    position: 'absolute',
    inset: '0',
    [placement]: hasOverscroll ? overscrollInset(getSwipeConfig(placement).axis) : '0',
    'pointer-events': 'none',
  })

/** Position and scroll margin of a snap point marker, on the edge the sheet enters from. */
const detentEdge = (config: SheetSwipeConfig, offset: string): Record<string, string> => {
  const viewport = viewportLength(config.axis)
  if (config.axis === 'y') {
    return config.after
      ? { top: offset, left: '0', 'scroll-margin-top': viewport }
      : { bottom: offset, left: '0', 'scroll-margin-bottom': viewport }
  }

  return config.after
    ? { top: '0', left: offset, 'scroll-margin-left': viewport }
    : { top: '0', right: offset, 'scroll-margin-right': viewport }
}

/** A snap point marker: its scroll margin of one viewport snaps it to the viewport edge the sheet enters from. */
export const detentStyle = (config: SheetSwipeConfig, point: SheetSnapPoint) =>
  toStyle({
    position: 'absolute',
    width: '1px',
    height: '1px',
    'scroll-snap-align': config.after ? 'start' : 'end',
    ...detentEdge(config, toLength(point)),
  })

/** `animation-range` of animations following the sheet, starting once `start` of it is visible (else at 0%). */
export const swipeRange = (config: SheetSwipeConfig, start: SheetSnapPoint | undefined) => {
  const from = start === undefined ? '0%' : toLength(start)
  const [rangeStart, rangeEnd] = config.after
    ? [from, '100%']
    : ['calc(100% - 100%)', `calc(100% - ${from})`]

  return `${config.viewRange} ${rangeStart} ${config.viewRange} ${rangeEnd}`
}

export const overlayStyle = (metrics: SheetViewportMetrics, open: boolean) =>
  toStyle({
    position: 'absolute',
    top: '0',
    left: '0',
    width: 'max(var(--page-width), 100vw)',
    height: 'max(var(--page-height), 100dvh)',
    overflow: 'clip',
    '--visual-viewport-width': `${metrics.width}px`,
    '--visual-viewport-height': `${metrics.height}px`,
    '--page-width': `${metrics.pageWidth}px`,
    '--page-height': `${metrics.pageHeight}px`,
    // The modal dialog turns off pointer events on the page; the overlay takes swipes and outside presses.
    'pointer-events': open ? 'auto' : undefined,
  })

/**
 * The backdrop fades with the sheet's view timeline. Without scroll-driven animations (Firefox), it fades over 300ms
 * while the sheet enters or leaves.
 */
export const backdropStyle = (input: {
  config: SheetSwipeConfig
  range: string
  index: number
  entering: boolean
  exiting: boolean
}) => {
  const animation = {
    'animation-name': BACKDROP_ANIMATION,
    'animation-iteration-count': '1',
    'animation-fill-mode': 'both',
    'animation-timing-function': 'linear',
    'animation-composition': 'replace',
  }

  if (hasViewTimeline) {
    return toStyle({
      position: 'absolute',
      inset: '0',
      ...animation,
      'animation-timeline': `--sheet-timeline-${input.index}`,
      'animation-direction': input.config.viewDirection,
      'animation-range': input.range,
    })
  }

  if (input.entering || input.exiting) {
    return toStyle({
      position: 'absolute',
      inset: '0',
      ...animation,
      'animation-direction': input.exiting ? 'reverse' : 'normal',
      'animation-duration': '300ms',
    })
  }

  return toStyle({ position: 'absolute', inset: '0' })
}

/**
 * The sheet element: overscroll padding on its edge (so overscrolling never shows a gap) and one scale-back animation
 * per sheet stacked above it, each bound to that sheet's timeline.
 */
export const sheetStyle = (input: {
  placement: SheetPlacement
  config: SheetSwipeConfig
  direction: string
  hasOverscroll: boolean
  index: number
  descendants: readonly SheetStackEntry[]
}) => {
  const declarations: Record<string, string> = { position: 'relative', direction: input.direction }

  if (input.hasOverscroll) {
    const inset = overscrollInset(input.config.axis)
    declarations[`padding-${input.placement}`] = inset
    declarations[`margin-${input.placement}`] = `-${inset}`
  }

  const { descendants } = input
  if (!descendants.length || !hasViewTimeline) return toStyle(declarations)

  const list = (value: (entry: SheetStackEntry, position: number) => string) =>
    descendants.map(value).join(', ')

  return toStyle({
    ...declarations,
    'animation-name': list(() => STACK_ANIMATION),
    'animation-timeline': list((_, position) => `--sheet-timeline-${input.index + 1 + position}`),
    'animation-direction': list((entry) => entry.direction),
    'animation-iteration-count': list(() => '1'),
    'animation-fill-mode': list(() => 'both'),
    'animation-range': list((entry) => entry.range),
    'animation-composition': list(() => 'accumulate'),
    'animation-timing-function': list(() => 'linear'),
  })
}

/** The dialog fills the sheet and names the view timeline the backdrop and the sheets below follow. */
export const dialogStyle = (config: SheetSwipeConfig, index: number) => {
  const viewport = viewportLength(config.axis)

  return toStyle({
    width: '100%',
    height: '100%',
    'view-timeline-name': `--sheet-timeline-${index}`,
    'view-timeline-axis': config.axis,
    'view-timeline-inset': config.after ? `0 ${viewport}` : `${viewport} 0`,
  })
}
