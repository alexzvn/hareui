import type { PrimitiveProps } from 'reka-ui'
import type { VNode } from 'vue'

import type { ButtonProps } from '@/components/button/Button.types'
import type { DrawerProps } from '@/components/drawer/Drawer.types'
import type { ModalProps } from '@/components/modal/Modal.types'
import type { IconValue } from '@/types/icon'
import type { ComponentSlots, ComponentUI, ComponentVariants } from '@/types/tv'
import type { ClassValue } from '@/utils/tv'

import type theme from './theme'

type Sidebar = typeof theme

/** The desktop state of the sidebar: `expanded`, or `collapsed` to the icon rail or off-canvas. */
export type SidebarState = 'expanded' | 'collapsed'

/** How the sidebar opens below `breakpoint`: a side sheet (`slideover`), a bottom sheet (`drawer`) or a full-screen dialog (`modal`). */
export type SidebarMode = 'slideover' | 'drawer' | 'modal'

/** The Tailwind CSS breakpoint below which the sidebar renders as a menu. */
export type SidebarBreakpoint = 'sm' | 'md' | 'lg' | 'xl' | '2xl'

/** Props forwarded to the menu overlay: `Modal` props for `mode="modal"`, `Drawer` props otherwise. */
export type SidebarMenuProps = Partial<DrawerProps> | Partial<ModalProps>

/** The close button of the sidebar header: `Button` props plus the icon it shows. */
export type SidebarCloseProps = Omit<ButtonProps, 'as'> & {
  /**
   * The icon rendered in the button: a class string or a component.
   * @defaultValue Gravity UI `xmark`
   */
  icon?: IconValue
}

/** The resolved slot class functions of `Sidebar`, passed to slots that replace one of its parts. */
export type SidebarUI = ComponentUI<Sidebar>

/** Props of `Sidebar`: a standalone sidebar that pushes the page content, collapses on desktop and opens as a menu on mobile. */
export type SidebarProps = {
  /**
   * The element or component the sidebar renders as.
   * @defaultValue 'aside'
   */
  as?: PrimitiveProps['as']
  /**
   * The look of the sidebar: `sidebar` sits on the page background with a 1px edge, `floating` is a raised card
   * detached from the viewport edges, `inset` drops the edge so the page content can be styled as a card next to it.
   * @defaultValue 'sidebar'
   */
  variant?: ComponentVariants<Sidebar>['variant']
  /**
   * How the sidebar collapses on desktop.
   * - `offcanvas`: it slides out of view completely.
   * - `icon`: it shrinks to a 48px icon rail.
   * - `none`: it can't collapse and has no mobile menu.
   * @defaultValue 'offcanvas'
   */
  collapsible?: ComponentVariants<Sidebar>['collapsible']
  /**
   * The side of the page the sidebar sits on.
   * @defaultValue 'left'
   */
  side?: ComponentVariants<Sidebar>['side']
  /** The title shown in the sidebar header. Also the accessible name of the mobile menu. */
  title?: string
  /** The description shown under the title in the sidebar header. */
  description?: string
  /**
   * A close button in the header that collapses the sidebar. Rendered only when `collapsible` is not `none`, and
   * always in the mobile menu. An object customizes the `Button` and its `icon`.
   * @defaultValue false
   */
  close?: boolean | SidebarCloseProps
  /**
   * A thin, clickable strip on the inner edge of the sidebar that toggles it. Rendered only when `collapsible` is not `none`.
   * @defaultValue false
   */
  rail?: boolean
  /**
   * Animates the sidebar width (200ms) when it collapses or expands.
   * @defaultValue true
   */
  transition?: boolean
  /**
   * The breakpoint below which the sidebar renders as a menu. Follows the default Tailwind CSS breakpoints.
   * @defaultValue 'md'
   */
  breakpoint?: SidebarBreakpoint
  /**
   * How the sidebar opens below `breakpoint`.
   * @defaultValue 'slideover'
   */
  mode?: SidebarMode
  /** Props for the menu overlay (`Modal` for `mode="modal"`, otherwise `Drawer`). */
  menu?: SidebarMenuProps
  /**
   * Closes the mobile menu when a link inside it is clicked or the page navigates. Items that only expand or
   * collapse a group keep it open.
   * @defaultValue true
   */
  autoClose?: boolean
  /** Additional classes merged into the root element. */
  class?: ClassValue
  /** Per-slot class overrides. */
  ui?: ComponentSlots<Sidebar>
}

/** Events emitted by `Sidebar`. */
export type SidebarEmits = {
  /** Emitted when the sidebar expands or collapses on desktop, or when its menu opens or closes on mobile. */
  'update:open': [value: boolean]
}

/** Props passed to the `header`, `default` and `footer` slots. */
export type SidebarSectionSlotProps = {
  /** Whether the sidebar is expanded or collapsed. Inside the mobile menu it is `expanded` while the menu is open. */
  state: SidebarState
  /** Whether the sidebar is expanded on desktop, or its menu open on mobile. */
  open: boolean
  /** Collapses the sidebar on desktop, closes its menu on mobile. */
  close: () => void
}

/** Props passed to the `close` and `rail` slots. */
export type SidebarPartSlotProps = {
  /** Whether the sidebar is expanded or collapsed. */
  state: SidebarState
  /** The resolved slot class functions, to style a custom part like the default one. */
  ui: SidebarUI
}

/** Slots of `Sidebar`: the header, body and footer regions, plus overrides for the header parts, the rail and the menu content. */
export type SidebarSlots = {
  /** Replaces the whole header (title, description, actions and close button). */
  header?: (props: SidebarSectionSlotProps) => VNode[]
  /** Replaces the title text. */
  title?: (props: { state: SidebarState }) => VNode[]
  /** Replaces the description text. */
  description?: (props: { state: SidebarState }) => VNode[]
  /** Buttons rendered before the close button, at the end of the header. Hidden on the icon rail. */
  actions?: (props: { state: SidebarState }) => VNode[]
  /** Replaces the close button. */
  close?: (props: SidebarPartSlotProps) => VNode[]
  /** The scrollable sidebar body. */
  default?: (props: SidebarSectionSlotProps) => VNode[]
  /** The sidebar footer (user menu...). Hidden when omitted. */
  footer?: (props: SidebarSectionSlotProps) => VNode[]
  /** Replaces the rail. Rendered only when `rail` is set. */
  rail?: (props: SidebarPartSlotProps) => VNode[]
  /** Replaces the whole menu content (header, body and footer) on mobile. */
  content?: (props: { close: () => void }) => VNode[]
}
