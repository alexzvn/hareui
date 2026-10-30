<script setup lang="ts">
import { h, ref } from 'vue'
import { Chip } from '@hareui/vue'
import { Timeline } from '@/components/timeline'
import type { TimelineItem } from '@/components/timeline'
import { Icon } from '../icons'

const icon = (name: string) => () => h(Icon, { icon: `gravity-ui:${name}` })

const sizes = ['sm', 'md', 'lg'] as const
const colors = ['accent', 'success', 'warning', 'danger'] as const
const statuses = ['default', 'current', 'success', 'warning', 'danger', 'muted'] as const

const trip: TimelineItem[] = [
  { date: 'Mon 08:00', title: 'Left Lisbon', description: 'Coastal road north, light traffic.', icon: icon('car') },
  { date: 'Mon 13:30', title: 'Lunch in Coimbra', description: 'Two hours by the river.', icon: icon('mug') },
  { date: 'Tue 10:00', title: 'Porto wine cellars', description: 'Guided tour, tickets booked.', icon: icon('ticket') },
  { date: 'Wed 09:15', title: 'Douro valley hike', description: 'Eleven kilometres, bring water.', icon: icon('sun') },
]

const statusItems: TimelineItem[] = statuses.map((status) => ({
  title: `Status ${status}`,
  description: 'Marker tone set per item.',
  status,
  icon: icon('circle-check'),
}))

const avatars: TimelineItem[] = [
  { title: 'Wren drafted the menu', date: '08:20', avatar: { src: 'https://i.pravatar.cc/96?img=32' } },
  { title: 'Odile listed the allergens', date: '08:55', avatar: { fallback: 'OB' } },
  { title: 'Menu signed off', date: '09:35', avatar: { src: 'https://i.pravatar.cc/96?img=15' } },
]

const slotted: TimelineItem[] = [
  { title: 'Draft saved', date: 'Yesterday', icon: icon('file') },
  { title: 'Release 2.4', date: 'Today', slot: 'release', icon: icon('rocket') },
  { title: 'Archived', date: 'Tomorrow', status: 'muted' },
]

const active = ref(1)
const reverseActive = ref(2)
const selected = ref('')
</script>

<template>
  <div class="flex flex-col gap-10">
    <h1 class="text-xl font-semibold">Timeline</h1>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">Basic</h2>
      <Timeline :items="trip" class="max-w-md" />
    </section>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">Sizes</h2>
      <div class="grid grid-cols-3 gap-6">
        <Timeline v-for="size in sizes" :key="size" :items="trip.slice(0, 3)" :size="size" />
      </div>
    </section>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">Density (compact / comfortable)</h2>
      <div class="grid grid-cols-2 gap-6">
        <Timeline :items="trip" size="sm" density="compact" />
        <Timeline :items="trip" size="sm" density="comfortable" />
      </div>
    </section>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">Status</h2>
      <Timeline :items="statusItems" size="sm" density="compact" />
    </section>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">v-model + colors (active {{ active }})</h2>
      <div class="mb-3 flex gap-2">
        <button v-for="i in 4" :key="i" class="rounded border border-border px-2 text-xs" @click="active = i - 1">{{ i - 1 }}</button>
      </div>
      <div class="grid grid-cols-4 gap-6">
        <Timeline v-for="color in colors" :key="color" v-model="active" :items="trip" :color="color" size="sm" />
      </div>
    </section>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">Reverse (active {{ reverseActive }})</h2>
      <Timeline v-model="reverseActive" :items="trip" reverse />
    </section>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">Horizontal</h2>
      <Timeline :items="trip" orientation="horizontal" :default-value="2" />
      <Timeline :items="trip" orientation="horizontal" size="sm" density="compact" class="mt-6" />
    </section>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">Axis center: placement end / start / alternate</h2>
      <div class="grid grid-cols-3 gap-6">
        <Timeline :items="trip" axis="center" placement="end" size="sm" />
        <Timeline :items="trip" axis="center" placement="start" size="sm" />
        <Timeline :items="trip" axis="center" placement="alternate" size="sm" />
      </div>
    </section>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">Avatars</h2>
      <Timeline :items="avatars" size="sm" />
    </section>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">Slots + select ({{ selected || 'none' }})</h2>
      <Timeline :items="slotted" @select="(_, item) => (selected = String(item.title))">
        <template #indicator="{ index }">{{ index + 1 }}</template>
        <template #release-description="{ item }">
          <div class="mt-1 flex items-center gap-2">
            <Chip size="sm" color="success" variant="soft">Shipped</Chip>
            <span>{{ item.title }} went out to all regions.</span>
          </div>
        </template>
      </Timeline>
    </section>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">:ui override (trailing dates)</h2>
      <Timeline
        :items="trip"
        size="sm"
        density="compact"
        class="max-w-lg"
        :ui="{ wrapper: 'grid grid-cols-[minmax(0,1fr)_auto] gap-x-4', date: 'col-start-2 row-start-1', description: 'col-start-1' }"
      />
    </section>
  </div>
</template>
