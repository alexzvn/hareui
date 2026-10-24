<template>
  <Table
    aria-label="Async loading table"
    :columns="columns"
    :has-more="hasMore"
    :loading="loading"
    :rows="items"
    :ui="{
      scrollContainer: 'h-[280px] overflow-y-auto',
      content: 'min-w-[600px]',
      header: 'sticky top-0 z-10 bg-surface-secondary',
    }"
    @load-more="loadMore"
  >
    <template #status-cell="{ row }">
      <Chip :color="statusColorMap[row.status as Status]" size="sm" variant="soft">{{
        row.status
      }}</Chip>
    </template>
  </Table>
</template>

<script setup lang="ts">
import type { TableColumn } from '@hareui/vue'
import { Chip, Table } from '@hareui/vue'
import { computed, ref } from 'vue'

const statusColorMap = { Active: 'success', Inactive: 'danger', 'On Leave': 'warning' } as const
type Status = keyof typeof statusColorMap

const allUsers: { id: number; name: string; role: string; status: Status; email: string }[] = [
  { id: 1, name: 'Kate Moore', role: 'CEO', status: 'Active', email: 'kate@acme.com' },
  { id: 2, name: 'John Smith', role: 'CTO', status: 'Active', email: 'john@acme.com' },
  { id: 3, name: 'Sara Johnson', role: 'CMO', status: 'On Leave', email: 'sara@acme.com' },
  { id: 4, name: 'Michael Brown', role: 'CFO', status: 'Active', email: 'michael@acme.com' },
  {
    id: 5,
    name: 'Emily Davis',
    role: 'Product Manager',
    status: 'Inactive',
    email: 'emily@acme.com',
  },
  { id: 6, name: 'Davis Wilson', role: 'Lead Designer', status: 'Active', email: 'davis@acme.com' },
  {
    id: 7,
    name: 'Olivia Martinez',
    role: 'Frontend Engineer',
    status: 'Active',
    email: 'olivia@acme.com',
  },
  {
    id: 8,
    name: 'James Taylor',
    role: 'Backend Engineer',
    status: 'Active',
    email: 'james@acme.com',
  },
  {
    id: 9,
    name: 'Sophia Anderson',
    role: 'QA Engineer',
    status: 'On Leave',
    email: 'sophia@acme.com',
  },
  {
    id: 10,
    name: 'Liam Thomas',
    role: 'DevOps Engineer',
    status: 'Active',
    email: 'liam@acme.com',
  },
  {
    id: 11,
    name: 'Lucas Martinez',
    role: 'Product Manager',
    status: 'Active',
    email: 'lucas@acme.com',
  },
  {
    id: 12,
    name: 'Emma Johnson',
    role: 'Frontend Engineer',
    status: 'Active',
    email: 'emma@acme.com',
  },
  {
    id: 13,
    name: 'Noah Davis',
    role: 'Backend Engineer',
    status: 'Active',
    email: 'noah@acme.com',
  },
  { id: 14, name: 'Ava Wilson', role: 'Lead Designer', status: 'Active', email: 'ava@acme.com' },
  {
    id: 15,
    name: 'Oliver Martinez',
    role: 'Frontend Engineer',
    status: 'Active',
    email: 'oliver@acme.com',
  },
  {
    id: 16,
    name: 'Isabella Johnson',
    role: 'Backend Engineer',
    status: 'Active',
    email: 'isabella@acme.com',
  },
  { id: 17, name: 'Mia Davis', role: 'Lead Designer', status: 'Active', email: 'mia@acme.com' },
  {
    id: 18,
    name: 'William Wilson',
    role: 'Frontend Engineer',
    status: 'Active',
    email: 'william@acme.com',
  },
]
const ITEMS_PER_PAGE = 6

const columns: TableColumn[] = [
  { key: 'name', label: 'Name', isRowHeader: true },
  { key: 'role', label: 'Role' },
  { key: 'status', label: 'Status' },
  { key: 'email', label: 'Email' },
]

const items = ref(allUsers.slice(0, ITEMS_PER_PAGE))
const loading = ref(false)
const hasMore = computed(() => items.value.length < allUsers.length)

function loadMore() {
  if (!hasMore.value || loading.value) return
  loading.value = true
  setTimeout(() => {
    items.value = allUsers.slice(0, items.value.length + ITEMS_PER_PAGE)
    loading.value = false
  }, 1500)
}
</script>
