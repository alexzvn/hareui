<script setup lang="ts">
import { RichTable } from '@hareui/vue'

// Without `columns`, one column is created per key of the first row.
const data = [
  { id: 1, name: 'Emma Wilson', role: 'Admin' },
  { id: 2, name: 'Isabella Nguyen', role: 'Editor' },
  { id: 3, name: 'Jackson Lee', role: 'Viewer' },
]
</script>

<template>
  <RichTable :data="data" class="w-full" />
</template>
