<template>
  <Stepper :items="items" :default-value="1" class="w-full max-w-xl" />
</template>

<script setup lang="ts">
import type { StepperItem } from '@hareui/vue'
import { Stepper } from '@hareui/vue'
import { Icon } from '@iconify/vue'
import { h } from 'vue'

const icon = (name: string) => (attrs: Record<string, unknown>) =>
  h(Icon, { ...attrs, icon: `gravity-ui:${name}` })

const items: StepperItem[] = [
  { title: 'Destination', description: 'Where to', icon: icon('map-pin') },
  { title: 'Flights', description: 'Pick your seats', icon: icon('plane') },
  { title: 'Hotel', description: 'Book a room', icon: icon('house') },
  { title: 'Payment', description: 'Pay securely', icon: icon('credit-card') },
]
</script>
