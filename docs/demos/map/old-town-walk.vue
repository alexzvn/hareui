<template>
  <div class="relative flex w-full flex-col overflow-hidden rounded-2xl border border-separator">
    <div class="h-90 sm:h-110">
      <Map
        ref="map"
        :center="[-9.134, 38.7104]"
        :zoom="15"
        :controls="{ compass: true }"
        @load="fit"
      >
        <MapRoute :points="walk.points" color="accent" :width="4" />

        <MapMarker
          v-for="(stop, index) in walk.stops"
          :key="stop.name"
          :position="[stop.long, stop.lat]"
          :label="stop.name"
          @click="selectedIndex = index"
          @hover="(isHovered) => (hoveredIndex = isHovered ? index : undefined)"
        >
          <span
            class="flex size-7 items-center justify-center rounded-full text-xs font-semibold ring-2 ring-surface transition-[background-color,scale] duration-150"
            :class="
              index === hoveredIndex || index === selectedIndex
                ? 'scale-115 bg-accent text-accent-foreground'
                : 'bg-foreground text-background'
            "
          >
            {{ index + 1 }}
          </span>
        </MapMarker>

        <MapPopup
          v-if="selected"
          :position="[selected.long, selected.lat]"
          :label="selected.name"
          @close="selectedIndex = undefined"
        >
          <div class="flex flex-col gap-0.5 pr-6">
            <span class="text-sm font-medium">{{ selected.name }}</span>
            <span class="text-xs text-muted"
              >Stop {{ selectedIndex! + 1 }} of {{ walk.stops.length }}</span
            >
          </div>
        </MapPopup>
      </Map>
    </div>

    <Card
      class="m-3 bg-overlay shadow-overlay sm:absolute sm:top-0 sm:left-0 sm:w-64"
      title="Old town walk"
      :description="`From the river up to the castle. ${km} km · ${minutes(walk.duration)} min`"
    >
      <ol class="flex flex-col">
        <template v-for="(stop, index) in walk.stops" :key="stop.name">
          <li>
            <button
              type="button"
              class="flex w-full items-center gap-3 rounded-lg px-2 py-1.5 text-left text-sm transition-colors hover:bg-default focus-visible:outline-2 focus-visible:outline-focus"
              :class="{ 'bg-default': index === hoveredIndex }"
              @click="selectedIndex = index"
              @pointerenter="hoveredIndex = index"
              @pointerleave="hoveredIndex = undefined"
            >
              <span
                class="flex size-5 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold"
                :class="
                  index === selectedIndex
                    ? 'bg-accent text-accent-foreground'
                    : 'bg-foreground text-background'
                "
              >
                {{ index + 1 }}
              </span>
              {{ stop.name }}
            </button>
          </li>
          <li v-if="walk.legs[index]" class="py-0.5 pl-[18px] text-xs text-muted">
            <span class="border-l border-dashed border-separator pl-5">
              {{ minutes(walk.legs[index].duration) }} min walk
            </span>
          </li>
        </template>
      </ol>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { Card } from '@hareui/vue'
import { Map, MapMarker, MapPopup, MapRoute } from '@hareui/vue/map'
import { computed, ref, useTemplateRef } from 'vue'

import data from './data/lisbon-routes.json'

// The JSON holds plain arrays; the map takes `[long, lat]` tuples.
const walk = { ...data.routes.walk, points: data.routes.walk.points as [number, number][] }
const km = (walk.distance / 1000).toFixed(1)
const minutes = (seconds: number) => Math.round(seconds / 60)

const map = useTemplateRef('map')
const hoveredIndex = ref<number>()
const selectedIndex = ref<number>()
const selected = computed(() =>
  selectedIndex.value === undefined ? undefined : walk.stops[selectedIndex.value],
)

// Shows the whole walk, clear of the card that floats over the map on wider screens.
const fit = () => {
  const isWide = window.matchMedia('(min-width: 640px)').matches

  map.value?.fitPoints(walk.points, {
    padding: isWide ? { top: 48, right: 72, bottom: 40, left: 320 } : 48,
    duration: 0,
  })
}
</script>
