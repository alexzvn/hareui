<template>
  <div class="relative h-96 w-full overflow-hidden rounded-xl border border-border p-2">
    <article class="h-full overflow-y-auto py-8 ps-8 pe-16">
      <section v-for="section in sections" :key="section.id" class="mb-10">
        <h2 :id="section.id" class="scroll-mt-8 text-lg font-semibold">{{ section.text }}</h2>
        <p class="mt-2 text-sm text-muted">{{ section.body }}</p>
      </section>
    </article>

    <Toc
      variant="floating"
      trigger="press"
      :links="links"
      class="absolute end-3 top-1/2 -translate-y-1/2"
    />
  </div>
</template>

<script setup lang="ts">
import type { TocLink } from '@hareui/vue'
import { Toc } from '@hareui/vue'

const sections = [
  {
    id: 'press-budget',
    text: 'Setting a budget',
    body: 'Write down what comes in and what goes out for one month before you change anything.',
  },
  {
    id: 'press-fund',
    text: 'An emergency fund',
    body: 'Aim for three months of rent and bills in a separate account you never see on your card.',
  },
  {
    id: 'press-debt',
    text: 'Paying down debt',
    body: 'Clear the highest interest first while paying the minimum on everything else.',
  },
  {
    id: 'press-save',
    text: 'Saving automatically',
    body: 'Move a fixed amount on payday, before you have a chance to spend it.',
  },
  {
    id: 'press-review',
    text: 'Yearly review',
    body: 'Once a year, check your subscriptions, insurance and savings rate, and adjust.',
  },
]

const links: TocLink[] = sections.map(({ id, text }) => ({ id, text, depth: 2 }))
</script>
