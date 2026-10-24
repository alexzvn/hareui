<script setup lang="ts">
import { NumberStepper } from '@hareui/vue'

const sizes = ['sm', 'md', 'lg'] as const
</script>

<template>
  <div class="flex flex-wrap items-end gap-6">
    <NumberStepper
      v-for="size in sizes"
      :key="size"
      :label="size"
      :aria-label="`Passengers (${size})`"
      :size="size"
      :default-value="2"
      :min="1"
    />
  </div>
</template>
