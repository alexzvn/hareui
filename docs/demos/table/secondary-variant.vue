<script setup lang="ts">
import { Table } from '@hareui/vue'

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
</script>

<template>
  <Table aria-label="Team members" variant="secondary" :columns="columns" :rows="rows" :ui="{ content: 'min-w-[600px]' }" />
</template>
