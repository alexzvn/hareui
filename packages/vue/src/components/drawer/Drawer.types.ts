import type { VNode } from 'vue'

import type { PortalTarget } from '@/config'
import type { CloseButtonProp } from '@/types/closeButton'
import type { ComponentSlots, ComponentVariants } from '@/types/tv'
import type { ClassValue } from '@/utils/tv'

import type theme from './theme'

type Drawer = typeof theme

/** Props for `Drawer`, a modal panel that slides in from an edge of the screen and can be dragged to dismiss. */
export type DrawerProps = {
  /** The controlled open state of the drawer. Use with `v-model:open`. */
  open?: boolean
  /** The open state of the drawer when it is initially rendered. Use when you do not need to control its open state. */
  defaultOpen?: boolean
  /** Title rendered in the header. */
  title?: string
  /**
   * Edge of the screen the drawer slides in from.
   * @defaultValue 'bottom'
   */
  placement?: ComponentVariants<Drawer>['placement']
  /**
   * Visual style of the backdrop.
   * @defaultValue 'opaque'
   */
  variant?: ComponentVariants<Drawer>['variant']
  /**
   * Whether clicking the backdrop or dragging the drawer towards its edge closes it.
   * @defaultValue true
   */
  dismissible?: boolean
  /**
   * Whether pressing Escape closes the drawer.
   * @defaultValue true
   */
  keyboardDismissible?: boolean
  /**
   * Whether the drag handle bar is rendered (at the top, or at the bottom for `placement="top"`).
   * @defaultValue false
   */
  handle?: boolean
  /**
   * Whether the default close button is rendered; an object customises its `icon` and `label` (accessible name).
   * @defaultValue true
   */
  closeButton?: CloseButtonProp
  /**
   * Renders the drawer in a portal. `true` portals to `document.body`, a selector string or element is used as the teleport target, and `false` disables portalling.
   * Falls back to `createHareUI({ portal })`, then `true`.
   */
  portal?: PortalTarget
  /** Additional classes merged into the dialog (panel) element. */
  class?: ClassValue
  /** Per-slot class overrides. */
  ui?: ComponentSlots<Drawer>
}

/** Slots for `Drawer`: the trigger and the panel's header, body, footer and close button. */
export type DrawerSlots = {
  /** The trigger element. Omit to control the drawer purely via `v-model:open`. */
  default?: (props: { open: boolean }) => VNode[]
  /** Replaces the whole header (title). */
  header?: () => VNode[]
  /** Replaces the title text. */
  title?: () => VNode[]
  /** The drawer body (scrollable; drag-to-dismiss is excluded from it). */
  body?: (props: { close: () => void }) => VNode[]
  /** The drawer footer (actions). */
  footer?: (props: { close: () => void }) => VNode[]
  /** Replaces the default close button. */
  close?: (props: { close: () => void }) => VNode[]
  /** Replaces the entire drawer content (handle, header, body, footer, close trigger). */
  content?: (props: { close: () => void }) => VNode[]
}

/** Events emitted by `Drawer`. */
export type DrawerEmits = {
  /** Emitted when the open state changes. */
  'update:open': [value: boolean]
  /** Emitted when the open animation starts. */
  enter: []
  /** Emitted when the open animation finished, right after `enter` when there is none. */
  'after:enter': []
  /** Emitted when the close animation starts. */
  leave: []
  /** Emitted when the close animation finished and the drawer left the DOM. */
  'after:leave': []
}
