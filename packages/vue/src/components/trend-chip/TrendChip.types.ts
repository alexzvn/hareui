import type { VNode } from 'vue'

import type { ChipProps } from '@/components/chip/Chip.types'
import type { ComponentSlots, ComponentVariants } from '@/types/tv'
import type { ClassValue } from '@/utils/tv'

import type theme from './theme'

type TrendChip = typeof theme

/** Props of `TrendChip`: a chip showing a metric change, coloured and arrowed by its direction. */
export type TrendChipProps = {
  /**
   * The element or component to render as.
   * @defaultValue 'span'
   */
  as?: ChipProps['as']
  /** The value text, e.g. `+3.2%`. The default slot replaces it. */
  label?: string | number
  /**
   * Direction of the change: `up` uses the success colour, `down` danger, `neutral` the default colour with no arrow.
   * Exposed as `data-trend`.
   * @defaultValue 'up'
   */
  trend?: ComponentVariants<TrendChip>['trend']
  /**
   * Visual style of the chip.
   * @defaultValue 'soft'
   */
  variant?: ChipProps['variant']
  /**
   * Size of the chip and its arrow.
   * @defaultValue 'sm'
   */
  size?: ComponentVariants<TrendChip>['size']
  /** Additional classes merged into the root element. */
  class?: ClassValue
  /** Per-slot class overrides. */
  ui?: ComponentSlots<TrendChip>
}

/** Slots of `TrendChip`. */
export type TrendChipSlots = {
  /** Replaces the direction arrow (also shown for the `neutral` trend, which has no default arrow). Mark custom icons `aria-hidden` when they are decorative. */
  indicator?: () => VNode[]
  /** Text before the value, e.g. a metric name. A space separates it from the value. */
  prefix?: () => VNode[]
  /** The value. Rendered in tabular numerals. */
  default?: () => VNode[]
  /** Text after the value, e.g. `vs last month`. Rendered in the muted colour. */
  suffix?: () => VNode[]
}
