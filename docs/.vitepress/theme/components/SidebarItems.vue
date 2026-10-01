<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { isSeparator, normalizePath, type SidebarEntry } from '../../sidebar'

defineProps<{ items: SidebarEntry[]; activePath: string }>()

const LINK_CLASS =
  'text-fd-muted-foreground relative flex flex-row items-center gap-2 rounded-lg p-2 text-start [&_svg]:size-4 [&_svg]:shrink-0 hover:bg-fd-accent/50 hover:text-fd-accent-foreground/80 data-[active=true]:bg-fd-primary/10 data-[active=true]:text-fd-primary transition-colors hover:transition-none data-[active=true]:hover:transition-colors'
const INDENT = 'padding-inline-start:calc(2 * var(--spacing))'
</script>

<template>
  <div class="flex w-full flex-col gap-0.5">
    <template v-for="entry in items" :key="isSeparator(entry) ? `sep-${entry.separator}` : entry.link">
      <p v-if="isSeparator(entry)" class="[&_svg]:size-4 [&_svg]:shrink-0" :style="INDENT">{{ entry.separator }}</p>
      <a
        v-else
        :data-active="normalizePath(entry.link) === activePath"
        :class="LINK_CLASS"
        :style="INDENT"
        :href="entry.link"
      >
        <Icon v-if="entry.icon" :icon="`gravity-ui:${entry.icon}`" />
        {{ entry.text }}
      </a>
    </template>
  </div>
</template>
