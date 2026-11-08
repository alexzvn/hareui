<template>
  <div class="relative flex w-full flex-col overflow-hidden rounded-2xl border border-separator">
    <div class="h-90 sm:h-110">
      <Map
        ref="map"
        :center="[-9.138, 38.7128]"
        :zoom="14"
        :controls="{ compass: true }"
        @load="fit"
      >
        <MapMarker
          v-for="viewpoint in viewpoints"
          :key="viewpoint.id"
          :position="[viewpoint.long, viewpoint.lat]"
          :label="viewpoint.name"
          @click="selectedId = viewpoint.id"
        >
          <MapMarkerDot :color="viewpoint.id === selectedId ? 'accent' : 'default'" />
          <MapMarkerLabel :position="viewpoint.labelPosition">{{ viewpoint.label }}</MapMarkerLabel>
        </MapMarker>
      </Map>
    </div>

    <Card
      class="m-3 bg-overlay shadow-overlay sm:absolute sm:top-0 sm:left-0 sm:w-64"
      title="Lisbon viewpoints"
      description="Five miradouros on the city's hills. Pick one on the map."
    >
      <div class="flex flex-col gap-0.5">
        <span class="text-sm font-medium">{{ selected.name }}</span>
        <span class="text-xs text-muted">{{ selected.neighbourhood }}</span>
      </div>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { Card } from '@hareui/vue'
import { Map, MapMarker, MapMarkerDot, MapMarkerLabel } from '@hareui/vue/map'
import { computed, ref, useTemplateRef } from 'vue'

import data from './data/lisbon-viewpoints.json'

// Santa Luzia and Portas do Sol are a minute's walk apart, so one label sits below its dot.
const viewpoints = data.viewpoints.map((viewpoint) => ({
  ...viewpoint,
  labelPosition: viewpoint.name.endsWith('Santa Luzia') ? ('bottom' as const) : ('top' as const),
}))

const map = useTemplateRef('map')
const selectedId = ref(viewpoints[0].id)
const selected = computed(() => viewpoints.find((viewpoint) => viewpoint.id === selectedId.value)!)

// Shows every viewpoint, clear of the card that floats over the map on wider screens.
const fit = () => {
  const isWide = window.matchMedia('(min-width: 640px)').matches
  const padding = isWide ? { top: 56, right: 72, bottom: 40, left: 320 } : 56

  map.value?.fitPoints(
    viewpoints.map((viewpoint) => [viewpoint.long, viewpoint.lat]),
    { padding, duration: 0 },
  )
}
</script>
