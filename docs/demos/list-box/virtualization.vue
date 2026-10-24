<script setup lang="ts">
import type { ListBoxItem } from '@hareui/vue'
import { ListBox } from '@hareui/vue'
const firstNames = [
  'Emma',
  'Liam',
  'Olivia',
  'Noah',
  'Ava',
  'James',
  'Sophia',
  'Oliver',
  'Isabella',
  'Lucas',
  'Mia',
  'Ethan',
  'Charlotte',
  'Mason',
  'Amelia',
  'Logan',
  'Harper',
  'Alexander',
  'Ella',
  'Benjamin',
]
const lastNames = [
  'Smith',
  'Johnson',
  'Williams',
  'Brown',
  'Jones',
  'Garcia',
  'Miller',
  'Davis',
  'Rodriguez',
  'Martinez',
  'Anderson',
  'Taylor',
  'Thomas',
  'Jackson',
  'White',
  'Harris',
  'Clark',
  'Lewis',
  'Robinson',
  'Walker',
]
const users: ListBoxItem[] = Array.from({ length: 1000 }, (_, i) => {
  const first = firstNames[i % firstNames.length]!
  const last = lastNames[Math.floor(i / firstNames.length) % lastNames.length]!
  return {
    value: i + 1,
    label: `${first} ${last}`,
    description: `${first.toLowerCase()}.${last.toLowerCase()}@acme.com`,
  }
})
</script>

<template>
  <ListBox
    aria-label="Virtualized list with 1000 items"
    class="h-[400px] w-[300px] overflow-y-auto"
    :items="users"
    :virtualize="{ estimateSize: 50 }"
  />
</template>
