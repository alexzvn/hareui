import type { Component, VNode } from 'vue'

import type { ComponentSlots } from '@/types/tv'
import type { ClassValue } from '@/utils/tv'

import type theme from './theme'

/** Props of `CheckboxButtonGroupItem`: one selectable card inside a `CheckboxButtonGroup`. */
export type CheckboxButtonGroupItemProps = {
  /** The value added to / removed from the group's `v-model` when the item is toggled. */
  value: string
  /** The item title. */
  label?: string
  /** Help text rendered below the title. */
  description?: string
  /** Leading icon: an icon class (`i-lucide-cloud`) or a component. */
  icon?: string | Component
  /**
   * Whether the item is disabled.
   * @defaultValue false
   */
  disabled?: boolean
  /**
   * Whether to render the selection indicator in the top-right corner. Set `false` to rely on the selected ring alone.
   * @defaultValue true
   */
  indicator?: boolean
  /** The id of the item's checkbox. Generated when omitted. */
  id?: string
  /** Additional classes merged into the card. */
  class?: ClassValue
  /** Per-slot class overrides for this item. Merged after the group's `ui`. */
  ui?: Omit<ComponentSlots<typeof theme>, 'base'>
}

/** Selection state passed to every `CheckboxButtonGroupItem` slot. */
export type CheckboxButtonGroupItemSlotProps = {
  /** Whether the item is selected. */
  selected: boolean
  /** Whether the item is disabled, directly or through the group. */
  disabled: boolean
}

/** Slots of `CheckboxButtonGroupItem`: extra content plus overrides for the title, description, icon and selection indicator. */
export type CheckboxButtonGroupItemSlots = {
  /** Extra content rendered after the title and description. */
  default?: (props: CheckboxButtonGroupItemSlotProps) => VNode[]
  /** The title content. Replaces the `label` prop. */
  label?: (props: CheckboxButtonGroupItemSlotProps) => VNode[]
  /** The description content. Replaces the `description` prop. */
  description?: (props: CheckboxButtonGroupItemSlotProps) => VNode[]
  /** The leading icon. Replaces the `icon` prop. */
  icon?: (props: CheckboxButtonGroupItemSlotProps) => VNode[]
  /** A custom indicator icon, shown in accent color while the item is selected. Replaces the default checkbox. */
  indicator?: (props: CheckboxButtonGroupItemSlotProps) => VNode[]
}
