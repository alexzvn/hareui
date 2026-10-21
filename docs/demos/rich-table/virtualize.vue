<script setup lang="ts">
import type { RichTableColumn } from '@hareui/vue'
import { RichTable } from '@hareui/vue'

interface Row {
  id: number
  name: string
  email: string
}

const data: Row[] = Array.from({ length: 10_000 }, (_, i) => ({ id: i + 1, name: `User ${i + 1}`, email: `user${i + 1}@example.com` }))

const columns: RichTableColumn<Row>[] = [
  { accessorKey: 'id', header: '#' },
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'email', header: 'Email' },
]
</script>

<template>
  <RichTable
    sticky
    :data="data"
    :columns="columns"
    :virtualize="{ estimateSize: 45, overscan: 8 }"
    class="h-[420px] w-full"
  />
</template>
