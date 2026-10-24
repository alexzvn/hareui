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
    <!-- Split so ProgressRoot's slot is only forwarded (and force-updated) when these slots are passed. -->
    <span
      v-if="hasLabel && $slots.label"
      :id="labelId"
      data-slot="label"
      :class="labelUi.base({ class: ui.label({ class: props.ui?.label }) })"
    >
      <slot name="label" v-bind="state">{{ label }}</slot>
    </span>
    <span
      v-else-if="hasLabel"
      :id="labelId"
      data-slot="label"
      :class="labelUi.base({ class: ui.label({ class: props.ui?.label }) })"
      >{{ label }}</span
    >
    <span
      v-if="hasOutput && $slots.output"
      data-slot="progress-bar-output"
      :class="ui.output({ class: props.ui?.output })"
    >
      <slot name="output" v-bind="state">{{ state.valueText }}</slot>
    </span>
    <span
      v-else-if="hasOutput"
      data-slot="progress-bar-output"
      :class="ui.output({ class: props.ui?.output })"
      >{{ state.valueText }}</span
    >
    <div data-slot="progress-bar-track" :class="ui.track({ class: props.ui?.track })">
      <ProgressIndicator
        data-slot="progress-bar-fill"
        :class="ui.fill({ class: props.ui?.fill })"
        :style="indeterminate ? undefined : { width: `${state.percentage}%` }"
      />
    </div>
  </ProgressRoot>
</template>

<script setup lang="ts">
import { ProgressIndicator, ProgressRoot, useId } from 'reka-ui'
import { computed } from 'vue'

import labelTheme from '@/components/label/theme'
import { useComponentUI } from '@/composables/useComponentUI'
import { useRangeValue } from '@/composables/useRangeValue'

import type { ProgressBarProps, ProgressBarSlotProps, ProgressBarSlots } from './ProgressBar.types'
import theme from './theme'

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

const labelId = useId(undefined, 'hareui-progress-bar-label')

const range = useRangeValue(() => props)
const clamped = computed(() => range.value.clamped)

const state = computed<ProgressBarSlotProps>(() =>
  props.indeterminate
    ? { percentage: undefined, valueText: undefined, indeterminate: true }
    : {
        percentage: range.value.percentage,
        valueText: range.value.valueText,
        indeterminate: false,
      },
)

const hasLabel = computed(() => !!props.label || !!slots.label)
const hasOutput = computed(
  () => props.showOutput ?? ((hasLabel.value || !!slots.output) && !props.indeterminate),
)
</script>
