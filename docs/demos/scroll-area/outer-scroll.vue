<template>
  <div
    ref="container"
    class="h-120 w-full max-w-md overflow-y-auto rounded-2xl border border-border bg-surface"
  >
    <header ref="header" class="flex flex-col gap-3 border-b border-separator p-4">
      <img
        src="https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/docs/oranges.jpeg"
        alt="A crate of oranges"
        class="aspect-video w-full rounded-xl object-cover"
      />
      <div class="flex items-start justify-between gap-3">
        <div class="flex flex-col gap-0.5">
          <h3 class="text-base font-semibold text-foreground">Valencia oranges, 5 kg crate</h3>
          <span class="text-sm text-muted">Picked to order in Sagunto, delivered in two days</span>
        </div>
        <span class="text-base font-semibold text-foreground">€24</span>
      </div>
      <div class="flex items-center gap-2 text-sm">
        <span role="img" aria-label="4.6 out of 5 stars" class="flex text-warning">
          <Icon v-for="star in 5" :key="star" icon="gravity-ui:star-fill" class="size-4" />
        </span>
        <span class="text-muted">4.6 from {{ reviews.length }} reviews</span>
      </div>
    </header>
    <ScrollArea
      v-slot="{ item, index }"
      :items="reviews"
      :virtualize="{ getScrollElement: () => container, scrollMargin, estimateSize: 96 }"
    >
      <article
        class="flex flex-col gap-1.5 px-4 py-3"
        :class="index < reviews.length - 1 && 'border-b border-separator'"
      >
        <div class="flex items-center justify-between gap-3">
          <span class="text-sm font-medium text-foreground">{{ item.author }}</span>
          <span class="text-xs text-muted">{{ item.date }}</span>
        </div>
        <span role="img" :aria-label="`${item.stars} out of 5 stars`" class="flex text-warning">
          <Icon
            v-for="star in 5"
            :key="star"
            :icon="star <= item.stars ? 'gravity-ui:star-fill' : 'gravity-ui:star'"
            class="size-3.5"
          />
        </span>
        <p class="text-sm leading-relaxed text-muted">{{ item.text }}</p>
      </article>
    </ScrollArea>
  </div>
</template>

<script setup lang="ts">
import { ScrollArea } from '@hareui/vue'
import { Icon } from '@iconify/vue'
import { onBeforeUnmount, onMounted, ref, useTemplateRef } from 'vue'

const AUTHORS = [
  'Inês',
  'Tom',
  'Akosua',
  'Lukas',
  'Mei',
  'Rafael',
  'Sofia',
  'Jakob',
  'Noor',
  'Pablo',
]

const TEXTS = [
  'Sweet and juicy.',
  'Arrived a day early and every orange was perfect. We have been juicing them every morning.',
  'A few were bruised from the trip, but support sent a refund for them the same day without any fuss.',
  'Great for marmalade.',
  'Much better than the supermarket ones. Thin skins, lots of juice and hardly any seeds. The kids eat them like sweets.',
  'Good, but 5 kg is a lot for two people.',
  'Third crate this winter. Still as good as the first one.',
]

// One star rating per review, mostly happy customers
const STARS = [5, 5, 4, 5, 3, 4, 5]

const LATEST = new Date(2026, 10, 4)
const formatDate = new Intl.DateTimeFormat('en', { dateStyle: 'medium' }).format

// 500 reviews of different lengths, measured once rendered
const reviews = Array.from({ length: 500 }, (_, index) => {
  const date = new Date(LATEST)
  date.setDate(LATEST.getDate() - Math.floor(index / 2))

  return {
    id: index,
    author: AUTHORS[(index * 3) % AUTHORS.length]!,
    date: formatDate(date),
    stars: STARS[index % STARS.length]!,
    text: TEXTS[(index * 5) % TEXTS.length]!,
  }
})

const container = useTemplateRef('container')
const header = useTemplateRef('header')

// The list starts below the header, so the scroll margin follows the header's height
const scrollMargin = ref(0)
let observer: ResizeObserver | undefined

onMounted(() => {
  observer = new ResizeObserver(([entry]) => {
    scrollMargin.value = entry?.borderBoxSize[0]?.blockSize ?? 0
  })

  if (header.value) observer.observe(header.value)
})

onBeforeUnmount(() => observer?.disconnect())
</script>
