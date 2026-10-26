<template>
  <div class="flex w-64 flex-col gap-3">
    <Switch v-model="isActive" label="Point hovered" />
    <div
      class="flex h-20 items-center justify-center rounded-xl border border-separator bg-surface"
    >
      <ChartTooltipContent :active="isActive" label="Morning ride" :payload="rides" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Switch } from '@hareui/vue'
import { ChartTooltipContent } from '@hareui/vue/charts'
import { ref } from 'vue'

const isActive = ref(true)

const rides = [{ name: 'Distance', color: 'var(--chart-2)', value: '14.2 km' }]
</script>
