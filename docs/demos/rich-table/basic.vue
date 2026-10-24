<template>
  <RichTable :data="data" :columns="columns" class="w-full" />
</template>

<script setup lang="ts">
import type { RichTableColumn } from '@hareui/vue'
import { Chip, RichTable } from '@hareui/vue'
import { Icon } from '@iconify/vue'
import { h } from 'vue'

interface Payment {
  id: string
  name: string
  email: string
  status: 'paid' | 'failed' | 'refunded' | 'processing'
  amount: number
}

const data: Payment[] = [
  {
    id: 'pay_1N3xDR',
    name: 'Emma Wilson',
    email: 'emma@example.com',
    status: 'paid',
    amount: 2450,
  },
  {
    id: 'pay_1N3x9M',
    name: 'Isabella Nguyen',
    email: 'isabella@example.com',
    status: 'paid',
    amount: 299,
  },
  {
    id: 'pay_1N3x8L',
    name: 'Jackson Lee',
    email: 'jackson@example.com',
    status: 'processing',
    amount: 39,
  },
  {
    id: 'pay_1N3xCQ',
    name: 'Liam Johnson',
    email: 'liam@example.com',
    status: 'refunded',
    amount: 150,
  },
  {
    id: 'pay_1N3xAN',
    name: 'William Kim',
    email: 'will@example.com',
    status: 'failed',
    amount: 99,
  },
]

const statusColor = {
  paid: 'success',
  failed: 'danger',
  refunded: 'default',
  processing: 'warning',
} as const
const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })

const columns: RichTableColumn<Payment>[] = [
  {
    accessorKey: 'name',
    header: 'Customer',
    cell: ({ row }) =>
      h('div', [
        h('p', { class: 'font-medium text-foreground' }, row.original.name),
        h('p', { class: 'text-xs text-muted' }, row.original.email),
      ]),
  },
  {
    accessorKey: 'id',
    header: 'Transaction ID',
    cell: ({ row }) => h('span', { class: 'font-mono text-xs text-muted' }, row.original.id),
  },
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
  {
    accessorKey: 'amount',
    header: () => h('div', { class: 'text-end' }, 'Amount'),
    cell: ({ row }) =>
      h('div', { class: 'text-end font-medium' }, currency.format(row.original.amount)),
  },
]
</script>
