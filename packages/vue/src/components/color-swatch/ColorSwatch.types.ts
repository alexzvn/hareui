import type { Color } from 'reka-ui'
import type { VNode } from 'vue'

import type { ComponentSlots, ComponentVariants } from '@/types/tv'
import type { ClassValue } from '@/utils/tv'

import type theme from './theme'

type ColorSwatch = typeof theme

export type ColorSwatchProps = {
  /**
   * The color to display, as a hex/CSS color string or a `Color` object.
   * When omitted and used inside a `ColorPicker`, falls back to its current color.
   */
  color?: string | Color
  /** Accessible name for the color, overriding the automatically derived color name. */
  colorName?: string
  /**
   * Shape of the swatch.
   * @defaultValue 'circle'
   */
  shape?: ComponentVariants<ColorSwatch>['shape']
  /**
   * Size of the swatch.
   * @defaultValue 'md'
   */
  size?: ComponentVariants<ColorSwatch>['size']
  /** Additional classes merged into the root element. */
  class?: ClassValue
  /** Per-slot class overrides. */
  ui?: ComponentSlots<ColorSwatch>
}

export type ColorSwatchSlots = {
  /** Replaces the swatch content. Receives the resolved color as a CSS string and its alpha channel (0–1). */
  default?: (props: { color: string; alpha: number }) => VNode[]
}
