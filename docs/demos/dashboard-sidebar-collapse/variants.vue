<script setup lang="ts">
import { DashboardSidebarCollapse } from '@hareui/vue'
</script>

<template>
  <!-- The button hides itself below `lg`, where the sidebar is a sheet: `flex` keeps these on screen. -->
  <div class="flex flex-wrap items-center justify-center gap-2">
    <DashboardSidebarCollapse variant="ghost" class="flex" />
    <DashboardSidebarCollapse variant="tertiary" class="flex" />
    <DashboardSidebarCollapse variant="secondary" class="flex" />
    <DashboardSidebarCollapse variant="outline" class="flex" />
  </div>
</template>
