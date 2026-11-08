<template>
  <ScrollArea
    v-slot="{ item }"
    :items="releases"
    :ui="{ viewport: 'divide-y divide-separator' }"
    class="h-72 w-full max-w-sm rounded-2xl border border-border bg-surface"
  >
    <div class="flex flex-col gap-0.5 px-4 py-3">
      <span class="text-sm font-medium text-foreground">{{ item.name }}</span>
      <span class="text-xs text-muted">{{ item.date }}</span>
    </div>
  </ScrollArea>
</template>

<script setup lang="ts">
import { ScrollArea } from '@hareui/vue'

const releases = Array.from({ length: 20 }, (_, index) => ({
  id: index,
  name: `Version 2.${20 - index}.0`,
  date: `Released ${index + 1} week${index === 0 ? '' : 's'} ago`,
}))
</script>
