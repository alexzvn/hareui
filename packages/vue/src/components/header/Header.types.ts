import type { PrimitiveProps } from 'reka-ui'
import type { VNode } from 'vue'

import type { ButtonProps } from '@/components/button/Button.types'
import type { DrawerProps } from '@/components/drawer/Drawer.types'
import type { ModalProps } from '@/components/modal/Modal.types'
import type { ComponentSlots, ComponentUI, ComponentVariants } from '@/types/tv'
import type { ClassValue } from '@/utils/tv'

import type theme from './theme'

type Header = typeof theme

/**
 * How `Header` presents its mobile menu: a `Modal` under the bar, a side `Drawer` (`slideover`), or a
 * bottom `Drawer` sheet.
 */
export type HeaderMode = 'modal' | 'slideover' | 'drawer'

/** Modal props accepted by `menu` in `modal` mode. */
export type ModalMenuProps = Omit<ModalProps, 'open' | 'defaultOpen'>

/** Drawer props accepted by `menu` in `slideover` and `drawer` modes. */
export type DrawerMenuProps = Omit<DrawerProps, 'open' | 'defaultOpen'>

type MenuProps =
  | Omit<ModalProps, 'open' | 'defaultOpen'>
  | Omit<DrawerProps, 'open' | 'defaultOpen'>

/**
 * Props of `Header`: a responsive site header with a title link, centered navigation, actions and a
 * collapsible mobile menu.
 */
export type HeaderProps = {
  /**
   * The element or component to render as.
   * @defaultValue 'header'
   */
  as?: PrimitiveProps['as']
  /**
   * Title rendered in the default `left` slot. Also used as the link's `aria-label`: set it when filling the `title` slot with a logo.
   * @defaultValue 'HareUI'
   */
  title?: string
  /**
   * The URL the title links to.
   * @defaultValue '/'
   */
  to?: string
  /**
   * How the mobile menu is presented: a `Modal` filling the area from the bar down (its header row lands on the bar, so the toggle turns into the close button in place),
   * a `Drawer` sliding in from the `right` (`slideover`), or a `Drawer` sheet from the bottom (`drawer`). The menu spans the header's width.
   * @defaultValue 'modal'
   */
  mode?: HeaderMode
  /** Props forwarded to the menu component (`Modal` for `modal`, `Drawer` for `slideover` and `drawer`), e.g. `{ placement: 'left' }`. `portal` places the menu's anchor element. */
  menu?: MenuProps
  /**
   * The toggle button that opens the menu (only rendered when the `body` or `content` slot is used). `true` renders the default animated hamburger;
   * an object is forwarded to the `Button` (`variant`, `size`, `class`, ...); `false` hides it.
   * @defaultValue true
   */
  toggle?: boolean | Omit<ButtonProps, 'as' | 'iconOnly'>
  /**
   * The side to render the toggle button on.
   * @defaultValue 'right'
   */
  toggleSide?: 'left' | 'right'
  /**
   * The viewport width from which the `default` slot shows inline and the toggle and menu are dropped. `none` keeps the collapsed layout at every width.
   * @defaultValue 'lg'
   */
  breakpoint?: ComponentVariants<Header>['breakpoint']
  /**
   * Close the menu when a link inside it is clicked or the page navigates (`popstate`/`hashchange`).
   * @defaultValue true
   */
  autoClose?: boolean
  /**
   * Hide the bar when scrolling down and reveal it when scrolling up. The bar slides out with a transform, so layout is unaffected.
   * @defaultValue false
   */
  hideOnScroll?: boolean
  /**
   * The scroll container watched by `hideOnScroll`: an element, a CSS selector, or `window`.
   * Defaults to the nearest scrollable ancestor, falling back to the window.
   */
  scrollTarget?: string | HTMLElement | Window | null
  /**
   * Height of the bar, any CSS length. Sets the `--header-height` CSS variable (default `4rem`).
   * @example '2.75rem'
   */
  height?: string
  /**
   * Lock page scroll while the mobile menu is open.
   * @defaultValue true
   */
  shouldBlockScroll?: boolean
  /**
   * Accessible label of the toggle while the menu is closed.
   * @defaultValue 'Open menu'
   */
  openLabel?: string
  /**
   * Accessible label of the toggle while the menu is open.
   * @defaultValue 'Close menu'
   */
  closeLabel?: string
  /**
   * Accessible title of the menu dialog.
   * @defaultValue 'Navigation menu'
   */
  menuTitle?: string
  /** Additional classes merged into the root element. */
  class?: ClassValue
  /** Per-slot class overrides. */
  ui?: ComponentSlots<Header>
}

/** Slots of `Header`, one per area of the bar plus the mobile menu's body and content. */
export type HeaderSlots = {
  /** Replaces the title text inside the default title link. */
  title?: () => VNode[]
  /** Replaces the whole start area (title link). The toggle is still rendered before it when `toggleSide="left"`. */
  left?: () => VNode[]
  /** Centered navigation, shown from the `lg` breakpoint. */
  default?: () => VNode[]
  /** End area (actions). The toggle is rendered after it when `toggleSide="right"`. */
  right?: () => VNode[]
  /** Replaces the toggle button. */
  toggle?: (props: { open: boolean; toggle: () => void; ui: ComponentUI<Header> }) => VNode[]
  /** Rendered above the bar, inside the root element. */
  top?: () => VNode[]
  /** Rendered below the bar, inside the root element. */
  bottom?: () => VNode[]
  /** The menu body, below the menu's own header (`modal` and `slideover`) or alone (`drawer`). */
  body?: () => VNode[]
  /** Replaces the entire menu content. */
  content?: (props: { close: () => void }) => VNode[]
}

/** Events emitted by `Header`. */
export type HeaderEmits = {
  /** Emitted when the menu opens or closes. */
  'update:open': [value: boolean]
  /** Emitted when `hideOnScroll` hides or reveals the bar. */
  'update:hidden': [value: boolean]
}
