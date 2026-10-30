<template>
  <div class="flex w-full flex-col gap-3">
    <p class="text-sm text-muted">
      Sizes: {{ sizes.map((size) => `${Math.round(size)}%`).join(' / ') }}
    </p>

    <div class="h-80 w-full overflow-hidden rounded-xl border border-border bg-background">
      <Splitter
        id="docs-splitter-persistence"
        auto-save-id="docs:splitter-persistence"
        :items="items"
        type="pill"
        @layout="sizes = $event"
      >
        <template #playlist>Playlist</template>
        <template #lyrics>Lyrics</template>
      </Splitter>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { SplitterItem } from '@hareui/vue'
import { Splitter } from '@hareui/vue'
import { ref } from 'vue'

const items: SplitterItem[] = [
  {
    slot: 'playlist',
    defaultSize: 35,
    minSize: 20,
    class: 'bg-surface text-surface-foreground items-center justify-center text-sm font-medium',
  },
  {
    slot: 'lyrics',
    defaultSize: 65,
    minSize: 30,
    class: 'items-center justify-center text-sm font-medium',
  },
]

const sizes = ref<number[]>([35, 65])
</script>
