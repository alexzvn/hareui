<template>
  <div class="h-[28rem] w-full overflow-hidden rounded-xl border border-border bg-background">
    <Splitter id="video-editor" :items="columns">
      <template #media>Media</template>

      <template #stage>
        <Splitter id="video-editor-stage" :items="rows" orientation="vertical">
          <template #viewer>Viewer</template>
          <template #timeline>Timeline</template>
        </Splitter>
      </template>
    </Splitter>
  </div>
</template>

<script setup lang="ts">
import type { SplitterItem } from '@hareui/vue'
import { Splitter } from '@hareui/vue'

const columns: SplitterItem[] = [
  {
    slot: 'media',
    defaultSize: 26,
    minSize: 15,
    maxSize: 40,
    class: 'bg-surface text-surface-foreground items-center justify-center text-sm font-medium',
  },
  { slot: 'stage', defaultSize: 74 },
]

const rows: SplitterItem[] = [
  {
    slot: 'viewer',
    defaultSize: 62,
    minSize: 30,
    class: 'items-center justify-center text-sm font-medium',
  },
  {
    slot: 'timeline',
    defaultSize: 38,
    minSize: 20,
    class:
      'bg-surface-secondary text-surface-secondary-foreground items-center justify-center text-sm font-medium',
  },
]
</script>
