<template>
  <div class="flex w-full flex-col gap-3">
    <div class="flex items-center gap-2">
      <Button size="sm" variant="secondary" @click="toggleFilters">
        {{ isFiltersCollapsed ? 'Show filters' : 'Hide filters' }}
      </Button>
    </div>

    <div class="h-96 w-full overflow-hidden rounded-xl border border-border bg-background">
      <Splitter
        ref="splitter"
        :items="items"
        @collapse="isFiltersCollapsed = true"
        @expand="isFiltersCollapsed = false"
      >
        <template #filters>Filters</template>
        <template #results>Results</template>
      </Splitter>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { SplitterItem } from '@hareui/vue'
import { Button, Splitter } from '@hareui/vue'
import { ref, useTemplateRef } from 'vue'

const items: SplitterItem[] = [
  {
    slot: 'filters',
    defaultSize: 28,
    minSize: 20,
    maxSize: 40,
    collapsible: true,
    collapsedSize: 0,
    class: 'bg-surface text-surface-foreground items-center justify-center text-sm font-medium',
  },
  {
    slot: 'results',
    defaultSize: 72,
    class: 'items-center justify-center text-sm font-medium',
  },
]

const splitter = useTemplateRef('splitter')
const isFiltersCollapsed = ref(false)

const toggleFilters = () => {
  const panel = splitter.value?.panelsRef[0]
  if (!panel) return

  if (isFiltersCollapsed.value) {
    panel.expand()
    return
  }

  panel.collapse()
}
</script>
