import type { PrimitiveProps } from 'reka-ui'
import type { Component, VNode } from 'vue'

import type { PortalTarget } from '@/config'
import type { ComponentSlots, ComponentUI, ComponentVariants } from '@/types/tv'
import type { ClassValue } from '@/utils/tv'

import type theme from './theme'

type Toc = typeof theme

/** The resolved slot class functions of `Toc`, handed to the `leading` and `trailing` slots. */
export type TocUI = ComponentUI<Toc>

/** A heading of the page listed in the table of contents. */
export type TocLink = {
  /** The `id` of the heading element. The link points at `#id`, and the heading is watched to track the active link. */
  id: string
  /** The link text. */
  text: string
  /** The heading level (`2` for an `h2`). Informational: nesting comes from `children`. */
  depth?: number
  /** The headings nested under this one, rendered as an indented sub-list. */
  children?: TocLink[]
  /** Additional classes for this link's `<a>`. */
  class?: ClassValue
  /** Per-slot class overrides for this link. */
  ui?: Pick<ComponentSlots<Toc>, 'item' | 'itemWithChildren' | 'link' | 'linkText' | 'panelLink'>
}

/** The colors of the active link and of the highlight indicator. */
export type TocColor = ComponentVariants<Toc>['color']

/** Options of the active-link indicator drawn next to the `list` variant. */
export type TocHighlight = {
  /**
   * The color of the active segment. Defaults to the `color` prop.
   */
  color?: TocColor
  /**
   * `straight` draws a rail along the list; `circuit` traces the rail along the nesting of the links.
   * @defaultValue 'straight'
   */
  variant?: ComponentVariants<Toc>['highlightVariant']
}

/** Props of `Toc`, a table of contents that tracks which heading of the page is in view. */
export type TocProps<T extends TocLink = TocLink> = {
  /**
   * The element or component the root renders as.
   * @defaultValue 'nav'
   */
  as?: PrimitiveProps['as']
  /**
   * The links to list, one per heading, nested with `children`.
   * @defaultValue []
   */
  links?: T[]
  /**
   * `list` renders the links as a sticky column that collapses behind its title below the `lg` breakpoint.
   * `floating` renders one mark per link and opens the links in a floating panel.
   * @defaultValue 'list'
   */
  variant?: ComponentVariants<Toc>['variant']
  /**
   * The title of the table of contents. The `floating` variant uses it as the accessible name of its marks and panel.
   * @defaultValue 'On this page'
   */
  title?: string
  /**
   * The color of the active link (and of the active mark in the `floating` variant).
   * @defaultValue 'accent'
   */
  color?: TocColor
  /**
   * Draws a line next to the `list` variant with the active links highlighted. An object sets its color and shape.
   * @defaultValue false
   */
  highlight?: boolean | TocHighlight
  /**
   * The icon of the collapsible trigger below the `lg` breakpoint (`list` variant). Defaults to an inline
   * `chevron-down` from Gravity UI Icons.
   */
  trailingIcon?: Component
  /**
   * The side of the page the `floating` variant sits on: the marks align to that edge and the panel opens towards
   * the other side.
   * @defaultValue 'right'
   */
  side?: ComponentVariants<Toc>['side']
  /**
   * How the marks open the panel of the `floating` variant. `hover` opens it after `delay` while the pointer rests
   * on the marks (a click pins it open); `press` opens and closes it on click only.
   * @defaultValue 'hover'
   */
  trigger?: 'hover' | 'press'
  /**
   * Delay in milliseconds before the panel opens once the pointer enters the marks (`trigger: 'hover'`).
   * @defaultValue 200
   */
  delay?: number
  /**
   * Delay in milliseconds before the panel closes once the pointer leaves the marks and the panel (`trigger: 'hover'`).
   * @defaultValue 300
   */
  closeDelay?: number
  /**
   * The controlled open state: the collapsible list below `lg` (`list`), or the panel (`floating`).
   * Can be bound with `v-model:open`.
   */
  open?: boolean
  /**
   * The open state when it is initially rendered. Use when you do not need to control it.
   * @defaultValue false
   */
  defaultOpen?: boolean
  /**
   * Renders the panel of the `floating` variant in a portal. `true` portals to `document.body`, a selector string or
   * element is used as the teleport target, and `false` disables portalling.
   * Falls back to `createHareUI({ portal })`, then `true`.
   */
  portal?: PortalTarget
  /** Additional classes merged into the root element. */
  class?: ClassValue
  /** Per-slot class overrides. */
  ui?: ComponentSlots<Toc>
}

/** Events emitted by `Toc`. */
export type TocEmits = {
  /** Emitted when the collapsible list or the floating panel opens or closes. */
  'update:open': [value: boolean]
  /** Emitted with the heading `id` after a link is clicked and the page scrolls to the heading. */
  move: [id: string]
}

/** Props passed to the `link` slot. */
export type TocLinkSlotProps<T extends TocLink = TocLink> = {
  /** The link being rendered. */
  link: T
  /** Whether its heading is in view. */
  active: boolean
  /** Its nesting level, `0` for top-level links. */
  level: number
}

/** Slots of `Toc`. */
export type TocSlots<T extends TocLink = TocLink> = {
  /** Content before the title in the trigger (`list` variant). */
  leading?: (props: { open: boolean; ui: TocUI }) => VNode[]
  /** Replaces the title text (`list` variant). */
  default?: (props: { open: boolean }) => VNode[]
  /** Replaces the chevron at the end of the trigger (`list` variant). */
  trailing?: (props: { open: boolean; ui: TocUI }) => VNode[]
  /** Replaces the list of links, in the `list` column and the floating panel. */
  content?: (props: { links: T[] }) => VNode[]
  /** Replaces the text of each link. */
  link?: (props: TocLinkSlotProps<T>) => VNode[]
  /** Content above the links (in the floating panel for the `floating` variant). */
  top?: (props: { links: T[] }) => VNode[]
  /** Content below the links (in the floating panel for the `floating` variant). Hidden below `lg` in the `list` variant. */
  bottom?: (props: { links: T[] }) => VNode[]
}
