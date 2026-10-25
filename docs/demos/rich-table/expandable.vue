<template>
  <RichTable
    v-model:expanded="expanded"
    :data="data"
    :columns="columns"
    :features="{ expanded: { getRowCanExpand: () => true } }"
    class="w-full"
  >
    <template #expanded="{ row }">
      <!-- `ps-11` lines the details up with the Customer column -->
      <dl class="grid grid-cols-[auto_1fr] gap-x-6 gap-y-1 ps-11 text-sm">
        <dt class="text-muted">Transaction</dt>
        <dd class="font-mono">
          {{ row.original.id }}
        </dd>
        <dt class="text-muted">Email</dt>
        <dd>{{ row.original.email }}</dd>
        <dt class="text-muted">Date</dt>
        <dd>{{ dateTime.format(new Date(row.original.date)) }}</dd>
        <dt class="text-muted">Fee</dt>
        <dd>{{ currency.format(row.original.fee) }}</dd>
      </dl>
    </template>
  </RichTable>
</template>

<script setup lang="ts">
import type { RichTableColumn, RichTableRow } from '@hareui/vue'
import { Button, RichTable } from '@hareui/vue'
import { Icon } from '@iconify/vue'
import { h, ref } from 'vue'

type Payment = {
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
]

const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })

const dateTime = new Intl.DateTimeFormat('en-US', {
  day: 'numeric',
  month: 'short',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
})

const expanded = ref({ 0: true })

// A ghost button whose muted chevron turns from right to down.
const expandToggle = (row: RichTableRow<Payment>) => {
  const isExpanded = row.getIsExpanded()
  return h(
    Button,
    {
      variant: 'ghost',
      size: 'sm',
      iconOnly: true,
      class: 'h-5 w-7 shrink-0',
      'aria-label': isExpanded ? 'Collapse row' : 'Expand row',
      'aria-expanded': isExpanded,
      onClick: row.getToggleExpandedHandler(),
    },
    () =>
      h(Icon, {
        icon: 'gravity-ui:chevron-right',
        class: [
          'size-4 text-muted transition-transform duration-150 ease-out motion-reduce:transition-none',
          isExpanded ? 'rotate-90' : 'rtl:rotate-180',
        ],
      }),
  )
}

const columns: RichTableColumn<Payment>[] = [
  // A narrow first column that fits the toggle
  {
    id: 'expand',
    header: () => h('span', { class: 'sr-only' }, 'Expand'),
    cell: ({ row }) => h('div', { class: 'flex' }, expandToggle(row)),
    meta: { class: { th: 'w-11 pe-0', td: 'w-11 pe-0' } },
  },
  { accessorKey: 'name', header: 'Customer' },
  { accessorKey: 'status', header: 'Status', meta: { class: { td: 'capitalize' } } },
  {
    accessorKey: 'amount',
    header: 'Amount',
    cell: ({ row }) => currency.format(row.original.amount),
  },
]
</script>
