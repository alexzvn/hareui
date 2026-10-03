<script setup lang="ts">
import { Spinner } from '@hareui/vue'
</script>

<template>
  <div class="flex items-center gap-4 rounded-xl border border-border bg-surface px-5 py-4">
    <Spinner class="text-accent" size="sm" />
    <Spinner class="text-muted" size="md" />
    <Spinner class="text-success" size="lg" />
  </div>
</template>
