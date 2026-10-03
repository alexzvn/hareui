<script lang="ts">
import type { ComponentSlots, ComponentVariants } from '../types/tv'
import theme from '../theme/meter'

type Meter = typeof theme

export interface MeterProps {
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
   * Number format for the value display. Percent formats the fraction of the range.
   * @defaultValue { style: 'percent' }
   */
  formatOptions?: Intl.NumberFormatOptions
  /** Custom value text (e.g. `'3 of 4'`), replacing the formatted value in the output and `aria-valuetext`. */
  valueLabel?: string
  /** Visible label, rendered in the top-left grid area and referenced by `aria-labelledby`. */
  label?: string
  /**
   * Whether to render the value output. Defaults to showing it when there is a label.
   */
  showOutput?: boolean
  /**
   * Size of the meter track.
   * @defaultValue 'md'
   */
  size?: ComponentVariants<Meter>['size']
  /**
   * Color of the fill bar.
   * @defaultValue 'accent'
   */
  color?: ComponentVariants<Meter>['color']
  /** Additional classes merged into the root element. */
  class?: any
  /** Per-slot class overrides. */
  ui?: ComponentSlots<Meter>
}

export interface MeterSlotProps {
  /** The percentage of the meter (0–100). */
  percentage: number
  /** The formatted value text. */
  valueText: string
}

export interface MeterSlots {
  /** Replaces the label text. */
  label?: (props: MeterSlotProps) => any
  /** Replaces the value output text. */
  output?: (props: MeterSlotProps) => any
}
</script>

<script setup lang="ts">
import { useId } from 'reka-ui'
import { computed } from 'vue'
import { useComponentUI } from '../composables/useComponentUI'
import { useRangeValue } from '../composables/useRangeValue'
import labelTheme from '../theme/label'

const props = withDefaults(defineProps<MeterProps>(), {
  value: 0,
  minValue: 0,
  maxValue: 100,
  showOutput: undefined,
})
const slots = defineSlots<MeterSlots>()

const ui = useComponentUI('meter', theme, () => ({ color: props.color, size: props.size }))
const labelUi = useComponentUI('label', labelTheme, () => ({}))
const labelId = useId(undefined, 'hareui-meter-label')

const range = useRangeValue(() => props)
const state = computed<MeterSlotProps>(() => ({ percentage: range.value.percentage, valueText: range.value.valueText }))

const hasLabel = computed(() => !!props.label || !!slots.label)
const hasOutput = computed(() => props.showOutput ?? (hasLabel.value || !!slots.output))
</script>

<template>
  <!-- Reka has no meter primitive; ARIA follows React Aria's useMeter (role "meter progressbar"). -->
  <div
    role="meter progressbar"
    :aria-labelledby="hasLabel ? labelId : undefined"
    :aria-valuemin="minValue"
    :aria-valuemax="maxValue"
    :aria-valuenow="range.clamped"
    :aria-valuetext="range.valueText"
    data-slot="meter"
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
    <span v-if="hasOutput" data-slot="meter-output" :class="ui.output({ class: props.ui?.output })">
      <slot name="output" v-bind="state">{{ state.valueText }}</slot>
    </span>
    <div data-slot="meter-track" :class="ui.track({ class: props.ui?.track })">
      <div data-slot="meter-fill" :class="ui.fill({ class: props.ui?.fill })" :style="{ width: `${state.percentage}%` }" />
    </div>
  </div>
</template>
