import type { VNode } from 'vue'

import type { PortalTarget } from '@/config'
import type { ComponentSlots, ComponentVariants } from '@/types/tv'
import type { ClassValue } from '@/utils/tv'

import type theme from './theme'

type Modal = typeof theme

export type ModalProps = {
  /** The controlled open state of the modal. Use with `v-model:open`. */
  open?: boolean
  /** The open state of the modal when it is initially rendered. Use when you do not need to control its open state. */
  defaultOpen?: boolean
  /** Title rendered in the header. */
  title?: string
  /**
   * Where the dialog scrolls when its content overflows the viewport.
   * @defaultValue 'inside'
   */
  scroll?: ComponentVariants<Modal>['scroll']
  /**
   * Size of the dialog.
   * @defaultValue 'md'
   */
  size?: ComponentVariants<Modal>['size']
  /**
   * Visual style of the backdrop.
   * @defaultValue 'opaque'
   */
  variant?: ComponentVariants<Modal>['variant']
  /**
   * Vertical position of the dialog within the viewport.
   * @defaultValue 'auto'
   */
  placement?: ComponentVariants<Modal>['placement']
  /**
   * Whether clicking the backdrop or pressing Escape closes the modal.
   * @defaultValue true
   */
  dismissible?: boolean
  /**
   * Whether the default close button is rendered.
   * @defaultValue true
   */
  closeButton?: boolean
  /**
   * Renders the modal in a portal. `true` portals to `document.body`, a selector string or element is used as the teleport target, and `false` disables portalling.
   * Falls back to `createHareUI({ portal })`, then `true`.
   */
  portal?: PortalTarget
  /** Additional classes merged into the dialog element. */
  class?: ClassValue
  /** Per-slot class overrides. */
  ui?: ComponentSlots<Modal>
}

export type ModalSlots = {
  /** The trigger element. Omit to control the modal purely via `v-model:open`. */
  default?: (props: { open: boolean }) => VNode[]
  /** Replaces the whole header (icon and title). */
  header?: () => VNode[]
  /** Icon rendered before the title in the header. */
  icon?: () => VNode[]
  /** Replaces the title text. */
  title?: () => VNode[]
  /** Supporting text after the title, linked to the dialog as its description. Pass one element (e.g. a `<p>`). */
  description?: () => VNode[]
  /** The dialog body. */
  body?: (props: { close: () => void }) => VNode[]
  /** The dialog footer (actions). */
  footer?: (props: { close: () => void }) => VNode[]
  /** Replaces the default close button. */
  close?: (props: { close: () => void }) => VNode[]
  /** Replaces the entire dialog content (header, body, footer, close trigger). */
  content?: (props: { close: () => void }) => VNode[]
}

export type ModalEmits = {
  /** Emitted when the open state changes. */
  'update:open': [value: boolean]
}
