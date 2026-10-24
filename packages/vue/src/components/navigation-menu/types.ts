import type { PortalTarget } from '@/config'

/** Options of the hover/click popover shown for a collapsed item with children. */
export interface NavigationMenuPopoverProps {
  /**
   * What opens the popover. `'hover'` (the default) opens it on hover and closes it when the
   * pointer leaves both the item and the popover; `'click'` uses the regular `Popover`.
   * @defaultValue 'hover'
   */
  mode?: 'hover' | 'click'
  /**
   * The preferred side of the item to render against.
   * @defaultValue 'right'
   */
  side?: 'top' | 'right' | 'bottom' | 'left'
  /**
   * The preferred alignment against the item.
   * @defaultValue 'start'
   */
  align?: 'start' | 'center' | 'end'
  /**
   * The distance in pixels from the item.
   * @defaultValue 8
   */
  sideOffset?: number
  /**
   * The offset in pixels from the `align` edge. Only used in `hover` mode.
   * @defaultValue 2
   */
  alignOffset?: number
  /**
   * Delay in milliseconds before a hover popover opens. Only used in `hover` mode.
   * @defaultValue 0
   */
  openDelay?: number
  /**
   * Delay in milliseconds before a hover popover closes. Only used in `hover` mode.
   * @defaultValue 100
   */
  closeDelay?: number
  /** Where to render the popover: `true`/`false`, a selector or an element. Falls back to `createHareUI({ portal })`. */
  portal?: PortalTarget
  /** Additional classes merged into the popover surface. */
  class?: any
}
