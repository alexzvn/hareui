<template>
  <div class="flex w-full max-w-lg flex-col gap-8">
    <div v-for="example in examples" :key="example.label" class="flex flex-col gap-3">
      <span class="text-xs font-medium text-muted uppercase">{{ example.label }}</span>
      <Stepper :items="items" :linear="example.linear" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { StepperItem } from '@hareui/vue'
import { Stepper } from '@hareui/vue'

const examples = [
  { label: 'Linear', linear: true },
  { label: 'Non-linear', linear: false },
]

const items: StepperItem[] = [
  { title: 'Intro' },
  { title: 'Basics' },
  { title: 'Practice' },
  { title: 'Quiz' },
]
</script>
