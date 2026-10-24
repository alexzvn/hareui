<template>
  <RichTable
    :data="data"
    :columns="columns"
    class="w-full rounded-xl border border-separator"
    :ui="{
      th: 'bg-accent/10 text-accent uppercase tracking-wide',
      td: 'text-muted',
      tbody: '[&>[data-slot=rich-table-row]]:hover:*:bg-accent/5',
    }"
    variant="secondary"
  />
</template>

<script setup lang="ts">
import type { RichTableColumn } from '@hareui/vue'
import { RichTable } from '@hareui/vue'

type Payment = {
  name: string
  email: string
  amount: number
}

const data: Payment[] = [
  { name: 'Emma Wilson', email: 'emma@example.com', amount: 2450 },
  { name: 'Isabella Nguyen', email: 'isabella@example.com', amount: 299 },
  { name: 'Jackson Lee', email: 'jackson@example.com', amount: 39 },
  { name: 'Liam Johnson', email: 'liam@example.com', amount: 150 },
  { name: 'William Kim', email: 'will@example.com', amount: 99 },
]

const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })

const columns: RichTableColumn<Payment>[] = [
  { accessorKey: 'name', header: 'Customer' },
  { accessorKey: 'email', header: 'Email' },
  {
    accessorKey: 'amount',
    header: 'Amount',
    cell: ({ row }) => currency.format(row.original.amount),
  },
]
</script>
