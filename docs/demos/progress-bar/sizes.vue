<script setup lang="ts">
import { ProgressBar } from '@hareui/vue'
</script>

<template>
  <div class="flex w-64 flex-col gap-6">
    <ProgressBar aria-label="Small" label="Small" size="sm" :value="40" />
    <ProgressBar aria-label="Medium" label="Medium" size="md" :value="60" />
    <ProgressBar aria-label="Large" label="Large" size="lg" :value="80" />
  </div>
</template>
