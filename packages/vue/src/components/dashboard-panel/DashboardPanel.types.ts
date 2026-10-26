import type { VNode } from 'vue'

import type { ComponentSlots } from '@/types/tv'
import type { ClassValue } from '@/utils/tv'

import type theme from './theme'

type DashboardPanel = typeof theme

/** Props of `DashboardPanel`: a resizable dashboard panel with a header, scrollable body and footer. */
export type DashboardPanelProps = {
  /**
   * Identifies the panel in the storage (`${storageKey}-panel-${id}`) and as its element id. Set it when several panels live in different pages.
   * @defaultValue useId()
   */
  id?: string
  /**
   * The minimum size of the panel, in the group's `unit`.
   * @defaultValue 15
   */
  minSize?: number
  /**
   * The maximum size of the panel, in the group's `unit`.
   * @defaultValue 100
   */
  maxSize?: number
  /**
   * The initial size of the panel, in the group's `unit`. Without it (or while `0`) the panel fills the remaining space.
   * @defaultValue 0
   */
  defaultSize?: number
  /**
   * Whether the panel can be resized with a drag handle on its end edge.
   * @defaultValue false
   */
  resizable?: boolean
  /** Additional classes merged into the root element. */
  class?: ClassValue
  /** Per-slot class overrides. */
  ui?: ComponentSlots<DashboardPanel>
}

/** Props passed to the `resize-handle` slot: bind the handlers and `attrs` on a custom handle element. */
export type DashboardPanelResizeHandleSlotProps = {
  /** Starts a pointer drag that resizes the panel. */
  onPointerDown: (e: PointerEvent) => void
  /** Starts a mouse drag; fallback for environments without pointer events. */
  onMouseDown: (e: MouseEvent) => void
  /** Starts a touch drag; fallback for environments without pointer events. */
  onTouchStart: (e: TouchEvent) => void
  /** Expands the panel and resets it to `defaultSize`. */
  onDoubleClick: (e: MouseEvent) => void
  /** Keyboard resizing: arrows step the size (Shift for larger steps), Home/End jump to min/max, Enter collapses when `collapsible`. */
  onKeyDown: (e: KeyboardEvent) => void
  /** `aria-valuenow`/`min`/`max` and `tabindex` for a `role="separator"` handle. */
  attrs: Record<string, unknown>
  /** Whether the panel is being dragged. */
  dragging: boolean
}

/** Slots of `DashboardPanel`: the header, body and footer regions, or the whole content, plus a custom resize handle. */
export type DashboardPanelSlots = {
  /** Replaces the header, body and footer (use it when you don't want a scrollable, padded body). */
  default?: () => VNode[]
  /** Rendered above the body, e.g. a navbar. */
  header?: () => VNode[]
  /** The scrollable, padded body. */
  body?: () => VNode[]
  /** Rendered below the body. */
  footer?: () => VNode[]
  /** Replaces the resize handle. Rendered only when `resizable`. */
  'resize-handle'?: (props: DashboardPanelResizeHandleSlotProps) => VNode[]
}
