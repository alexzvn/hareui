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
      <div
        data-slot="meter-fill"
        :class="ui.fill({ class: props.ui?.fill })"
        :style="{ width: `${state.percentage}%` }"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useId } from 'reka-ui'
import { computed } from 'vue'

import labelTheme from '@/components/label/theme'
import { useComponentUI } from '@/composables/useComponentUI'
import { useRangeValue } from '@/composables/useRangeValue'

import type { MeterProps, MeterSlotProps, MeterSlots } from './Meter.types'
import theme from './theme'

const props = withDefaults(defineProps<MeterProps>(), {
  value: 0,
  minValue: 0,
  maxValue: 100,
  showOutput: undefined,
})

const slots = defineSlots<MeterSlots>()

const ui = useComponentUI('meter', {
  theme,
  variantProps: () => ({ color: props.color, size: props.size }),
})

const labelUi = useComponentUI('label', { theme: labelTheme, variantProps: () => ({}) })
const labelId = useId(undefined, 'hareui-meter-label')

const range = useRangeValue(() => props)
const state = computed<MeterSlotProps>(() => ({
  percentage: range.value.percentage,
  valueText: range.value.valueText,
}))

const hasLabel = computed(() => !!props.label || !!slots.label)
const hasOutput = computed(() => props.showOutput ?? (hasLabel.value || !!slots.output))
</script>
