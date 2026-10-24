<script setup lang="ts">
import type { RichTableColumn } from '@hareui/vue'
import { Button, RichTable } from '@hareui/vue'
import { h, ref } from 'vue'

interface Payment {
  id: string
  name: string
  status: string
  amount: number
}

const data: Payment[] = [
  { id: 'pay_1N3xDR', name: 'Emma Wilson', status: 'paid', amount: 2450 },
  { id: 'pay_1N3x9M', name: 'Isabella Nguyen', status: 'paid', amount: 299 },
  { id: 'pay_1N3x8L', name: 'Jackson Lee', status: 'processing', amount: 39 },
  { id: 'pay_1N3xCQ', name: 'Liam Johnson', status: 'refunded', amount: 150 },
  { id: 'pay_1N3xAN', name: 'William Kim', status: 'failed', amount: 99 },
]

const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })
const rowPinning = ref({ top: ['pay_1N3x8L'], bottom: [] as string[] })

const columns: RichTableColumn<Payment>[] = [
  { accessorKey: 'name', header: 'Customer' },
  { accessorKey: 'status', header: 'Status', meta: { class: { td: 'capitalize' } } },
  { accessorKey: 'amount', header: 'Amount', cell: ({ row }) => currency.format(row.original.amount) },
  {
    id: 'pin',
    header: () => h('span', { class: 'sr-only' }, 'Pin'),
    cell: ({ row }) => h('div', { class: 'flex justify-end' }, h(Button, {
      variant: 'ghost',
      size: 'sm',
      onClick: () => row.pin(row.getIsPinned() ? false : 'top'),
    }, () => row.getIsPinned() ? 'Unpin' : 'Pin')),
  },
]
</script>

<template>
  <RichTable
    v-model:row-pinning="rowPinning"
    :data="data"
    :columns="columns"
    :get-row-id="row => row.id"
    class="w-full"
    :meta="{ class: { tr: row => row.getIsPinned() ? 'font-medium' : '' } }"
  />
</template>
