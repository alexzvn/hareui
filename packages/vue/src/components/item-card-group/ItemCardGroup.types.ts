import type { VNode } from 'vue'

import type { ComponentSlots, ComponentVariants } from '@/types/tv'
import type { ClassValue } from '@/utils/tv'

import type theme from './theme'

type ItemCardGroup = typeof theme

/** The visual style of an `ItemCardGroup`, also the default of the ItemCards inside it. */
export type ItemCardGroupVariant = NonNullable<ComponentVariants<ItemCardGroup>['variant']>

/** How an `ItemCardGroup` arranges its cards. */
export type ItemCardGroupLayout = NonNullable<ComponentVariants<ItemCardGroup>['layout']>

/** Props of `ItemCardGroup`, which groups ItemCards as a divided list or a grid, with an optional heading. */
export type ItemCardGroupProps = {
  /**
   * `list` stacks the cards on one shared surface with a divider between them; `grid` lays them out in columns,
   * each on its own surface. Exposed as `data-layout`.
   * @defaultValue 'list'
   */
  layout?: ItemCardGroupLayout
  /**
   * Visual style of the group, passed down as the default `variant` of every ItemCard inside it.
   * @defaultValue 'default'
   */
  variant?: ItemCardGroupVariant
  /**
   * The number of grid columns. Only used with `layout="grid"`, as the `--item-card-group-columns` CSS variable.
   * @defaultValue 2
   */
  columns?: 2 | 3
  /** The group heading, rendered as an `h3` and used as the group's accessible name. */
  title?: string
  /** Secondary text under the heading. */
  description?: string
  /** Additional classes merged into the root element. */
  class?: ClassValue
  /** Per-slot class overrides. */
  ui?: ComponentSlots<ItemCardGroup>
}

/** Slots of `ItemCardGroup`. */
export type ItemCardGroupSlots = {
  /** Replaces the content of the header (title and description); the header keeps its padding. */
  header?: () => VNode[]
  /** Replaces the title text. */
  title?: () => VNode[]
  /** Replaces the description text. */
  description?: () => VNode[]
  /** The ItemCards. */
  default?: () => VNode[]
}
