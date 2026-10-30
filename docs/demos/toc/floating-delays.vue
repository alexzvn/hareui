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
      :delay="0"
      :close-delay="800"
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
    id: 'delays-dough',
    text: 'Mixing the dough',
    body: 'Flour, water, salt and a pinch of yeast. Mix until there are no dry patches, then leave it alone.',
  },
  {
    id: 'delays-fold',
    text: 'Stretch and fold',
    body: 'Every half hour, lift one side of the dough and fold it over. Four rounds are plenty.',
  },
  {
    id: 'delays-proof',
    text: 'The long proof',
    body: 'Cover the bowl and let it rise in the fridge overnight for a deeper flavour.',
  },
  {
    id: 'delays-bake',
    text: 'Baking',
    body: 'Bake in a preheated pot at 250°C, lid on for twenty minutes, then lid off until deep brown.',
  },
]

const links: TocLink[] = sections.map(({ id, text }) => ({ id, text, depth: 2 }))
</script>
