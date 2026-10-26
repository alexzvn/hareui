import type { Color, PrimitiveProps } from 'reka-ui'
import type { VNode } from 'vue'

import type { ComponentSlots, ComponentVariants } from '@/types/tv'
import type { ClassValue } from '@/utils/tv'

import type theme from './theme'

type ColorSwatchPicker = typeof theme

/** A swatch in a `ColorSwatchPicker`: a color string, or an object with a label and disabled state. */
export type ColorSwatchPickerItem =
  | string
  | {
      /** The color as a hex/CSS color string. Identifies the item in `v-model`. */
      value: string
      /** Accessible name for the item. Defaults to the derived color name. */
      label?: string
      /** Whether this item is disabled. */
      disabled?: boolean
    }

/** Props for `ColorSwatchPicker`, a listbox of color swatches for picking one color from a palette. */
export type ColorSwatchPickerProps = {
  /** The swatches to render. */
  items: ColorSwatchPickerItem[]
  /**
   * The selected color (controlled). A hex string or a `Color` object matching one of the items.
   * Falls back to the enclosing `ColorPicker`'s color when neither this nor `v-model` is set.
   */
  modelValue?: string | Color
  /** The initially selected color when uncontrolled. */
  defaultValue?: string | Color
  /**
   * Size of the swatches.
   * @defaultValue 'md'
   */
  size?: ComponentVariants<ColorSwatchPicker>['size']
  /**
   * Shape of the swatches.
   * @defaultValue 'circle'
   */
  variant?: ComponentVariants<ColorSwatchPicker>['variant']
  /**
   * Layout direction.
   * @defaultValue 'grid'
   */
  layout?: ComponentVariants<ColorSwatchPicker>['layout']
  /**
   * Whether every item is disabled.
   * @defaultValue false
   */
  disabled?: boolean
  /** The name of the field, used when submitting a form. */
  name?: string
  /** Element or component the root renders as. */
  as?: PrimitiveProps['as']
  /** Render the root as its single child instead of a wrapper element. */
  asChild?: boolean
  /** Additional classes merged into the root element. */
  class?: ClassValue
  /** Per-slot class overrides. */
  ui?: ComponentSlots<ColorSwatchPicker>
}

/** Props passed to the `ColorSwatchPicker` item slots. */
export type ColorSwatchPickerSlotProps = {
  /** The item's color string. */
  value: string
  /** The item's accessible label, if any. */
  label?: string
  /** Whether the item is selected. */
  selected: boolean
}

/** Slots for `ColorSwatchPicker`. */
export type ColorSwatchPickerSlots = {
  /** Replaces the whole content of an item (swatch and indicator). */
  default?: (props: ColorSwatchPickerSlotProps) => VNode[]
  /** Replaces the check icon inside the indicator (always rendered, revealed by the selected state). */
  indicator?: (props: ColorSwatchPickerSlotProps) => VNode[]
}

/** Events emitted by `ColorSwatchPicker`. */
export type ColorSwatchPickerEmits = {
  /** Emitted when the selection changes. Emits a `Color` when the current value is a `Color`, else the item's string. */
  'update:modelValue': [value: string | Color]
}
