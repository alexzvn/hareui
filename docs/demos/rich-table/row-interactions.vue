<script setup lang="ts">
import type { DropdownValue, RichTableColumn, RichTableRow } from '@hareui/vue'
import { Dropdown, RichTable } from '@hareui/vue'
import { ref, useTemplateRef } from 'vue'

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
]

const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })

const columns: RichTableColumn<Payment>[] = [
  { accessorKey: 'name', header: 'Customer' },
  { accessorKey: 'status', header: 'Status', meta: { class: { td: 'capitalize' } } },
  {
    accessorKey: 'amount',
    header: 'Amount',
    cell: ({ row }) => currency.format(row.original.amount),
  },
]

const log = ref('Click, hover or right-click a row')

const onSelect = (_: Event, row: RichTableRow<Payment>) =>
  (log.value = `Selected ${row.original.name}`)
const onHover = (_: Event, row: RichTableRow<Payment> | null) =>
  row && (log.value = `Hovering ${row.original.name}`)

// The context menu is a Dropdown opened on an invisible anchor placed under the pointer.
const items = [
  { value: 'copy', label: 'Copy payment ID' },
  { value: 'view', label: 'View customer' },
  { value: 'refund', label: 'Refund payment', variant: 'danger' as const },
]
const root = useTemplateRef('root')
const menuOpen = ref(false)
const menuRow = ref<Payment>()
const anchor = ref({ left: '0px', top: '0px' })

function onContextmenu(e: Event, row: RichTableRow<Payment>) {
  e.preventDefault()
  const { clientX, clientY } = e as MouseEvent
  const rect = root.value!.getBoundingClientRect()
  anchor.value = { left: `${clientX - rect.left}px`, top: `${clientY - rect.top}px` }
  menuRow.value = row.original
  menuOpen.value = true
}

function onAction(value: DropdownValue) {
  log.value = `${items.find((item) => item.value === value)?.label}: ${menuRow.value?.name}`
}
</script>

<template>
  <div ref="root" class="relative flex w-full flex-col gap-3">
    <RichTable
      :data="data"
      :columns="columns"
      :on-select="onSelect"
      :on-hover="onHover"
      :on-contextmenu="onContextmenu"
    />
    <p class="text-sm text-muted">
      {{ log }}
    </p>
    <Dropdown
      v-model:open="menuOpen"
      :items="items"
      align="start"
      :side-offset="2"
      @action="onAction"
    >
      <span aria-hidden="true" class="pointer-events-none absolute size-px" :style="anchor" />
    </Dropdown>
  </div>
</template>
