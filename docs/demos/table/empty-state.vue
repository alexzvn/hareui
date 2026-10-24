<script setup lang="ts">
import type { TableColumn } from '@hareui/vue'
import { EmptyState, Table } from '@hareui/vue'
import { Icon } from '@iconify/vue'

const columns: TableColumn[] = [
  { key: 'name', label: 'Name', isRowHeader: true },
  { key: 'role', label: 'Role' },
  { key: 'status', label: 'Status' },
  { key: 'email', label: 'Email' },
]
</script>

<template>
  <Table
    aria-label="Empty table"
    class="min-h-[200px]"
    :columns="columns"
    :rows="[]"
    :ui="{ content: 'h-full min-w-[600px]' }"
  >
    <template #empty>
      <EmptyState class="flex h-full w-full flex-col items-center justify-center gap-4 text-center">
        <Icon class="size-6 text-muted" icon="gravity-ui:tray" />
        <span class="text-sm text-muted">No results found</span>
      </EmptyState>
    </template>
  </Table>
</template>
