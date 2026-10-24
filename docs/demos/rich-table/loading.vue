<template>
  <div class="flex w-full flex-col gap-3">
    <div class="flex flex-wrap items-center gap-2">
      <Button size="sm" variant="secondary" @click="loading = !loading">
        {{ loading ? 'Stop loading' : 'Start loading' }}
      </Button>
      <Button
        v-for="animation in ['carousel', 'carousel-inverse', 'swing', 'elastic'] as const"
        :key="animation"
        size="sm"
        :variant="loadingAnimation === animation ? 'primary' : 'tertiary'"
        @click="loadingAnimation = animation"
      >
        {{ animation }}
      </Button>
    </div>
    <RichTable
      :loading="loading"
      :loading-animation="loadingAnimation"
      :data="data"
      :columns="columns"
    />
  </div>
</template>

<script setup lang="ts">
import type { RichTableColumn } from '@hareui/vue'
import { Button, RichTable } from '@hareui/vue'
import { ref } from 'vue'

interface Payment {
  name: string
  status: 'paid' | 'failed' | 'refunded' | 'processing'
  amount: number
}

const data: Payment[] = [
  { name: 'Emma Wilson', status: 'paid', amount: 2450 },
  { name: 'Isabella Nguyen', status: 'paid', amount: 299 },
  { name: 'Jackson Lee', status: 'processing', amount: 39 },
  { name: 'Liam Johnson', status: 'refunded', amount: 150 },
]

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)
const loading = ref(true)
const loadingAnimation = ref<'carousel' | 'carousel-inverse' | 'swing' | 'elastic'>('carousel')

const columns: RichTableColumn<Payment>[] = [
  { accessorKey: 'name', header: 'Customer' },
  { accessorKey: 'status', header: 'Status' },
  {
    accessorKey: 'amount',
    header: 'Amount',
    cell: ({ row }) => formatCurrency(row.original.amount),
  },
]
</script>
