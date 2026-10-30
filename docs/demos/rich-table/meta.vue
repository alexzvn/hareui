<template>
  <RichTable
    :data="data"
    :columns="columns"
    :meta="{ class: { tr: (row) => (row.original.status === 'failed' ? '*:bg-danger/5' : '') } }"
    class="w-full"
  />
</template>

<script setup lang="ts">
import type { RichTableColumn } from '@hareui/vue'
import { RichTable } from '@hareui/vue'

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

// `meta` on a column styles its header and cells, and can span cells; `meta` on the table styles rows.
const columns: RichTableColumn<Payment>[] = [
  {
    accessorKey: 'name',
    header: 'Customer',
    meta: { class: { th: 'text-foreground', td: 'font-medium' } },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    meta: {
      class: {
        td: (cell) => (cell.getValue() === 'failed' ? 'capitalize text-danger' : 'capitalize'),
      },
    },
  },
  {
    accessorKey: 'amount',
    header: 'Amount',
    cell: ({ row }) => currency.format(row.original.amount),
    meta: {
      class: { th: 'text-end', td: 'text-end' },
      style: { td: { fontVariantNumeric: 'tabular-nums' } },
    },
  },
]
</script>
