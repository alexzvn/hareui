<template>
  <ListView
    :items="items"
    selectable
    multiple
    virtualize
    aria-label="Transactions"
    class="h-96 max-w-md"
  />
</template>

<script setup lang="ts">
import type { ListViewItem } from '@hareui/vue'
import { ListView } from '@hareui/vue'

const MERCHANTS = [
  'Corner bakery',
  'City transit',
  'Bookshop',
  'Grocery market',
  'Cinema',
  'Pharmacy',
]

// 5,000 rows, of which only those in view are rendered
const items: ListViewItem[] = Array.from({ length: 5000 }, (_, index) => ({
  value: index,
  label: `${MERCHANTS[index % MERCHANTS.length]} #${index + 1}`,
  description: `€${(4.5 + ((index * 7.31) % 120)).toFixed(2)}`,
}))
</script>
