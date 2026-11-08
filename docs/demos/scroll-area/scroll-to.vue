<template>
  <div class="flex w-full max-w-sm flex-col gap-3">
    <ScrollArea
      ref="area"
      v-slot="{ item, index }"
      :items="releases"
      :virtualize="{ estimateSize: 64, skipMeasurement: true }"
      class="h-72 rounded-2xl border border-border bg-surface"
    >
      <div
        class="flex h-16 flex-col justify-center gap-0.5 px-4 transition-colors"
        :class="[
          index === target && 'bg-default',
          index < releases.length - 1 && 'border-b border-separator',
        ]"
      >
        <div class="flex items-baseline justify-between gap-3">
          <span class="text-sm font-medium text-foreground tabular-nums">{{ item.version }}</span>
          <span class="shrink-0 text-xs text-muted">{{ item.date }}</span>
        </div>
        <span class="truncate text-xs text-muted">{{ item.summary }}</span>
      </div>
    </ScrollArea>
    <ButtonGroup size="sm" variant="tertiary">
      <Button @click="scrollTo(0)">Latest</Button>
      <Button @click="scrollTo(firstMajor)">v2.0.0</Button>
      <Button @click="scrollTo(releases.length - 1)">Oldest</Button>
    </ButtonGroup>
  </div>
</template>

<script setup lang="ts">
import { Button, ButtonGroup, ScrollArea } from '@hareui/vue'
import { ref, useTemplateRef } from 'vue'

const MAJOR = [
  'Breaking: components read the new color tokens.',
  'Breaking: Vue 3.5 is now the minimum version.',
  'Breaking: grouped props replace the flat ones.',
]

const MINOR = [
  'Adds a virtualized mode to long lists.',
  'Adds right-to-left support to every overlay.',
  'Adds keyboard drag and drop to the tree.',
  'Adds a compact density to tables.',
  'Adds locale catalogs for 40 languages.',
  'Adds a loading state to buttons.',
]

const PATCH = [
  'Fixes focus returning to the trigger after close.',
  'Fixes a flicker when the theme switches.',
  'Fixes the date picker in Safari.',
  'Fixes long labels overflowing chips.',
  'Fixes a memory leak in tooltips.',
]

type Version = { major: number; minor: number; patch: number }

// How many minor versions each major had: v0.x to v3.x
const MINOR_COUNTS = [6, 12, 9, 5]

const LATEST = new Date(2026, 10, 2)
const formatDate = new Intl.DateTimeFormat('en', { dateStyle: 'medium' }).format

const getPatches = (major: number, minor: number): Version[] =>
  Array.from({ length: ((major + minor) % 3) + 1 }, (_, patch) => ({ major, minor, patch }))

const getSummary = ({ major, minor, patch }: Version, index: number) => {
  if (patch > 0) return PATCH[index % PATCH.length]!
  if (minor > 0) return MINOR[index % MINOR.length]!

  return MAJOR[major % MAJOR.length]!
}

// Every release from v0.1.0 to v3.4.x, newest first
const versions = MINOR_COUNTS.flatMap((count, major) =>
  Array.from({ length: count }, (_, minor) => getPatches(major, minor + (major === 0 ? 1 : 0))),
)
  .flat()
  .reverse()

const releases = versions.map((version, index) => {
  const date = new Date(LATEST)
  date.setDate(LATEST.getDate() - index * 9)

  return {
    id: index,
    version: `v${version.major}.${version.minor}.${version.patch}`,
    date: formatDate(date),
    summary: getSummary(version, index),
  }
})

const firstMajor = releases.findIndex((release) => release.version === 'v2.0.0')

const area = useTemplateRef('area')
const target = ref<number>()

const scrollTo = (index: number) => {
  target.value = index
  area.value?.scrollToIndex(index, { align: 'center', behavior: 'smooth' })
}
</script>
