import type { VNode } from 'vue'

import type { IconValue } from '@/types/icon'
import type { ComponentSlots } from '@/types/tv'
import type { ClassValue } from '@/utils/tv'

import type theme from './theme'

/** Props of `RadioButtonGroupItem`: one selectable card of a `RadioButtonGroup`. */
export type RadioButtonGroupItemProps = {
  /** The value submitted and bound to the group's `v-model` when the item is selected. */
  value: string
  /** The item title. */
  label?: string
  /** Help text rendered below the title. */
  description?: string
  /** Leading icon: a class string (such as `i-lucide-truck`) or a component. */
  icon?: IconValue
  /**
   * Whether the item is disabled.
   * @defaultValue false
   */
  disabled?: boolean
  /**
   * Whether to show the selection indicator in the top-end corner.
   * @defaultValue true
   */
  indicator?: boolean
  /** The id of the item's radio. Generated when omitted. */
  id?: string
  /** Additional classes merged into the card. */
  class?: ClassValue
  /** Per-slot class overrides for this item. Merged after the group's `ui`. */
  ui?: Omit<ComponentSlots<typeof theme>, 'base'>
}

/** Props every `RadioButtonGroupItem` slot receives. */
export type RadioButtonGroupItemSlotProps = {
  /** Whether the item is selected. */
  selected: boolean
  /** Whether the item is disabled, directly or through the group. */
  disabled: boolean
}

/** Slots of `RadioButtonGroupItem`. */
export type RadioButtonGroupItemSlots = {
  /** Extra content rendered after the title and description. */
  default?: (props: RadioButtonGroupItemSlotProps) => VNode[]
  /** The title content. Replaces the `label` prop. */
  label?: (props: RadioButtonGroupItemSlotProps) => VNode[]
  /** The description content. Replaces the `description` prop. */
  description?: (props: RadioButtonGroupItemSlotProps) => VNode[]
  /** The leading icon. Replaces the `icon` prop. */
  icon?: (props: RadioButtonGroupItemSlotProps) => VNode[]
  /** A custom indicator icon, shown in accent color while the item is selected. Replaces the radio dot. */
  indicator?: (props: RadioButtonGroupItemSlotProps) => VNode[]
}
