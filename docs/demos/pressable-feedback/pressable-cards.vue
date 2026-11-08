<template>
  <div class="flex w-full max-w-2xl flex-col gap-4">
    <div class="grid gap-4 sm:grid-cols-2">
      <PressableFeedback
        as="article"
        :ripple="CARD_RIPPLE"
        class="flex flex-col rounded-3xl bg-surface text-start shadow-surface"
        @click="opened = trip.title"
      >
        <img alt="" class="aspect-4/3 w-full object-cover" loading="lazy" :src="trip.image" />
        <div class="flex items-center justify-between gap-3 p-4">
          <div class="flex min-w-0 flex-col gap-0.5">
            <p class="text-base font-semibold text-foreground">{{ trip.title }}</p>
            <p class="text-sm text-muted">{{ trip.details }}</p>
          </div>
          <Chip color="accent" variant="soft">Book</Chip>
        </div>
      </PressableFeedback>

      <div class="grid gap-4">
        <PressableFeedback
          v-for="playlist in playlists"
          :key="playlist.title"
          as="article"
          :ripple="CARD_RIPPLE"
          class="flex items-center gap-4 rounded-3xl bg-surface p-3 text-start shadow-surface"
          @click="opened = playlist.title"
        >
          <img
            alt=""
            class="size-24 shrink-0 rounded-2xl object-cover"
            loading="lazy"
            :src="playlist.cover"
          />
          <div class="flex min-w-0 flex-col gap-2">
            <div class="flex flex-col gap-0.5">
              <p class="text-sm font-semibold text-foreground">{{ playlist.title }}</p>
              <p class="text-xs text-muted">{{ playlist.tracks }}</p>
            </div>
            <div class="flex items-center gap-1.5">
              <Avatar
                alt=""
                class="size-5"
                :fallback="playlist.curator.charAt(0)"
                :src="playlist.avatar"
                :ui="{ fallback: 'text-xs' }"
              />
              <span class="text-xs text-muted">By {{ playlist.curator }}</span>
            </div>
          </div>
        </PressableFeedback>
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <PressableFeedback
        v-for="event in events"
        :key="event.title"
        as="article"
        :ripple="CARD_RIPPLE"
        class="flex w-full items-center gap-3 rounded-3xl bg-surface p-3 text-start shadow-surface"
        @click="opened = event.title"
      >
        <img
          alt=""
          class="size-12 shrink-0 rounded-xl object-cover"
          loading="lazy"
          :src="event.image"
        />
        <div class="flex min-w-0 flex-1 flex-col gap-0.5">
          <p class="truncate text-sm font-medium text-foreground">{{ event.title }}</p>
          <p class="truncate text-xs text-muted">{{ event.when }}</p>
        </div>
        <Icon class="size-4 shrink-0 text-muted" icon="gravity-ui:chevron-right" />
      </PressableFeedback>
    </div>

    <p class="text-xs text-muted">Opened: {{ opened }}</p>
  </div>
</template>

<script setup lang="ts">
import { Avatar, Chip, PressableFeedback } from '@hareui/vue'
import { Icon } from '@iconify/vue'
import { ref } from 'vue'

// A softer tint than the button default suits a large white card.
const CARD_RIPPLE = { hoverOpacity: 0.04, pressedOpacity: 0.08 }

const ASSETS = 'https://heroui-assets.nyc3.cdn.digitaloceanspaces.com'

const trip = {
  title: 'Weekend in Lisbon',
  details: '3 nights · from €420',
  image:
    'https://images.unsplash.com/photo-1754151630904-da4334bddfbf?w=800&h=600&fit=crop&auto=format&q=70',
}

const playlists = [
  {
    title: 'Citrus Mornings',
    tracks: '18 tracks · 1 h 04 min',
    cover: `${ASSETS}/docs/oranges.jpeg`,
    curator: 'Rui',
    avatar: `${ASSETS}/avatars/blue.jpg`,
  },
  {
    title: 'Sweet Spot',
    tracks: '24 tracks · 1 h 32 min',
    cover: `${ASSETS}/docs/cherries.jpeg`,
    curator: 'Ana',
    avatar: `${ASSETS}/avatars/purple.jpg`,
  },
]

const events = [
  { title: 'Design review', when: 'Today · 14:00 · Room 2', image: `${ASSETS}/docs/demo1.jpg` },
  { title: 'Team lunch', when: 'Friday · 12:30 · Mercado', image: `${ASSETS}/docs/avocado.jpeg` },
]

const opened = ref('Nothing yet')
</script>
