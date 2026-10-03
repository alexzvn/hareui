<script setup lang="ts">
import { Autocomplete } from '@hareui/vue'

const currencies = [
  { value: 'usd', code: 'USD', name: 'US Dollar', symbol: '$' },
  { value: 'eur', code: 'EUR', name: 'Euro', symbol: '€' },
  { value: 'gbp', code: 'GBP', name: 'British Pound', symbol: '£' },
  { value: 'jpy', code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
  { value: 'chf', code: 'CHF', name: 'Swiss Franc', symbol: '₣' },
]
const items = currencies.map(c => ({ value: c.value, label: c.code, description: c.name, textValue: `${c.code} ${c.name}` }))
const byValue = new Map(currencies.map(c => [c.value, c]))
</script>

<template>
  <Autocomplete
    class="w-[256px]"
    default-value="usd"
    label="Currency"
    placeholder="Select a currency"
    search-label="Search currencies"
    search-placeholder="Search currencies..."
    :items="items"
  >
    <template #value="{ selectedItems, isPlaceholder, text }">
      <template v-if="isPlaceholder || !byValue.get(String(selectedItems[0]?.value))">
        {{ text }}
      </template>
      <span v-else class="flex min-w-0 items-center gap-1.5">
        <span class="font-medium">{{ byValue.get(String(selectedItems[0]!.value))!.symbol }}</span>
        <span>{{ byValue.get(String(selectedItems[0]!.value))!.code }}</span>
        <span class="truncate text-muted">{{ byValue.get(String(selectedItems[0]!.value))!.name }}</span>
      </span>
    </template>
    <template #empty>
      No results found
    </template>
  </Autocomplete>
</template>
