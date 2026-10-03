<script setup lang="ts">
import type { TableSortDescriptor } from '@hareui/vue'
import { Table } from '@hareui/vue'
import { computed, ref } from 'vue'

const columns = [
  { key: 'name', label: 'Name', isRowHeader: true, sortable: true },
  { key: 'role', label: 'Role', sortable: true },
  { key: 'status', label: 'Status', sortable: true },
  { key: 'email', label: 'Email', sortable: true },
]
const users = [
  { id: 1, name: 'Kate Moore', role: 'CEO', status: 'Active', email: 'kate@acme.com' },
  { id: 2, name: 'John Smith', role: 'CTO', status: 'Active', email: 'john@acme.com' },
  { id: 3, name: 'Sara Johnson', role: 'CMO', status: 'On Leave', email: 'sara@acme.com' },
  { id: 4, name: 'Michael Brown', role: 'CFO', status: 'Active', email: 'michael@acme.com' },
  { id: 5, name: 'Emily Davis', role: 'Product Manager', status: 'Inactive', email: 'emily@acme.com' },
]

const sortDescriptor = ref<TableSortDescriptor>({ column: 'name', direction: 'ascending' })
const rows = computed(() => {
  const { column, direction } = sortDescriptor.value
  const sorted = [...users].sort((a, b) => String(a[column as keyof typeof a]).localeCompare(String(b[column as keyof typeof b])))
  return direction === 'descending' ? sorted.reverse() : sorted
})
</script>

<template>
  <Table
    v-model:sort-descriptor="sortDescriptor"
    aria-label="Table with sorting"
    :columns="columns"
    :rows="rows"
    :ui="{ content: 'min-w-[600px]' }"
  />
</template>
