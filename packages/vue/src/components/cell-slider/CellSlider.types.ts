import type { VNode } from 'vue'

import type { ComponentSlots, ComponentVariants } from '@/types/tv'
import type { ClassValue } from '@/utils/tv'

import type theme from './theme'

type CellSlider = typeof theme

export type CellSliderProps = {
  /** The current value. Bind with `v-model`. */
  modelValue?: number
  /**
   * The initial value when uncontrolled.
   * @defaultValue min
   */
  defaultValue?: number
  /**
   * The slider's minimum value.
   * @defaultValue 0
   */
  min?: number
  /**
   * The slider's maximum value.
   * @defaultValue 100
   */
  max?: number
  /**
   * The amount the value changes per step.
   * @defaultValue 1
   */
  step?: number
  /** Formatting options for the value shown at the end of the row (`Intl.NumberFormat`). */
  formatOptions?: Intl.NumberFormatOptions
  /** The BCP 47 locale used to format the value. Defaults to the browser locale. */
  locale?: string
  /** The text at the start of the row. Also names the slider. */
  label?: string
  /**
   * Visual style of the row. Use `secondary` on a surface or card.
   * @defaultValue 'default'
   */
  variant?: ComponentVariants<CellSlider>['variant']
  /**
   * Whether the slider is disabled.
   * @defaultValue false
   */
  disabled?: boolean
  /** The name of the slider, used when submitting an HTML form. */
  name?: string
  /**
   * Whether a value is required before form submission.
   * @defaultValue false
   */
  required?: boolean
  /** The id of the slider. Generated when omitted. */
  id?: string
  /** Additional classes merged into the root element. */
  class?: ClassValue
  /** Per-slot class overrides. */
  ui?: ComponentSlots<CellSlider>
}

export type CellSliderEmits = {
  /** Emitted when the value changes, on every step of a drag. */
  'update:modelValue': [value: number]
  /** Emitted with the final value when a drag or keyboard step commits a change. */
  changeEnd: [value: number]
}

export type CellSliderSlots = {
  /** The label content. Replaces the `label` prop. */
  label?: () => VNode[]
  /** The value shown at the end of the row. Replaces the formatted value. */
  output?: (props: { value: number; formatted: string }) => VNode[]
}
