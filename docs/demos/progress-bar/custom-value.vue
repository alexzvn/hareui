<script setup lang="ts">
import { Label, NumberField, ProgressBar } from 'herouse'
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

    <!-- herouse has no Separator: HeroUI's separator styles -->
    <div class="h-px w-full shrink-0 rounded-sm bg-separator md:hidden" role="separator" />
    <div aria-orientation="vertical" class="hidden h-auto min-h-2 w-px shrink-0 self-stretch rounded-sm bg-separator md:block" role="separator" />

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

      <!-- herouse has no Select: a native <select> styled as HeroUI's secondary Select trigger -->
      <div class="flex flex-col gap-1">
        <Label class="w-fit" for="progress-bar-format">Format</Label>
        <div class="relative isolate inline-flex">
          <select
            id="progress-bar-format"
            v-model="format"
            class="min-h-9 w-full cursor-(--cursor-interactive) appearance-none rounded-field border border-(--field-border) bg-default px-3 py-2 pe-7 text-start text-base text-field-foreground shadow-none outline-none select-none [border-width:var(--border-width-field)] no-highlight transition-[background-color,border-color,box-shadow] duration-150 ease-smooth focus-visible:status-focused motion-reduce:transition-none sm:text-sm hover:bg-default-hover"
          >
            <option v-for="option in formatStyleOptions" :key="option.value" :value="option.value">
              {{ option.label }}
            </option>
          </select>
          <svg
            aria-hidden="true"
            class="pointer-events-none absolute inset-y-0 end-2 my-auto flex size-4 shrink-0 items-center justify-center text-field-placeholder"
            fill="none"
            height="16"
            viewBox="0 0 16 16"
            width="16"
          >
            <path
              clip-rule="evenodd"
              d="M2.97 5.47a.75.75 0 0 1 1.06 0L8 9.44l3.97-3.97a.75.75 0 1 1 1.06 1.06l-4.5 4.5a.75.75 0 0 1-1.06 0l-4.5-4.5a.75.75 0 0 1 0-1.06"
              fill="currentColor"
              fill-rule="evenodd"
            />
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>
