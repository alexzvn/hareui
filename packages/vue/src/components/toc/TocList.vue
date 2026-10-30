<template>
  <ul :class="level > 0 ? ui.listWithChildren() : ui.list()">
    <li
      v-for="link in links"
      :key="link.id"
      :class="
        link.children?.length
          ? ui.itemWithChildren({ override: link.ui?.itemWithChildren })
          : ui.item({ override: link.ui?.item })
      "
    >
      <a
        :href="`#${link.id}`"
        data-slot="toc-link"
        :data-active="activeIds.includes(link.id) || undefined"
        :aria-current="activeIds.includes(link.id) ? 'location' : undefined"
        :class="
          ui.link({ override: [link.ui?.link, link.class], active: activeIds.includes(link.id) })
        "
        @click="emit('select', { event: $event, link })"
      >
        <slot name="link" :link="link" :active="activeIds.includes(link.id)" :level="level">
          <span data-slot="toc-link-text" :class="ui.linkText({ override: link.ui?.linkText })">
            {{ link.text }}
          </span>
        </slot>
      </a>

      <TocList
        v-if="link.children?.length"
        :links="link.children"
        :level="level + 1"
        :ui="ui"
        :active-ids="activeIds"
        @select="emit('select', $event)"
      >
        <template v-if="!!slots.link" #link="slotProps">
          <slot name="link" v-bind="slotProps" />
        </template>
      </TocList>
    </li>
  </ul>
</template>

<script setup lang="ts">
import type { TocLink, TocLinkSlotProps, TocUI } from './Toc.types'

defineProps<{
  links: TocLink[]
  level: number
  ui: TocUI
  activeIds: string[]
}>()

const emit = defineEmits<{
  select: [payload: { event: MouseEvent; link: TocLink }]
}>()

const slots = defineSlots<{
  link?: (props: TocLinkSlotProps) => unknown
}>()
</script>
