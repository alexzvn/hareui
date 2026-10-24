<template>
  <RichTable
    :data="data"
    :columns="columns"
    :initial-state="{ sorting: [{ id: 'status', desc: false }] }"
    class="w-full"
  />
</template>

<script setup lang="ts">
import type { RichTableColumn } from '@hareui/vue'
import { RichTable } from '@hareui/vue'
import { Icon } from '@iconify/vue'
import { h } from 'vue'

interface Payment {
  name: string
  status: string
  amount: number
}

const data: Payment[] = [
  { name: 'Emma Wilson', status: 'paid', amount: 2450 },
  { name: 'Isabella Nguyen', status: 'refunded', amount: 299 },
  { name: 'Jackson Lee', status: 'processing', amount: 39 },
  { name: 'Liam Johnson', status: 'paid', amount: 150 },
  { name: 'William Kim', status: 'failed', amount: 99 },
]

const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })

// Sort statuses by their position in this list instead of alphabetically.
const order = ['failed', 'processing', 'paid', 'refunded']

function sortableHeader(
  column: { getIsSorted: () => false | 'asc' | 'desc'; toggleSorting: (desc?: boolean) => void },
  label: string,
) {
  const sorted = column.getIsSorted()
  return h(
    'button',
    {
      type: 'button',
      class:
        "-mx-1 inline-flex cursor-(--cursor-interactive) items-center gap-1 rounded-sm px-1 outline-none before:absolute before:inset-0 before:content-[''] hover:text-foreground focus-visible:status-focused",
      onClick: () => column.toggleSorting(sorted === 'asc'),
    },
    [
      label,
      h(Icon, {
        icon: 'gravity-ui:chevron-up',
        class: [
          'size-3 shrink-0 transition-transform duration-100 ease-out motion-reduce:transition-none',
          sorted === 'desc' && 'rotate-180',
          !sorted && 'opacity-0',
        ],
      }),
    ],
  )
}

const columns: RichTableColumn<Payment>[] = [
  { accessorKey: 'name', header: 'Customer' },
  {
    accessorKey: 'status',
    header: ({ column }) => sortableHeader(column, 'Status'),
    enableSorting: true,
    sortingFn: (a, b, id) =>
      order.indexOf(String(a.getValue(id))) - order.indexOf(String(b.getValue(id))),
    meta: { class: { td: 'capitalize' } },
  },
  {
    accessorKey: 'amount',
    header: 'Amount',
    cell: ({ row }) => currency.format(row.original.amount),
  },
]
</script>
