<script setup lang="ts">
import { CellSlider } from '@hareui/vue'

interface Filter { label: string, value: number, min: number, max: number, step: number, format: Intl.NumberFormatOptions }

const filters: Record<string, Filter[]> = {
  Stay: [
    { label: 'Max per night', value: 180, min: 40, max: 500, step: 10, format: { style: 'currency', currency: 'USD', maximumFractionDigits: 0 } },
    { label: 'Guest rating', value: 4, min: 1, max: 5, step: 0.5, format: { minimumFractionDigits: 1 } },
  ],
  Location: [
    { label: 'From center', value: 3, min: 0, max: 20, step: 0.5, format: { style: 'unit', unit: 'kilometer' } },
    { label: 'Walk to transit', value: 10, min: 0, max: 30, step: 5, format: { style: 'unit', unit: 'minute' } },
  ],
}
</script>

<template>
  <div class="w-[300px] divide-y divide-separator rounded-2xl border border-separator">
    <section v-for="(rows, title) in filters" :key="title" class="grid gap-1.5 p-3">
      <h4 class="mb-1 text-[11px] font-semibold tracking-wide text-muted uppercase">
        {{ title }}
      </h4>
      <CellSlider
        v-for="row in rows"
        :key="row.label"
        :label="row.label"
        :default-value="row.value"
        :min="row.min"
        :max="row.max"
        :step="row.step"
        :format-options="row.format"
      />
    </section>
  </div>
</template>
