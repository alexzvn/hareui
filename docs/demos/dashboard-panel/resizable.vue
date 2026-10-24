<template>
  <DashboardGroup :persistent="false">
    <!-- The handle sits on the end edge of a resizable panel. Sizes are % of the group (`unit` on the group changes that). -->
    <DashboardPanel id="list" resizable :default-size="30" :max-size="50" :min-size="20">
      <template #header>
        <DashboardNavbar title="Inbox" :toggle="false" />
      </template>

      <template #body>
        <div
          class="h-full min-h-24 rounded-xl border border-dashed border-separator bg-surface/50"
        />
      </template>
    </DashboardPanel>

    <!-- Below `lg` a sized panel takes the full width, so the detail panel is hidden there. -->
    <DashboardPanel id="detail" class="max-lg:hidden">
      <template #header>
        <DashboardNavbar title="Message" :toggle="false" />
      </template>

      <template #body>
        <div
          class="h-full min-h-24 rounded-xl border border-dashed border-separator bg-surface/50"
        />
      </template>
    </DashboardPanel>
  </DashboardGroup>
</template>

<script setup lang="ts">
import { DashboardGroup, DashboardNavbar, DashboardPanel } from '@hareui/vue'
</script>
