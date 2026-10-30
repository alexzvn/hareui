<template>
  <div class="h-96 w-full rounded-xl border border-border p-2">
    <div class="h-full overflow-y-auto px-4 lg:grid lg:grid-cols-[1fr_13rem] lg:gap-10">
      <Toc :links="links" class="lg:order-last" />

      <article class="py-8">
        <section v-for="section in sections" :key="section.id" class="mb-10">
          <h2 :id="section.id" class="scroll-mt-16 text-lg font-semibold lg:scroll-mt-8">
            {{ section.text }}
          </h2>
          <p class="mt-2 text-sm text-muted">{{ section.body }}</p>
        </section>
      </article>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TocLink } from '@hareui/vue'
import { Toc } from '@hareui/vue'

const sections = [
  {
    id: 'basic-beans',
    text: 'Picking the beans',
    body: 'Buy whole beans roasted within the last month and grind them right before brewing. A medium roast is a forgiving place to start.',
  },
  {
    id: 'basic-grind',
    text: 'Grind size',
    body: 'Pour-over wants something close to sea salt. Too fine and the water stalls; too coarse and the cup tastes thin and sour.',
  },
  {
    id: 'basic-water',
    text: 'Water and temperature',
    body: 'Use filtered water just off the boil, around 94°C. Two grams of water per gram of coffee wets the bed for the bloom.',
  },
  {
    id: 'basic-pour',
    text: 'The pour',
    body: 'Pour in slow spirals, keeping the bed level. The whole brew should take about three minutes from the first drop.',
  },
  {
    id: 'basic-taste',
    text: 'Tasting and adjusting',
    body: 'Bitter and dry means grind coarser next time; sour and hollow means grind finer. Change one thing at a time.',
  },
]

const links: TocLink[] = sections.map(({ id, text }) => ({ id, text, depth: 2 }))
</script>
