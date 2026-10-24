import type { Color, ColorChannel, ColorSpace } from 'reka-ui'

import type { ComponentSlots } from '@/types/tv'
import type { ClassValue } from '@/utils/tv'

import type theme from './theme'

type ColorArea = typeof theme

export type ColorAreaProps = {
  /**
   * The colour value (controlled), as a hex/CSS colour string or a `Color` object. Use with `v-model`.
   * When omitted and used inside a `ColorPicker`, falls back to its current colour.
   */
  modelValue?: string | Color
  /** The default colour when uncontrolled. */
  defaultValue?: string | Color
  /** The colour space the channels are read from. Defaults to the colour's own space. */
  colorSpace?: ColorSpace
  /**
   * Colour channel for the horizontal (x) axis. Defaults to the first channel of the colour space
   * that isn't `yChannel` (`hue` for HSL/HSB, `red` for RGB), as in React Aria.
   */
  xChannel?: ColorChannel
  /**
   * Colour channel for the vertical (y) axis. Defaults to the first channel of the colour space
   * that isn't the x channel (`saturation` for HSL/HSB, `green` for RGB), as in React Aria.
   */
  yChannel?: ColorChannel
  /** Whether the colour area is disabled. */
  disabled?: boolean
  /** Whether to show the dot grid overlay for precision picking. */
  showDots?: boolean
  /** The name of the x channel's hidden input, for form submission. */
  xName?: string
  /** The name of the y channel's hidden input, for form submission. */
  yName?: string
  /** Additional classes merged into the root element. */
  class?: ClassValue
  /** Per-slot class overrides. */
  ui?: ComponentSlots<ColorArea>
}

export type ColorAreaEmits = {
  /** Emitted on every colour change, mirroring HeroUI's `onChange` (fired while dragging/typing). */
  change: [value: Color]
  /** Emitted when the user stops interacting (pointer up / key up), mirroring HeroUI's `onChangeEnd`. */
  changeEnd: [value: Color]
}
