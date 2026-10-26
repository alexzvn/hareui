<template>
  <DashboardGroup :persistent="false">
    <!-- The default slot replaces header/body/footer: no padding, no scroll container. -->
    <DashboardPanel id="default-slot">
      <div class="flex flex-1 items-center justify-center text-sm text-muted">
        Free-form content
      </div>
    </DashboardPanel>
  </DashboardGroup>
</template>

<script setup lang="ts">
import { DashboardGroup, DashboardPanel } from '@hareui/vue'
</script>
