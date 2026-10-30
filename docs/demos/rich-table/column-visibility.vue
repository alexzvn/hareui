<template>
  <div class="flex w-full flex-col gap-3">
    <div class="flex justify-end">
      <Dropdown v-model="visible" :items="items" selection-mode="multiple" align="end">
        <Button variant="secondary" size="sm">
          <Icon icon="gravity-ui:layout-columns-3" />
          Columns
        </Button>
      </Dropdown>
    </div>
    <RichTable v-model:column-visibility="columnVisibility" :data="data" :columns="columns" />
  </div>
</template>

<script setup lang="ts">
import type { DropdownEntry, RichTableColumn } from '@hareui/vue'
import { Button, Dropdown, RichTable } from '@hareui/vue'
import { Icon } from '@iconify/vue'
import { computed, ref } from 'vue'

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
const columnVisibility = ref<Record<string, boolean>>({ email: false })

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

const items: DropdownEntry[] = [
  { value: 'name', label: 'Customer' },
  { value: 'email', label: 'Email' },
  { value: 'status', label: 'Status' },
  { value: 'amount', label: 'Amount' },
]

const ids = ['name', 'email', 'status', 'amount']

// The dropdown's selection holds the ids of the visible columns.
const visible = computed({
  get: () => ids.filter((id) => columnVisibility.value[id] !== false),
  set: (selected) => {
    columnVisibility.value = Object.fromEntries(ids.map((id) => [id, selected.includes(id)]))
  },
})
</script>
