<template>
  <div class="flex w-full max-w-lg flex-col gap-8">
    <Stepper
      :items="items"
      color="default"
      :default-value="2"
      class="[--stepper-inactive-border:var(--foreground)] [--stepper-inactive-fg:var(--foreground)]"
    />
    <Stepper
      :items="items"
      :default-value="2"
      class="[--stepper-active-color:var(--warning)] [--stepper-separator-size:4px]"
    />
  </div>
</template>

<script setup lang="ts">
import type { StepperItem } from '@hareui/vue'
import { Stepper } from '@hareui/vue'

const items: StepperItem[] = [
  { title: 'Sketch' },
  { title: 'Ink' },
  { title: 'Color' },
  { title: 'Print' },
]
</script>
