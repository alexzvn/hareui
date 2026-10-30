<template>
  <div class="flex flex-wrap gap-10">
    <div v-for="color in colors" :key="color" class="flex flex-col gap-3">
      <span class="text-xs font-medium text-muted capitalize">{{ color }}</span>
      <Stepper :items="items" orientation="vertical" :color="color" :default-value="2" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { StepperItem } from '@hareui/vue'
import { Stepper } from '@hareui/vue'

const colors = ['accent', 'success', 'danger', 'default'] as const

const items: StepperItem[] = [
  { title: 'Request', description: 'Leave dates sent' },
  { title: 'Manager', description: 'Approved by Lena' },
  { title: 'HR', description: 'Checking balance' },
  { title: 'Calendar', description: 'Added to the rota' },
]
</script>
