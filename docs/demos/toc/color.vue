<template>
  <div class="h-96 w-full rounded-xl border border-border p-2">
    <div class="h-full overflow-y-auto px-4 lg:grid lg:grid-cols-[1fr_13rem] lg:gap-10">
      <Toc :links="links" color="default" :highlight="{ color: 'success' }" class="lg:order-last" />

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
    id: 'color-sow',
    text: 'Sowing',
    body: 'Sow seeds indoors six weeks before the last frost, two to a cell, and keep the soil warm and damp.',
  },
  {
    id: 'color-light',
    text: 'Light',
    body: 'Seedlings stretch towards a dim window. A lamp a hand-width above them, sixteen hours a day, keeps them sturdy.',
  },
  {
    id: 'color-harden',
    text: 'Hardening off',
    body: 'Put the trays outside for an hour on the first day and a little longer each day after, over about a week.',
  },
  {
    id: 'color-plant',
    text: 'Planting out',
    body: 'Plant on a cloudy afternoon, water in well, and cover the bed if a cold night is forecast.',
  },
]

const links: TocLink[] = sections.map(({ id, text }) => ({ id, text, depth: 2 }))
</script>
