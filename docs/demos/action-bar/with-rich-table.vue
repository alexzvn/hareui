<template>
  <div class="mx-auto w-full max-w-2xl p-6 pb-24">
    <RichTable v-model:row-selection="rowSelection" :data="invoices" :columns="columns">
      <template #select-header="{ table }">
        <Checkbox
          :model-value="
            table.getIsSomePageRowsSelected() ? 'indeterminate' : table.getIsAllPageRowsSelected()
          "
          aria-label="Select all"
          @update:model-value="table.toggleAllPageRowsSelected(!!$event)"
        />
      </template>
      <template #select-cell="{ row }">
        <Checkbox
          variant="secondary"
          :model-value="row.getIsSelected()"
          :aria-label="`Select ${row.original.number}`"
          @update:model-value="row.toggleSelected(!!$event)"
        />
      </template>
    </RichTable>
    <ActionBar :open="selectedCount > 0">
      <template #prefix>
        <Chip size="sm" variant="secondary" class="shrink-0 tabular-nums">{{ selectedCount }}</Chip>
      </template>
      <template #default="{ labelClass }">
        <Button size="sm" variant="ghost">
          <Icon icon="gravity-ui:paper-plane" />
          <span :class="labelClass">Send</span>
        </Button>
        <Button size="sm" variant="ghost">
          <Icon icon="gravity-ui:arrow-down-to-line" />
          <span :class="labelClass">Download</span>
        </Button>
        <Separator />
        <Button size="sm" variant="danger-soft" @click="onDelete">
          <Icon icon="gravity-ui:trash-bin" />
          <span :class="labelClass">Delete</span>
        </Button>
      </template>
      <template #suffix>
        <Button
          icon-only
          size="sm"
          variant="ghost"
          aria-label="Clear selection"
          @click="rowSelection = {}"
        >
          <Icon icon="gravity-ui:xmark" />
        </Button>
      </template>
    </ActionBar>
  </div>
</template>

<script setup lang="ts">
import type { RichTableColumn } from '@hareui/vue'
import { ActionBar, Button, Checkbox, Chip, RichTable, Separator } from '@hareui/vue'
import { Icon } from '@iconify/vue'
import { computed, ref } from 'vue'

type Invoice = {
  number: string
  client: string
  amount: string
}

const invoices = ref<Invoice[]>([
  { number: 'INV-1042', client: 'Northwind Bakery', amount: '$1,280.00' },
  { number: 'INV-1043', client: 'Harbor Optics', amount: '$640.50' },
  { number: 'INV-1044', client: 'Lumen Studio', amount: '$3,920.00' },
  { number: 'INV-1045', client: 'Pine & Partners', amount: '$212.75' },
])

const rowSelection = ref<Record<string, boolean>>({ 0: true, 2: true })

const selectedCount = computed(() => Object.values(rowSelection.value).filter(Boolean).length)

const onDelete = () => {
  invoices.value = invoices.value.filter((_, index) => !rowSelection.value[index])
  rowSelection.value = {}
}

const columns: RichTableColumn<Invoice>[] = [
  { id: 'select' },
  { accessorKey: 'number', header: 'Invoice' },
  { accessorKey: 'client', header: 'Client' },
  { accessorKey: 'amount', header: 'Amount', meta: { class: { td: 'tabular-nums' } } },
]
</script>
