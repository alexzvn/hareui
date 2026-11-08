<template>
  <div class="relative flex w-full flex-col overflow-hidden rounded-2xl border border-separator">
    <div class="h-90 sm:h-110">
      <Map ref="map" :center="[-9.142, 38.712]" :zoom="14" :controls="{ locate: true }" @load="fit">
        <MapMarker
          v-for="dock in docks"
          :key="dock.id"
          :position="[dock.long, dock.lat]"
          :label="`${dock.name}: ${dock.bikes} of ${dock.capacity} bikes free`"
        >
          <svg viewBox="0 0 24 24" class="size-6 drop-shadow-sm" aria-hidden="true">
            <circle cx="12" cy="12" r="11" class="fill-surface" />
            <circle
              cx="12"
              cy="12"
              r="7"
              fill="none"
              stroke-width="4"
              class="opacity-30"
              :class="LEVELS[level(dock)].stroke"
            />
            <circle
              cx="12"
              cy="12"
              r="7"
              fill="none"
              stroke-width="4"
              pathLength="100"
              :stroke-dasharray="`${(dock.bikes / dock.capacity) * 100} 100`"
              transform="rotate(-90 12 12)"
              :class="LEVELS[level(dock)].stroke"
            />
          </svg>
          <MapMarkerTooltip>
            <span class="font-medium">{{ dock.name }}</span>
            <span class="text-muted"> · {{ dock.bikes }} / {{ dock.capacity }} bikes</span>
          </MapMarkerTooltip>
        </MapMarker>
      </Map>
    </div>

    <Card
      class="m-3 bg-overlay shadow-overlay sm:absolute sm:top-0 sm:left-0 sm:w-64"
      title="Bike-share docks"
      description="Free bikes near the river right now."
    >
      <dl class="grid grid-cols-3 gap-2">
        <div v-for="stat in stats" :key="stat.label" class="flex flex-col">
          <dt class="text-xs text-muted">{{ stat.label }}</dt>
          <dd class="text-lg font-semibold tabular-nums">{{ stat.value }}</dd>
        </div>
      </dl>
      <ul class="mt-2 flex flex-col gap-1 text-xs text-muted">
        <li v-for="item in LEVELS" :key="item.label" class="flex items-center gap-2">
          <span class="size-2 rounded-full" :class="item.dot" />
          {{ item.label }}
        </li>
      </ul>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { Card } from '@hareui/vue'
import { Map, MapMarker, MapMarkerTooltip } from '@hareui/vue/map'
import { useTemplateRef } from 'vue'

import data from './data/lisbon-bike-docks.json'

type Dock = (typeof data.docks)[number]

const LEVELS = [
  { label: 'Plenty of bikes', stroke: 'stroke-success', dot: 'bg-success' },
  { label: 'A few left', stroke: 'stroke-warning', dot: 'bg-warning' },
  { label: 'Empty', stroke: 'stroke-danger', dot: 'bg-danger' },
]

const level = (dock: Dock) => {
  if (dock.bikes === 0) return 2

  return dock.bikes / dock.capacity < 0.25 ? 1 : 0
}

const docks = data.docks
const stats = [
  { label: 'Docks', value: docks.length },
  { label: 'Bikes free', value: docks.reduce((sum, dock) => sum + dock.bikes, 0) },
  { label: 'Empty', value: docks.filter((dock) => dock.bikes === 0).length },
]

const map = useTemplateRef('map')

// Shows every dock, clear of the card that floats over the map on wider screens.
const fit = () => {
  const isWide = window.matchMedia('(min-width: 640px)').matches

  map.value?.fitPoints(
    docks.map((dock) => [dock.long, dock.lat]),
    { padding: isWide ? { top: 40, right: 72, bottom: 40, left: 320 } : 40, duration: 0 },
  )
}
</script>
