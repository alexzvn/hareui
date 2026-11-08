<template>
  <div
    class="grid w-full overflow-hidden rounded-2xl border border-separator sm:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]"
  >
    <form class="flex flex-col gap-4 p-5" @submit.prevent>
      <div class="flex flex-col gap-1">
        <h3 class="text-sm font-medium">Delivery address</h3>
        <p class="text-sm text-muted">Drag the pin to your door.</p>
      </div>
      <TextField
        v-model="street"
        label="Street and number"
        name="street"
        placeholder="Rua da Rosa 120"
      />
      <TextField label="Notes for the courier" name="notes">
        <TextArea placeholder="Third floor, blue door" :rows="3" />
      </TextField>
      <div class="flex flex-col gap-1.5" aria-live="polite">
        <Chip :color="isCovered ? 'success' : 'danger'" variant="soft" class="self-start">
          {{ isCovered ? 'We deliver here' : 'Outside our area' }}
        </Chip>
        <span class="text-xs text-muted tabular-nums">
          {{ parish ? `${parish.name} · ` : '' }}{{ pin[1].toFixed(5) }}, {{ pin[0].toFixed(5) }}
        </span>
      </div>
    </form>

    <div class="h-80 sm:h-110">
      <Map ref="map" :center="[-9.143, 38.716]" :zoom="13" @load="fit">
        <MapPolygon
          v-for="area in deliveryArea"
          :key="area.id"
          :points="area.ring as [number, number][]"
          color="accent"
          :opacity="0.12"
          type="dashed"
        />
        <MapMarker v-model:position="pin" draggable label="Delivery pin" anchor="bottom">
          <Icon icon="tabler:map-pin-filled" class="size-8 text-accent drop-shadow-md" />
        </MapMarker>
      </Map>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Chip, TextArea, TextField } from '@hareui/vue'
import { Map, MapMarker, MapPolygon } from '@hareui/vue/map'
import { Icon } from '@iconify/vue'
import { computed, ref, useTemplateRef } from 'vue'

import data from './data/lisbon-parishes.json'

type Position = [long: number, lat: number]

const DELIVERY_PARISHES = [
  'Misericórdia',
  'Santa Maria Maior',
  'Santo António',
  'São Vicente',
  'Estrela',
  'Arroios',
]

const deliveryArea = data.parishes.filter((parish) => DELIVERY_PARISHES.includes(parish.name))

// Whether `point` lies inside `ring`: a ray from the point crosses the ring's edges an odd number of times.
const isInside = ([x, y]: Position, ring: Position[]) => {
  let isInsideRing = false
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i]!
    const [xj, yj] = ring[j]!
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi)
      isInsideRing = !isInsideRing
  }

  return isInsideRing
}

const street = ref('')
const pin = ref<Position>([-9.1446, 38.7128])

const parish = computed(() =>
  data.parishes.find((item) => isInside(pin.value, item.ring as Position[])),
)

const isCovered = computed(() =>
  Boolean(parish.value && DELIVERY_PARISHES.includes(parish.value.name)),
)

const map = useTemplateRef('map')

// Shows the whole delivery area.
const fit = () => {
  map.value?.fitPoints(
    deliveryArea.flatMap((area) => area.ring as Position[]),
    { padding: 24, duration: 0 },
  )
}
</script>
