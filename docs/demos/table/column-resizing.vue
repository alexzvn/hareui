<script setup lang="ts">
import type { TableColumn, TableRow } from '@hareui/vue'
import { Chip, Table } from '@hareui/vue'

const columns: TableColumn[] = [
  { key: 'name', label: 'Name', isRowHeader: true, minWidth: 160, resizable: true },
  { key: 'role', label: 'Role', minWidth: 220, resizable: true },
  { key: 'status', label: 'Status', minWidth: 100, resizable: true },
  { key: 'email', label: 'Email', minWidth: 200 },
]
const rows: TableRow[] = [
  {
    id: 1,
    name: 'Kate Moore',
    role: 'CEO',
    status: 'Active',
    color: 'success',
    email: 'kate@acme.com',
  },
  {
    id: 2,
    name: 'John Smith',
    role: 'CTO',
    status: 'Active',
    color: 'success',
    email: 'john@acme.com',
  },
  {
    id: 3,
    name: 'Sara Johnson',
    role: 'CMO',
    status: 'On Leave',
    color: 'warning',
    email: 'sara@acme.com',
  },
  {
    id: 4,
    name: 'Michael Brown',
    role: 'CFO',
    status: 'Active',
    color: 'success',
    email: 'michael@acme.com',
  },
  {
    id: 5,
    name: 'Emily Davis',
    role: 'Product Manager',
    status: 'Inactive',
    color: 'danger',
    email: 'emily@acme.com',
  },
]
</script>

<template>
  <Table
    aria-label="Table with resizable columns"
    :columns="columns"
    :rows="rows"
    :ui="{ content: 'min-w-[700px]' }"
  >
    <template #status-cell="{ row }">
      <Chip :color="row.color" size="sm" variant="soft">{{ row.status }}</Chip>
    </template>
  </Table>
</template>
