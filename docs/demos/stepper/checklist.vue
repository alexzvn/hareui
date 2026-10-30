<template>
  <div class="flex w-full max-w-sm flex-col gap-5">
    <h3 class="text-lg font-semibold text-foreground">Set up your store</h3>

    <Stepper
      :items="items"
      orientation="vertical"
      size="lg"
      :default-value="1"
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
    title: 'Store created',
    description: 'Your storefront is live on a free subdomain.',
    icon: icon('house'),
  },
  {
    title: 'Add products',
    description: 'Upload photos, prices and stock for your first items.',
    icon: icon('shopping-bag'),
  },
  {
    title: 'Get paid',
    description: 'Connect a bank account to receive payouts.',
    icon: icon('credit-card'),
  },
]
</script>
