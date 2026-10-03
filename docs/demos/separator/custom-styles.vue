<script setup lang="ts">
import { Separator } from '@hareui/vue'
</script>

<template>
  <div class="max-w-xs space-y-4">
    <p class="text-sm font-medium text-foreground">Account settings</p>
    <Separator class="bg-separator-secondary" />
    <div class="flex items-center gap-3 text-sm text-muted">
      <span>Profile</span>
      <Separator class="h-4 bg-separator" orientation="vertical" />
      <span>Billing</span>
      <Separator class="h-4 bg-separator" orientation="vertical" />
      <span>Security</span>
    </div>
  </div>
</template>
