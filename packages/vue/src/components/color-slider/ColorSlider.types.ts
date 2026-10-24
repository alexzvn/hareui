import type { Color, ColorChannel, ColorSpace } from 'reka-ui'
import type { VNode } from 'vue'

import type { ComponentSlots } from '@/types/tv'
import type { ClassValue } from '@/utils/tv'

import type theme from './theme'

type ColorSlider = typeof theme

export type ColorSliderProps = {
  /** The color channel that this slider manipulates. */
  channel: ColorChannel
  /**
   * The color space the channel/gradient is resolved in. Auto-corrected with a dev warning when
   * it conflicts with `channel` (e.g. `channel="red"` forces `"rgb"`).
   * @defaultValue 'hsl'
   */
  colorSpace?: ColorSpace
  /**
   * The color value (controlled). Falls back to the enclosing `ColorPicker`'s color when omitted
   * and one is present.
   */
  modelValue?: string | Color
  /**
   * The default color (uncontrolled), used when there's no `v-model` and no enclosing `ColorPicker`.
   * @defaultValue '#000000'
   */
  defaultValue?: string | Color
  /**
   * The orientation of the slider.
   * @defaultValue 'horizontal'
   */
  orientation?: 'horizontal' | 'vertical'
  /**
   * Whether the slider is disabled.
   * @defaultValue false
   */
  disabled?: boolean
  /** Custom step value for increment/decrement. Defaults to the channel's natural step. */
  step?: number
  /** Visible label, rendered above (horizontal) or below (vertical) the track. */
  label?: string
  /**
   * Whether to render the formatted value output.
   * @defaultValue true when there's a label
   */
  showOutput?: boolean
  /** The name of the hidden input, used for form submission. Submits the channel value (e.g. `200` for hue, `0.5` for alpha), as React Aria does. */
  name?: string
  /** Additional classes merged into the root element. */
  class?: ClassValue
  /** Per-slot class overrides. */
  ui?: ComponentSlots<ColorSlider>
}

export type ColorSliderSlotProps = {
  /** The display name of the current channel (e.g. `'Hue'`). */
  channelName: string
  /** The current numeric value of the channel. */
  channelValue: number
  /** The formatted value text, as rendered in the output. */
  valueText: string
}

export type ColorSliderSlots = {
  /** Label content. Replaces the `label` prop. */
  label?: () => VNode[]
  /** Output content. Replaces the formatted value text. */
  output?: (props: ColorSliderSlotProps) => VNode[]
  /** Thumb content. */
  thumb?: (props: ColorSliderSlotProps) => VNode[]
}

export type ColorSliderEmits = {
  /** Emitted on every value change with the new color, in the channel's native color space. */
  'update:modelValue': [value: Color]
  /** Emitted on every value change while dragging/keying, with the new color as a hex string. */
  change: [value: string]
  /** Emitted when a drag/key interaction ends, with the resulting color as a hex string. */
  changeEnd: [value: string]
}
