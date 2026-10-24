import type { VNode } from 'vue'

import type { ComponentSlots } from '@/types/tv'
import type { ClassValue } from '@/utils/tv'

import type theme from './theme'

type Slider = typeof theme

export type SliderProps = {
  /**
   * The current value(s). Bind with `v-model`. A plain number renders a single thumb; an array
   * renders one thumb per value (e.g. a two-element array for a range slider).
   */
  modelValue?: number | number[]
  /**
   * The initial value(s) when uncontrolled (no `v-model`).
   * @defaultValue 0
   */
  defaultValue?: number | number[]
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
  /** Formatting options for the displayed value label (`Intl.NumberFormat`). */
  formatOptions?: Intl.NumberFormatOptions
  /** The BCP 47 locale used to format the value label. Defaults to the browser locale. */
  locale?: string
  /**
   * The axis the slider is laid out along.
   * @defaultValue 'horizontal'
   */
  orientation?: 'horizontal' | 'vertical'
  /** The slider's label. */
  label?: string
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
  ui?: ComponentSlots<Slider>
}

export type SliderSlots = {
  /** The label content. Replaces the `label` prop. */
  label?: () => VNode[]
  /** The output content, showing the formatted current value(s). Replaces the default `' – '`-joined format. */
  output?: (props: { values: number[]; formatted: string[] }) => VNode[]
}
