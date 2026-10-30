<template>
  <div class="flex w-full max-w-lg flex-col gap-8">
    <div v-for="size in sizes" :key="size" class="flex flex-col gap-3">
      <span class="text-xs font-medium text-muted uppercase">{{ size }}</span>
      <Stepper :items="items" :size="size" :default-value="1" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { StepperItem } from '@hareui/vue'
import { Stepper } from '@hareui/vue'

const sizes = ['sm', 'md', 'lg'] as const

const items: StepperItem[] = [
  { title: 'Upload' },
  { title: 'Crop' },
  { title: 'Filters' },
  { title: 'Share' },
]
</script>
