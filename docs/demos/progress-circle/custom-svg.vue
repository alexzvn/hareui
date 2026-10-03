<script setup lang="ts">
import { ProgressCircle } from '@hareui/vue'
</script>

<template>
  <div class="flex items-end gap-6">
    <ProgressCircle aria-label="Thin circle" :stroke-width="2" :value="60" />
    <ProgressCircle aria-label="Default circle" :value="60" />
    <ProgressCircle aria-label="Thick circle" :stroke-width="6" :value="60" />
  </div>
</template>
