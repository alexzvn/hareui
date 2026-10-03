<script setup lang="ts">
import { Meter } from '@hareui/vue'
</script>

<template>
  <div class="flex w-64 flex-col gap-6">
    <Meter color="success" label="Small" size="sm" :value="40" />
    <Meter color="accent" label="Medium" size="md" :value="60" />
    <Meter color="warning" label="Large" size="lg" :value="80" />
  </div>
</template>
