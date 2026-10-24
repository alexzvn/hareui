<script setup lang="ts">
import { RadioButtonGroup, RadioButtonGroupItem } from '@hareui/vue'
import { ref } from 'vue'

const seats = [
  { value: 'standard', title: 'Standard', description: 'Reclining seat and a power outlet', price: 39 },
  { value: 'comfort', title: 'Comfort', description: 'Extra legroom in a quiet coach', price: 58 },
  { value: 'first', title: 'First', description: 'Wide seat, meal served at your seat', price: 94 },
]

const eur = new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })

const seat = ref('comfort')
</script>

<template>
  <div class="flex w-[min(360px,calc(100vw-2rem))] flex-col gap-4">
    <RadioButtonGroup
      v-model="seat"
      name="seat-class"
      variant="secondary"
      label="Seat class"
      description="Paris to Lyon, 08:12 departure"
    >
      <RadioButtonGroupItem
        v-for="option in seats"
        :key="option.value"
        :value="option.value"
        :label="option.title"
        :description="option.description"
      >
        <span class="mt-2 text-sm font-semibold">{{ eur.format(option.price) }}</span>
      </RadioButtonGroupItem>
    </RadioButtonGroup>
    <p class="text-sm text-muted">
      Selected: <span class="font-medium text-foreground">{{ seat }}</span>
    </p>
  </div>
</template>
