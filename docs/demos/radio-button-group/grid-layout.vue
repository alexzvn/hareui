<script setup lang="ts">
import { RadioButtonGroup, RadioButtonGroupItem } from '@hareui/vue'

const rooms = [
  { value: 'single', title: 'Single', description: 'One bed, city view', price: 89 },
  { value: 'double', title: 'Double', description: 'Queen bed, balcony', price: 129 },
  { value: 'suite', title: 'Suite', description: 'Living room, sea view', price: 210 },
]

const eur = new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })
</script>

<template>
  <RadioButtonGroup
    class="w-full max-w-2xl grid-cols-1 sm:grid-cols-3"
    default-value="double"
    layout="grid"
    name="room-type"
    variant="secondary"
    label="Room type"
  >
    <RadioButtonGroupItem
      v-for="room in rooms"
      :key="room.value"
      :value="room.value"
      :label="room.title"
      :description="room.description"
      :ui="{ itemDescription: 'mt-1' }"
    >
      <span class="mt-2 text-sm font-semibold">
        {{ eur.format(room.price) }}<span class="text-xs font-normal text-muted"> / night</span>
      </span>
    </RadioButtonGroupItem>
  </RadioButtonGroup>
</template>
