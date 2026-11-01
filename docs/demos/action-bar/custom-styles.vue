<template>
  <div class="flex min-h-screen items-center justify-center p-6">
    <p class="text-sm text-muted">This bar sits at the bottom right with smaller rounding.</p>
    <ActionBar
      default-open
      aria-label="Draft actions"
      :ui="{ base: 'justify-end px-6', toolbar: 'rounded-xl' }"
    >
      <template #prefix>
        <span class="text-sm text-muted">Draft saved</span>
      </template>
      <Button size="sm" variant="ghost">Preview</Button>
      <Button size="sm">Publish</Button>
    </ActionBar>
  </div>
</template>

<script setup lang="ts">
import { ActionBar, Button } from '@hareui/vue'
</script>
