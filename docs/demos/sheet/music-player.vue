<template>
  <Sheet
    v-model:snap-point="snap"
    :snap-points="snapPoints"
    title="Now playing"
    class="mx-auto max-w-[420px]"
    :ui="{ header: 'px-4 pt-0 pb-3', body: 'flex flex-col gap-6 px-6 pt-2 pb-8' }"
  >
    <Button variant="secondary"> Now Playing </Button>
    <template #header>
      <div v-if="isMini" class="flex h-11 items-center gap-3">
        <div :class="[cover, 'size-11 shrink-0 rounded-lg']" />
        <div class="flex min-w-0 flex-1 flex-col">
          <span class="truncate text-sm font-medium">{{ track.title }}</span>
          <span class="truncate text-xs text-muted">{{ track.artist }}</span>
        </div>
        <Button
          icon-only
          variant="ghost"
          :aria-label="isPlaying ? 'Pause' : 'Play'"
          @click="isPlaying = !isPlaying"
        >
          <Icon :icon="isPlaying ? 'gravity-ui:pause-fill' : 'gravity-ui:play-fill'" />
        </Button>
      </div>
      <div v-else class="flex h-11 items-center gap-3">
        <Button icon-only size="sm" variant="ghost" aria-label="Minimize player" @click="snap = 0">
          <Icon icon="gravity-ui:chevron-down" />
        </Button>
        <div class="flex min-w-0 flex-1 flex-col items-center">
          <span class="text-xs text-muted">Playing from</span>
          <span class="truncate text-sm font-medium">Late Night Drive</span>
        </div>
        <Button icon-only size="sm" variant="ghost" aria-label="More options">
          <Icon icon="gravity-ui:ellipsis" />
        </Button>
      </div>
    </template>
    <template #body>
      <div :class="[cover, 'mx-auto aspect-square w-full max-w-72 rounded-2xl shadow-lg']" />
      <div class="flex items-center gap-3">
        <div class="flex min-w-0 flex-1 flex-col">
          <span class="truncate text-lg font-semibold">{{ track.title }}</span>
          <span class="truncate text-sm text-muted">{{ track.artist }}</span>
        </div>
        <Button
          icon-only
          variant="ghost"
          :aria-label="isLiked ? 'Remove from liked songs' : 'Add to liked songs'"
          @click="isLiked = !isLiked"
        >
          <Icon
            :class="isLiked ? 'text-danger' : undefined"
            :icon="isLiked ? 'gravity-ui:heart-fill' : 'gravity-ui:heart'"
          />
        </Button>
      </div>
      <div class="flex flex-col gap-1">
        <Slider
          v-model="position"
          aria-label="Playback position"
          :max="track.duration"
          :ui="{ output: 'sr-only' }"
        />
        <div class="flex justify-between text-xs text-muted tabular-nums">
          <span>{{ toTime(position) }}</span>
          <span>-{{ toTime(track.duration - position) }}</span>
        </div>
      </div>
      <div class="flex items-center justify-between">
        <Button icon-only variant="ghost" aria-label="Shuffle">
          <Icon icon="gravity-ui:shuffle" />
        </Button>
        <Button icon-only variant="ghost" aria-label="Previous track">
          <Icon icon="gravity-ui:backward-step-fill" />
        </Button>
        <Button
          icon-only
          size="lg"
          class="size-14 rounded-full"
          :aria-label="isPlaying ? 'Pause' : 'Play'"
          @click="isPlaying = !isPlaying"
        >
          <Icon
            class="size-6"
            :icon="isPlaying ? 'gravity-ui:pause-fill' : 'gravity-ui:play-fill'"
          />
        </Button>
        <Button icon-only variant="ghost" aria-label="Next track">
          <Icon icon="gravity-ui:forward-step-fill" />
        </Button>
        <Button icon-only variant="ghost" aria-label="Repeat">
          <Icon icon="gravity-ui:arrows-rotate-right" />
        </Button>
      </div>
    </template>
  </Sheet>
</template>

<script setup lang="ts">
import { Button, Sheet, Slider } from '@hareui/vue'
import { Icon } from '@iconify/vue'
import { computed, ref } from 'vue'

const snapPoints = ['88px']

const track = { title: 'Harbour Lights', artist: 'The Tidewater Band', duration: 228 }
const cover = 'bg-linear-to-br from-indigo-500 via-fuchsia-500 to-amber-400'

const snap = ref(0)
const position = ref(72)
const isPlaying = ref(true)
const isLiked = ref(false)

// The mini player shows while the sheet rests at its snap point; fully expanded, the header turns into a toolbar.
const isMini = computed(() => snap.value === 0)

const toTime = (seconds: number) =>
  `${Math.floor(seconds / 60)}:${String(Math.round(seconds % 60)).padStart(2, '0')}`
</script>
