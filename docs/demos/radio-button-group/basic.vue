<script setup lang="ts">
import { RadioButtonGroup, RadioButtonGroupItem } from '@hareui/vue'

const roasts = [
  {
    value: 'light',
    title: 'Light roast',
    description: 'Bright and fruity, with citrus notes',
    price: 14,
  },
  {
    value: 'medium',
    title: 'Medium roast',
    description: 'Balanced, with caramel and cocoa',
    price: 13,
  },
  { value: 'dark', title: 'Dark roast', description: 'Bold and smoky, low acidity', price: 12 },
]

const eur = new Intl.NumberFormat('en-IE', {
  style: 'currency',
  currency: 'EUR',
  maximumFractionDigits: 0,
})
</script>

<template>
  <RadioButtonGroup
    class="w-[min(360px,calc(100vw-2rem))]"
    default-value="medium"
    name="roast"
    variant="secondary"
    label="Roast"
    description="Freshly roasted every Monday."
  >
    <RadioButtonGroupItem
      v-for="roast in roasts"
      :key="roast.value"
      :value="roast.value"
      :label="roast.title"
      :description="roast.description"
    >
      <span class="mt-2 text-sm font-semibold">
        {{ eur.format(roast.price) }}<span class="text-xs font-normal text-muted"> / 250 g</span>
      </span>
    </RadioButtonGroupItem>
  </RadioButtonGroup>
</template>
