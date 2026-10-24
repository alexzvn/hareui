import type { VNode } from 'vue'

import type { ExpandedValue } from '@/composables/useExpandedValues'
import type { ComponentSlots, ComponentVariants } from '@/types/tv'
import type { ClassValue } from '@/utils/tv'

import type theme from './theme'

type Accordion = typeof theme

export type AccordionItem = {
  /** The trigger text, shown unless `#label` is used. */
  label?: string
  /** The value identifying this item (HeroUI's `id`). Defaults to the item's index. */
  value?: ExpandedValue
  /** Whether this item is disabled. */
  disabled?: boolean
  /** Name of a dynamic slot to render this item's body, taking precedence over `#content`. */
  slot?: string
  /** Fallback body text, used when no `#content`/`[item.slot]` slot is provided. */
  content?: string
  /** Extra fields (icons, subtitles, …) are passed through to the slots as `item`. */
  [key: string]: unknown
}

export type AccordionProps<T extends AccordionItem = AccordionItem> = {
  /** The items to render. */
  items: T[]
  /** The expanded item values. Use `v-model` to control them. */
  modelValue?: ExpandedValue[]
  /** The values expanded on first render (uncontrolled). */
  defaultValue?: ExpandedValue[]
  /**
   * Whether multiple items can be expanded at once (HeroUI's `allowsMultipleExpanded`).
   * @defaultValue false
   */
  multiple?: boolean
  /**
   * Whether the entire accordion is disabled.
   * @defaultValue false
   */
  disabled?: boolean
  /**
   * The visual variant of the accordion.
   * @defaultValue 'default'
   */
  variant?: ComponentVariants<Accordion>['variant']
  /**
   * Hide separator lines between accordion items.
   * @defaultValue false
   */
  hideSeparator?: boolean
  /** Additional classes merged into the root element. */
  class?: ClassValue
  /** Per-slot class overrides. */
  ui?: ComponentSlots<Accordion>
}

/** Props passed to every per-item slot. */
export type ItemSlotProps<T extends AccordionItem = AccordionItem> = {
  item: T
  index: number
  open: boolean
}

export type AccordionSlots<T extends AccordionItem = AccordionItem> = {
  /** Rendered in the trigger before the label (e.g. an icon). */
  leading?: (props: ItemSlotProps<T>) => VNode[]
  /** Replaces the trigger's label text. */
  label?: (props: ItemSlotProps<T>) => VNode[]
  /**
   * Replaces the chevron (HeroUI's `Accordion.Indicator` children). A single root element
   * receives the themed indicator classes and `data-expanded`, so it rotates like the default.
   */
  indicator?: (props: ItemSlotProps<T>) => VNode[]
  /** Body content for every item, overridden by `[item.slot]`. */
  content?: (props: ItemSlotProps<T>) => VNode[]
  /** Body content of the items whose `slot` names it. */
  [slot: string]: ((props: ItemSlotProps<T>) => VNode[]) | undefined
}

export type AccordionEmits = {
  /** Emitted when the expanded items change. */
  'update:modelValue': [value: ExpandedValue[]]
}
