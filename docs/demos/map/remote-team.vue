<template>
  <div
    class="grid w-full overflow-hidden rounded-2xl border border-separator sm:grid-cols-[17rem_minmax(0,1fr)]"
  >
    <div class="h-90 sm:order-last sm:h-auto sm:min-h-110">
      <Map ref="map" :center="[15, 20]" :zoom="1" projection="globe" @load="frame">
        <MapArc
          v-for="person in people"
          :key="person.id"
          :from="hq"
          :to="person"
          :color="person.color"
          :width="person.id === activeId ? 3 : 2"
          :opacity="activeId === undefined || person.id === activeId ? 0.9 : 0.35"
        />

        <MapMarker :position="hq" label="Lisbon office">
          <span
            class="flex size-6 items-center justify-center rounded-full bg-foreground text-background ring-2 ring-surface"
          >
            <Icon icon="gravity-ui:house" class="size-3.5" />
          </span>
        </MapMarker>
        <MapMarker
          v-for="person in people"
          :key="person.id"
          :position="person"
          :label="`${person.name}, ${person.city}`"
          @click="focus(person)"
          @hover="(isHovered) => (activeId = isHovered ? person.id : undefined)"
        >
          <span
            class="flex size-7 items-center justify-center rounded-full text-[10px] font-semibold text-white ring-2 ring-surface transition-transform"
            :class="{ 'scale-120': person.id === activeId }"
            :style="{ background: cssColor(person.color) }"
          >
            {{ initials(person.name) }}
          </span>
          <MapMarkerTooltip>{{ person.city }}</MapMarkerTooltip>
        </MapMarker>
      </Map>
    </div>

    <Card
      class="m-3 bg-overlay shadow-overlay"
      title="Our team"
      description="Eight people, seven time zones. Pick someone to turn the globe."
    >
      <ul class="flex flex-col">
        <li v-for="person in people" :key="person.id">
          <button
            type="button"
            class="flex w-full items-center gap-2.5 rounded-lg px-2 py-1 text-left transition-colors hover:bg-default focus-visible:outline-2 focus-visible:outline-focus"
            :class="{ 'bg-default': person.id === activeId }"
            @click="focus(person)"
            @pointerenter="activeId = person.id"
            @pointerleave="activeId = undefined"
          >
            <span
              class="size-2 shrink-0 rounded-full"
              :style="{ background: cssColor(person.color) }"
            />
            <span class="flex min-w-0 flex-1 flex-col">
              <span class="truncate text-sm">{{ person.name }}</span>
              <span class="text-xs text-muted">{{ person.city }}</span>
            </span>
            <span class="text-xs text-muted tabular-nums">{{ localTime(person.timeZone) }}</span>
          </button>
        </li>
      </ul>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { Card } from '@hareui/vue'
import { Map, MapArc, MapMarker, MapMarkerTooltip } from '@hareui/vue/map'
import { Icon } from '@iconify/vue'
import type { Map as MapLibreMap } from 'maplibre-gl'
import { onBeforeUnmount, onMounted, ref, useTemplateRef } from 'vue'

import data from './data/team.json'

type Person = (typeof data.people)[number]

const people = data.people
const hq = data.hq

const THEME_COLORS = ['default', 'accent', 'success', 'warning', 'danger']
const cssColor = (color: string) =>
  THEME_COLORS.includes(color) ? `var(--${color === 'default' ? 'muted' : color})` : color

const initials = (name: string) =>
  name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')

// The clocks start after mounting, so the page renders the same on the server and in the browser.
const now = ref<Date>()
let timer: ReturnType<typeof setInterval> | undefined
onMounted(() => {
  now.value = new Date()
  timer = setInterval(() => (now.value = new Date()), 30_000)
})

onBeforeUnmount(() => clearInterval(timer))

const localTime = (timeZone: string) =>
  now.value ? new Intl.DateTimeFormat('en', { timeStyle: 'short', timeZone }).format(now.value) : ''

const map = useTemplateRef('map')
const activeId = ref<string>()

// The globe takes up most of the map, whatever its size.
const frame = (current: MapLibreMap) => {
  const { clientWidth, clientHeight } = current.getContainer()
  const zoom = Math.log2((0.85 * Math.min(clientWidth, clientHeight)) / 148)
  map.value?.flyTo({ zoom }, { duration: 0 })
}

const focus = (person: Person) => {
  activeId.value = person.id
  map.value?.flyTo({ center: [(person.long + hq.long) / 2, (person.lat + hq.lat) / 2] })
}
</script>
