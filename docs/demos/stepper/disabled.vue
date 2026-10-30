<template>
  <div class="flex w-full max-w-lg flex-col gap-8">
    <div class="flex flex-col gap-3">
      <span class="text-xs font-medium text-muted uppercase">Disabled stepper</span>
      <Stepper :items="items" :default-value="2" disabled />
    </div>
    <div class="flex flex-col gap-3">
      <span class="text-xs font-medium text-muted uppercase">Disabled step</span>
      <Stepper :items="itemsWithDisabledStep" :default-value="1" :linear="false" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { StepperItem } from '@hareui/vue'
import { Stepper } from '@hareui/vue'

const items: StepperItem[] = [
  { title: 'Received' },
  { title: 'Sorted' },
  { title: 'Repairing' },
  { title: 'Returned' },
]

const itemsWithDisabledStep: StepperItem[] = items.map((item) =>
  item.title === 'Repairing' ? { ...item, disabled: true } : item,
)
</script>
