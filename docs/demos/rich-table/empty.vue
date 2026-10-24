<template>
  <div class="flex w-full flex-col gap-6">
    <RichTable :data="[]" :columns="columns" empty="No payments found." />

    <RichTable :data="[]" :columns="columns">
      <template #empty>
        <div class="py-6">
          <div class="flex flex-col items-center gap-3 px-4 py-6">
            <div class="flex flex-col items-center gap-2">
              <div
                class="flex size-10 items-center justify-center rounded-full border border-border bg-default text-foreground"
              >
                <Icon icon="gravity-ui:credit-card" class="size-4" />
              </div>
              <h3 class="text-sm font-semibold text-foreground">No payments yet</h3>
              <p class="text-xs text-muted">Payments appear here once a customer pays.</p>
            </div>
            <Button variant="outline">
              <Icon icon="gravity-ui:plus" />
              Create payment
            </Button>
          </div>
        </div>
      </template>
    </RichTable>
  </div>
</template>

<script setup lang="ts">
import type { RichTableColumn } from '@hareui/vue'
import { Button, RichTable } from '@hareui/vue'
import { Icon } from '@iconify/vue'

type Payment = {
  name: string
  status: string
  amount: number
}

const columns: RichTableColumn<Payment>[] = [
  { accessorKey: 'name', header: 'Customer' },
  { accessorKey: 'status', header: 'Status' },
  { accessorKey: 'amount', header: 'Amount' },
]
</script>
