<template>
  <div class="flex w-full flex-col gap-3">
    <RichTable
      v-model:row-selection="rowSelection"
      v-model:data="tasks"
      :columns="columns"
      :get-row-id="(task) => task.id"
      reorderable
    />
    <p class="text-sm text-muted">
      Sprint backlog: select tasks to move them together. Next up: {{ tasks[0]?.title }}.
    </p>
  </div>
</template>

<script setup lang="ts">
import type { RichTableColumn } from '@hareui/vue'
import { Avatar, Checkbox, Chip, RichTable } from '@hareui/vue'
import { h, ref } from 'vue'

type Task = {
  id: string
  title: string
  owner: string
  avatar: string
  points: number
  status: 'todo' | 'in progress' | 'review'
}

const avatar = (u: number) => `https://img.heroui.chat/image/avatar?w=200&h=200&u=${u}`

const tasks = ref<Task[]>([
  {
    id: 'T-101',
    title: 'Sign-in with passkeys',
    owner: 'Mia',
    avatar: avatar(5),
    points: 5,
    status: 'in progress',
  },
  {
    id: 'T-102',
    title: 'Export invoices as CSV',
    owner: 'Leo',
    avatar: avatar(12),
    points: 3,
    status: 'todo',
  },
  {
    id: 'T-103',
    title: 'Fix timezone in reminders',
    owner: 'Ava',
    avatar: avatar(25),
    points: 2,
    status: 'review',
  },
  {
    id: 'T-104',
    title: 'Onboarding checklist',
    owner: 'Noah',
    avatar: avatar(8),
    points: 8,
    status: 'todo',
  },
  {
    id: 'T-105',
    title: 'Dark mode for charts',
    owner: 'Mia',
    avatar: avatar(5),
    points: 3,
    status: 'todo',
  },
])

const rowSelection = ref<Record<string, boolean>>({})

const statusColors = { todo: 'default', 'in progress': 'accent', review: 'warning' } as const

const columns: RichTableColumn<Task>[] = [
  {
    id: 'rank',
    header: '#',
    cell: ({ row }) => h('span', { class: 'text-muted tabular-nums' }, `#${row.index + 1}`),
  },
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
        'aria-label': `Select ${row.original.title}`,
      }),
  },
  { accessorKey: 'title', header: 'Task' },
  {
    accessorKey: 'owner',
    header: 'Owner',
    cell: ({ row }) =>
      h('div', { class: 'flex items-center gap-2' }, [
        h(Avatar, {
          src: row.original.avatar,
          alt: row.original.owner,
          size: 'sm',
          fallback: row.original.owner.slice(0, 1),
        }),
        row.original.owner,
      ]),
  },
  { accessorKey: 'points', header: 'Points' },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) =>
      h(
        Chip,
        {
          color: statusColors[row.original.status],
          variant: 'soft',
          size: 'sm',
          class: 'capitalize',
        },
        () => row.original.status,
      ),
  },
]
</script>
