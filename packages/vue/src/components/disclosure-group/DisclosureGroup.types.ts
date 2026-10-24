import type { PrimitiveProps } from 'reka-ui'
import type { VNode } from 'vue'

import type { ExpandedValue } from '@/composables/useExpandedValues'
import type { ComponentSlots } from '@/types/tv'
import type { ClassValue } from '@/utils/tv'

import type theme from './theme'

type DisclosureGroup = typeof theme

export type DisclosureGroupProps = {
  /**
   * The element or component to render the root as.
   * @defaultValue 'div'
   */
  as?: PrimitiveProps['as']
  /** The expanded disclosures' `value`s. Use `v-model` to control them. */
  modelValue?: ExpandedValue[]
  /** The disclosures expanded on first render (uncontrolled). */
  defaultValue?: ExpandedValue[]
  /**
   * Whether multiple disclosures can be expanded at once (HeroUI's `allowsMultipleExpanded`).
   * @defaultValue false
   */
  multiple?: boolean
  /**
   * Whether all disclosures in the group are disabled.
   * @defaultValue false
   */
  disabled?: boolean
  /** Additional classes merged into the root element. */
  class?: ClassValue
  /** Per-slot class overrides. */
  ui?: ComponentSlots<DisclosureGroup>
}

export type DisclosureGroupSlots = {
  /** The `Disclosure` items (and anything between them, e.g. `Separator`). */
  default?: (props: { expanded: ExpandedValue[]; disabled: boolean }) => VNode[]
}

export type DisclosureGroupEmits = {
  /** Emitted when the expanded disclosures change. */
  'update:modelValue': [value: ExpandedValue[]]
}
