<script setup lang="ts">
import {
  DashboardGroup,
  DashboardPanel,
  DashboardSidebar,
  DashboardSidebarToggle,
} from '@hareui/vue'

const details = [
  { label: 'Status', value: 'Open' },
  { label: 'Assignee', value: 'Emma Wilson' },
  { label: 'Priority', value: 'High' },
  { label: 'Created', value: 'Oct 12, 2026' },
]
</script>

<template>
  <DashboardGroup unit="rem" :persistent="false">
    <DashboardPanel>
      <template #header>
        <div class="flex h-16 shrink-0 items-center gap-3 px-4">
          <p class="min-w-0 flex-1 truncate text-sm font-semibold text-foreground">Ticket #1024</p>
          <!-- `side="right"` toggles the right sidebar. -->
          <DashboardSidebarToggle side="right" />
        </div>
      </template>
      <template #body>
        <div class="h-full rounded-xl border border-dashed border-separator bg-surface/50" />
      </template>
    </DashboardPanel>

    <DashboardSidebar id="toggle-side" side="right">
      <template #header>
        <p class="truncate px-1 py-2 text-sm font-semibold text-foreground">Details</p>
      </template>
      <dl class="flex flex-col gap-3 px-2 text-sm">
        <div
          v-for="detail in details"
          :key="detail.label"
          class="flex items-center justify-between gap-4"
        >
          <dt class="text-muted">
            {{ detail.label }}
          </dt>
          <dd class="truncate text-foreground">
            {{ detail.value }}
          </dd>
        </div>
      </dl>
    </DashboardSidebar>
  </DashboardGroup>
</template>
