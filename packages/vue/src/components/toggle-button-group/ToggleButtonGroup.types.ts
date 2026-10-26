import type { PrimitiveProps } from 'reka-ui'
import type { VNode } from 'vue'

import type { ToggleButtonProps } from '@/components/toggle-button/ToggleButton.types'
import type { ComponentSlots, ComponentVariants } from '@/types/tv'
import type { ClassValue } from '@/utils/tv'

import type theme from './theme'

type ToggleButtonGroup = typeof theme

/** Props of `ToggleButtonGroup`: a set of ToggleButtons with single or multiple selection by `value`. */
export type ToggleButtonGroupProps = {
  /**
   * The element or component to render as.
   * @defaultValue 'div'
   */
  as?: PrimitiveProps['as']
  /** The `value`s of the selected ToggleButtons (controlled, `v-model`). */
  modelValue?: string[]
  /**
   * The initially selected values when uncontrolled.
   * @defaultValue []
   */
  defaultValue?: string[]
  /**
   * Whether one or several buttons can be selected. Single selection makes the buttons radios.
   * @defaultValue 'single'
   */
  selectionMode?: 'single' | 'multiple'
  /**
   * Whether the last selected button can't be deselected.
   * @defaultValue false
   */
  disallowEmptySelection?: boolean
  /**
   * Layout direction, also the arrow keys that move focus. Inside a Toolbar it defaults to the toolbar's orientation.
   * @defaultValue 'horizontal'
   */
  orientation?: ComponentVariants<ToggleButtonGroup>['orientation']
  /** Size applied to every ToggleButton that doesn't set its own. */
  size?: ToggleButtonProps['size']
  /**
   * Disables every ToggleButton in the group; a ToggleButton's own `:disabled="false"` re-enables it.
   * @defaultValue false
   */
  disabled?: boolean
  /**
   * Whether the group stretches to its container and the buttons share the width.
   * @defaultValue false
   */
  fullWidth?: boolean
  /**
   * Separates the buttons with a gap and fully rounds each one instead of joining them.
   * @defaultValue false
   */
  detached?: boolean
  /**
   * Draws a divider at the start of every button except the first (HeroUI's `ToggleButtonGroup.Separator`).
   * Hidden when `detached`.
   * @defaultValue false
   */
  separator?: boolean
  /** Additional classes merged into the root element. */
  class?: ClassValue
  /** Per-slot class overrides. `button` is added to each ToggleButton, `separator` to each divider. */
  ui?: ComponentSlots<ToggleButtonGroup>
}

/** Slots of `ToggleButtonGroup`. */
export type ToggleButtonGroupSlots = {
  /** The ToggleButtons, each with a `value`. */
  default?: (props: { selected: string[] }) => VNode[]
}
