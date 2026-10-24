<template>
  <!-- The footer sits in the table's gray container, under the rows -->
  <div class="w-full rounded-[min(32px,calc(var(--radius)*2.5))] bg-surface-secondary">
    <RichTable
      v-model:pagination="pagination"
      :data="data"
      :columns="columns"
      :pagination-options="paginationOptions"
    />
    <Pagination
      v-model:page="page"
      :total="pageCount"
      size="sm"
      prev-label=""
      next-label=""
      class="px-5 pt-1.5 pb-3.5"
    >
      <template #summary> {{ first }} to {{ last }} of {{ data.length }} payments </template>
    </Pagination>
  </div>
</template>

<script setup lang="ts">
import type { RichTableColumn } from '@hareui/vue'
import { Pagination, RichTable } from '@hareui/vue'
import { getPaginationRowModel } from '@tanstack/vue-table'
import { computed, ref } from 'vue'

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
  { name: 'Ava Thompson', status: 'processing', amount: 320 },
]

const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })
const pagination = ref({ pageIndex: 0, pageSize: 3 })
const paginationOptions = { getPaginationRowModel: getPaginationRowModel() }

const columns: RichTableColumn<Payment>[] = [
  { accessorKey: 'name', header: 'Customer' },
  { accessorKey: 'status', header: 'Status', meta: { class: { td: 'capitalize' } } },
  {
    accessorKey: 'amount',
    header: 'Amount',
    cell: ({ row }) => currency.format(row.original.amount),
  },
]

const pageCount = computed(() => Math.ceil(data.length / pagination.value.pageSize))

// `Pagination` is 1-based while TanStack's `pageIndex` is 0-based.
const page = computed({
  get: () => pagination.value.pageIndex + 1,
  set: (value) => (pagination.value = { ...pagination.value, pageIndex: value - 1 }),
})

const first = computed(() => pagination.value.pageIndex * pagination.value.pageSize + 1)
const last = computed(() => Math.min(first.value + pagination.value.pageSize - 1, data.length))
</script>
