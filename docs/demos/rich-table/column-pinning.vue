<script setup lang="ts">
import type { RichTableColumn } from '@hareui/vue'
import { RichTable } from '@hareui/vue'
import { h, ref } from 'vue'

interface Payment {
  id: string
  name: string
  email: string
  date: string
  status: string
  fee: number
  amount: number
}

const data: Payment[] = [
  {
    id: 'pay_1N3xDR',
    name: 'Emma Wilson',
    email: 'emma@example.com',
    date: '2024-03-11T15:30:00',
    status: 'paid',
    fee: 73.5,
    amount: 2450,
  },
  {
    id: 'pay_1N3x9M',
    name: 'Isabella Nguyen',
    email: 'isabella@example.com',
    date: '2024-03-11T10:10:00',
    status: 'paid',
    fee: 8.97,
    amount: 299,
  },
  {
    id: 'pay_1N3x8L',
    name: 'Jackson Lee',
    email: 'jackson@example.com',
    date: '2024-03-11T08:50:00',
    status: 'processing',
    fee: 1.43,
    amount: 39,
  },
  {
    id: 'pay_1N3xCQ',
    name: 'Liam Johnson',
    email: 'liam@example.com',
    date: '2024-03-10T19:45:00',
    status: 'refunded',
    fee: 4.5,
    amount: 150,
  },
  {
    id: 'pay_1N3xAN',
    name: 'William Kim',
    email: 'will@example.com',
    date: '2024-03-09T17:35:00',
    status: 'failed',
    fee: 3.17,
    amount: 99,
  },
]

const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })
const dateTime = new Intl.DateTimeFormat('en-US', {
  day: 'numeric',
  month: 'short',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
})

const columnPinning = ref({ left: ['name'], right: ['amount'] })

const columns: RichTableColumn<Payment>[] = [
  { accessorKey: 'name', header: 'Customer', meta: { class: { td: 'font-medium' } } },
  {
    accessorKey: 'id',
    header: 'Transaction ID',
    cell: ({ row }) => h('span', { class: 'font-mono text-xs text-muted' }, row.original.id),
  },
  { accessorKey: 'email', header: 'Email' },
  {
    accessorKey: 'date',
    header: 'Date',
    cell: ({ row }) => dateTime.format(new Date(row.original.date)),
  },
  { accessorKey: 'status', header: 'Status', meta: { class: { td: 'capitalize' } } },
  {
    accessorKey: 'fee',
    header: 'Fee',
    cell: ({ row }) => currency.format(row.original.fee),
    meta: { class: { td: 'text-muted' } },
  },
  {
    accessorKey: 'amount',
    header: 'Amount',
    cell: ({ row }) => currency.format(row.original.amount),
    meta: { class: { td: 'font-medium' } },
  },
]
</script>

<template>
  <RichTable
    v-model:column-pinning="columnPinning"
    :data="data"
    :columns="columns"
    class="w-full"
  />
</template>
