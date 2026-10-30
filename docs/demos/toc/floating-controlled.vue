<template>
  <div class="flex w-full flex-col gap-3">
    <div class="flex items-center gap-3">
      <Button size="sm" variant="secondary" @click="isOpen = !isOpen">
        {{ isOpen ? 'Hide contents' : 'Show contents' }}
      </Button>
      <span class="text-sm text-muted">
        The panel is
        <span class="font-medium text-foreground">{{ isOpen ? 'open' : 'closed' }}</span>
      </span>
    </div>

    <div class="relative h-96 overflow-hidden rounded-xl border border-border p-2">
      <article class="h-full overflow-y-auto py-8 ps-8 pe-16">
        <section v-for="section in sections" :key="section.id" class="mb-10">
          <h2 :id="section.id" class="scroll-mt-8 text-lg font-semibold">{{ section.text }}</h2>
          <p class="mt-2 text-sm text-muted">{{ section.body }}</p>
        </section>
      </article>

      <Toc
        v-model:open="isOpen"
        variant="floating"
        :links="links"
        class="absolute end-3 top-1/2 -translate-y-1/2"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TocLink } from '@hareui/vue'
import { Button, Toc } from '@hareui/vue'
import { ref } from 'vue'

const isOpen = ref(false)

const sections = [
  {
    id: 'controlled-arrive',
    text: 'Arriving',
    body: 'The station is a ten-minute walk from the old town. Buy a day pass at the machines by the exit.',
  },
  {
    id: 'controlled-eat',
    text: 'Where to eat',
    body: 'The covered market opens at seven; get there early for warm bread and the best seats.',
  },
  {
    id: 'controlled-see',
    text: 'What to see',
    body: 'Walk the river path at sunset, then climb to the castle for the view over the rooftops.',
  },
  {
    id: 'controlled-stay',
    text: 'Where to stay',
    body: 'Small guesthouses near the square fill quickly in summer, so book a few weeks ahead.',
  },
]

const links: TocLink[] = sections.map(({ id, text }) => ({ id, text, depth: 2 }))
</script>
