<script setup lang="ts">
import type { TableSelection, TableSortDescriptor } from 'herouse'
import { Table } from 'herouse'
import { computed, ref } from 'vue'

const columns = [
  { key: 'name', label: 'Name', isRowHeader: true, sortable: true, resizable: true, minWidth: 120 },
  { key: 'role', label: 'Role', sortable: true },
  { key: 'email', label: 'Email' },
]
const users = [
  { id: 1, name: 'Kate Moore', role: 'CEO', email: 'kate@acme.com' },
  { id: 2, name: 'John Smith', role: 'CTO', email: 'john@acme.com', disabled: true },
  { id: 3, name: 'Sara Johnson', role: 'CMO', email: 'sara@acme.com', children: [{ id: 4, name: 'Michael Brown', role: 'CFO', email: 'michael@acme.com' }] },
]
const selectedKeys = ref<TableSelection>(new Set())
const sortDescriptor = ref<TableSortDescriptor>({ column: 'name', direction: 'ascending' })
const rows = computed(() => {
  const { column, direction } = sortDescriptor.value
  const sorted = [...users].sort((a, b) => String(a[column as 'name']).localeCompare(String(b[column as 'name'])))
  return direction === 'descending' ? sorted.reverse() : sorted
})
</script>

<template>
  <div class="flex flex-col gap-8">
    <h1 class="text-xl font-semibold">Table</h1>
    <Table
      v-model:selected-keys="selectedKeys"
      v-model:sort-descriptor="sortDescriptor"
      aria-label="Playground"
      :columns="columns"
      :rows="rows"
      selection-mode="multiple"
      tree-column="name"
    />
    <p class="text-sm text-muted">Selected: {{ selectedKeys === 'all' ? 'all' : [...selectedKeys].join(', ') || 'none' }}</p>
    <Table aria-label="Secondary" :columns="columns" :rows="rows" variant="secondary" />
  </div>
</template>
