<template>
  <div class="flex flex-wrap items-center gap-3">
    <TrendChip trend="up" label="+12.4%" />
    <TrendChip trend="down" label="-3.7%" />
    <TrendChip trend="neutral" label="0.0%" />
  </div>
</template>

<script setup lang="ts">
import { TrendChip } from '@hareui/vue'
</script>
