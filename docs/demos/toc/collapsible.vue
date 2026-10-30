<template>
  <div class="h-96 w-full rounded-xl border border-border p-2">
    <div class="h-full overflow-y-auto px-4">
      <Toc v-model:open="isOpen" :links="links" />

      <article class="py-8">
        <section v-for="section in sections" :key="section.id" class="mb-10">
          <h2 :id="section.id" class="scroll-mt-16 text-lg font-semibold">{{ section.text }}</h2>
          <p class="mt-2 text-sm text-muted">{{ section.body }}</p>
        </section>
      </article>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TocLink } from '@hareui/vue'
import { Toc } from '@hareui/vue'
import { ref } from 'vue'

const isOpen = ref(true)

const sections = [
  {
    id: 'mobile-tent',
    text: 'Pitching the tent',
    body: 'Clear the ground of stones, face the door away from the wind and stake the corners first.',
  },
  {
    id: 'mobile-fire',
    text: 'Lighting a fire',
    body: 'Use an existing fire ring, start small with dry twigs, and keep a pot of water nearby.',
  },
  {
    id: 'mobile-cook',
    text: 'Cooking outdoors',
    body: 'One-pot meals keep the washing up short. Pack spices in small labelled bags.',
  },
  {
    id: 'mobile-leave',
    text: 'Leaving no trace',
    body: 'Pack out everything you brought in, and scatter the cold ashes before you go.',
  },
]

const links: TocLink[] = sections.map(({ id, text }) => ({ id, text, depth: 2 }))
</script>
