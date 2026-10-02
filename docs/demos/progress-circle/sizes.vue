<script setup lang="ts">
import { ProgressCircle } from 'herouse'
</script>

<template>
  <div class="flex items-center gap-6">
    <ProgressCircle aria-label="Loading" size="sm" :value="40" />
    <ProgressCircle aria-label="Loading" size="md" :value="60" />
    <ProgressCircle aria-label="Loading" size="lg" :value="80" />
  </div>
</template>
