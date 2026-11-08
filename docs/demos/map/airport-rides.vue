<template>
  <div class="relative flex w-full flex-col overflow-hidden rounded-2xl border border-separator">
    <div class="h-90 sm:h-110">
      <Map ref="map" :center="[-9.133, 38.738]" :zoom="12" @load="fit">
        <!-- The other ride draws first, so the selected one sits on top. -->
        <MapRoute
          :points="other.points"
          color="default"
          :width="4"
          :opacity="0.6"
          @click="selectedId = other.id"
        />
        <MapRoute :points="selected.points" color="accent" :width="5" />

        <MapMarker :position="[start.long, start.lat]" label="Lisbon Airport">
          <MapMarkerDot color="var(--foreground)" />
          <MapMarkerLabel position="bottom">Airport</MapMarkerLabel>
        </MapMarker>
        <MapMarker :position="[end.long, end.lat]" :label="end.name">
          <MapMarkerDot color="accent" />
          <MapMarkerLabel position="bottom">{{ end.name }}</MapMarkerLabel>
        </MapMarker>
      </Map>
    </div>

    <Card
      class="m-3 bg-overlay shadow-overlay sm:absolute sm:top-0 sm:left-0 sm:w-64"
      title="Ride into town"
      description="Two ways from the airport to Praça do Comércio. Pick one here or on the map."
    >
      <RadioGroup
        v-model="selectedId"
        name="airport-ride"
        aria-label="Route"
        :items="items"
        variant="secondary"
      />
    </Card>
  </div>
</template>

<script setup lang="ts">
import type { RadioGroupItem } from '@hareui/vue'
import { Card, RadioGroup } from '@hareui/vue'
import { Map, MapMarker, MapMarkerDot, MapMarkerLabel, MapRoute } from '@hareui/vue/map'
import { computed, ref, useTemplateRef } from 'vue'

import data from './data/lisbon-routes.json'

// The JSON holds plain arrays; the map takes `[long, lat]` tuples.
const toPoints = (points: number[][]) => points as [number, number][]

const rides = [
  {
    id: 'fastest',
    label: 'Fastest',
    ...data.routes.fastest,
    points: toPoints(data.routes.fastest.points),
  },
  {
    id: 'alternative',
    label: 'Alternative',
    ...data.routes.alternative,
    points: toPoints(data.routes.alternative.points),
  },
]

const [start, end] = data.routes.fastest.stops

const items: RadioGroupItem[] = rides.map((ride) => ({
  value: ride.id,
  label: `${ride.label} · ${Math.round(ride.duration / 60)} min`,
  description: `${(ride.distance / 1000).toFixed(1)} km by car`,
}))

const map = useTemplateRef('map')
const selectedId = ref('fastest')
const selected = computed(() => rides.find((ride) => ride.id === selectedId.value)!)
const other = computed(() => rides.find((ride) => ride.id !== selectedId.value)!)

// Shows both rides, clear of the card that floats over the map on wider screens.
const fit = () => {
  const isWide = window.matchMedia('(min-width: 640px)').matches

  map.value?.fitPoints(
    rides.flatMap((ride) => ride.points),
    {
      padding: isWide ? { top: 48, right: 48, bottom: 48, left: 320 } : 48,
      duration: 0,
    },
  )
}
</script>
