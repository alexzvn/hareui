<script setup lang="ts">
import { CellSlider } from '@hareui/vue'
</script>

<template>
  <section class="grid w-[300px] gap-1.5 rounded-3xl bg-surface-secondary p-4">
    <header class="mb-1.5">
      <h4 class="text-sm font-semibold">
        Daily goals
      </h4>
      <p class="text-xs text-muted">
        Resets at midnight
      </p>
    </header>
    <CellSlider label="Steps" variant="secondary" :default-value="8000" :min="2000" :max="20000" :step="500" />
    <CellSlider
      label="Water"
      variant="secondary"
      :default-value="2.5"
      :min="1"
      :max="4"
      :step="0.25"
      :format-options="{ style: 'unit', unit: 'liter' }"
    />
  </section>
</template>
