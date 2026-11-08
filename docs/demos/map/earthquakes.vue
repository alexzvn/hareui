<template>
  <div class="relative flex w-full flex-col overflow-hidden rounded-2xl border border-separator">
    <div class="h-90 sm:h-110">
      <Map
        ref="map"
        :center="[150, 10]"
        :zoom="1"
        projection="globe"
        :controls="{ fullscreen: true }"
        @load="frame"
      >
        <MapClusterLayer
          v-if="view[0] === 'clusters'"
          :points="quakes"
          :color="(quake) => MAGNITUDES.find((item) => quake.mag >= item.from)!.color"
          :cluster="{ distance: 40 }"
          @point-click="(quake) => (selected = quake)"
        />
        <MapHeatmap v-else :points="quakes" :radius="14" />

        <MapPopup
          v-if="selected"
          :position="selected"
          :label="selected.place"
          close-button
          @close="selected = undefined"
        >
          <div class="flex flex-col gap-1 pr-6">
            <span class="text-sm font-medium"
              >M{{ selected.mag.toFixed(1) }} · {{ selected.place }}</span
            >
            <span class="text-xs text-muted">
              {{ Math.round(selected.depth) }} km deep · {{ date.format(selected.time) }}
            </span>
          </div>
        </MapPopup>
      </Map>
    </div>

    <Card
      class="m-3 bg-overlay shadow-overlay sm:absolute sm:top-0 sm:left-0 sm:w-64"
      title="Earthquakes, last 30 days"
      :description="`${quakes.length.toLocaleString('en')} quakes of magnitude 2.5 or more.`"
    >
      <ToggleButtonGroup
        v-model="view"
        disallow-empty-selection
        full-width
        size="sm"
        aria-label="View"
      >
        <ToggleButton value="clusters">Clusters</ToggleButton>
        <ToggleButton value="heatmap">Heatmap</ToggleButton>
      </ToggleButtonGroup>
      <ul v-if="view[0] === 'clusters'" class="mt-2 flex flex-col gap-1 text-xs text-muted">
        <li v-for="item in MAGNITUDES" :key="item.label" class="flex items-center gap-2">
          <span class="size-2 rounded-full" :style="{ background: item.color }" />
          {{ item.label }}
        </li>
      </ul>
      <p v-else class="mt-2 text-xs text-muted">Stronger quakes count for more.</p>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { Card, ToggleButton, ToggleButtonGroup } from '@hareui/vue'
import { Map, MapClusterLayer, MapHeatmap, MapPopup } from '@hareui/vue/map'
import { ref, useTemplateRef } from 'vue'

import data from './data/earthquakes.json'

type Quake = (typeof quakes)[number]

const MAGNITUDES = [
  { from: 6, label: 'Magnitude 6 or more', color: 'var(--danger)' },
  { from: 4.5, label: 'Magnitude 4.5 to 6', color: 'var(--warning)' },
  { from: 0, label: 'Below 4.5', color: 'var(--accent)' },
]

// Heatmap items weigh by magnitude; clusters ignore `weight`.
const quakes = data.quakes.map((quake) => ({ ...quake, weight: quake.mag }))

const date = new Intl.DateTimeFormat('en', { dateStyle: 'medium', timeStyle: 'short' })
const view = ref(['clusters'])
const selected = ref<Quake>()

const map = useTemplateRef('map')

const isWide = () => window.matchMedia('(min-width: 640px)').matches

// On a wide page the card sits over the left side, so the globe centers in the
// space beside it. Fullscreen shows the map alone, without the card.
const pad = () => {
  const isBeside = isWide() && !document.fullscreenElement
  map.value?.map?.setPadding({ top: 0, right: 0, bottom: 0, left: isBeside ? 272 : 0 })
}

// A narrow map shows less of the globe, so it zooms out further.
const frame = () => {
  pad()
  map.value?.map?.on('resize', pad)
  map.value?.flyTo({ zoom: isWide() ? 1.3 : 0.6 }, { duration: 0 })
}
</script>
