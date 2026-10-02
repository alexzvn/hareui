<script setup lang="ts">
import { Label, NumberField, ProgressBar, Select, Separator } from 'herouse'
import { ref } from 'vue'

const formatStyleOptions = [
  { label: 'Currency', value: 'currency' },
  { label: 'Percent', value: 'percent' },
  { label: 'Decimal', value: 'decimal' },
  { label: 'Unit', value: 'unit' },
]

const formatOptionsMap: Record<string, Intl.NumberFormatOptions> = {
  currency: { currency: 'USD', style: 'currency' },
  decimal: { style: 'decimal' },
  percent: { style: 'percent' },
  unit: { style: 'unit', unit: 'mile' },
}

const value = ref(750)
const minValue = ref(0)
const maxValue = ref(1000)
const format = ref('percent')

function setMinValue(v: number | null) {
  minValue.value = v ?? 0
  if (value.value < minValue.value)
    value.value = minValue.value
}

function setMaxValue(v: number | null) {
  maxValue.value = v ?? minValue.value + 1
  if (value.value > maxValue.value)
    value.value = maxValue.value
}
</script>

<template>
  <div class="flex w-full flex-col gap-6 md:flex-row md:items-center md:gap-10">
    <div class="flex w-full max-w-md flex-1 justify-center">
      <ProgressBar
        aria-label="Revenue"
        class="w-full max-w-52"
        :format-options="formatOptionsMap[format]"
        label="Progress"
        :max-value="maxValue"
        :min-value="minValue"
        :value="value"
      />
    </div>

    <Separator class="md:hidden" />
    <Separator class="hidden md:block" orientation="vertical" />

    <div class="flex max-w-52 flex-col gap-3">
      <Label class="text-xs font-medium text-muted">Options</Label>

      <NumberField v-model="value" label="Value" :max="maxValue" :min="minValue" variant="secondary" />
      <NumberField
        label="Min Value"
        :max="maxValue - 1"
        :min="0"
        :model-value="minValue"
        variant="secondary"
        @update:model-value="setMinValue"
      />
      <NumberField
        label="Max Value"
        :max="2000"
        :min="minValue + 1"
        :model-value="maxValue"
        variant="secondary"
        @update:model-value="setMaxValue"
      />

      <Select v-model="format" :items="formatStyleOptions" label="Format" variant="secondary" />
    </div>
  </div>
</template>
