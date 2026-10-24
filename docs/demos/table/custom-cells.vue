<template>
  <Table
    v-model:selected-keys="selectedKeys"
    v-model:sort-descriptor="sortDescriptor"
    aria-label="Table with custom cells"
    :columns="columns"
    :rows="rows"
    selection-mode="multiple"
    :ui="{ content: 'min-w-[800px]' }"
  >
    <template #actions-header>
      <span class="block text-end">Actions</span>
    </template>
    <template #id-cell="{ row }">
      <div class="flex items-center gap-2 font-medium">
        #{{ row.id }}
        <Button :aria-label="`Copy ID #${row.id}`" icon-only size="sm" variant="ghost">
          <Icon class="size-4 text-muted" icon="gravity-ui:copy" />
        </Button>
      </div>
    </template>
    <template #name-cell="{ row }">
      <div class="flex items-center gap-3">
        <Avatar alt="" :fallback="initials(row.name)" size="sm" :src="row.image_url" />
        <div class="flex flex-col">
          <span class="text-xs">{{ row.name }}</span>
          <span class="text-xs text-muted">{{ row.email }}</span>
        </div>
      </div>
    </template>
    <template #status-cell="{ row }">
      <Chip :color="statusColorMap[row.status]" size="sm" variant="soft">{{ row.status }}</Chip>
    </template>
    <template #actions-cell="{ row }">
      <div class="flex items-center gap-1">
        <Button :aria-label="`View ${row.name}`" icon-only size="sm" variant="tertiary">
          <Icon class="size-4" icon="gravity-ui:eye" />
        </Button>
        <Button :aria-label="`Edit ${row.name}`" icon-only size="sm" variant="tertiary">
          <Icon class="size-4" icon="gravity-ui:pencil" />
        </Button>
        <Button :aria-label="`Delete ${row.name}`" icon-only size="sm" variant="danger-soft">
          <Icon class="size-4" icon="gravity-ui:trash-bin" />
        </Button>
      </div>
    </template>
  </Table>
</template>

<script setup lang="ts">
import type { TableColumn, TableSelection, TableSortDescriptor } from '@hareui/vue'
import { Avatar, Button, Chip, Table } from '@hareui/vue'
import { Icon } from '@iconify/vue'
import { computed, ref } from 'vue'

const statusColorMap = { Active: 'success', Inactive: 'danger', 'On Leave': 'warning' } as const
type Status = keyof typeof statusColorMap
const AVATARS = 'https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars'

const users: {
  id: number
  name: string
  image_url: string
  role: string
  status: Status
  email: string
}[] = [
  {
    id: 4586932,
    name: 'Kate Moore',
    image_url: `${AVATARS}/red.jpg`,
    role: 'Chief Executive Officer',
    status: 'Active',
    email: 'kate@acme.com',
  },
  {
    id: 5273849,
    name: 'John Smith',
    image_url: `${AVATARS}/green.jpg`,
    role: 'Chief Technology Officer',
    status: 'Active',
    email: 'john@acme.com',
  },
  {
    id: 7492836,
    name: 'Sara Johnson',
    image_url: `${AVATARS}/blue.jpg`,
    role: 'Chief Marketing Officer',
    status: 'On Leave',
    email: 'sara@acme.com',
  },
  {
    id: 8293746,
    name: 'Michael Brown',
    image_url: `${AVATARS}/purple.jpg`,
    role: 'Chief Financial Officer',
    status: 'Active',
    email: 'michael@acme.com',
  },
  {
    id: 1234567,
    name: 'Emily Davis',
    image_url: `${AVATARS}/orange.jpg`,
    role: 'Product Manager',
    status: 'Inactive',
    email: 'emily@acme.com',
  },
]

const columns: TableColumn[] = [
  { key: 'id', label: 'Worker ID', isRowHeader: true, sortable: true, class: 'after:hidden' },
  { key: 'name', label: 'Member', sortable: true },
  { key: 'role', label: 'Role', sortable: true, class: 'min-w-52' },
  { key: 'status', label: 'Status', sortable: true, class: 'min-w-25' },
  { key: 'actions', label: 'Actions' },
]

const selectedKeys = ref<TableSelection>(new Set())
const sortDescriptor = ref<TableSortDescriptor>({ column: 'name', direction: 'ascending' })
const rows = computed(() => {
  const { column, direction } = sortDescriptor.value
  return [...users].sort((a, b) => {
    const cmp = String(a[column as keyof typeof a]).localeCompare(
      String(b[column as keyof typeof b]),
    )

    return direction === 'descending' ? -cmp : cmp
  })
})

const initials = (name: string) =>
  name
    .split(' ')
    .map((n) => n[0])
    .join('')
</script>
