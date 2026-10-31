import type { PrimitiveProps } from 'reka-ui'
import type { VNode } from 'vue'

import type { ComponentSlots } from '@/types/tv'
import type { ClassValue } from '@/utils/tv'

import type theme from './theme'

type MetricGroup = typeof theme

/** Props of `MetricGroup`, which lays `Metric` cards out on one shared surface with dividers between them. */
export type MetricGroupProps = {
  /**
   * The element or component to render as.
   * @defaultValue 'div'
   */
  as?: PrimitiveProps['as']
  /**
   * Turns the row into a column. `true` always stacks; a breakpoint stacks below it, so `stacked="md"` is a column
   * under 768px and a row from 768px up. Exposed as `data-stacked`.
   * @defaultValue false
   */
  stacked?: boolean | 'sm' | 'md' | 'lg' | 'xl'
  /** Additional classes merged into the root element. */
  class?: ClassValue
  /** Per-slot class overrides. */
  ui?: ComponentSlots<MetricGroup>
}

/** Slots of `MetricGroup`. */
export type MetricGroupSlots = {
  /** The `Metric` cards. They lose their own radius and shadow and are divided by 1 px lines. */
  default?: () => VNode[]
}
