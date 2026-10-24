import type { VNode } from 'vue'

import type { ComponentSlots, ComponentVariants } from '@/types/tv'
import type { ClassValue } from '@/utils/tv'

import type theme from './theme'

type Tabs = typeof theme

export type TabsItem = {
  /** The tab's label, shown in the trigger unless `#tab` is used. */
  label?: string
  /** The value identifying this tab. Defaults to the item's index (as a string). */
  value?: string | number
  /** Whether this tab is disabled. */
  disabled?: boolean
  /** Name of a dynamic slot to render this item's panel content, taking precedence over `#content`. */
  slot?: string
  /** Fallback panel text, used when no `#content`/`[item.slot]` slot is provided. */
  content?: string
}

export type TabsProps<T extends TabsItem = TabsItem> = {
  /** The tabs to render. */
  items: T[]
  /** The selected tab value. Use `v-model` to control it. */
  modelValue?: string | number
  /**
   * The value of the tab selected by default (uncontrolled).
   * @defaultValue the first enabled item's value
   */
  defaultValue?: string | number
  /**
   * Layout direction of the tab list.
   * @defaultValue 'horizontal'
   */
  orientation?: ComponentVariants<Tabs>['orientation']
  /**
   * Visual style of the tabs.
   * @defaultValue 'primary'
   */
  variant?: ComponentVariants<Tabs>['variant']
  /**
   * Alignment of the tab labels.
   * @defaultValue 'center'
   */
  align?: ComponentVariants<Tabs>['align']
  /**
   * Whether to render a panel for every item.
   * @defaultValue true
   */
  content?: boolean
  /**
   * Whether to render a separator between tabs. HeroUI separators are opt-in
   * via `<Tabs.Separator/>`.
   * @defaultValue false
   */
  separator?: boolean
  /** Additional classes merged into the root element. */
  class?: ClassValue
  /** Per-slot class overrides. */
  ui?: ComponentSlots<Tabs>
}

export type TabsSlots<T extends TabsItem = TabsItem> = {
  /** Replaces a tab's label. */
  tab?: (props: { item: T; index: number; selected: boolean }) => VNode[]
  /** Fallback panel content for every item, overridden by `[item.slot]`. */
  content?: (props: { item: T; index: number }) => VNode[]
  /** Panel content of the items whose `slot` names it. */
  [slot: string]:
    | ((props: { item: T; index: number; selected: boolean }) => VNode[])
    | ((props: { item: T; index: number }) => VNode[])
    | undefined
}
