<template>
  <div class="flex w-full flex-col gap-3">
    <RichTable
      ref="table"
      v-model:row-selection="rowSelection"
      :data="data"
      :columns="columns"
      :on-select="onSelect"
    />
    <p class="text-sm text-muted">
      {{ table?.tableApi?.getFilteredSelectedRowModel().rows.length || 0 }} of
      {{ table?.tableApi?.getFilteredRowModel().rows.length || 0 }} row(s) selected.
    </p>
  </div>
</template>

<script setup lang="ts">
import type { RichTableColumn, RichTableRow } from '@hareui/vue'
import { Avatar, Checkbox, Chip, RichTable } from '@hareui/vue'
import { Icon } from '@iconify/vue'
import { h, ref, useTemplateRef } from 'vue'

type Employee = {
  name: string
  email: string
  avatar: string
  department: string
  status: 'active' | 'pending' | 'inactive'
  joined: string
}

const data: Employee[] = [
  {
    name: 'Amara Okafor',
    email: 'amara.okafor@company.com',
    avatar: 'https://img.heroui.chat/image/avatar?w=200&h=200&u=25',
    department: 'Support',
    status: 'pending',
    joined: 'Jun 27, 2024',
  },
  {
    name: 'Elena Rodriguez',
    email: 'elena.rodriguez@company.com',
    avatar: 'https://img.heroui.chat/image/avatar?w=200&h=200&u=20',
    department: 'HR',
    status: 'active',
    joined: 'Jan 28, 2024',
  },
  {
    name: "James O'Brien",
    email: 'james.o.brien@company.com',
    avatar: 'https://img.heroui.chat/image/avatar?w=200&h=200&u=23',
    department: 'Finance',
    status: 'active',
    joined: 'Apr 14, 2024',
  },
  {
    name: 'Luca Bianchi',
    email: 'luca.bianchi@company.com',
    avatar: 'https://img.heroui.chat/image/avatar?w=200&h=200&u=26',
    department: 'Engineering',
    status: 'active',
    joined: 'Jul 25, 2024',
  },
  {
    name: 'Yuki Tanaka',
    email: 'yuki.tanaka@company.com',
    avatar: 'https://img.heroui.chat/image/avatar?w=200&h=200&u=22',
    department: 'Product',
    status: 'inactive',
    joined: 'May 8, 2024',
  },
]

const statusColor = { active: 'success', pending: 'warning', inactive: 'danger' } as const

const table = useTemplateRef('table')
const rowSelection = ref<Record<string, boolean>>({ 1: true })

const columns: RichTableColumn<Employee>[] = [
  {
    id: 'select',
    header: ({ table }) =>
      h(Checkbox, {
        modelValue: table.getIsSomePageRowsSelected()
          ? 'indeterminate'
          : table.getIsAllPageRowsSelected(),
        'onUpdate:modelValue': (value: boolean | 'indeterminate') =>
          table.toggleAllPageRowsSelected(!!value),
        'aria-label': 'Select all',
      }),
    // Row checkboxes sit on the white body card, so they take the filled `secondary` look
    cell: ({ row }) =>
      h(Checkbox, {
        variant: 'secondary',
        modelValue: row.getIsSelected(),
        'onUpdate:modelValue': (value: boolean | 'indeterminate') => row.toggleSelected(!!value),
        'aria-label': `Select ${row.original.name}`,
      }),
  },
  {
    accessorKey: 'name',
    header: 'Employee',
    cell: ({ row }) =>
      h('div', { class: 'flex items-center gap-3' }, [
        h(Avatar, {
          src: row.original.avatar,
          alt: row.original.name,
          size: 'sm',
          fallback: row.original.name.slice(0, 1),
        }),
        h('div', [
          h('p', { class: 'font-medium' }, row.original.name),
          h('p', { class: 'text-xs text-muted' }, row.original.email),
        ]),
      ]),
  },
  { accessorKey: 'department', header: 'Department' },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) =>
      h(
        Chip,
        {
          color: statusColor[row.original.status],
          variant: 'soft',
          size: 'sm',
          class: 'capitalize',
        },
        {
          leading: () => h(Icon, { icon: 'gravity-ui:circle-fill', width: 6, height: 16 }),
          default: () => row.original.status,
        },
      ),
  },
  { accessorKey: 'joined', header: 'Joined', meta: { class: { td: 'text-muted' } } },
]

const onSelect = (_: Event, row: RichTableRow<Employee>) => {
  row.toggleSelected(!row.getIsSelected())
}
</script>
