<template>
  <!-- Reka's range is 0–max, so its aria-value* bindings are overridden with React Aria's values. -->
  <ProgressRoot
    :model-value="indeterminate ? null : range.clamped - minValue"
    :max="Math.max(maxValue - minValue, Number.MIN_VALUE)"
    :get-value-label="() => undefined"
    :aria-valuemin="minValue"
    :aria-valuemax="maxValue"
    :aria-valuenow="indeterminate ? undefined : range.clamped"
    :aria-valuetext="indeterminate ? undefined : range.valueText"
    data-slot="progress-circle"
    :class="ui.base({ class: [props.ui?.base, props.class] })"
  >
    <svg
      data-slot="progress-circle-track"
      fill="none"
      :viewBox="`0 0 ${CENTER * 2} ${CENTER * 2}`"
      :class="ui.track({ class: props.ui?.track })"
    >
      <circle
        data-slot="progress-circle-track-circle"
        :cx="CENTER"
        :cy="CENTER"
        :r="radius"
        :stroke-width="strokeWidth"
        :class="ui.trackCircle({ class: props.ui?.trackCircle })"
      />
      <circle
        data-slot="progress-circle-fill-circle"
        :cx="CENTER"
        :cy="CENTER"
        :r="radius"
        :stroke-dasharray="CIRCUMFERENCE"
        :stroke-dashoffset="dashOffset"
        stroke-linecap="round"
        :stroke-width="strokeWidth"
        :transform="`rotate(-90 ${CENTER} ${CENTER})`"
        :class="ui.fillCircle({ class: props.ui?.fillCircle })"
      />
    </svg>
  </ProgressRoot>
</template>

<script setup lang="ts">
import { ProgressRoot } from 'reka-ui'
import { computed } from 'vue'

import { useComponentUI } from '@/composables/useComponentUI'
import { useRangeValue } from '@/composables/useRangeValue'

import type { ProgressCircleProps } from './ProgressCircle.types'
import theme from './theme'

const props = withDefaults(defineProps<ProgressCircleProps>(), {
  value: 0,
  minValue: 0,
  maxValue: 100,
  indeterminate: false,
  strokeWidth: 4,
})

const ui = useComponentUI('progressCircle', {
  theme,
  variantProps: () => ({
    color: props.color,
    size: props.size,
    indeterminate: props.indeterminate,
  }),
})

const range = useRangeValue(() => props)

const CENTER = 18

// HeroUI's dash pattern always uses the default radius (16), even when the radius is overridden.
const CIRCUMFERENCE = 2 * Math.PI * (CENTER - 4 / 2)
const radius = computed(() => CENTER - props.strokeWidth / 2)

const dashOffset = computed(() =>
  props.indeterminate
    ? CIRCUMFERENCE * 0.75
    : CIRCUMFERENCE - (range.value.percentage / 100) * CIRCUMFERENCE,
)
</script>
