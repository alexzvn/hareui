<script setup lang="ts">
import type { RichTableColumn, RichTableHeader } from '@hareui/vue'
import { RichTable } from '@hareui/vue'
import { h } from 'vue'

interface Payment {
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

// The column resizer is the column separator itself: it grows into a full-height accent line on hover and
// while dragging. Arrow keys resize by 10px, double click resets.
function resizer(header: RichTableHeader<Payment>, label: string) {
  const { column } = header
  const resizeBy = (delta: number) => header.getContext().table.setColumnSizing(sizing => ({ ...sizing, [column.id]: column.getSize() + delta }))
  return h('div', { class: 'flex items-center' }, [
    label,
    h('div', {
      'role': 'separator',
      'tabindex': 0,
      'aria-orientation': 'vertical',
      'aria-label': `Resize ${label}`,
      'aria-valuenow': column.getSize(),
      'aria-valuemin': column.columnDef.minSize,
      'data-resizing': column.getIsResizing() || undefined,
      'class': [
        'absolute end-0 top-1/2 z-1 box-content h-4 w-px translate-x-1/2 -translate-y-1/2 rtl:-translate-x-1/2 cursor-col-resize touch-none select-none rounded-sm bg-separator bg-clip-content px-2 outline-none',
        'hover:h-full hover:w-0.5 hover:bg-accent data-resizing:h-full data-resizing:w-0.5 data-resizing:bg-accent focus-visible:h-full focus-visible:w-0.5 focus-visible:bg-focus',
      ],
      'onMousedown': header.getResizeHandler(),
      'onTouchstart': header.getResizeHandler(),
      'onDblclick': () => column.resetSize(),
      'onKeydown': (event: KeyboardEvent) => {
        const delta = { ArrowLeft: -10, ArrowRight: 10 }[event.key]
        if (delta) {
          event.preventDefault()
          resizeBy(getComputedStyle(event.currentTarget as Element).direction === 'rtl' ? -delta : delta)
        }
      },
    }),
  ])
}

const columns: RichTableColumn<Payment>[] = [
  { accessorKey: 'name', header: ({ header }) => resizer(header, 'Customer'), size: 200, minSize: 120 },
  { accessorKey: 'email', header: ({ header }) => resizer(header, 'Email'), size: 240, minSize: 120 },
  { accessorKey: 'status', header: ({ header }) => resizer(header, 'Status'), size: 140, minSize: 100, meta: { class: { td: 'capitalize' } } },
  { accessorKey: 'amount', header: ({ header }) => resizer(header, 'Amount'), size: 140, minSize: 100, cell: ({ row }) => currency.format(row.original.amount) },
]
</script>

<template>
  <RichTable
    :data="data"
    :columns="columns"
    :column-sizing-options="{ enableColumnResizing: true, columnResizeMode: 'onChange' }"
    :ui="{ base: 'table-fixed' }"
    class="w-full"
  />
</template>
