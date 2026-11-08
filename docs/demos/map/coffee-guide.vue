<template>
  <div class="relative flex w-full flex-col overflow-hidden rounded-2xl border border-separator">
    <div class="h-90 sm:h-110">
      <Map ref="map" :center="[-9.142, 38.712]" :zoom="14.5" @load="fit">
        <MapMarker
          v-for="cafe in shown"
          :key="cafe.id"
          :position="[cafe.long, cafe.lat]"
          :label="cafe.name"
          @click="selectedId = cafe.id"
        >
          <span
            class="flex size-7 items-center justify-center rounded-full shadow-overlay ring-2 ring-surface transition-colors"
            :class="
              cafe.id === selectedId
                ? 'bg-accent text-accent-foreground'
                : 'bg-foreground text-background'
            "
          >
            <Icon icon="tabler:coffee" class="size-4" />
          </span>
          <MapMarkerTooltip>{{ cafe.name }} · {{ cafe.rating }}</MapMarkerTooltip>
        </MapMarker>

        <MapPopup
          v-if="selected"
          :position="[selected.long, selected.lat]"
          :label="selected.name"
          close-button
          @close="selectedId = undefined"
        >
          <div class="flex flex-col gap-1 pr-6">
            <span class="text-sm font-medium">{{ selected.name }}</span>
            <span class="text-xs text-muted">{{ selected.street }}</span>
            <span class="text-xs text-muted">Open {{ selected.opens }}–{{ selected.closes }}</span>
          </div>
        </MapPopup>
      </Map>
    </div>

    <Card
      class="m-3 bg-overlay shadow-overlay sm:absolute sm:top-0 sm:bottom-0 sm:left-0 sm:w-72"
      title="Coffee in Baixa and Chiado"
      :description="`${shown.length} of ${cafes.length} cafés`"
      :ui="{ content: 'min-h-0' }"
    >
      <ToggleButtonGroup v-model="filters" selection-mode="multiple" size="sm" aria-label="Filters">
        <ToggleButton v-for="filter in FILTERS" :key="filter.value" :value="filter.value">
          {{ filter.label }}
        </ToggleButton>
      </ToggleButtonGroup>

      <ul class="mt-3 flex max-h-48 flex-col overflow-y-auto sm:max-h-none">
        <li v-for="cafe in shown" :key="cafe.id">
          <button
            type="button"
            class="flex w-full items-center justify-between gap-3 rounded-lg px-2 py-1.5 text-left text-sm transition-colors hover:bg-default focus-visible:outline-2 focus-visible:outline-focus"
            :class="{ 'bg-default': cafe.id === selectedId }"
            @click="selectedId = cafe.id"
          >
            <span class="truncate">{{ cafe.name }}</span>
            <span class="flex shrink-0 items-center gap-1 text-xs text-muted">
              <Icon icon="gravity-ui:star-fill" class="size-3 text-warning" />
              {{ cafe.rating }}
            </span>
          </button>
        </li>
      </ul>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { Card, ToggleButton, ToggleButtonGroup } from '@hareui/vue'
import { Map, MapMarker, MapMarkerTooltip, MapPopup } from '@hareui/vue/map'
import { Icon } from '@iconify/vue'
import { computed, ref, useTemplateRef } from 'vue'

import data from './data/lisbon-cafes.json'

const FILTERS = [
  { value: 'wifi', label: 'Wi-Fi' },
  { value: 'terrace', label: 'Terrace' },
  { value: 'roastery', label: 'Roastery' },
]

const cafes = data.cafes
const filters = ref<string[]>([])
const selectedId = ref<string>()

const shown = computed(() =>
  cafes.filter((cafe) => filters.value.every((filter) => cafe.tags.includes(filter))),
)

const selected = computed(() => shown.value.find((cafe) => cafe.id === selectedId.value))

const map = useTemplateRef('map')

// Shows every café, clear of the list that floats over the map on wider screens.
const fit = () => {
  const isWide = window.matchMedia('(min-width: 640px)').matches

  map.value?.fitPoints(
    cafes.map((cafe) => [cafe.long, cafe.lat]),
    { padding: isWide ? { top: 48, right: 48, bottom: 48, left: 344 } : 40, duration: 0 },
  )
}
</script>
