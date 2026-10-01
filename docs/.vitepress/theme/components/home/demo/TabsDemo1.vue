<script setup lang="ts">
import { Tabs } from 'herouse'

const items = [
  { label: '1D', value: '1d' },
  { label: '7D', value: '7d' },
  { label: '1M', value: '1m' },
  { label: '1Y', value: '1y' },
  { label: 'All', value: 'all' },
]
</script>

<template>
  <Tabs class="w-[256px]" aria-label="Options" :items="items" :content="false" />
</template>
