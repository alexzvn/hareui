<template>
  <div class="flex flex-wrap items-center gap-3">
    <TrendChip label="+12%">
      <template #prefix>MRR</template>
    </TrendChip>
    <TrendChip trend="down" label="-7.5%">
      <template #suffix>vs last quarter</template>
    </TrendChip>
    <TrendChip label="+2,480">
      <template #suffix>new users</template>
    </TrendChip>
  </div>
</template>

<script setup lang="ts">
import { TrendChip } from '@hareui/vue'
</script>
