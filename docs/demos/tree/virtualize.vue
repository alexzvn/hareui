<template>
  <Tree :items="items" virtualize class="h-80 w-80" />
</template>

<script setup lang="ts">
import type { TreeItem } from '@hareui/vue'
import { Tree } from '@hareui/vue'

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

// 12 months of daily logs: about 370 rows, of which only those in view are rendered.
const items: TreeItem[] = MONTHS.map((month, index) => ({
  label: month,
  defaultExpanded: index === 0,
  children: Array.from({ length: 30 }, (_, day) => ({ label: `${month} ${day + 1}.log` })),
}))
</script>
