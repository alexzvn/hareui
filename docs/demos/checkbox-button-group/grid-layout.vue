<script setup lang="ts">
import { CheckboxButtonGroup, CheckboxButtonGroupItem } from '@hareui/vue'

const extras = [
  { value: 'candles', label: 'Candles', description: 'A set of 12, mixed colors', price: 3.5 },
  { value: 'topper', label: 'Cake topper', description: 'Hand-lettered name or message', price: 6 },
  { value: 'box', label: 'Gift box', description: 'Ribboned box with a card', price: 4.25 },
  { value: 'sparkler', label: 'Sparklers', description: 'Four indoor-safe sparklers', price: 2.75 },
]

const eur = new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR' })
</script>

<template>
  <CheckboxButtonGroup
    class="w-[480px] grid-cols-2"
    layout="grid"
    name="cake-extras"
    label="Cake extras"
    variant="secondary"
    :default-value="['candles']"
  >
    <CheckboxButtonGroupItem
      v-for="extra in extras"
      :key="extra.value"
      :value="extra.value"
      :label="extra.label"
      :description="extra.description"
      :ui="{ itemDescription: 'mt-1' }"
    >
      <span class="mt-2 text-sm font-semibold">+{{ eur.format(extra.price) }}</span>
    </CheckboxButtonGroupItem>
  </CheckboxButtonGroup>
</template>
