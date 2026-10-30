<template>
  <Stepper :items="items" :default-value="1" class="w-full max-w-xl" />
</template>

<script setup lang="ts">
import type { StepperItem } from '@hareui/vue'
import { Stepper } from '@hareui/vue'

const items: StepperItem[] = [
  { title: 'Workspace', description: 'Pick a name' },
  { title: 'Members', description: 'Invite people' },
  { title: 'Billing', description: 'Choose a plan' },
  { title: 'Launch', description: 'Go live' },
]
</script>
