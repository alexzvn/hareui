<template>
  <Marquee pause-on-hover class="w-full" :ui="{ root: '[--marquee-gap:--spacing(4)]' }">
    <figure
      v-for="review in reviews"
      :key="review.name"
      class="flex w-72 shrink-0 flex-col gap-3 rounded-3xl bg-surface p-4 shadow-surface"
    >
      <blockquote class="text-sm text-foreground">{{ review.quote }}</blockquote>
      <figcaption class="text-xs text-muted">{{ review.name }} · {{ review.role }}</figcaption>
    </figure>
  </Marquee>
</template>

<script setup lang="ts">
import { Marquee } from '@hareui/vue'

const reviews = [
  {
    name: 'Ines Duarte',
    role: 'Bakery owner',
    quote: 'Orders that used to take a phone call now arrive sorted by pickup time.',
  },
  {
    name: 'Tomás Rivera',
    role: 'Cycling coach',
    quote: 'My riders log every session themselves, and I finally see the whole week at once.',
  },
  {
    name: 'Mei Lin',
    role: 'Bookshop manager',
    quote: 'Stock counts went from a weekend chore to ten minutes on a Monday morning.',
  },
  {
    name: 'Kofi Mensah',
    role: 'Studio photographer',
    quote: 'Clients pick their favourite shots from a link, no more email threads.',
  },
]
</script>
