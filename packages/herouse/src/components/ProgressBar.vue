<script lang="ts">
import type { ComponentSlots, ComponentVariants } from '../types/tv'
import theme from '../theme/progressBar'

type ProgressBar = typeof theme

export interface ProgressBarProps {
  /**
   * The current value (clamped to `minValue`–`maxValue`).
   * @defaultValue 0
   */
  value?: number
  /**
   * The minimum value.
   * @defaultValue 0
   */
  minValue?: number
  /**
   * The maximum value.
   * @defaultValue 100
   */
  maxValue?: number
  /**
   * Whether progress is indeterminate (no value; the fill loops).
   * @defaultValue false
   */
  indeterminate?: boolean
  /**
   * Number format for the value display. Percent formats the fraction of the range.
   * @defaultValue { style: 'percent' }
   */
  formatOptions?: Intl.NumberFormatOptions
  /** Custom value text (e.g. `'3 of 4'`), replacing the formatted value in the output and `aria-valuetext`. */
  valueLabel?: string
  /** Visible label, rendered in the top-left grid area and referenced by `aria-labelledby`. */
  label?: string
  /**
   * Whether to render the value output. Defaults to showing it next to a label, unless indeterminate.
   */
  showOutput?: boolean
  /**
   * Size of the progress track.
   * @defaultValue 'md'
   */
  size?: ComponentVariants<ProgressBar>['size']
  /**
   * Color of the fill bar.
   * @defaultValue 'accent'
   */
  color?: ComponentVariants<ProgressBar>['color']
  /** Additional classes merged into the root element. */
  class?: any
  /** Per-slot class overrides. */
  ui?: ComponentSlots<ProgressBar>
}

export interface ProgressBarSlotProps {
  /** The percentage of the progress (0–100); `undefined` when indeterminate. */
  percentage: number | undefined
  /** The formatted value text; `undefined` when indeterminate. */
  valueText: string | undefined
  /** Whether progress is indeterminate. */
  indeterminate: boolean
}

export interface ProgressBarSlots {
  /** Replaces the label text. */
  label?: (props: ProgressBarSlotProps) => any
  /** Replaces the value output text. */
  output?: (props: ProgressBarSlotProps) => any
}
</script>

<script setup lang="ts">
import { ProgressIndicator, ProgressRoot, useId } from 'reka-ui'
import { computed } from 'vue'
import { useComponentUI } from '../composables/useComponentUI'
import { useRangeValue } from '../composables/useRangeValue'
import labelTheme from '../theme/label'

const props = withDefaults(defineProps<ProgressBarProps>(), {
  value: 0,
  minValue: 0,
  maxValue: 100,
  indeterminate: false,
  showOutput: undefined,
})
const slots = defineSlots<ProgressBarSlots>()

const ui = useComponentUI('progressBar', theme, () => ({
  color: props.color,
  size: props.size,
  indeterminate: props.indeterminate,
}))
const labelUi = useComponentUI('label', labelTheme, () => ({}))

const labelId = useId(undefined, 'herouse-progress-bar-label')

const range = useRangeValue(() => props)
const clamped = computed(() => range.value.clamped)
const state = computed<ProgressBarSlotProps>(() => props.indeterminate
  ? { percentage: undefined, valueText: undefined, indeterminate: true }
  : { percentage: range.value.percentage, valueText: range.value.valueText, indeterminate: false })

const hasLabel = computed(() => !!props.label || !!slots.label)
const hasOutput = computed(() => props.showOutput ?? ((hasLabel.value || !!slots.output) && !props.indeterminate))
</script>

<template>
  <!-- Reka's range is 0–max, so its aria-value* bindings are overridden with React Aria's values. -->
  <ProgressRoot
    :model-value="indeterminate ? null : clamped - minValue"
    :max="Math.max(maxValue - minValue, Number.MIN_VALUE)"
    :get-value-label="() => undefined"
    :aria-labelledby="hasLabel ? labelId : undefined"
    :aria-valuemin="minValue"
    :aria-valuemax="maxValue"
    :aria-valuenow="indeterminate ? undefined : clamped"
    :aria-valuetext="state.valueText"
    data-slot="progress-bar"
    :class="ui.base({ class: [props.ui?.base, props.class] })"
  >
    <span
      v-if="hasLabel"
      :id="labelId"
      data-slot="label"
      :class="labelUi.base({ class: ui.label({ class: props.ui?.label }) })"
    >
      <slot name="label" v-bind="state">{{ label }}</slot>
    </span>
    <span v-if="hasOutput" data-slot="progress-bar-output" :class="ui.output({ class: props.ui?.output })">
      <slot name="output" v-bind="state">{{ state.valueText }}</slot>
    </span>
    <div data-slot="progress-bar-track" :class="ui.track({ class: props.ui?.track })">
      <ProgressIndicator
        data-slot="progress-bar-fill"
        :class="ui.fill({ class: props.ui?.fill })"
        :style="indeterminate ? undefined : { width: `${state.percentage}%` }"
      />
    </div>
  </ProgressRoot>
</template>
