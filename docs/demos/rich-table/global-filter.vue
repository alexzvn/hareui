<template>
  <div class="flex w-full flex-col gap-3">
    <Input
      v-model="globalFilter"
      aria-label="Filter rows"
      placeholder="Filter..."
      class="max-w-xs"
    />
    <RichTable v-model:global-filter="globalFilter" :data="data" :columns="columns" />
  </div>
</template>

<script setup lang="ts">
import type { RichTableColumn } from '@hareui/vue'
import { Input, RichTable } from '@hareui/vue'
import { ref } from 'vue'

type Payment = {
  name: string
  email: string
  status: string
  amount: number
}

const data: Payment[] = [
  { name: 'Emma Wilson', email: 'emma@example.com', status: 'paid', amount: 2450 },
  { name: 'Isabella Nguyen', email: 'isabella@example.com', status: 'paid', amount: 299 },
  { name: 'Jackson Lee', email: 'jackson@example.com', status: 'processing', amount: 39 },
  { name: 'Liam Johnson', email: 'liam@example.com', status: 'refunded', amount: 150 },
  { name: 'William Kim', email: 'will@example.com', status: 'failed', amount: 99 },
]

const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })
const globalFilter = ref('')

const columns: RichTableColumn<Payment>[] = [
  { accessorKey: 'name', header: 'Customer' },
  { accessorKey: 'email', header: 'Email' },
  { accessorKey: 'status', header: 'Status', meta: { class: { td: 'capitalize' } } },
  {
    accessorKey: 'amount',
    header: 'Amount',
    cell: ({ row }) => currency.format(row.original.amount),
  },
]
</script>
