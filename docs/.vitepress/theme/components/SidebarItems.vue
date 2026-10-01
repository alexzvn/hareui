<script setup lang="ts">
import { reactive } from 'vue'
import { Icon } from '@iconify/vue'
import { isGroup, isSeparator, normalizePath, type SidebarEntry } from '../../sidebar'

const props = defineProps<{ items: SidebarEntry[]; activePath: string }>()

const LINK_CLASS =
  'text-fd-muted-foreground relative flex flex-row items-center gap-2 rounded-lg p-2 text-start [&_svg]:size-4 [&_svg]:shrink-0 hover:bg-fd-accent/50 hover:text-fd-accent-foreground/80 data-[active=true]:bg-fd-primary/10 data-[active=true]:text-fd-primary transition-colors hover:transition-none data-[active=true]:hover:transition-colors'
const INDENT = 'padding-inline-start:calc(2 * var(--spacing))'

const open = reactive(
  Object.fromEntries(props.items.filter(isGroup).map((group) => [group.text, !group.collapsed])),
)
</script>

<template>
  <div class="flex w-full flex-col gap-0.5">
    <template v-for="entry in items" :key="isSeparator(entry) ? `sep-${entry.separator}` : isGroup(entry) ? `group-${entry.text}` : entry.link">
      <p v-if="isSeparator(entry)" class="[&_svg]:size-4 [&_svg]:shrink-0" :style="INDENT">{{ entry.separator }}</p>
      <div v-else-if="isGroup(entry)" class="flex flex-col gap-0.5">
        <button
          type="button"
          :aria-expanded="open[entry.text]"
          :data-state="open[entry.text] ? 'open' : 'closed'"
          class="text-fd-foreground relative flex w-full flex-row items-center gap-2 rounded-lg p-2 text-start font-medium [&_svg]:size-4 [&_svg]:shrink-0 hover:bg-fd-accent/50 transition-colors"
          :style="INDENT"
          @click="open[entry.text] = !open[entry.text]"
        >
          {{ entry.text }}
          <Icon icon="gravity-ui:chevron-down" :class="['ms-auto transition-transform', !open[entry.text] && '-rotate-90']" />
        </button>
        <div v-show="open[entry.text]" :data-state="open[entry.text] ? 'open' : 'closed'" class="flex flex-col gap-0.5">
          <a
            v-for="link in entry.items"
            :key="link.link"
            :data-active="normalizePath(link.link) === activePath"
            :class="LINK_CLASS"
            :style="INDENT"
            :href="link.link"
          >
            <Icon v-if="link.icon" :icon="`gravity-ui:${link.icon}`" />
            {{ link.text }}
          </a>
        </div>
      </div>
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
