<template>
  <DashboardGroup :persistent="false">
    <DashboardPanel id="basic">
      <template #header>
        <DashboardNavbar title="Panel" :toggle="false">
          <template #right>
            <Button size="sm" variant="secondary"> Action </Button>
          </template>
        </DashboardNavbar>
      </template>

      <template #body>
        <div
          class="h-full min-h-24 rounded-xl border border-dashed border-separator bg-surface/50"
        />
      </template>

      <template #footer>
        <div
          class="flex shrink-0 items-center justify-between border-t border-separator px-6 py-2 text-xs text-muted"
        >
          <span>Footer</span>
          <span>v1.0.0</span>
        </div>
      </template>
    </DashboardPanel>
  </DashboardGroup>
</template>

<script setup lang="ts">
import { Button, DashboardGroup, DashboardNavbar, DashboardPanel } from '@hareui/vue'
</script>
