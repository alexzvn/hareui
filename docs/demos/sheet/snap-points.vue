<template>
  <Sheet :snap-points="snapPoints" title="Nearby places" class="mx-auto max-w-[480px]">
    <Button variant="secondary"> Snap Points </Button>
    <template #body>
      <p class="text-sm text-muted">
        {{ places.length }} places within a 15-minute walk. Swipe up to see them all.
      </p>
      <ul class="mt-3 flex flex-col divide-y divide-separator">
        <li v-for="place in places" :key="place.name" class="flex items-center gap-3 py-3">
          <span class="flex size-10 shrink-0 items-center justify-center rounded-xl bg-default">
            <Icon class="size-5 text-muted" :icon="place.icon" />
          </span>
          <div class="flex min-w-0 flex-1 flex-col">
            <span class="truncate text-sm font-medium">{{ place.name }}</span>
            <span class="truncate text-xs text-muted">{{ place.kind }}</span>
          </div>
          <span class="shrink-0 text-xs text-muted tabular-nums">{{ place.distance }}</span>
        </li>
      </ul>
    </template>
  </Sheet>
</template>

<script setup lang="ts">
import { Button, Sheet } from '@hareui/vue'
import { Icon } from '@iconify/vue'

const snapPoints = ['148px', '355px']

const places = [
  {
    name: 'Copper Kettle Coffee',
    kind: 'Café · Open until 6 pm',
    distance: '120 m',
    icon: 'gravity-ui:cup',
  },
  {
    name: 'Riverside Market',
    kind: 'Groceries · Open now',
    distance: '240 m',
    icon: 'gravity-ui:shopping-basket',
  },
  {
    name: 'Elm Street Library',
    kind: 'Library · Free Wi-Fi',
    distance: '350 m',
    icon: 'gravity-ui:books',
  },
  { name: 'Harbour Park', kind: 'Park · Playground', distance: '480 m', icon: 'gravity-ui:geo' },
  {
    name: 'Northside Pharmacy',
    kind: 'Pharmacy · Open 24 hours',
    distance: '520 m',
    icon: 'gravity-ui:shield-check',
  },
  {
    name: 'The Paper Lantern',
    kind: 'Bookshop · Open until 8 pm',
    distance: '640 m',
    icon: 'gravity-ui:book-open',
  },
  {
    name: 'Canal Street Station',
    kind: 'Metro · Lines 2 and 4',
    distance: '780 m',
    icon: 'gravity-ui:location-arrow',
  },
  {
    name: 'Fig & Olive Bistro',
    kind: 'Restaurant · Tables free',
    distance: '910 m',
    icon: 'gravity-ui:house',
  },
  {
    name: 'Glasswork Gallery',
    kind: 'Gallery · Free entry',
    distance: '1.1 km',
    icon: 'gravity-ui:picture',
  },
]
</script>
