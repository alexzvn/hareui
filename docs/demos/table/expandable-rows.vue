<template>
  <Table
    v-model:expanded-keys="expandedKeys"
    aria-label="Files"
    :columns="columns"
    :rows="rows"
    tree-column="name"
    :ui="{ content: 'min-w-[520px]' }"
  >
    <template #name-cell="{ row, hasChildItems, isExpanded, toggle }">
      <span class="flex items-center gap-1">
        <Button
          v-if="hasChildItems"
          aria-label="Toggle row"
          icon-only
          size="sm"
          variant="ghost"
          @click="toggle"
        >
          <Icon
            aria-hidden="true"
            :class="[
              'size-4 text-muted transition-transform duration-150',
              isExpanded ? 'rotate-90' : 'rtl:rotate-180',
            ]"
            icon="gravity-ui:chevron-right"
          />
        </Button>
        <span>{{ row.name }}</span>
      </span>
    </template>
  </Table>
</template>

<script setup lang="ts">
import type { TableColumn, TableRow, TableSelection } from '@hareui/vue'
import { Button, Table } from '@hareui/vue'
import { Icon } from '@iconify/vue'
import { ref } from 'vue'

const columns: TableColumn[] = [
  { key: 'name', label: 'Name', isRowHeader: true },
  { key: 'type', label: 'Type' },
  { key: 'date', label: 'Date Modified' },
]
const rows: TableRow[] = [
  {
    id: '1',
    name: 'Documents',
    type: 'Directory',
    date: '10/20/2025',
    children: [
      {
        id: '2',
        name: 'Project',
        type: 'Directory',
        date: '8/2/2025',
        children: [
          { id: '3', name: 'Weekly Report', type: 'File', date: '7/10/2025' },
          { id: '4', name: 'Budget', type: 'File', date: '8/20/2025' },
        ],
      },
    ],
  },
  {
    id: '5',
    name: 'Photos',
    type: 'Directory',
    date: '2/3/2026',
    children: [
      { id: '6', name: 'Image 1', type: 'File', date: '1/23/2026' },
      { id: '7', name: 'Image 2', type: 'File', date: '2/3/2026' },
    ],
  },
]
const expandedKeys = ref<TableSelection>(new Set(['1']))
</script>
