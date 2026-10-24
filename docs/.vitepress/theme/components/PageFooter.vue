<template>
  <div v-if="neighbours.length" class="@container my-8 grid gap-4 grid-cols-2">
    <a
      v-for="item in neighbours"
      :key="item.link!.link"
      :class="[
        'hover:text-fd-accent-foreground flex flex-col gap-2 rounded-2xl p-4 text-sm transition-none hover:bg-surface-secondary @max-lg:col-span-full',
        item.next && 'text-end',
        item.next && neighbours.length === 1 && 'col-start-2',
      ]"
      :href="item.link!.link"
    >
      <div
        :class="['inline-flex items-center gap-1.5 font-medium', item.next && 'flex-row-reverse']"
      >
        <Icon
          :icon="item.next ? 'gravity-ui:chevron-right' : 'gravity-ui:chevron-left'"
          class="-mx-1 size-4 shrink-0 rtl:rotate-180"
        />
        <p>{{ item.link!.text }}</p>
      </div>
      <p class="text-fd-muted-foreground truncate">
        {{ descriptions.get(normalizePath(item.link!.link)) }}
      </p>
    </a>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { computed } from 'vue'

import { normalizePath, sectionLinks, type SidebarSection } from '../../sidebar'
import { data as pages } from '../pages.data'

const props = defineProps<{ section?: SidebarSection; path: string }>()

const descriptions = new Map(pages.map((page) => [page.url, page.description]))

const neighbours = computed(() => {
  if (!props.section) return []

  const links = sectionLinks(props.section).filter((link) =>
    descriptions.has(normalizePath(link.link)),
  )

  const index = links.findIndex((link) => normalizePath(link.link) === props.path)
  if (index === -1) return []

  return [
    { link: links[index - 1], next: false },
    { link: links[index + 1], next: true },
  ].filter((item) => item.link)
})
</script>
