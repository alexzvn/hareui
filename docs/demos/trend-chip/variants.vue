<template>
  <div class="flex flex-col gap-3">
    <div v-for="variant in variants" :key="variant" class="flex flex-wrap items-center gap-3">
      <span class="w-20 text-xs text-muted">{{ variant }}</span>
      <TrendChip :variant="variant" trend="up" label="+6.2%" />
      <TrendChip :variant="variant" trend="down" label="-1.9%" />
      <TrendChip :variant="variant" trend="neutral" label="0.0%" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { TrendChip } from '@hareui/vue'

const variants = ['primary', 'secondary', 'soft', 'tertiary'] as const
</script>
