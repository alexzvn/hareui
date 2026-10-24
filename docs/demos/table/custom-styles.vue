<template>
  <Table
    aria-label="Team members"
    class="w-full max-w-2xl overflow-hidden rounded-xl border border-border/80 shadow-sm ring-1 ring-black/5 dark:ring-white/10"
    :columns="columns"
    :rows="rows"
    :ui="{
      content: 'min-w-[600px]',
      header: 'bg-neutral-100/80 dark:bg-neutral-800/80',
      column:
        'text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400',
      row: 'border-t border-border/60 transition-colors hover:bg-neutral-100/60 even:bg-neutral-50/50 dark:hover:bg-neutral-800/50 dark:even:bg-neutral-900/30',
    }"
  >
    <template #name-cell="{ value }">
      <span class="font-medium text-neutral-900 dark:text-neutral-100">{{ value }}</span>
    </template>
  </Table>
</template>

<script setup lang="ts">
import type { TableColumn, TableRow } from '@hareui/vue'
import { Table } from '@hareui/vue'

const columns: TableColumn[] = [
  { key: 'name', label: 'Name', isRowHeader: true },
  { key: 'role', label: 'Role' },
  { key: 'status', label: 'Status' },
]
const rows: TableRow[] = [
  { id: 1, name: 'Kate Moore', role: 'CEO', status: 'Active' },
  { id: 2, name: 'John Smith', role: 'CTO', status: 'Active' },
  { id: 3, name: 'Sara Johnson', role: 'CMO', status: 'On leave' },
]
</script>
