<script lang="ts">
import type { AccordionRootProps, NavigationMenuContentProps } from 'reka-ui'
import type { Component } from 'vue'

import type { ComponentSlots, ComponentVariants } from '../../types/tv'
import type { AvatarProps } from '../avatar/Avatar.vue'
import type { BadgeProps } from '../badge/Badge.vue'
import type { ChipProps } from '../chip/Chip.vue'
import type { DropdownEntry } from '../dropdown/Dropdown.vue'
import type { TooltipProps } from '../tooltip/Tooltip.vue'
import theme from './theme'
import type { NavigationMenuPopoverProps } from './types'

export type { NavigationMenuPopoverProps } from './types'

type NavigationMenu = typeof theme

/** An icon: a class string (icon-font / CSS-mask utilities such as `i-lucide-house`) or a component. */
export type NavigationMenuIconValue = string | Component

export interface NavigationMenuChildItem extends Omit<NavigationMenuItem, 'type' | 'ui'> {
  /** Description, only shown when `orientation` is `horizontal`. */
  description?: string
  [key: string]: any
}

export interface NavigationMenuItem {
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
  class?: any
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
  [key: string]: any
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

export interface NavigationMenuProps<T extends NavigationMenuItem = NavigationMenuItem> {
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
  class?: any
  /** Per-slot class overrides. */
  ui?: ComponentSlots<NavigationMenu>
}

export interface NavigationMenuEmits {
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

export interface NavigationMenuSlots<T extends NavigationMenuItem = NavigationMenuItem> {
  /** Replaces the whole content of an item's link. */
  item?: (props: ItemSlotProps<T>) => any
  /** Replaces the leading icon, avatar or chip. */
  'item-leading'?: (props: ItemSlotProps<T>) => any
  /** Replaces the label text. */
  'item-label'?: (props: { item: T; index: number; active: boolean }) => any
  /** Replaces the trailing badge, kbds and chevron. */
  'item-trailing'?: (props: ItemSlotProps<T>) => any
  /**
   * Action buttons at the end of a vertical row, before the `actions` menu button: a sibling of the link, shown
   * on hover and focus. Style them with `ui.linkAction()`.
   */
  'item-actions'?: (props: ItemSlotProps<T>) => any
  /** Replaces the content of an item: the dropdown content (horizontal) or the collapsed-rail popover (vertical). */
  'item-content'?: (props: ItemSlotProps<T> & { close?: () => void }) => any
  /** Rendered before the lists, e.g. a logo in a horizontal menu. */
  'list-leading'?: () => any
  /** Rendered after the lists. */
  'list-trailing'?: () => any
  /** The `<slot>`, `<slot>-leading`, `<slot>-label`, `<slot>-trailing`, `<slot>-actions` and `<slot>-content` slots of the items whose `slot` field names them. */
  [slot: string]: ((props: ItemSlotProps<T> & { close?: () => void }) => any) | undefined
}
</script>

<script setup lang="ts" generic="T extends NavigationMenuItem = NavigationMenuItem">
import {
  AccordionRoot,
  NavigationMenuIndicator,
  NavigationMenuList,
  NavigationMenuRoot,
  NavigationMenuViewport,
} from 'reka-ui'
import { computed, onBeforeUnmount, provide, useSlots } from 'vue'

import { useComponentUI } from '../../composables/useComponentUI'
import { get, navigationMenuKey } from './context'
import NavigationMenuNode from './NavigationMenuNode.vue'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<NavigationMenuProps<T>>(), {
  orientation: 'horizontal',
  contentOrientation: 'horizontal',
  externalIcon: true,
  delayDuration: 0,
  type: 'multiple',
  collapsible: true,
  unmountOnHide: true,
  valueKey: 'value',
  labelKey: 'label',
  as: undefined,
  modelValue: undefined,
  defaultValue: undefined,
})
const emit = defineEmits<NavigationMenuEmits>()
const slots = useSlots()
defineSlots<NavigationMenuSlots<T>>()

const vertical = computed(() => props.orientation === 'vertical')
const collapsed = computed(() => !!props.collapsed)

const ui = useComponentUI('navigationMenu', theme, () => ({
  orientation: props.orientation,
  contentOrientation: vertical.value ? undefined : props.contentOrientation,
  collapsed: !!props.collapsed,
  color: props.color,
  variant: props.variant,
  highlight: !!props.highlight,
  highlightColor: props.highlightColor || props.color,
}))

const rootProps = computed(() => ({
  as: props.as,
  delayDuration: props.delayDuration,
  skipDelayDuration: props.skipDelayDuration,
  orientation: props.orientation,
  disableClickTrigger: props.disableClickTrigger,
  disableHoverTrigger: props.disableHoverTrigger,
  disablePointerLeaveClose: props.disablePointerLeaveClose,
  unmountOnHide: props.unmountOnHide,
}))
const accordionProps = computed(() => ({
  collapsible: props.collapsible,
  disabled: props.disabled,
  type: props.type,
  unmountOnHide: props.unmountOnHide,
}))
const tooltipProps = computed<TooltipProps>(() => ({
  ...(vertical.value ? { delay: 0, side: 'right' as const } : {}),
  ...(typeof props.tooltip === 'object' ? props.tooltip : {}),
}))
const popoverProps = computed<NavigationMenuPopoverProps>(() => ({
  mode: 'hover',
  side: 'right',
  align: 'start',
  ...(typeof props.popover === 'object' ? props.popover : {}),
}))

const lists = computed<NavigationMenuItem[][]>(() => {
  const items = props.items
  if (!items?.length) return []
  return Array.isArray(items[0])
    ? (items as NavigationMenuItem[][])
    : [items as NavigationMenuItem[]]
})

function getLabel(item: NavigationMenuItem) {
  return get(item, props.labelKey) as string | undefined
}

function getItemValue(item: NavigationMenuItem, index: number, level: number, listIndex: number) {
  const prefix = lists.value.length > 1 ? `group-${listIndex}-` : ''
  return (
    (get(item, props.valueKey) as string | undefined) ??
    (level > 0 ? `${prefix}item-${level}-${index}` : `${prefix}item-${index}`)
  )
}

function getAccordionDefaultValue(list: NavigationMenuItem[], level = 0, listIndex = 0) {
  const open = list.reduce<string[]>((acc, item, index) => {
    if (item.defaultOpen || item.open) acc.push(getItemValue(item, index, level, listIndex))
    return acc
  }, [])
  return props.type === 'single' ? open[0] : open
}

function listProps(list: NavigationMenuItem[], listIndex: number) {
  if (!vertical.value || collapsed.value) return {}
  return {
    ...accordionProps.value,
    modelValue: props.modelValue,
    defaultValue: props.defaultValue ?? getAccordionDefaultValue(list, 0, listIndex),
    'onUpdate:modelValue': (value: string | string[] | undefined) =>
      emit('update:modelValue', value),
  }
}

// One observer for every row's actions. The link's end padding is what the buttons cover of the row (their
// width plus their end inset) and a 12px gap before the label. Hidden actions (`display: none`) fall back to
// the one-button default.
let actionsObserver: ResizeObserver | undefined
function observeActions(el: HTMLElement) {
  if (typeof ResizeObserver === 'undefined') return () => {}
  actionsObserver ??= new ResizeObserver((entries) => {
    for (const { target } of entries) {
      const row = target.parentElement
      if (!row) continue
      const box = target.getBoundingClientRect()
      if (!box.width) {
        row.style.removeProperty('--navigation-menu-actions-inset')
        continue
      }
      const rowBox = row.getBoundingClientRect()
      const covered =
        getComputedStyle(row).direction === 'rtl'
          ? box.right - rowBox.left
          : rowBox.right - box.left
      row.style.setProperty('--navigation-menu-actions-inset', `${covered + 12}px`)
    }
  })
  actionsObserver.observe(el)
  return () => actionsObserver?.unobserve(el)
}
onBeforeUnmount(() => actionsObserver?.disconnect())

provide(navigationMenuKey, {
  props: props as unknown as NavigationMenuProps,
  ui: ui as never,
  slots,
  accordionProps,
  tooltipProps,
  popoverProps,
  getLabel,
  getItemValue,
  getAccordionDefaultValue,
  observeActions,
})
</script>

<template>
  <NavigationMenuRoot
    data-slot="root"
    v-bind="{
      ...rootProps,
      ...(vertical
        ? {}
        : {
            modelValue: props.modelValue as string | undefined,
            defaultValue: props.defaultValue as string | undefined,
            'onUpdate:modelValue': (value: string) => emit('update:modelValue', value),
          }),
      ...$attrs,
    }"
    :data-collapsed="props.collapsed"
    :class="ui.root({ class: [props.ui?.root, props.class] })"
  >
    <slot name="list-leading" />

    <template v-for="(list, listIndex) in lists" :key="`list-${listIndex}`">
      <component
        :is="vertical && !collapsed ? AccordionRoot : NavigationMenuList"
        v-bind="listProps(list, listIndex)"
        as="ul"
        data-slot="list"
        :class="ui.list({ class: props.ui?.list })"
      >
        <NavigationMenuNode
          v-for="(item, index) in list"
          :key="`list-${listIndex}-${index}`"
          :item="item"
          :index="index"
          :list-index="listIndex"
        />
      </component>

      <div
        v-if="vertical && listIndex < lists.length - 1"
        role="separator"
        data-slot="separator"
        :class="ui.separator({ class: props.ui?.separator })"
      />
    </template>

    <slot name="list-trailing" />

    <div
      v-if="!vertical"
      data-slot="viewportWrapper"
      :class="ui.viewportWrapper({ class: props.ui?.viewportWrapper })"
    >
      <NavigationMenuIndicator
        v-if="props.arrow"
        data-slot="indicator"
        :class="ui.indicator({ class: props.ui?.indicator })"
      >
        <div data-slot="arrow" :class="ui.arrow({ class: props.ui?.arrow })" />
      </NavigationMenuIndicator>

      <NavigationMenuViewport
        v-bind="props.viewport"
        data-slot="viewport"
        :class="ui.viewport({ class: props.ui?.viewport })"
      />
    </div>
  </NavigationMenuRoot>
</template>
