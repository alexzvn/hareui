<template>
  <div class="relative flex w-full flex-col overflow-hidden rounded-2xl border border-separator">
    <div class="h-90 sm:h-110">
      <Map ref="map" :center="[-9.18, 38.697]" :zoom="13" @load="start">
        <MapRoute :points="remaining" color="default" :width="4" type="dashed" />
        <MapRoute :points="travelled" color="accent" :width="4" />

        <MapMarker :position="[destination.long, destination.lat]" :label="destination.name">
          <MapMarkerDot color="var(--foreground)" />
          <MapMarkerLabel position="bottom">{{ destination.name }}</MapMarkerLabel>
        </MapMarker>
        <MapMarker :position="courier" label="Courier">
          <span
            class="flex size-8 items-center justify-center rounded-full bg-accent text-accent-foreground shadow-overlay ring-2 ring-surface"
          >
            <Icon icon="tabler:bike" class="size-4" />
          </span>
        </MapMarker>
      </Map>
    </div>

    <Card class="m-3 bg-overlay shadow-overlay sm:absolute sm:top-0 sm:left-0 sm:w-64">
      <div class="flex items-center gap-3">
        <Avatar fallback="RM" color="accent" size="sm" />
        <div class="flex flex-col">
          <span class="text-sm font-medium">Rita is on her way</span>
          <span class="text-xs text-muted">Order 2041 · Cais do Sodré to Belém</span>
        </div>
      </div>
      <ProgressBar
        class="mt-4"
        label="Arriving in"
        :value="progress * 100"
        :value-label="`${minutesLeft} min`"
        size="sm"
      />
    </Card>
  </div>
</template>

<script setup lang="ts">
import { Avatar, Card, ProgressBar } from '@hareui/vue'
import { Map, MapMarker, MapMarkerDot, MapMarkerLabel, MapRoute } from '@hareui/vue/map'
import { Icon } from '@iconify/vue'
import { computed, onBeforeUnmount, ref, useTemplateRef } from 'vue'

import data from './data/lisbon-routes.json'

type Position = [long: number, lat: number]

const ride = data.routes.ride
const points = ride.points as Position[]
const destination = ride.stops.at(-1)!

// One loop replays the whole ride in 40 seconds.
const LOOP = 40_000

// Distance from the start to each point, in degrees: enough to move at an even pace.
const distances: number[] = []
for (const [index, point] of points.entries()) {
  const previous = points[index - 1] ?? point
  distances.push(
    (distances.at(-1) ?? 0) + Math.hypot(point[0] - previous[0], point[1] - previous[1]),
  )
}

const total = distances.at(-1)!

const progress = ref(0.4)

// Where the courier is at `progress`, and the index of the last route point behind it.
const locate = (progress: number) => {
  const distance = progress * total
  const index = Math.max(distances.findIndex((value) => value >= distance) - 1, 0)
  const [from, to] = [points[index]!, points[index + 1] ?? points[index]!]
  const length = distances[index + 1]! - distances[index]! || 1
  const ratio = (distance - distances[index]!) / length
  const position: Position = [
    from[0] + (to[0] - from[0]) * ratio,
    from[1] + (to[1] - from[1]) * ratio,
  ]

  return { index, position }
}

// The marker moves every frame. The lines redraw twice a second, which keeps the map's work light.
const courier = computed(() => locate(progress.value).position)
const split = computed(() => locate(Math.floor(progress.value * 80) / 80))
const travelled = computed(() => [...points.slice(0, split.value.index + 1), split.value.position])
const remaining = computed(() => [split.value.position, ...points.slice(split.value.index + 1)])
const minutesLeft = computed(() => Math.ceil(((1 - progress.value) * ride.duration) / 60))

let frame = 0
const tick = (time: number) => {
  progress.value = (time % LOOP) / LOOP
  frame = requestAnimationFrame(tick)
}

onBeforeUnmount(() => cancelAnimationFrame(frame))

const map = useTemplateRef('map')

// Shows the whole ride, clear of the card that floats over the map on wider screens.
const fit = () => {
  const isWide = window.matchMedia('(min-width: 640px)').matches

  map.value?.fitPoints(points, {
    padding: isWide
      ? { top: 160, right: 48, bottom: 48, left: 72 }
      : { top: 40, right: 32, bottom: 40, left: 64 },
    duration: 0,
  })
}

// The ride starts once the map has drawn. With reduced motion, the courier stands still partway along.
const start = () => {
  fit()

  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches)
    frame = requestAnimationFrame(tick)
}
</script>
