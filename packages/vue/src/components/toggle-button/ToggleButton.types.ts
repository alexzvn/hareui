import type { PrimitiveProps } from 'reka-ui'
import type { VNode } from 'vue'

import type { ComponentSlots, ComponentVariants } from '@/types/tv'
import type { ClassValue } from '@/utils/tv'

import type theme from './theme'

type ToggleButton = typeof theme

/** Props of `ToggleButton`: a button that toggles between selected and unselected, on its own or inside a `ToggleButtonGroup`. */
export type ToggleButtonProps = {
  /**
   * The element or component to render as.
   * @defaultValue 'button'
   */
  as?: PrimitiveProps['as']
  /**
   * Visual style of the toggle button.
   * @defaultValue 'default'
   */
  variant?: ComponentVariants<ToggleButton>['variant']
  /**
   * Size of the toggle button. Inside a `ToggleButtonGroup`, defaults to the group's size.
   * @defaultValue 'md'
   */
  size?: ComponentVariants<ToggleButton>['size']
  /**
   * Whether the button only contains an icon (square shape).
   * @defaultValue false
   */
  iconOnly?: boolean
  /**
   * Whether the toggle button is disabled. Inside a disabled `ToggleButtonGroup`, `:disabled="false"` re-enables it.
   * @defaultValue false
   */
  disabled?: boolean
  /** The selected state (controlled, `v-model`). Ignored inside a `ToggleButtonGroup`. */
  modelValue?: boolean
  /**
   * The initial selected state when uncontrolled. Ignored inside a `ToggleButtonGroup`.
   * @defaultValue false
   */
  defaultValue?: boolean
  /** Identifies the button inside a `ToggleButtonGroup`; the group's `v-model` holds these values. */
  value?: string
  /** Additional classes merged into the root element. */
  class?: ClassValue
  /** Per-slot class overrides. */
  ui?: ComponentSlots<ToggleButton>
}

/** State passed to the `ToggleButton` default slot. */
export type ToggleButtonSlotProps = {
  /** Whether the button is selected (pressed). */
  selected: boolean
  /** Whether the button is disabled, directly, through its `ToggleButtonGroup` or an enclosing disabled fieldset. */
  disabled: boolean
}

/** Slots of `ToggleButton`. */
export type ToggleButtonSlots = {
  /** The button content. */
  default?: (props: ToggleButtonSlotProps) => VNode[]
}
