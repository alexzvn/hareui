<template>
  <EmptyState class="w-full max-w-[420px]" variant="outline">
    <template #title>Storage is <span class="text-danger">full</span></template>
    <template #description>
      You are using 15 GB of 15 GB. Delete files or upgrade to keep syncing.
    </template>
    <template #actions>
      <Button size="sm">Upgrade</Button>
      <Button size="sm" variant="ghost">Manage files</Button>
    </template>
  </EmptyState>
</template>

<script setup lang="ts">
import { Button, EmptyState } from '@hareui/vue'
</script>
