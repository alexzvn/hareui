<template>
  <div class="flex w-full max-w-lg flex-col gap-8">
    <div v-for="color in colors" :key="color" class="flex flex-col gap-3">
      <span class="text-xs font-medium text-muted capitalize">{{ color }}</span>
      <Stepper :items="items" :color="color" :default-value="2" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { StepperItem } from '@hareui/vue'
import { Stepper } from '@hareui/vue'

const colors = ['accent', 'success', 'warning', 'danger', 'default'] as const

const items: StepperItem[] = [
  { title: 'Scan' },
  { title: 'Verify' },
  { title: 'Sign' },
  { title: 'Archive' },
]
</script>
