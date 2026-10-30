<template>
  <div class="relative h-96 w-full overflow-hidden rounded-xl border border-border p-2">
    <article class="h-full overflow-y-auto py-8 ps-8 pe-16">
      <section v-for="section in sections" :key="section.id" class="mb-10">
        <h2 :id="section.id" class="scroll-mt-8 text-lg font-semibold">{{ section.text }}</h2>
        <p class="mt-2 text-sm text-muted">{{ section.body }}</p>
      </section>
    </article>

    <Toc variant="floating" :links="links" class="absolute end-3 top-1/2 -translate-y-1/2" />
  </div>
</template>

<script setup lang="ts">
import type { TocLink } from '@hareui/vue'
import { Toc } from '@hareui/vue'

const sections = [
  {
    id: 'float-welcome',
    text: 'Welcome aboard',
    body: 'This handbook walks you through your first two weeks: the tools, the people and the rhythm of the team.',
  },
  {
    id: 'float-accounts',
    text: 'Your accounts',
    body: 'Your laptop arrives with email and chat set up. Ask your buddy for access to the shared drive on day one.',
  },
  {
    id: 'float-meetings',
    text: 'Meetings',
    body: 'Stand-up is at ten, fifteen minutes, cameras optional. Demos happen every other Friday afternoon.',
  },
  {
    id: 'float-shipping',
    text: 'Shipping your first change',
    body: 'Pick a small issue labelled “first task”, open a pull request and ask for two reviews.',
  },
  {
    id: 'float-help',
    text: 'Getting help',
    body: 'No question is too small. Post in the help channel and someone will answer within the hour.',
  },
]

const links: TocLink[] = sections.map(({ id, text }) => ({ id, text, depth: 2 }))
</script>
