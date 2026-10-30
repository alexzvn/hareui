<template>
  <div class="flex flex-wrap gap-10">
    <div v-for="size in sizes" :key="size" class="flex flex-col gap-3">
      <span class="text-xs font-medium text-muted uppercase">{{ size }}</span>
      <Stepper :items="items" orientation="vertical" :size="size" :default-value="1" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { StepperItem } from '@hareui/vue'
import { Stepper } from '@hareui/vue'

const sizes = ['sm', 'md', 'lg'] as const

const items: StepperItem[] = [
  { title: 'Draft', description: 'Write the first pass' },
  { title: 'Review', description: 'Collect feedback' },
  { title: 'Polish', description: 'Fix the details' },
  { title: 'Publish', description: 'Ship it' },
]
</script>
