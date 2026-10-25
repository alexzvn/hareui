import type { Color, ColorChannel, ColorSpace } from 'reka-ui'

import type { ComponentSlots } from '@/types/tv'
import type { ClassValue } from '@/utils/tv'

import type theme from './theme'

type ColorArea = typeof theme

/** One axis of a `ColorArea`: the colour channel it adjusts and its hidden input. */
export type ColorAreaAxis = {
  /**
   * Colour channel of the axis. Defaults to the first channel of the colour space the other axis
   * doesn't use: `hue` then `saturation` for HSL/HSB, `red` then `green` for RGB, as in React Aria.
   */
  channel?: ColorChannel
  /** The name of the axis's hidden input, for form submission. */
  name?: string
}

/** Props for `ColorArea`, a 2D area for adjusting two channels of a colour, e.g. saturation and lightness. */
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
   * The horizontal (x) axis. Its channel defaults to the first channel of the colour space that
   * isn't the y channel (`hue` for HSL/HSB, `red` for RGB), as in React Aria.
   */
  x?: ColorAreaAxis
  /**
   * The vertical (y) axis. Its channel defaults to the first channel of the colour space that
   * isn't the x channel (`saturation` for HSL/HSB, `green` for RGB), as in React Aria.
   */
  y?: ColorAreaAxis
  /** Whether the colour area is disabled. */
  disabled?: boolean
  /** Whether to show the dot grid overlay for precision picking. */
  showDots?: boolean
  /** Additional classes merged into the root element. */
  class?: ClassValue
  /** Per-slot class overrides. */
  ui?: ComponentSlots<ColorArea>
}

/** Events emitted by `ColorArea`. */
export type ColorAreaEmits = {
  /** Emitted on every colour change, mirroring HeroUI's `onChange` (fired while dragging/typing). */
  change: [value: Color]
  /** Emitted when the user stops interacting (pointer up / key up), mirroring HeroUI's `onChangeEnd`. */
  changeEnd: [value: Color]
}
