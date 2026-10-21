<script setup lang="ts">
import type { RichTableColumn, RichTableRow } from '@hareui/vue'
import { Button, RichTable } from '@hareui/vue'
import { getGroupedRowModel } from '@tanstack/vue-table'
import { Icon } from '@iconify/vue'
import { h, ref } from 'vue'

interface Payment {
  name: string
  status: string
  amount: number
}

const data: Payment[] = [
  { name: 'Emma Wilson', status: 'paid', amount: 2450 },
  { name: 'Isabella Nguyen', status: 'paid', amount: 299 },
  { name: 'Jackson Lee', status: 'processing', amount: 39 },
  { name: 'Olivia Martin', status: 'paid', amount: 1999 },
  { name: 'Liam Johnson', status: 'refunded', amount: 150 },
  { name: 'Ava Thompson', status: 'processing', amount: 320 },
]

const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })
const grouping = ref(['status'])
const groupingOptions = { getGroupedRowModel: getGroupedRowModel() }

// A ghost button whose muted chevron turns from right to down.
function expandToggle(row: RichTableRow<Payment>, label: string) {
  const isExpanded = row.getIsExpanded()
  return h(Button, {
    'variant': 'ghost',
    'size': 'sm',
    'iconOnly': true,
    'class': 'h-5 w-7 shrink-0',
    'aria-label': isExpanded ? `Collapse ${label}` : `Expand ${label}`,
    'aria-expanded': isExpanded,
    'onClick': row.getToggleExpandedHandler(),
  }, () => h(Icon, { icon: 'gravity-ui:chevron-right', class: ['size-4 text-muted transition-transform duration-150 ease-out motion-reduce:transition-none', isExpanded ? 'rotate-90' : 'rtl:rotate-180'] }))
}

const columns: RichTableColumn<Payment>[] = [
  {
    accessorKey: 'status',
    header: 'Status',
    // Group rows show the toggle and the group; the grouped column stays empty in the rows of a group
    cell: ({ row, getValue }) => row.getIsGrouped()
      ? h('div', { class: 'flex items-center gap-1 font-medium capitalize' }, [
          expandToggle(row, getValue<string>()),
          `${getValue<string>()} (${row.subRows.length})`,
        ])
      : getValue<string>(),
  },
  { accessorKey: 'name', header: 'Customer' },
  {
    accessorKey: 'amount',
    header: 'Amount',
    aggregationFn: 'sum',
    aggregatedCell: ({ getValue }) => h('span', { class: 'font-medium' }, currency.format(getValue<number>())),
    cell: ({ row }) => currency.format(row.original.amount),
  },
]
</script>

<template>
  <RichTable
    v-model:grouping="grouping"
    :grouping-options="groupingOptions"
    :data="data"
    :columns="columns"
    :initial-state="{ expanded: true }"
    class="w-full"
  />
</template>
