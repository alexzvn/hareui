<template>
  <RichTable v-model:sorting="sorting" :data="data" :columns="columns" class="w-full" />
</template>

<script setup lang="ts">
import type { RichTableColumn } from '@hareui/vue'
import { RichTable } from '@hareui/vue'
import { Icon } from '@iconify/vue'
import { h, ref } from 'vue'

type Payment = {
  name: string
  status: string
  amount: number
}

const data: Payment[] = [
  { name: 'Emma Wilson', status: 'paid', amount: 2450 },
  { name: 'Isabella Nguyen', status: 'paid', amount: 299 },
  { name: 'Jackson Lee', status: 'processing', amount: 39 },
  { name: 'Liam Johnson', status: 'refunded', amount: 150 },
  { name: 'William Kim', status: 'failed', amount: 99 },
]

const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })
const sorting = ref([{ id: 'amount', desc: true }])

// The whole header cell toggles the sort; one chevron turns with the direction and stays hidden while unsorted.
const sortableHeader = (
  column: { getIsSorted: () => false | 'asc' | 'desc'; toggleSorting: (desc?: boolean) => void },
  label: string,
) => {
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
  {
    accessorKey: 'name',
    header: ({ column }) => sortableHeader(column, 'Customer'),
    enableSorting: true,
  },
  {
    accessorKey: 'status',
    header: ({ column }) => sortableHeader(column, 'Status'),
    enableSorting: true,
    meta: { class: { td: 'capitalize' } },
  },
  {
    accessorKey: 'amount',
    header: ({ column }) => sortableHeader(column, 'Amount'),
    enableSorting: true,
    cell: ({ row }) => currency.format(row.original.amount),
  },
]
</script>
