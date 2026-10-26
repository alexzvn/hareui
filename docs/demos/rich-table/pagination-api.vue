<template>
  <!-- The footer sits in the table's gray container, under the rows -->
  <div class="w-full rounded-[min(32px,calc(var(--radius)*2.5))] bg-surface-secondary">
    <RichTable
      ref="table"
      :data="data"
      :columns="columns"
      :features="features"
      :initial-state="initialState"
    />
    <div class="flex items-center justify-between gap-4 px-5 pt-1 pb-3">
      <span class="text-xs text-muted">
        Page {{ (table?.tableApi?.getState().pagination.pageIndex ?? 0) + 1 }} of
        {{ table?.tableApi?.getPageCount() ?? 1 }}
      </span>
      <div class="flex gap-2">
        <Button
          size="sm"
          variant="secondary"
          :disabled="!table?.tableApi?.getCanPreviousPage()"
          @click="table?.tableApi?.previousPage()"
        >
          Previous
        </Button>
        <Button
          size="sm"
          variant="secondary"
          :disabled="!table?.tableApi?.getCanNextPage()"
          @click="table?.tableApi?.nextPage()"
        >
          Next
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { RichTableColumn } from '@hareui/vue'
import { Button, RichTable } from '@hareui/vue'
import { getPaginationRowModel } from '@tanstack/vue-table'
import { useTemplateRef } from 'vue'

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
  { name: 'Olivia Martin', status: 'paid', amount: 1999 },
  { name: 'Sofia Davis', status: 'paid', amount: 450 },
  { name: 'William Kim', status: 'failed', amount: 99 },
  { name: 'Noah Brown', status: 'paid', amount: 780 },
]

const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })
const table = useTemplateRef('table')
const features = { pagination: { getPaginationRowModel: getPaginationRowModel() } }
const initialState = { pagination: { pageIndex: 0, pageSize: 4 } }

const columns: RichTableColumn<Payment>[] = [
  { accessorKey: 'name', header: 'Customer' },
  { accessorKey: 'status', header: 'Status', meta: { class: { td: 'capitalize' } } },
  {
    accessorKey: 'amount',
    header: 'Amount',
    cell: ({ row }) => currency.format(row.original.amount),
  },
]
</script>
