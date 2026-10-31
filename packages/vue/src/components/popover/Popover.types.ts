import type { VNode } from 'vue'

import type { PortalTarget } from '@/config'
import type { ComponentSlots } from '@/types/tv'
import type { ClassValue } from '@/utils/tv'

import type theme from './theme'

type Popover = typeof theme

/** How a `Popover` opens: on press (`click`) or while its trigger is hovered or focused (`hover`). */
export type PopoverMode = 'click' | 'hover'

/** Props of the `content` slot: `close` in click mode, none in hover mode. */
export type PopoverContentSlotProps<M extends PopoverMode = PopoverMode> = [M] extends ['hover']
  ? { close?: undefined }
  : { close: () => void }

/** Props of `Popover`, an overlay anchored to its trigger that shows rich content in context. */
export type PopoverProps<M extends PopoverMode = PopoverMode> = {
  /**
   * How the popover opens: `click` toggles it on press; `hover` opens it while the trigger is hovered or focused,
   * without moving focus or making the page inert.
   * @defaultValue 'click'
   */
  mode?: M
  /**
   * In `hover` mode, the delay in milliseconds before the popover opens.
   * @defaultValue 700
   */
  openDelay?: number
  /**
   * In `hover` mode, the delay in milliseconds before the popover closes once the pointer or focus left.
   * @defaultValue 300
   */
  closeDelay?: number
  /**
   * In `hover` mode, lets a tap on the trigger open the popover at once and a second tap close it. Without it, a tap
   * only opens the popover where tapping focuses the trigger (not in Safari on iOS), after `openDelay`.
   * @defaultValue false
   */
  enableTouch?: boolean
  /**
   * The controlled open state of the popover.
   */
  open?: boolean
  /**
   * The open state of the popover when it is initially rendered. Use when you do not need to control its open state.
   * @defaultValue false
   */
  defaultOpen?: boolean
  /**
   * The title rendered inside the popover's heading.
   */
  title?: string
  /**
   * The preferred side of the trigger to render against when open.
   * @defaultValue 'bottom'
   */
  side?: 'top' | 'right' | 'bottom' | 'left'
  /**
   * The preferred alignment against the trigger.
   * @defaultValue 'center'
   */
  align?: 'start' | 'center' | 'end'
  /**
   * The distance in pixels from the trigger.
   * @defaultValue 8
   */
  sideOffset?: number
  /**
   * Whether the popover can change orientation to fit in the viewport when it would otherwise overflow.
   * @defaultValue true
   */
  flip?: boolean
  /**
   * Whether to render an arrow pointing at the trigger.
   * @defaultValue false
   */
  arrow?: boolean
  /**
   * When `false`, the popover will not close when clicking outside or pressing Escape.
   * @defaultValue true
   */
  dismissible?: boolean
  /**
   * Renders the popover content in a portal. `true` portals to `document.body`, a selector string or element is used as the teleport target, and `false` disables portalling.
   * Falls back to `createHareUI({ portal })`, then `true`.
   */
  portal?: PortalTarget
  /** Additional classes merged into the popover surface. */
  class?: ClassValue
  /** Per-slot class overrides. */
  ui?: ComponentSlots<Popover>
}

/** Slots of `Popover`. */
export type PopoverSlots<M extends PopoverMode = PopoverMode> = {
  /** The trigger element. Receives the current open state. */
  default?: (props: { open: boolean }) => VNode[]
  /** Replaces the heading text derived from `title`. */
  title?: () => VNode[]
  /** The popover's content. Receives a `close` callback in `click` mode. */
  content?: (props: PopoverContentSlotProps<M>) => VNode[]
}

/** Events emitted by `Popover`. */
export type PopoverEmits = {
  /** Emitted when the open state changes. */
  'update:open': [value: boolean]
  /** Emitted when Escape or an outside press tries to close the popover while `dismissible` is `false`. */
  'close:prevent': []
}
