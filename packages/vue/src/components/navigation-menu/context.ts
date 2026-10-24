import type { ComputedRef, InjectionKey, Slots, VNode } from 'vue'
import { Comment, Fragment, h, inject } from 'vue'

import type { TooltipProps } from '@/components/tooltip/Tooltip.types'
import type { ClassValue } from '@/utils/tv'

import type { NavigationMenuItem, NavigationMenuProps } from './NavigationMenu.types'
import type theme from './theme'
import type { NavigationMenuPopoverProps } from './types'

type Theme = typeof theme
type SlotName = keyof Theme['slots']

type SlotArgs = {
  class?: ClassValue
  active?: boolean
  disabled?: boolean
  level?: boolean
  actions?: boolean
  danger?: boolean
}

/** Where an item sits in the menu: its index in its list, nesting level and top-level list index. */
export type NavigationMenuItemPosition = {
  index: number
  level: number
  listIndex: number
}

/** The resolved slot class functions; link slots take per-item variants on top of the root ones. */
export type NavigationMenuUI = Record<SlotName, (props?: SlotArgs) => string>

export type NavigationMenuContext = {
  props: NavigationMenuProps
  ui: ComputedRef<NavigationMenuUI>
  slots: Slots
  accordionProps: ComputedRef<Record<string, unknown>>
  tooltipProps: ComputedRef<TooltipProps>
  popoverProps: ComputedRef<NavigationMenuPopoverProps>
  getLabel: (item: NavigationMenuItem) => string | undefined
  getItemValue: (item: NavigationMenuItem, position: NavigationMenuItemPosition) => string
  getAccordionDefaultValue: (
    list: NavigationMenuItem[],
    position: Omit<NavigationMenuItemPosition, 'index'>,
  ) => string | string[] | undefined
  /**
   * Tracks the width of a row's actions container and writes the end padding its link needs
   * (`--navigation-menu-actions-inset` on the row). Returns the cleanup.
   */
  observeActions: (el: HTMLElement) => () => void
}

export const navigationMenuKey: InjectionKey<NavigationMenuContext> =
  Symbol('hareui-navigation-menu')

export const useNavigationMenu = (): NavigationMenuContext => {
  const context = inject(navigationMenuKey)
  if (!context) throw new Error('NavigationMenu parts must be used inside <NavigationMenu>')

  return context
}

/** Reads a (possibly dotted) path from an item (dotted-path getter). */
export const get = (item: unknown, path: string): unknown => {
  let value: unknown = item
  for (const key of path.split('.')) {
    if (value === null || typeof value !== 'object') return undefined
    value = (value as Record<string, unknown>)[key]
  }

  return value
}

// Comments are empty; fragments count when any child has content.
const isContentNode = (node: VNode): boolean => {
  if (node.type === Comment) return false

  return node.type === Fragment ? hasContent(node.children as VNode[]) : true
}

/** Whether rendered slot output has content (Vue's own rule for falling back to slot defaults). */
export const hasContent = (nodes: VNode[] | undefined): boolean => {
  return !!nodes?.some(isContentNode)
}

/** Slot names an item resolves to: its own `slot` field, falling back to the generic one. */
export const slotName = (
  item: NavigationMenuItem,
  suffix: '' | 'leading' | 'label' | 'trailing' | 'content' | 'actions',
): string => {
  const base = item.slot || 'item'
  return suffix ? `${base}-${suffix}` : base
}

/**
 * Renders a named slot of the root `NavigationMenu` with this component's default slot as the
 * fallback, so the item templates can live in separate components.
 */
export const SlotOutlet = (
  props: { name: string; slotProps?: Record<string, unknown> },
  { slots }: { slots: Slots },
) => {
  const root = inject(navigationMenuKey)
  const render = root?.slots[props.name]
  if (render) {
    const nodes = render(props.slotProps ?? {})
    if (hasContent(nodes)) return nodes
  }

  // An empty array without a fallback: the server renderer can't render a Fragment with `null` children.
  return h(Fragment, null, slots.default?.() ?? [])
}

SlotOutlet.props = ['name', 'slotProps']
