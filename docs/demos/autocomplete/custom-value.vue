<script setup lang="ts">
import type { ListBoxItem } from '@hareui/vue'
import { Autocomplete } from '@hareui/vue'

interface Currency extends ListBoxItem {
  code: string
  name: string
  symbol: string
}

const currencies = [
  { value: 'usd', code: 'USD', name: 'US Dollar', symbol: '$' },
  { value: 'eur', code: 'EUR', name: 'Euro', symbol: '€' },
  { value: 'gbp', code: 'GBP', name: 'British Pound', symbol: '£' },
  { value: 'jpy', code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
  { value: 'chf', code: 'CHF', name: 'Swiss Franc', symbol: '₣' },
]
const items: Currency[] = currencies.map(c => ({ ...c, label: c.code, description: c.name, textValue: `${c.code} ${c.name}` }))
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
      <template v-if="isPlaceholder || !selectedItems[0]">
        {{ text }}
      </template>
      <span v-else class="flex min-w-0 items-center gap-1.5">
        <span class="font-medium">{{ selectedItems[0]!.symbol }}</span>
        <span>{{ selectedItems[0]!.code }}</span>
        <span class="truncate text-muted">{{ selectedItems[0]!.name }}</span>
      </span>
    </template>
    <template #empty>
      No results found
    </template>
  </Autocomplete>
</template>
