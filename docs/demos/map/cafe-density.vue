<template>
  <div class="relative flex w-full flex-col overflow-hidden rounded-2xl border border-separator">
    <div class="h-90 sm:h-110">
      <Map ref="map" :center="[-9.155, 38.745]" :zoom="11.5" @load="fit">
        <MapPolygon
          v-for="parish in parishes"
          :key="parish.id"
          :points="parish.ring as [number, number][]"
          :color="STEPS[parish.step]!.color"
          :opacity="0.65"
          @hover="(isHovered) => (activeId = isHovered ? parish.id : undefined)"
          @click="activeId = parish.id"
        />
      </Map>
    </div>

    <Card
      class="m-3 bg-overlay shadow-overlay sm:absolute sm:top-0 sm:left-0 sm:w-64"
      title="Cafés per km²"
      description="Lisbon's 24 parishes by how many cafés they pack in."
    >
      <div class="flex h-2 overflow-hidden rounded-full">
        <span
          v-for="step in STEPS"
          :key="step.from"
          class="flex-1"
          :style="{ background: step.color }"
        />
      </div>
      <div class="flex justify-between text-xs text-muted tabular-nums">
        <span v-for="step in STEPS" :key="step.from">{{ step.from }}</span>
      </div>
      <p class="mt-2 min-h-5 text-sm" aria-live="polite">
        <template v-if="active">
          <span class="font-medium">{{ active.name }}</span>
          <span class="text-muted">
            · {{ active.cafes }} cafés · {{ Math.round(active.density) }}/km²</span
          >
        </template>
        <span v-else class="text-muted">Point at a parish.</span>
      </p>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { Card } from '@hareui/vue'
import { Map, MapPolygon } from '@hareui/vue/map'
import { computed, ref, useTemplateRef } from 'vue'

import data from './data/lisbon-parishes.json'

// Each step mixes more of the accent color into the surface.
const STEPS = [0, 5, 15, 30, 60].map((from, index) => ({
  from,
  color: `color-mix(in oklch, var(--accent) ${20 + index * 20}%, var(--surface))`,
}))

const parishes = data.parishes.map((parish) => {
  const density = parish.cafes / parish.area

  return { ...parish, density, step: STEPS.findLastIndex((step) => density >= step.from) }
})

const activeId = ref<string>()
const active = computed(() => parishes.find((parish) => parish.id === activeId.value))

const map = useTemplateRef('map')

// Shows the whole city, clear of the card that floats over the map on wider screens.
const fit = () => {
  const isWide = window.matchMedia('(min-width: 640px)').matches

  map.value?.fitPoints(
    parishes.flatMap((parish) => parish.ring as [number, number][]),
    { padding: isWide ? { top: 24, right: 24, bottom: 24, left: 296 } : 16, duration: 0 },
  )
}
</script>
