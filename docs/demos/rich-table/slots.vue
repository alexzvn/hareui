<script setup lang="ts">
import type { RichTableColumn } from '@hareui/vue'
import { Avatar, Button, Chip, Dropdown, RichTable } from '@hareui/vue'
import { Icon } from '@iconify/vue'

interface Payment {
  name: string
  email: string
  avatar: string
  status: 'paid' | 'failed' | 'refunded' | 'processing'
  amount: number
}

const data: Payment[] = [
  {
    name: 'Emma Wilson',
    email: 'emma@example.com',
    avatar: 'https://img.heroui.chat/image/avatar?w=200&h=200&u=1',
    status: 'paid',
    amount: 2450,
  },
  {
    name: 'Isabella Nguyen',
    email: 'isabella@example.com',
    avatar: 'https://img.heroui.chat/image/avatar?w=200&h=200&u=2',
    status: 'paid',
    amount: 299,
  },
  {
    name: 'Jackson Lee',
    email: 'jackson@example.com',
    avatar: 'https://img.heroui.chat/image/avatar?w=200&h=200&u=3',
    status: 'processing',
    amount: 39,
  },
  {
    name: 'Liam Johnson',
    email: 'liam@example.com',
    avatar: 'https://img.heroui.chat/image/avatar?w=200&h=200&u=4',
    status: 'refunded',
    amount: 150,
  },
  {
    name: 'William Kim',
    email: 'will@example.com',
    avatar: 'https://img.heroui.chat/image/avatar?w=200&h=200&u=5',
    status: 'failed',
    amount: 99,
  },
]

const statusColor = {
  paid: 'success',
  failed: 'danger',
  refunded: 'default',
  processing: 'warning',
} as const
const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })
const total = data.reduce((sum, payment) => sum + payment.amount, 0)

// Plain column definitions with a `footer` so the footer row renders; every cell is rendered by the slots below.
const columns: RichTableColumn<Payment>[] = [
  { accessorKey: 'name', header: 'Customer', footer: 'Total' },
  { accessorKey: 'status', header: 'Status' },
  { accessorKey: 'amount', header: 'Amount', footer: '' },
  { id: 'actions' },
]

const items = [
  { value: 'copy', label: 'Copy payment ID' },
  { value: 'view', label: 'View customer' },
  { value: 'refund', label: 'Refund', variant: 'danger' as const },
]
</script>

<template>
  <RichTable :data="data" :columns="columns" class="w-full">
    <template #name-cell="{ row }">
      <div class="flex items-center gap-3">
        <Avatar
          size="sm"
          :src="row.original.avatar"
          :alt="row.original.name"
          :fallback="row.original.name.slice(0, 1)"
        />
        <div>
          <p class="font-medium">
            {{ row.original.name }}
          </p>
          <p class="text-xs text-muted">
            {{ row.original.email }}
          </p>
        </div>
      </div>
    </template>

    <template #status-cell="{ row }">
      <Chip :color="statusColor[row.original.status]" variant="soft" size="sm" class="capitalize">
        <template #leading>
          <Icon icon="gravity-ui:circle-fill" :width="6" :height="16" />
        </template>
        {{ row.original.status }}
      </Chip>
    </template>

    <template #amount-header>
      <span class="block text-end"> Amount </span>
    </template>
    <template #amount-cell="{ row }">
      <span class="block text-end font-medium">
        {{ currency.format(row.original.amount) }}
      </span>
    </template>
    <template #amount-footer>
      <span class="block text-end font-medium text-foreground">
        {{ currency.format(total) }}
      </span>
    </template>

    <template #actions-header>
      <span class="sr-only">Actions</span>
    </template>
    <template #actions-cell>
      <div class="flex justify-end">
        <Dropdown :items="items">
          <Button variant="ghost" size="sm" icon-only aria-label="Actions">
            <Icon icon="gravity-ui:ellipsis" class="size-4" />
          </Button>
        </Dropdown>
      </div>
    </template>
  </RichTable>
</template>
