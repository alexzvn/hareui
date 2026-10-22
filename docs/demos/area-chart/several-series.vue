<script setup lang="ts">
import { Card } from '@hareui/vue'
import { AreaChart, ChartLegend } from '@hareui/vue/charts'

const data = [
  { hour: '00:00', download: 120, upload: 35 },
  { hour: '03:00', download: 85, upload: 22 },
  { hour: '06:00', download: 140, upload: 41 },
  { hour: '09:00', download: 380, upload: 160 },
  { hour: '12:00', download: 420, upload: 210 },
  { hour: '15:00', download: 395, upload: 245 },
  { hour: '18:00', download: 610, upload: 180 },
  { hour: '21:00', download: 720, upload: 150 },
]

const series = { download: { name: 'Download' }, upload: { name: 'Upload' } }

function formatSpeed(value: number | string) {
  return `${value} Mbps`
}
</script>

<template>
  <Card class="w-full max-w-[520px] rounded-2xl" :ui="{ header: 'flex-row items-center justify-between' }">
    <template #header>
      <h3 class="text-base font-medium text-foreground">Office Network</h3>
      <ChartLegend :series="series" />
    </template>
    <div class="flex flex-col gap-4">
      <div class="flex flex-col">
        <span class="text-lg font-semibold text-foreground">1.42 TB</span>
        <span class="text-xs text-muted">Transferred today</span>
      </div>
      <AreaChart
        :data="data"
        index="hour"
        :series="series"
        aria-label="Office network download and upload speed"
        :height="200"
        :tooltip="{ valueFormatter: formatSpeed }"
      />
    </div>
  </Card>
</template>
