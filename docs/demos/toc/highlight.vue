<template>
  <div class="h-96 w-full rounded-xl border border-border p-2">
    <div class="h-full overflow-y-auto px-4 lg:grid lg:grid-cols-[1fr_13rem] lg:gap-10">
      <Toc :links="links" highlight class="lg:order-last" />

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
    id: 'hl-route',
    depth: 2,
    text: 'Planning the route',
    body: 'Pick a loop you can finish before dark, with water every few hours and a way out halfway.',
  },
  {
    id: 'hl-pack',
    depth: 2,
    text: 'What to pack',
    body: 'Pack for the weather you might get, not the forecast you hope for.',
  },
  {
    id: 'hl-layers',
    depth: 3,
    text: 'Layers',
    body: 'A base layer, a warm mid layer and a shell beat one heavy jacket every time.',
  },
  {
    id: 'hl-food',
    depth: 3,
    text: 'Food and water',
    body: 'Bring a little more than you think: salty snacks, something sweet, and two litres of water.',
  },
  {
    id: 'hl-trail',
    depth: 2,
    text: 'On the trail',
    body: 'Start slow, eat before you are hungry, and turn back if the weather turns.',
  },
  {
    id: 'hl-after',
    depth: 2,
    text: 'After the hike',
    body: 'Stretch, refill your bottles and write down what you would change for next time.',
  },
]

const links: TocLink[] = [
  { id: 'hl-route', text: 'Planning the route', depth: 2 },
  {
    id: 'hl-pack',
    text: 'What to pack',
    depth: 2,
    children: [
      { id: 'hl-layers', text: 'Layers', depth: 3 },
      { id: 'hl-food', text: 'Food and water', depth: 3 },
    ],
  },
  { id: 'hl-trail', text: 'On the trail', depth: 2 },
  { id: 'hl-after', text: 'After the hike', depth: 2 },
]
</script>
