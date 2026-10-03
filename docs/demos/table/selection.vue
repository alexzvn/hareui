<script setup lang="ts">
import type { TableSelection } from '@hareui/vue'
import { Table } from '@hareui/vue'
import { ref } from 'vue'

const columns = [
  { key: 'name', label: 'Name', isRowHeader: true },
  { key: 'role', label: 'Role' },
  { key: 'status', label: 'Status' },
  { key: 'email', label: 'Email' },
]
const rows = [
  { id: 1, name: 'Kate Moore', role: 'CEO', status: 'Active', email: 'kate@acme.com' },
  { id: 2, name: 'John Smith', role: 'CTO', status: 'Active', email: 'john@acme.com' },
  { id: 3, name: 'Sara Johnson', role: 'CMO', status: 'On Leave', email: 'sara@acme.com' },
  { id: 4, name: 'Michael Brown', role: 'CFO', status: 'Active', email: 'michael@acme.com' },
]
const selectedKeys = ref<TableSelection>(new Set())
</script>

<template>
  <div class="flex flex-col gap-3">
    <Table
      v-model:selected-keys="selectedKeys"
      aria-label="Table with selection"
      :columns="columns"
      :rows="rows"
      selection-mode="multiple"
      :ui="{ content: 'min-w-[600px]' }"
    />
    <p class="text-sm text-muted">
      Selected:
      <span class="font-medium">{{ selectedKeys === 'all' ? 'All' : selectedKeys.size > 0 ? [...selectedKeys].join(', ') : 'None' }}</span>
    </p>
  </div>
</template>
