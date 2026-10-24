<script setup lang="ts">
import type { SelectValue } from '@hareui/vue'
import { CellSelect } from '@hareui/vue'
import { computed, ref } from 'vue'

const fareInEuro = 240
const currencies = [
  { value: 'EUR', label: 'Euro', rate: 1 },
  { value: 'USD', label: 'US Dollar', rate: 1.08 },
  { value: 'JPY', label: 'Yen', rate: 162 },
]

const currency = ref<SelectValue>('EUR')
const fare = computed(() => {
  const option = currencies.find(item => item.value === currency.value) ?? currencies[0]!
  return new Intl.NumberFormat('en', { style: 'currency', currency: option.value, maximumFractionDigits: 0 }).format(fareInEuro * option.rate)
})
</script>

<template>
  <div class="w-72 overflow-hidden rounded-2xl border border-separator">
    <div class="p-3">
      <CellSelect v-model="currency" :items="currencies" label="Currency" />
    </div>
    <footer class="flex items-center justify-between border-t border-separator px-4 py-2.5 text-xs">
      <span class="text-muted">Lisbon → Oslo</span>
      <span class="font-semibold tabular-nums">{{ fare }}</span>
    </footer>
  </div>
</template>
