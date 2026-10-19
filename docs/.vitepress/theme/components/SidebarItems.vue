<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { isGroup, isSeparator, normalizePath, type SidebarEntry } from '../../sidebar'

defineProps<{ items: SidebarEntry[]; activePath: string }>()

const LINK_CLASS =
  'text-fd-muted-foreground relative flex flex-row items-center gap-2 rounded-lg p-2 text-start [&_svg]:size-4 [&_svg]:shrink-0 hover:bg-fd-accent/50 hover:text-fd-accent-foreground/80 data-[active=true]:bg-fd-primary/10 data-[active=true]:text-fd-primary transition-colors hover:transition-none data-[active=true]:hover:transition-colors'
const INDENT = 'padding-inline-start:calc(2 * var(--spacing))'
const key = (entry: SidebarEntry) => isSeparator(entry) ? `sep-${entry.separator}` : isGroup(entry) ? `group-${entry.group}` : entry.link
</script>

<template>
  <div class="flex w-full flex-col gap-0.5">
    <template v-for="entry in items" :key="key(entry)">
      <p v-if="isSeparator(entry)" class="[&_svg]:size-4 [&_svg]:shrink-0" :style="INDENT">{{ entry.separator }}</p>
      <details v-else-if="isGroup(entry)" open class="group/sidebar-group mt-2">
        <summary
          class="text-fd-foreground flex cursor-pointer list-none flex-row items-center justify-between rounded-lg p-2 font-medium select-none hover:bg-fd-accent/50 [&::-webkit-details-marker]:hidden"
          :style="INDENT"
        >
          {{ entry.group }}
          <Icon icon="gravity-ui:chevron-down" class="text-fd-muted-foreground size-4 shrink-0 -rotate-90 transition-transform group-open/sidebar-group:rotate-0" />
        </summary>
        <div class="border-fd-border ms-3 flex flex-col gap-0.5 border-s ps-2">
          <a
            v-for="link in entry.items"
            :key="link.link"
            :data-active="normalizePath(link.link) === activePath"
            :class="LINK_CLASS"
            :style="INDENT"
            :href="link.link"
          >
            {{ link.text }}
          </a>
        </div>
      </details>
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
