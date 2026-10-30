<template>
  <Stepper :items="items" :default-value="1" class="w-full max-w-lg" />
</template>

<script setup lang="ts">
import type { StepperItem } from '@hareui/vue'
import { Stepper } from '@hareui/vue'

const items: StepperItem[] = [
  { title: 'Basket' },
  { title: 'Delivery' },
  { title: 'Checkout' },
  { title: 'Receipt' },
]
</script>
