import type { Ref, ShallowRef, VNode } from 'vue'

import type { PortalTarget } from '@/config'
import type { CloseButtonProp } from '@/types/closeButton'
import type { DialogEmits } from '@/types/dialog'
import type { ComponentSlots, ComponentVariants } from '@/types/tv'
import type { ClassValue } from '@/utils/tv'

import type theme from './theme'

type Sheet = typeof theme

/** How much of the sheet a snap point reveals: pixels as a number, or any CSS length (`'40%'` of the sheet, `'20rem'`). */
export type SheetSnapPoint = number | string

/**
 * Props for `Sheet`, a modal panel that slides in from an edge and follows the finger with native scrolling: it can
 * rest at snap points, be swiped away and stack on top of other sheets.
 */
export type SheetProps = {
  /** The controlled open state of the sheet. Use with `v-model:open`. */
  open?: boolean
  /** The open state of the sheet when it is initially rendered. Use when you do not need to control its open state. */
  defaultOpen?: boolean
  /** Title rendered in the header, and the dialog's accessible name. */
  title?: string
  /**
   * Edge of the screen the sheet slides in from, and the direction it is swiped away to.
   * @defaultValue 'bottom'
   */
  placement?: ComponentVariants<Sheet>['placement']
  /**
   * Visual style of the backdrop. Only the bottom-most sheet of a stack dims the page.
   * @defaultValue 'opaque'
   */
  variant?: ComponentVariants<Sheet>['variant']
  /**
   * Floats the sheet with a margin and rounds all of its corners.
   * @defaultValue false
   */
  detached?: boolean
  /**
   * Positions the sheet rests at, as the visible amount of the sheet: pixels as numbers, or CSS lengths (percentages
   * of the sheet). The sheet opens at the first one unless `snapPoint` says otherwise. Fully expanded is always the
   * last position, so it isn't listed (a trailing `1`, `'1'` or `'100%'` is ignored). The backdrop fades in past the
   * last snap point.
   */
  // oxlint-disable-next-line hareui/prop-group -- `snapPoint` is a v-model (`v-model:snap-point`), which a `snap: { points, point }` group cannot carry
  snapPoints?: SheetSnapPoint[]
  /**
   * The snap point the sheet rests at, as an index into `snapPoints`; `snapPoints.length` is fully expanded. Use with
   * `v-model:snap-point`. The sheet opens at this snap point, and setting it while open scrolls the sheet there.
   * @defaultValue 0
   */
  snapPoint?: number
  /**
   * Whether pressing the backdrop or swiping the sheet away closes it.
   * @defaultValue true
   */
  dismissible?: boolean
  /**
   * Whether pressing Escape closes the sheet.
   * @defaultValue true
   */
  keyboardDismissible?: boolean
  /**
   * Whether the drag handle bar is rendered (at the top, or at the bottom for `placement="top"`).
   * @defaultValue `true` for `top` and `bottom`, `false` for `left` and `right`
   */
  handle?: boolean
  /**
   * Whether the default close button is rendered; an object customises its `icon` and `label` (accessible name).
   * @defaultValue false
   */
  closeButton?: CloseButtonProp
  /**
   * Renders the sheet in a portal. `true` portals to `document.body`, a selector string or element is used as the teleport target, and `false` disables portalling.
   * Falls back to `createHareUI({ portal })`, then `true`.
   */
  portal?: PortalTarget
  /** Additional classes merged into the sheet (content) element, e.g. a `max-w-*` with `mx-auto`. */
  class?: ClassValue
  /** Per-slot class overrides. */
  ui?: ComponentSlots<Sheet>
}

/** Slots for `Sheet`: the trigger and the panel's header, body, footer and close button. */
export type SheetSlots = {
  /** The trigger element. Omit to control the sheet purely via `v-model:open`. */
  default?: (props: { open: boolean }) => VNode[]
  /** Replaces the whole header (title). The `title` prop still names the dialog for assistive technology. */
  header?: () => VNode[]
  /** Replaces the title text. */
  title?: () => VNode[]
  /** The sheet body. It scrolls once the sheet is fully expanded. */
  body?: (props: { close: () => void }) => VNode[]
  /** The sheet footer (actions). */
  footer?: (props: { close: () => void }) => VNode[]
  /** Replaces the default close button. */
  close?: (props: { close: () => void }) => VNode[]
  /** Replaces the entire sheet content (handle, header, body, footer, close button). */
  content?: (props: { close: () => void }) => VNode[]
}

/** Events emitted by `Sheet`. */
export type SheetEmits = DialogEmits & {
  /** Emitted when the sheet settles at a different snap point, with its index (`snapPoints.length` is fully expanded). */
  'update:snapPoint': [value: number]
}

// Internal types shared by the sheet's helpers; not exported from the package.

/** Scroll axis the sheet moves along. */
export type SheetAxis = 'x' | 'y'

/** A resolved `placement`. */
export type SheetPlacement = NonNullable<SheetProps['placement']>

/** How a placement maps onto the scroll container (React Aria's `getSwipeConfig` for one edge). */
export type SheetSwipeConfig = {
  axis: SheetAxis
  /** Whether the sheet sits after the viewport when closed (`bottom`, `right`): it enters by scrolling forward. */
  after: boolean
  /** Resting scroll position of the open sheet, in viewports. */
  enteredScroll: 0 | 1
  /** Offset of the scroll container from the viewport, in viewport percent. */
  containerOffset: 0 | -100
  /** View-timeline range the sheet travels through while it enters. */
  viewRange: 'entry' | 'exit'
  /** Direction of the scroll-driven animations that follow the sheet. */
  viewDirection: 'normal' | 'reverse'
}

/** A mounted sheet in the document-wide stack; later entries sit on top. */
export type SheetStackEntry = {
  /** `animation-range` of the animations bound to this sheet's timeline. */
  range: string
  /** `animation-direction` of those animations. */
  direction: string
}

/** Inputs of the scroll container geometry. */
export type SheetGeometryInput = {
  placement: SheetPlacement
  config: SheetSwipeConfig
  /** Not dismissible and at rest: the sheet can't be scrolled out of view. */
  clamped: boolean
  /** Turns scroll snapping off (a non-dismissible sheet while it enters or leaves). */
  snapDisabled: boolean
  /** Clamped scroll travel (CSS length). */
  travel: string
  /** Extra travel hidden behind the iOS toolbar (CSS length). */
  padding: string
  /** Window scroll offsets when the sheet opened. */
  scrollX: number
  scrollY: number
}

/** Viewport and page metrics the overlay is laid out with. */
export type SheetViewportMetrics = {
  scrollX: number
  scrollY: number
  width: number
  height: number
  pageWidth: number
  pageHeight: number
}

/** `useDialogShell`'s presence listeners, called by the sheet's own motion. */
type SheetLifecycle = {
  onEnter: () => void
  onAfterEnter: () => void
  onLeave: () => void
  onAfterLeave: () => Promise<void> | void
}

/** Options of `useSheetMotion`. */
export type SheetMotionOptions = {
  open: Readonly<Ref<boolean>>
  config: Readonly<Ref<SheetSwipeConfig>>
  scroller: Readonly<ShallowRef<HTMLElement | null>>
  stage: Readonly<ShallowRef<HTMLElement | null>>
  /** The dialog element (`[data-sheet-content]`). */
  dialog: () => HTMLElement | undefined
  dismissible: () => boolean
  /** The open sheet was scrolled fully out of view. */
  onSwipeAway: () => void
  /** The requested snap point index (`snapPoint` prop); `undefined` opens at the first one. */
  snapPoint: () => number | undefined
  /** The sheet settled at another snap point. */
  onSnapPointChange: (index: number) => void
  lifecycle: SheetLifecycle
}

/** Options of `useSheetHandleDrag`. */
export type SheetHandleDragOptions = {
  config: () => SheetSwipeConfig
  hasSnapPoints: () => boolean
  dismissible: () => boolean
  open: () => boolean
  close: () => void
}

/** A handle drag in progress. */
export type SheetHandleDrag = {
  axis: SheetAxis
  handle: HTMLElement
  scroller: HTMLElement
  pointerId: number
  /** Pointer position at the start. */
  origin: number
  last: number
  lastTime: number
  startedAt: number
  /** Scroll position at the start. */
  scroll: number
  /** Pointer velocity of the last move, px/ms. */
  velocity: number
}

/** Inputs of the release target of a handle drag on a sheet without snap points. */
export type SheetDismissInput = {
  after: boolean
  current: number
  rest: number
  /** Maximum scroll position. */
  extent: number
  /** Size of the dialog along the axis. */
  size: number
  /** Size of the viewport along the axis. */
  viewport: number
  /** Pointer travel. */
  travel: number
  /** Drag duration, ms. */
  elapsed: number
  dismissible: boolean
}
