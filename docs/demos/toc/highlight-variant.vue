<template>
  <div class="h-96 w-full rounded-xl border border-border p-2">
    <div class="h-full overflow-y-auto px-4 lg:grid lg:grid-cols-[1fr_13rem] lg:gap-10">
      <Toc :links="links" :highlight="{ variant: 'circuit' }" class="lg:order-last" />

      <article class="py-8">
        <template v-for="section in sections" :key="section.id">
          <component
            :is="section.depth === 3 ? 'h3' : 'h2'"
            :id="section.id"
            class="scroll-mt-16 font-semibold lg:scroll-mt-8"
            :class="section.depth === 3 ? 'mt-6 text-base' : 'mt-10 text-lg first:mt-0'"
          >
            {{ section.text }}
          </component>
          <p class="mt-2 text-sm text-muted">{{ section.body }}</p>
        </template>
      </article>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TocLink } from '@hareui/vue'
import { Toc } from '@hareui/vue'

const sections = [
  {
    id: 'hv-setup',
    depth: 2,
    text: 'Setting up the tank',
    body: 'Rinse the gravel, fill the tank with dechlorinated water and let the filter run for a day.',
  },
  {
    id: 'hv-cycle',
    depth: 2,
    text: 'Cycling',
    body: 'Beneficial bacteria need four to six weeks to settle in before the first fish arrive.',
  },
  {
    id: 'hv-test',
    depth: 3,
    text: 'Testing the water',
    body: 'Check ammonia, nitrite and nitrate twice a week and write the numbers down.',
  },
  {
    id: 'hv-plants',
    depth: 3,
    text: 'Adding plants',
    body: 'Fast growers like hornwort soak up the extra nutrients while the tank settles.',
  },
  {
    id: 'hv-fish',
    depth: 2,
    text: 'Choosing fish',
    body: 'Start with a few hardy fish and add more over several weeks, never all at once.',
  },
  {
    id: 'hv-care',
    depth: 2,
    text: 'Weekly care',
    body: 'Change a quarter of the water each week and wipe the glass before the algae takes hold.',
  },
]

const links: TocLink[] = [
  { id: 'hv-setup', text: 'Setting up the tank', depth: 2 },
  {
    id: 'hv-cycle',
    text: 'Cycling',
    depth: 2,
    children: [
      { id: 'hv-test', text: 'Testing the water', depth: 3 },
      { id: 'hv-plants', text: 'Adding plants', depth: 3 },
    ],
  },
  { id: 'hv-fish', text: 'Choosing fish', depth: 2 },
  { id: 'hv-care', text: 'Weekly care', depth: 2 },
]
</script>
