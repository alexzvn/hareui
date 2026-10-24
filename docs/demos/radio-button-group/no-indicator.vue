<template>
  <RadioButtonGroup
    class="w-[min(360px,calc(100vw-2rem))]"
    default-value="medium"
    name="pizza-size"
    label="Pizza size"
  >
    <RadioButtonGroupItem
      v-for="size in sizes"
      :key="size.value"
      :value="size.value"
      :label="size.title"
      :description="size.description"
      :indicator="false"
    >
      <span class="mt-2 text-sm font-semibold">{{ eur.format(size.price) }}</span>
    </RadioButtonGroupItem>
  </RadioButtonGroup>
</template>

<script setup lang="ts">
import { RadioButtonGroup, RadioButtonGroupItem } from '@hareui/vue'

const sizes = [
  { value: 'small', title: 'Small', description: '25 cm, 6 slices', price: 9.5 },
  { value: 'medium', title: 'Medium', description: '30 cm, 8 slices', price: 12 },
  { value: 'large', title: 'Large', description: '35 cm, 10 slices', price: 14.5 },
]

const eur = new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR' })
</script>
