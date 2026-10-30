<template>
  <div class="relative h-96 w-full overflow-hidden rounded-xl border border-border p-2">
    <article class="h-full overflow-y-auto py-8 ps-16 pe-8">
      <section v-for="section in sections" :key="section.id" class="mb-10">
        <h2 :id="section.id" class="scroll-mt-8 text-lg font-semibold">{{ section.text }}</h2>
        <p class="mt-2 text-sm text-muted">{{ section.body }}</p>
      </section>
    </article>

    <Toc
      variant="floating"
      side="left"
      :links="links"
      class="absolute start-3 top-1/2 -translate-y-1/2"
    />
  </div>
</template>

<script setup lang="ts">
import type { TocLink } from '@hareui/vue'
import { Toc } from '@hareui/vue'

const sections = [
  {
    id: 'side-tuning',
    text: 'Tuning up',
    body: 'Tune every string to the open note before each practice, starting from the lowest one.',
  },
  {
    id: 'side-chords',
    text: 'First chords',
    body: 'G, C and D carry hundreds of songs. Switch between two of them until it feels slow and easy.',
  },
  {
    id: 'side-strum',
    text: 'Strumming patterns',
    body: 'Count out loud. Down, down-up, up-down-up is a pattern you will use for years.',
  },
  {
    id: 'side-songs',
    text: 'Your first song',
    body: 'Pick something you love at a slow tempo. Play along with the recording once the changes are clean.',
  },
  {
    id: 'side-practice',
    text: 'Practice routine',
    body: 'Fifteen minutes a day beats two hours on Sunday. Stop while it is still fun.',
  },
]

const links: TocLink[] = sections.map(({ id, text }) => ({ id, text, depth: 2 }))
</script>
