<template>
  <div class="relative h-[28rem] w-full overflow-hidden rounded-xl border border-border p-2">
    <article class="h-full overflow-y-auto py-8 ps-8 pe-16">
      <template v-for="{ link, level } in flat" :key="link.id">
        <component
          :is="headingTags[level]"
          :id="link.id"
          class="scroll-mt-8 font-semibold"
          :class="level === 0 ? 'mt-10 text-lg first:mt-0' : 'mt-6 text-base'"
        >
          {{ link.text }}
        </component>
        <p class="mt-2 text-sm text-muted">
          Notes on {{ link.text.toLowerCase() }}: what to look for, what to avoid and how long it
          takes.
        </p>
      </template>
    </article>

    <Toc variant="floating" :links="links" class="absolute end-3 top-1/2 -translate-y-1/2">
      <template #top>
        <p class="px-3 pt-1 pb-0.5 text-xs font-medium tracking-wide text-muted uppercase">
          Chapters
        </p>
      </template>
    </Toc>
  </div>
</template>

<script setup lang="ts">
import type { TocLink } from '@hareui/vue'
import { Toc } from '@hareui/vue'

const headingTags = ['h2', 'h3', 'h4']

const links: TocLink[] = [
  {
    id: 'nested-frame',
    text: 'Building the frame',
    depth: 2,
    children: [
      { id: 'nested-wood', text: 'Choosing wood', depth: 3 },
      { id: 'nested-joints', text: 'Cutting joints', depth: 3 },
    ],
  },
  {
    id: 'nested-finish',
    text: 'Finishing',
    depth: 2,
    children: [
      {
        id: 'nested-sanding',
        text: 'Sanding',
        depth: 3,
        children: [
          { id: 'nested-grits', text: 'Grit order', depth: 4 },
          { id: 'nested-dust', text: 'Dust control', depth: 4 },
        ],
      },
      { id: 'nested-oil', text: 'Oil or varnish', depth: 3 },
    ],
  },
  { id: 'nested-care', text: 'Caring for it', depth: 2 },
]

const flatten = (items: TocLink[], level = 0): { link: TocLink; level: number }[] =>
  items.flatMap((link) => [{ link, level }, ...flatten(link.children ?? [], level + 1)])

const flat = flatten(links)
</script>
