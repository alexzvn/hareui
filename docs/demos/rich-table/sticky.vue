<template>
  <RichTable sticky :data="data" :columns="columns" class="h-[420px] w-full" />
</template>

<script setup lang="ts">
import type { RichTableColumn } from '@hareui/vue'
import { RichTable } from '@hareui/vue'

type Payment = {
  id: number
  name: string
  email: string
  status: string
  amount: number
}

const customers = [
  { name: 'Emma Wilson', email: 'emma@example.com' },
  { name: 'Isabella Nguyen', email: 'isabella@example.com' },
  { name: 'Jackson Lee', email: 'jackson@example.com' },
  { name: 'Liam Johnson', email: 'liam@example.com' },
  { name: 'William Kim', email: 'will@example.com' },
]
const statuses = ['paid', 'processing', 'paid', 'refunded', 'failed']

// Enough rows to scroll under the sticky header and footer.
const data: Payment[] = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  ...customers[i % 5],
  status: statuses[(i * 3) % 5],
  amount: 40 + ((i * 397) % 2400),
}))

const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })

const columns: RichTableColumn<Payment>[] = [
  { accessorKey: 'name', header: 'Customer', footer: 'Total' },
  { accessorKey: 'email', header: 'Email' },
  { accessorKey: 'status', header: 'Status', meta: { class: { td: 'capitalize' } } },
  {
    accessorKey: 'amount',
    header: 'Amount',
    cell: ({ row }) => currency.format(row.original.amount),
    footer: ({ table }) =>
      currency.format(table.getRowModel().rows.reduce((sum, row) => sum + row.original.amount, 0)),
  },
]
</script>
