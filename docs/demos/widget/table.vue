<template>
  <Widget
    class="w-full max-w-[640px]"
    title="Library Loans"
    description="4 overdue"
    :ui="{ content: 'p-0' }"
  >
    <Table
      aria-label="Overdue library loans"
      variant="secondary"
      :columns="columns"
      :rows="rows"
      :ui="{ header: 'sr-only' }"
    />
  </Widget>
</template>

<script setup lang="ts">
import type { TableColumn, TableRow } from '@hareui/vue'
import { Table, Widget } from '@hareui/vue'

const columns: TableColumn[] = [
  { key: 'title', label: 'Book', isRowHeader: true },
  { key: 'member', label: 'Member' },
  { key: 'due', label: 'Due', align: 'end', class: 'whitespace-nowrap' },
]

const rows: TableRow[] = [
  { id: 1, title: 'The Salt Road', member: 'Ines Okafor', due: 'Oct 12' },
  { id: 2, title: 'Small Engines', member: 'Tomás Reyes', due: 'Oct 15' },
  { id: 3, title: 'A Field Guide to Moss', member: 'Hana Ito', due: 'Oct 19' },
  { id: 4, title: 'Night Ferry', member: 'Leo Brandt', due: 'Oct 21' },
]
</script>
