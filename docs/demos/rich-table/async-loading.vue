<template>
  <div class="flex w-full flex-col gap-3">
    <p class="text-sm text-muted">{{ items.length }} / {{ all.length }} payments</p>
    <RichTable ref="table" class="max-h-100" sticky :data="items" :columns="columns">
      <template v-if="items.length < all.length" #body-bottom>
        <!-- Load-more row: a centered Spinner while the next page loads. -->
        <tr ref="sentinel">
          <td :colspan="columns.length" class="py-3">
            <div class="flex items-center justify-center py-2">
              <Spinner v-if="loading" aria-label="Loading more payments" />
              <span v-else class="size-6" />
            </div>
          </td>
        </tr>
      </template>
    </RichTable>
  </div>
</template>

<script setup lang="ts">
import type { RichTableColumn } from '@hareui/vue'
import { RichTable, Spinner } from '@hareui/vue'
import { onBeforeUnmount, ref, useTemplateRef, watch } from 'vue'

type Payment = {
  id: string
  name: string
  amount: number
}

const customers = [
  { name: 'Emma Wilson', amount: 2450 },
  { name: 'Isabella Nguyen', amount: 299 },
  { name: 'Jackson Lee', amount: 39 },
  { name: 'Liam Johnson', amount: 150 },
  { name: 'Olivia Martin', amount: 1999 },
]

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)

const PAGE = 8
const TOTAL = 40
const all = Array.from({ length: TOTAL }, (_, i): Payment => ({
  ...customers[i % customers.length]!,
  id: `pay_${String(i + 1).padStart(3, '0')}`,
}))

const items = ref(all.slice(0, PAGE))
const loading = ref(false)
const hasMore = () => items.value.length < all.length

const loadMore = () => {
  if (loading.value || !hasMore()) return
  loading.value = true

  setTimeout(() => {
    items.value = all.slice(0, items.value.length + PAGE)
    loading.value = false
  }, 1200)
}

const columns: RichTableColumn<Payment>[] = [
  { accessorKey: 'id', header: 'ID' },
  { accessorKey: 'name', header: 'Customer' },
  {
    accessorKey: 'amount',
    header: 'Amount',
    cell: ({ row }) => formatCurrency(row.original.amount),
  },
]

// A sentinel row after the rows loads the next page once it scrolls into view.
const table = useTemplateRef('table')
const sentinel = useTemplateRef('sentinel')
let observer: IntersectionObserver | undefined
watch(sentinel, (el) => {
  observer?.disconnect()
  if (!el) return

  observer = new IntersectionObserver((entries) => entries[0]?.isIntersecting && loadMore(), {
    root: table.value?.$el,
  })

  observer.observe(el)
})

onBeforeUnmount(() => observer?.disconnect())
</script>
