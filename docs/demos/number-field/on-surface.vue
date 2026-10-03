<script setup lang="ts">
import { NumberField, Surface } from '@hareui/vue'
</script>

<template>
  <Surface class="flex w-full max-w-[280px] flex-col gap-4 rounded-3xl p-6">
    <NumberField
      :default-value="1024"
      :min="0"
      name="width"
      variant="secondary"
      label="Width"
      description="Enter the width in pixels"
      :ui="{ input: 'w-full' }"
    />
    <NumberField
      :default-value="0.5"
      :format-options="{ style: 'percent' }"
      :max="1"
      :min="0"
      name="percentage"
      :step="0.1"
      variant="secondary"
      label="Percentage"
      description="Value must be between 0 and 100"
      :ui="{ input: 'w-full' }"
    />
  </Surface>
</template>
