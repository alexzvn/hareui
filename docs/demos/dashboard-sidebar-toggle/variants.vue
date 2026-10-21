<script setup lang="ts">
import { DashboardSidebarToggle } from '@hareui/vue'
</script>

<template>
  <!-- The toggle hides itself from `md` up, where the sidebar is docked: `md:flex` keeps these on screen. -->
  <div class="flex flex-wrap items-center justify-center gap-2">
    <DashboardSidebarToggle variant="ghost" class="md:flex" />
    <DashboardSidebarToggle variant="tertiary" class="md:flex" />
    <DashboardSidebarToggle variant="secondary" class="md:flex" />
    <DashboardSidebarToggle variant="outline" class="md:flex" />
  </div>
</template>
