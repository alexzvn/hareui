import type { VNode } from 'vue'

import type { PortalTarget } from '@/config'
import type { ComponentSlots } from '@/types/tv'
import type { ClassValue } from '@/utils/tv'

import type theme from './theme'

type Tooltip = typeof theme

/** Props of the `Tooltip` component: a short label shown next to its trigger on hover or focus. */
export type TooltipProps = {
  /** The text content of the tooltip. Ignored when the `content` slot is used. */
  text?: string
  /** The controlled open state of the tooltip. Use with `v-model:open`. */
  open?: boolean
  /** The open state of the tooltip when it is initially rendered. Use when you do not need to control its open state. */
  defaultOpen?: boolean
  /**
   * Delay in milliseconds before the tooltip opens after the pointer enters the trigger.
   * @defaultValue 1500
   */
  delay?: number
  /**
   * Delay in milliseconds before the tooltip closes after the pointer leaves the trigger (and the
   * tooltip). Blur, press, Escape and opening another tooltip still close it immediately, as in
   * React Aria.
   * @defaultValue 500
   */
  closeDelay?: number
  /**
   * What opens the tooltip. `'hover'` opens it on hover and on focus; `'focus'` opens it only when
   * the trigger receives focus (hovering neither opens nor closes it).
   * @defaultValue 'hover'
   */
  trigger?: 'hover' | 'focus'
  /**
   * The preferred side of the trigger to render against.
   * @defaultValue 'top'
   */
  side?: 'top' | 'right' | 'bottom' | 'left'
  /**
   * The preferred alignment against the trigger.
   * @defaultValue 'center'
   */
  align?: 'start' | 'center' | 'end'
  /**
   * The distance in pixels from the trigger.
   * @defaultValue 7 when `arrow` is true, otherwise 3
   */
  sideOffset?: number
  /**
   * Whether to render an arrow pointing at the trigger.
   * @defaultValue false
   */
  arrow?: boolean
  /**
   * Whether the tooltip is disabled.
   * @defaultValue false
   */
  disabled?: boolean
  /**
   * Renders the tooltip in a portal. `true` portals to `document.body`, a selector string or element is used as the teleport target, and `false` disables portalling.
   * Falls back to `createHareUI({ portal })`, then `true`.
   */
  portal?: PortalTarget
  /** Additional classes merged into the tooltip content element. */
  class?: ClassValue
  /** Per-slot class overrides. */
  ui?: ComponentSlots<Tooltip>
}

/** Slots of the `Tooltip` component. */
export type TooltipSlots = {
  /** The trigger element. */
  default?: (props: { open: boolean }) => VNode[]
  /** Replaces the default `text` content. */
  content?: () => VNode[]
}

/** Events emitted by the `Tooltip` component. */
export type TooltipEmits = {
  /** Emitted when the open state changes. */
  'update:open': [value: boolean]
}
