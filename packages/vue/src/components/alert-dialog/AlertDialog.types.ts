import type { VNode } from 'vue'

import type { PortalTarget } from '@/config'
import type { CloseButtonProp } from '@/types/closeButton'
import type { ComponentSlots, ComponentVariants } from '@/types/tv'
import type { ClassValue } from '@/utils/tv'

import type theme from './theme'

type AlertDialog = typeof theme

/** Props of `AlertDialog`, a modal dialog that interrupts the user with an important message and requires a response. */
export type AlertDialogProps = {
  /** The controlled open state of the alert dialog. Use with `v-model:open`. */
  open?: boolean
  /** The open state of the alert dialog when it is initially rendered. Use when you do not need to control its open state. */
  defaultOpen?: boolean
  /** Title rendered in the header. */
  title?: string
  /**
   * Status color of the header icon. Also picks the default icon.
   * @defaultValue 'danger'
   */
  status?: ComponentVariants<AlertDialog>['status']
  /**
   * Whether the status icon is rendered in the header. The `#icon` slot replaces its content.
   * @defaultValue true
   */
  icon?: boolean
  /**
   * Size of the dialog.
   * @defaultValue 'md'
   */
  size?: ComponentVariants<AlertDialog>['size']
  /**
   * Visual style of the backdrop.
   * @defaultValue 'opaque'
   */
  variant?: ComponentVariants<AlertDialog>['variant']
  /**
   * Vertical position of the dialog within the viewport.
   * @defaultValue 'auto'
   */
  placement?: ComponentVariants<AlertDialog>['placement']
  /**
   * Whether clicking the backdrop closes the alert dialog. Alert dialogs require an explicit action by default.
   * @defaultValue false
   */
  dismissible?: boolean
  /**
   * Whether pressing Escape closes the alert dialog.
   * @defaultValue false
   */
  keyboardDismissible?: boolean
  /**
   * Whether the default close button is rendered; an object customises its `icon` and `label` (accessible name).
   * @defaultValue true
   */
  closeButton?: CloseButtonProp
  /**
   * Renders the alert dialog in a portal. `true` portals to `document.body`, a selector string or element is used as the teleport target, and `false` disables portalling.
   * Falls back to `createHareUI({ portal })`, then `true`.
   */
  portal?: PortalTarget
  /** Additional classes merged into the dialog element. */
  class?: ClassValue
  /** Per-slot class overrides. */
  ui?: ComponentSlots<AlertDialog>
}

/** Slots of `AlertDialog`. */
export type AlertDialogSlots = {
  /** The trigger element. Omit to control the alert dialog purely via `v-model:open`. */
  default?: (props: { open: boolean }) => VNode[]
  /** Replaces the whole header (icon and title). */
  header?: () => VNode[]
  /** Replaces the default status icon inside the icon wrapper. */
  icon?: () => VNode[]
  /** Replaces the title text. */
  title?: () => VNode[]
  /** The dialog body. */
  body?: (props: { close: () => void }) => VNode[]
  /** The dialog footer (actions). */
  footer?: (props: { close: () => void }) => VNode[]
  /** Replaces the default close button. */
  close?: (props: { close: () => void }) => VNode[]
  /** Replaces the entire dialog content (header, body, footer, close trigger). */
  content?: (props: { close: () => void }) => VNode[]
}

/** Events emitted by `AlertDialog`. */
export type AlertDialogEmits = {
  /** Emitted when the open state changes. */
  'update:open': [value: boolean]
  /** Emitted when the open animation starts. */
  enter: []
  /** Emitted when the open animation finished, right after `enter` when there is none. */
  'after:enter': []
  /** Emitted when the close animation starts. */
  leave: []
  /** Emitted when the close animation finished and the dialog left the DOM. */
  'after:leave': []
}
