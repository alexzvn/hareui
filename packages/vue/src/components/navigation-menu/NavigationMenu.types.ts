import type { AccordionRootProps, NavigationMenuContentProps } from 'reka-ui'
import type { Component, VNode } from 'vue'

import type { AvatarProps } from '@/components/avatar/Avatar.types'
import type { BadgeProps } from '@/components/badge/Badge.types'
import type { ChipProps } from '@/components/chip/Chip.types'
import type { DropdownEntry } from '@/components/dropdown/Dropdown.types'
import type { TooltipProps } from '@/components/tooltip/Tooltip.types'
import type { ComponentSlots, ComponentVariants } from '@/types/tv'
import type { ClassValue } from '@/utils/tv'

import type theme from './theme'
import type { NavigationMenuPopoverProps } from './types'

export type { NavigationMenuPopoverProps } from './types'

type NavigationMenu = typeof theme

/** An icon: a class string (icon-font / CSS-mask utilities such as `i-lucide-house`) or a component. */
export type NavigationMenuIconValue = string | Component

export type NavigationMenuChildItem = {
  /** Description, only shown when `orientation` is `horizontal`. */
  description?: string
  /** Extra fields are passed through to the slots as `item`. */
  [key: string]: unknown
} & Omit<NavigationMenuItemFields, 'type' | 'ui'>

/** The known fields of an item, kept apart from the index signature so `Omit` preserves them. */
type NavigationMenuItemFields = {
  /** The item text. */
  label?: string
  /** Leading icon: a class string or a component. */
  icon?: NavigationMenuIconValue
  /** Leading avatar, shown instead of the icon. */
  avatar?: AvatarProps
  /**
   * Trailing label badge (a `Chip`). A string or number is used as its label.
   * `{ size: 'sm', variant: 'tertiary' }`{lang="ts-type"}
   */
  badge?: string | number | ChipProps
  /**
   * A dot or counter anchored to the icon (a `Badge`). Needs `icon`.
   * `{ color: 'accent', size: 'sm' }`{lang="ts-type"}
   */
  chip?: boolean | BadgeProps
  /**
   * Keyboard shortcut shown on the right. Entries naming a modifier or special key (`'command'`,
   * `'shift'`, `'ctrl'`, `'option'`, `'enter'`, ...) render as its symbol, the rest as text.
   */
  kbds?: string[]
  /**
   * Show a tooltip with the item's label.
   * In `vertical` orientation it only works when the menu is `collapsed`; in `horizontal` it works on any item.
   */
  tooltip?: boolean | TooltipProps
  /** Show a popover with the children list when the vertical menu is `collapsed`. Takes priority over the `popover` prop. */
  popover?: boolean | NavigationMenuPopoverProps
  /**
   * The entries of a menu opened from a ⋮ button at the end of the row, in a
   * vertical menu that isn't `collapsed`. Takes the `Dropdown` items, plus `icon` (a class string or a
   * component) and `onSelect` on each entry.
   */
  actions?: DropdownEntry[]
  /** The icon at the end of the item, replacing the chevron shown for items with children. */
  trailingIcon?: NavigationMenuIconValue
  /**
   * The kind of item. `label` is a group heading (vertical only), `trigger` forces an item that has
   * children and a link to act as a collapsible button instead.
   * @defaultValue 'link'
   */
  type?: 'label' | 'trigger' | 'link'
  /** Name of the slots (`#<slot>`, `#<slot>-leading`, `#<slot>-label`, `#<slot>-trailing`, `#<slot>-actions`, `#<slot>-content`) that render this item. */
  slot?: string
  /**
   * The value of the item. Avoid using the index as the value, it conflicts in horizontal orientation.
   * @defaultValue `item-${index}`, `item-${level}-${index}` for nested children, `group-${listIndex}-item-${index}` in grouped lists
   */
  value?: string
  /** The children: an accordion in the vertical menu, a dropdown content in the horizontal one. */
  children?: NavigationMenuChildItem[]
  /** Whether the children are expanded initially (vertical, uncontrolled). */
  defaultOpen?: boolean
  /** Same as `defaultOpen`. */
  open?: boolean
  /** Called when the item is selected (clicked or activated with the keyboard). */
  onSelect?: (e: Event) => void
  /** Whether the item is the current location. Overrides the router match. */
  active?: boolean
  /** Whether the item is disabled. */
  disabled?: boolean
  /** The URL to link to. A vue-router location is passed to `RouterLink` when the app has it, a string renders a plain anchor. */
  href?: string
  /** A route location (vue-router) or URL. */
  to?: string | Record<string, unknown>
  /** The element or component to render the link as, e.g. a router link component. */
  as?: string | Component
  /** The link `target`. `_blank` also shows the external icon. */
  target?: '_blank' | '_parent' | '_self' | '_top' | (string & {}) | null
  /** The link `rel`. Defaults to `noopener noreferrer` for `_blank`. */
  rel?: string | null
  /** The link `download` attribute. */
  download?: boolean | string
  /** Treat the link as external: never route it through `RouterLink`. */
  external?: boolean
  /** With a router, only match the exact route as active. */
  exact?: boolean
  /** With a router, replace the history entry instead of pushing. */
  replace?: boolean
  /** Additional classes merged into the item's link. */
  class?: ClassValue
  /** Per-slot class overrides for this item. */
  ui?: Partial<
    Pick<
      ComponentSlots<NavigationMenu>,
      | 'item'
      | 'linkLeadingAvatar'
      | 'linkLeadingIcon'
      | 'linkLeadingChip'
      | 'linkLabel'
      | 'linkLabelExternalIcon'
      | 'linkTrailing'
      | 'linkTrailingBadge'
      | 'linkTrailingKbd'
      | 'linkTrailingIcon'
      | 'linkRow'
      | 'linkActions'
      | 'linkAction'
      | 'linkActionsMenu'
      | 'linkActionsItemIcon'
      | 'label'
      | 'link'
      | 'content'
      | 'childList'
      | 'childLabel'
      | 'childItem'
      | 'childLink'
      | 'childLinkIcon'
      | 'childLinkWrapper'
      | 'childLinkLabel'
      | 'childLinkLabelExternalIcon'
      | 'childLinkDescription'
    >
  >
}

export type NavigationMenuItem = NavigationMenuItemFields & {
  /** Extra fields are passed through to the slots as `item`. */
  [key: string]: unknown
}

/** Options for the dropdown content of horizontal items with children. */
export type NavigationMenuContentOptions = Omit<
  NavigationMenuContentProps,
  'as' | 'asChild' | 'forceMount'
> & {
  onEscapeKeyDown?: (event: KeyboardEvent) => void
  onPointerDownOutside?: (event: Event) => void
  onFocusOutside?: (event: Event) => void
  onInteractOutside?: (event: Event) => void
}

export type NavigationMenuProps<T extends NavigationMenuItem = NavigationMenuItem> = {
  /**
   * The element or component this component should render as.
   * @defaultValue 'nav'
   */
  as?: AccordionRootProps['as']
  /**
   * Whether a `single` or `multiple` vertical items can be open at a time. Only works when `orientation` is `vertical`.
   * @defaultValue 'multiple'
   */
  type?: 'single' | 'multiple'
  /**
   * The controlled value of the open item(s). Can be bound with `v-model`.
   * - horizontal: a `string` (the item whose content is open)
   * - vertical, `type="single"`: a `string`
   * - vertical, `type="multiple"`: a `string[]`
   */
  modelValue?: string | string[]
  /** The value(s) open initially. Use when you do not need to control them. */
  defaultValue?: string | string[]
  /** The icon displayed to open an item with children, replacing the chevron. */
  trailingIcon?: NavigationMenuIconValue
  /**
   * The icon displayed after the label of `target="_blank"` items. `false` hides it.
   * @defaultValue true
   */
  externalIcon?: boolean | NavigationMenuIconValue
  /** The items: a flat array, or an array of arrays to render groups separated by a divider (vertical). */
  items?: T[] | T[][]
  /**
   * The color of the active item.
   * @defaultValue 'default'
   */
  color?: ComponentVariants<NavigationMenu>['color']
  /**
   * The style of the items: `pill` fills the hovered, open and active ones, `link` only changes their text.
   * @defaultValue 'pill'
   */
  variant?: ComponentVariants<NavigationMenu>['variant']
  /**
   * The orientation of the menu: a navbar row (horizontal) or a sidebar list (vertical).
   * @defaultValue 'horizontal'
   */
  orientation?: 'horizontal' | 'vertical'
  /**
   * Collapse the menu to only show icons. Only works when `orientation` is `vertical`.
   * @defaultValue false
   */
  collapsed?: boolean
  /**
   * Show a tooltip with the label on the items. Only works when `orientation` is `vertical` and `collapsed` is `true`.
   * `{ delay: 0, side: 'right' }`{lang="ts-type"}
   * @defaultValue false
   */
  tooltip?: boolean | TooltipProps
  /**
   * Show a popover with the children list on the items when the menu is `collapsed`.
   * `{ mode: 'hover', side: 'right', align: 'start' }`{lang="ts-type"}
   * @defaultValue false
   */
  popover?: boolean | NavigationMenuPopoverProps
  /** Display a line next to the active item. */
  highlight?: boolean
  /**
   * The color of the highlight line. Defaults to `color`.
   * @defaultValue 'default'
   */
  highlightColor?: ComponentVariants<NavigationMenu>['highlightColor']
  /** Options of the content of horizontal items with children. */
  content?: NavigationMenuContentOptions
  /**
   * The orientation of the content. Only works when `orientation` is `horizontal`.
   * @defaultValue 'horizontal'
   */
  contentOrientation?: ComponentVariants<NavigationMenu>['contentOrientation']
  /** Options of the viewport. Only works when `orientation` is `horizontal` and `contentOrientation` is `vertical`. */
  viewport?: { align?: 'start' | 'center' | 'end' }
  /**
   * Display an arrow alongside the content of horizontal items.
   * @defaultValue false
   */
  arrow?: boolean
  /**
   * The key used to get the value from an item.
   * @defaultValue 'value'
   */
  valueKey?: string
  /**
   * The key used to get the label from an item.
   * @defaultValue 'label'
   */
  labelKey?: string
  /**
   * Whether the vertical items can all be closed in `single` mode.
   * @defaultValue true
   */
  collapsible?: boolean
  /** Disable all the vertical collapsible items. */
  disabled?: boolean
  /**
   * The duration in milliseconds from when the pointer enters a trigger until its content opens. Horizontal only.
   * @defaultValue 0
   */
  delayDuration?: number
  /**
   * How much time in milliseconds a user has to enter another trigger without incurring a delay again. Horizontal only.
   * @defaultValue 300
   */
  skipDelayDuration?: number
  /** Content cannot be opened by clicking its trigger. Horizontal only. */
  disableClickTrigger?: boolean
  /** Content cannot be opened by hovering its trigger. Horizontal only. */
  disableHoverTrigger?: boolean
  /** Content stays open when the pointer leaves the menu. Horizontal only. */
  disablePointerLeaveClose?: boolean
  /**
   * Unmount the content of closed items.
   * @defaultValue true
   */
  unmountOnHide?: boolean
  /** Additional classes merged into the root element. */
  class?: ClassValue
  /** Per-slot class overrides. */
  ui?: ComponentSlots<NavigationMenu>
}

export type NavigationMenuEmits = {
  /**
   * Emitted when the open item(s) change: a `string` (horizontal and vertical `single`) or a `string[]` (vertical `multiple`).
   */
  'update:modelValue': [value: string | string[] | undefined]
}

type ItemSlotProps<T extends NavigationMenuItem = NavigationMenuItem> = {
  item: T
  index: number
  active: boolean
  ui: Record<string, (props?: object) => string>
}

export type NavigationMenuSlots<T extends NavigationMenuItem = NavigationMenuItem> = {
  /** Replaces the whole content of an item's link. */
  item?: (props: ItemSlotProps<T>) => VNode[]
  /** Replaces the leading icon, avatar or chip. */
  'item-leading'?: (props: ItemSlotProps<T>) => VNode[]
  /** Replaces the label text. */
  'item-label'?: (props: { item: T; index: number; active: boolean }) => VNode[]
  /** Replaces the trailing badge, kbds and chevron. */
  'item-trailing'?: (props: ItemSlotProps<T>) => VNode[]
  /**
   * Action buttons at the end of a vertical row, before the `actions` menu button: a sibling of the link, shown
   * on hover and focus. Style them with `ui.linkAction()`.
   */
  'item-actions'?: (props: ItemSlotProps<T>) => VNode[]
  /** Replaces the content of an item: the dropdown content (horizontal) or the collapsed-rail popover (vertical). */
  'item-content'?: (props: ItemSlotProps<T> & { close?: () => void }) => VNode[]
  /** Rendered before the lists, e.g. a logo in a horizontal menu. */
  'list-leading'?: () => VNode[]
  /** Rendered after the lists. */
  'list-trailing'?: () => VNode[]
  /** The `<slot>`, `<slot>-leading`, `<slot>-label`, `<slot>-trailing`, `<slot>-actions` and `<slot>-content` slots of the items whose `slot` field names them. */
  [slot: string]: ((props: ItemSlotProps<T> & { close?: () => void }) => VNode[]) | undefined
}
