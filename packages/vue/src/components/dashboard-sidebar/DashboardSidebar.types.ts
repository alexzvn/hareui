import type { VNode } from 'vue'

import type { ButtonProps } from '@/components/button/Button.types'
import type { DrawerProps } from '@/components/drawer/Drawer.types'
import type { ModalProps } from '@/components/modal/Modal.types'
import type { ComponentSlots, ComponentUI } from '@/types/tv'
import type { ClassValue } from '@/utils/tv'

import type theme from './theme'

type DashboardSidebar = typeof theme

/** How the sidebar opens below the `md` breakpoint: a side sheet (`slideover`), a bottom sheet (`drawer`) or a full-screen dialog (`modal`). */
export type DashboardSidebarMode = 'slideover' | 'drawer' | 'modal'

/** Props forwarded to the menu overlay: `Modal` props for `mode="modal"`, `Drawer` props otherwise. */
export type DashboardSidebarMenuProps = Partial<DrawerProps> | Partial<ModalProps>

/** Props of `DashboardSidebar`: a resizable, collapsible sidebar that becomes an overlay menu below the `md` breakpoint. */
export type DashboardSidebarProps = {
  /**
   * Identifies the sidebar in the storage (`${storageKey}-sidebar-${id}`) and as its element id.
   * @defaultValue useId()
   */
  id?: string
  /**
   * The side of the dashboard the sidebar sits on. `right` is the aside panel: it has its own `open`/`collapsed` state in the group context (`sidebars.right`).
   * @defaultValue 'left'
   */
  side?: 'left' | 'right'
  /**
   * The minimum size of the sidebar, in the group's `unit`.
   * @defaultValue 10
   */
  minSize?: number
  /**
   * The maximum size of the sidebar, in the group's `unit`.
   * @defaultValue 20
   */
  maxSize?: number
  /**
   * The size of the sidebar, in the group's `unit`, until the user resizes it.
   * @defaultValue 15
   */
  defaultSize?: number
  /**
   * Whether the sidebar can be resized with a drag handle. The handle is also a keyboard-operable separator.
   * @defaultValue false
   */
  resizable?: boolean
  /**
   * Whether the sidebar collapses to an icon rail (`collapsedSize`) when dragged near its edge, toggled from the handle, or via `v-model:collapsed`.
   * @defaultValue false
   */
  collapsible?: boolean
  /**
   * The size of the sidebar while collapsed, in the group's `unit`. The sidebar never gets narrower than 3rem.
   * @defaultValue 0
   */
  collapsedSize?: number
  /**
   * How the sidebar opens below the `md` breakpoint.
   * @defaultValue 'slideover'
   */
  mode?: DashboardSidebarMode
  /** Props for the menu overlay (`Modal` for `mode="modal"`, otherwise `Drawer`). `title` is used as its accessible name. */
  menu?: DashboardSidebarMenuProps
  /**
   * The toggle button of the menu header; an object customizes the `Button`.
   * @defaultValue true
   */
  toggle?: boolean | Omit<ButtonProps, 'as'>
  /**
   * The side of the menu header the toggle is rendered on. `right` (the default) puts the close button at the end of
   * the brand row, where the other overlays place it.
   * @defaultValue 'right'
   */
  toggleSide?: 'left' | 'right'
  /**
   * Closes the menu when a link inside it is clicked.
   * @defaultValue true
   */
  autoClose?: boolean
  /** Additional classes merged into the root element. */
  class?: ClassValue
  /** Per-slot class overrides. */
  ui?: ComponentSlots<DashboardSidebar>
}

/** Events emitted by `DashboardSidebar`. */
export type DashboardSidebarEmits = {
  /** Emitted when the mobile menu opens or closes. */
  'update:open': [value: boolean]
  /** Emitted when the sidebar collapses or expands. */
  'update:collapsed': [value: boolean]
}

/** Props passed to the `toggle` slot that replaces the menu header's toggle button. */
export type DashboardSidebarToggleSlotProps = {
  /** Whether the mobile menu is open. */
  open: boolean
  /** Opens the mobile menu when closed, closes it when open. */
  toggle: () => void
  /** The resolved slot class functions, to style a custom toggle like the default one. */
  ui: DashboardSidebarUI
}

/** Props passed to the `resize-handle` slot: bind the handlers and `attrs` on a custom handle element. */
export type DashboardSidebarResizeHandleSlotProps = {
  /** Starts a pointer drag that resizes the sidebar. */
  onPointerDown: (e: PointerEvent) => void
  /** Starts a mouse drag; fallback for environments without pointer events. */
  onMouseDown: (e: MouseEvent) => void
  /** Starts a touch drag; fallback for environments without pointer events. */
  onTouchStart: (e: TouchEvent) => void
  /** Expands the sidebar and resets it to `defaultSize`. */
  onDoubleClick: (e: MouseEvent) => void
  /** Keyboard resizing: arrows step the size (Shift for larger steps), Home/End jump to min/max, Enter collapses when `collapsible`. */
  onKeyDown: (e: KeyboardEvent) => void
  /** `aria-valuenow`/`min`/`max` and `tabindex` for a `role="separator"` handle. */
  attrs: Record<string, unknown>
  /** Whether the sidebar is being dragged. */
  dragging: boolean
  /** The resolved slot class functions, to style a custom handle like the default one. */
  ui: DashboardSidebarUI
}

type DashboardSidebarUI = ComponentUI<DashboardSidebar>

/** Slots of `DashboardSidebar`: the header, body and footer regions, plus overrides for the menu toggle, menu content and resize handle. */
export type DashboardSidebarSlots = {
  /** The sidebar header (logo, team switcher...). Hidden when omitted. */
  header?: (props: { collapsed: boolean; collapse: (value: boolean) => void }) => VNode[]
  /** The scrollable sidebar body. */
  default?: (props: { collapsed: boolean; collapse: (value: boolean) => void }) => VNode[]
  /** The sidebar footer (user menu...). Hidden when omitted. */
  footer?: (props: { collapsed: boolean; collapse: (value: boolean) => void }) => VNode[]
  /** Replaces the toggle button of the menu header. */
  toggle?: (props: DashboardSidebarToggleSlotProps) => VNode[]
  /** Replaces the whole menu content (header, body and footer). */
  content?: (props: { close: () => void }) => VNode[]
  /** Replaces the resize handle. Rendered only when `resizable`. */
  'resize-handle'?: (props: DashboardSidebarResizeHandleSlotProps) => VNode[]
}
