<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { Button } from '@hareui/vue'
import { ref } from 'vue'

import type { TocLink } from '@/components/toc'
import { Toc } from '@/components/toc'

// Every section gets its own heading ids, so the scrollspies of the demos don't watch each other's headings.
const createLinks = (prefix: string): TocLink[] => [
  { id: `${prefix}-soil`, text: 'Preparing the soil', depth: 2 },
  {
    id: `${prefix}-seeds`,
    text: 'Choosing seeds',
    depth: 2,
    children: [
      { id: `${prefix}-tomatoes`, text: 'Tomatoes', depth: 3 },
      { id: `${prefix}-beans`, text: 'Runner beans', depth: 3 },
    ],
  },
  { id: `${prefix}-water`, text: 'Watering schedule', depth: 2 },
  { id: `${prefix}-pests`, text: 'Keeping pests away', depth: 2 },
  { id: `${prefix}-harvest`, text: 'Harvest time', depth: 2 },
]

const flatten = (links: TocLink[]): TocLink[] =>
  links.flatMap((link) => [link, ...flatten(link.children ?? [])])

const prefixes = [
  'basic',
  'title',
  'default',
  'accent',
  'success',
  'warning',
  'danger',
  'straight',
  'circuit',
  'hcolor',
  'slots',
  'ui',
  'hover',
  'press',
  'left',
  'delays',
  'controlled',
] as const

const linksOf = Object.fromEntries(prefixes.map((p) => [p, createLinks(p)])) as Record<
  (typeof prefixes)[number],
  TocLink[]
>

const colors = ['default', 'accent', 'success', 'warning', 'danger'] as const
const open = ref(false)
const moves = ref<string[]>([])
</script>

<template>
  <div class="flex flex-col gap-10 p-8">
    <h1 class="text-2xl font-semibold">Toc</h1>

    <template v-for="section in [
      { key: 'basic', label: 'List (default)' },
      { key: 'title', label: 'Title' },
      { key: 'straight', label: 'Highlight straight' },
      { key: 'circuit', label: 'Highlight circuit' },
      { key: 'hcolor', label: 'Highlight color (success, neutral link color)' },
      { key: 'slots', label: 'Slots: top, bottom, link, leading, trailing' },
      { key: 'ui', label: ':ui override' },
    ] as const" :key="section.key">
      <section class="flex flex-col gap-2">
        <h2 class="text-sm text-muted">{{ section.label }}</h2>
        <div class="grid h-80 grid-cols-[1fr_14rem] gap-8 overflow-y-auto rounded-xl border border-border px-6">
          <article class="py-6">
            <div v-for="link in flatten(linksOf[section.key])" :key="link.id" class="mb-8">
              <component :is="link.depth === 3 ? 'h4' : 'h3'" :id="link.id" class="font-semibold">
                {{ link.text }}
              </component>
              <p class="mt-2 text-sm text-muted">
                Notes for {{ link.text.toLowerCase() }} go here. Scroll to see the active link follow the heading in
                view.
              </p>
            </div>
          </article>

          <Toc
            v-if="section.key === 'basic'"
            :links="linksOf.basic"
            @move="(id) => moves.push(id)"
          />
          <Toc v-if="section.key === 'title'" :links="linksOf.title" title="In this guide" />
          <Toc v-if="section.key === 'straight'" :links="linksOf.straight" highlight />
          <Toc
            v-if="section.key === 'circuit'"
            :links="linksOf.circuit"
            :highlight="{ variant: 'circuit' }"
          />
          <Toc
            v-if="section.key === 'hcolor'"
            :links="linksOf.hcolor"
            color="default"
            :highlight="{ color: 'success' }"
          />
          <Toc v-if="section.key === 'slots'" :links="linksOf.slots">
            <template #leading>
              <Icon icon="gravity-ui:list-ul" class="size-4 text-muted" />
            </template>
            <template #trailing>
              <span class="text-xs text-muted">5</span>
            </template>
            <template #top>
              <p class="mb-3 text-xs text-muted">Updated last week</p>
            </template>
            <template #link="{ link, active }">
              <span class="truncate">{{ link.text }}</span>
              <span v-if="active" class="ms-2 text-xs">•</span>
            </template>
            <template #bottom>
              <a href="#" class="text-sm text-muted hover:text-foreground">Edit this page</a>
            </template>
          </Toc>
          <Toc
            v-if="section.key === 'ui'"
            :links="linksOf.ui"
            highlight
            :ui="{ title: 'text-xs uppercase tracking-wider text-muted', link: 'text-xs' }"
          />
        </div>
      </section>
    </template>

    <p class="text-xs text-muted">move: {{ moves.join(', ') || '—' }}</p>

    <section class="flex flex-col gap-2">
      <h2 class="text-sm text-muted">Colors</h2>
      <div class="flex flex-wrap gap-6">
        <div
          v-for="color in colors"
          :key="color"
          class="grid h-64 w-96 grid-cols-[1fr_9rem] gap-4 overflow-y-auto rounded-xl border border-border px-4"
        >
          <article class="py-4">
            <h3
              v-for="link in flatten(linksOf[color])"
              :id="link.id"
              :key="link.id"
              class="mb-24 text-sm font-semibold"
            >
              {{ link.text }}
            </h3>
          </article>
          <Toc :links="linksOf[color]" :color="color" :title="color" />
        </div>
      </div>
    </section>

    <section class="flex flex-col gap-2">
      <h2 class="text-sm text-muted">Empty links (slots only)</h2>
      <Toc :links="[]">
        <template #bottom>
          <span class="text-sm text-muted">Nothing to list</span>
        </template>
      </Toc>
    </section>

    <template v-for="section in [
      { key: 'hover', label: 'Floating, hover (default)' },
      { key: 'press', label: 'Floating, press' },
      { key: 'left', label: 'Floating, side left' },
      { key: 'delays', label: 'Floating, delay 0 / closeDelay 800' },
      { key: 'controlled', label: 'Floating, v-model:open' },
    ] as const" :key="section.key">
      <section class="flex flex-col gap-2">
        <h2 class="text-sm text-muted">{{ section.label }}</h2>
        <div v-if="section.key === 'controlled'" class="flex items-center gap-2">
          <Button size="sm" variant="secondary" @click="open = !open">Toggle</Button>
          <span class="text-sm text-muted">{{ open ? 'open' : 'closed' }}</span>
        </div>
        <div class="relative h-80 max-w-2xl overflow-hidden rounded-xl border border-border">
          <article
            class="h-full overflow-y-auto py-6"
            :class="section.key === 'left' ? 'ps-16 pe-8' : 'ps-8 pe-16'"
          >
            <div v-for="link in flatten(linksOf[section.key])" :key="link.id" class="mb-10">
              <h3 :id="link.id" class="font-semibold">{{ link.text }}</h3>
              <p class="mt-2 text-sm text-muted">
                Notes for {{ link.text.toLowerCase() }}. Hover or press the marks to jump around.
              </p>
            </div>
          </article>

          <Toc
            v-if="section.key === 'controlled'"
            v-model:open="open"
            variant="floating"
            :links="linksOf.controlled"
            class="absolute end-3 top-1/2 -translate-y-1/2"
          />
          <Toc
            v-else
            variant="floating"
            :links="linksOf[section.key]"
            :trigger="section.key === 'press' ? 'press' : 'hover'"
            :side="section.key === 'left' ? 'left' : 'right'"
            :delay="section.key === 'delays' ? 0 : undefined"
            :close-delay="section.key === 'delays' ? 800 : undefined"
            :class="
              section.key === 'left'
                ? 'absolute start-3 top-1/2 -translate-y-1/2'
                : 'absolute end-3 top-1/2 -translate-y-1/2'
            "
          >
            <template v-if="section.key === 'press'" #top>
              <span class="block px-3 py-1 text-[10px] font-semibold tracking-wider text-muted uppercase">
                Contents
              </span>
            </template>
          </Toc>
        </div>
      </section>
    </template>
  </div>
</template>
