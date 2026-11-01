<template>
  <div class="flex flex-col gap-8 p-8">
    <section class="flex flex-col gap-3">
      <h2 class="text-sm font-semibold">Title and description</h2>
      <Widget class="max-w-[520px]" title="Orders" description="Last 7 days">
        <p class="text-sm">Content area</p>
      </Widget>
    </section>

    <section class="flex flex-col gap-3">
      <h2 class="text-sm font-semibold">Legend</h2>
      <Widget class="max-w-[520px]" title="Traffic" :legend="legend">
        <p class="text-sm">Content area</p>
      </Widget>
    </section>

    <section class="flex flex-col gap-3">
      <h2 class="text-sm font-semibold">No header</h2>
      <Widget class="max-w-[520px]">
        <p class="text-sm">Content only</p>
      </Widget>
    </section>

    <section class="flex flex-col gap-3">
      <h2 class="text-sm font-semibold">Slots</h2>
      <Widget class="max-w-[520px]">
        <template #title>Custom title</template>
        <template #description>Custom description</template>
        <template #legend><span class="text-xs">Custom legend</span></template>
        <p class="text-sm">Content area</p>
        <template #footer><span class="text-xs text-muted">Footer note</span></template>
      </Widget>
      <Widget class="max-w-[520px]">
        <template #header>
          <div class="px-4 py-2 text-sm">Whole header replaced</div>
        </template>
        <p class="text-sm">Content area</p>
      </Widget>
    </section>

    <section class="flex flex-col gap-3">
      <h2 class="text-sm font-semibold">as="section", :ui override (edge-to-edge content)</h2>
      <Widget as="section" class="max-w-[520px]" title="Members" :ui="{ content: 'p-0' }">
        <Table aria-label="Members" variant="secondary" :columns="columns" :rows="rows" />
      </Widget>
    </section>
  </div>
</template>

<script setup lang="ts">
import type { TableColumn, TableRow, WidgetLegendItem } from '@hareui/vue'
import { Table, Widget } from '@hareui/vue'

const legend: WidgetLegendItem[] = [
  { label: 'Visits', color: 'var(--chart-3)' },
  { label: 'Signups', color: 'var(--chart-1)' },
]

const columns: TableColumn[] = [
  { key: 'name', label: 'Name', isRowHeader: true },
  { key: 'role', label: 'Role' },
]

const rows: TableRow[] = [
  { id: 1, name: 'Ada', role: 'Owner' },
  { id: 2, name: 'Bo', role: 'Editor' },
]
</script>
