<template>
  <div class="flex w-full max-w-sm flex-col gap-5">
    <h3 class="text-lg font-semibold text-foreground">Your 30-day trial</h3>

    <Stepper
      :items="items"
      orientation="vertical"
      size="lg"
      color="default"
      disabled
      :ui="{ description: 'text-sm' }"
    />
  </div>
</template>

<script setup lang="ts">
import type { StepperItem } from '@hareui/vue'
import { Stepper } from '@hareui/vue'
import { Icon } from '@iconify/vue'
import { h } from 'vue'

const icon = (name: string) => (attrs: Record<string, unknown>) =>
  h(Icon, { ...attrs, icon: `gravity-ui:${name}` })

const items: StepperItem[] = [
  {
    title: 'Now',
    description: 'Every feature unlocked, for you and up to five teammates.',
    icon: icon('sparkles'),
  },
  {
    title: 'Day 25',
    description: 'We email you before anything changes, so there are no surprises.',
    icon: icon('envelope'),
  },
  {
    title: 'Day 30',
    description: 'Pick a plan to keep going, or stay on the free tier.',
    icon: icon('credit-card'),
  },
]
</script>
