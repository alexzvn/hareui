<template>
  <div class="flex w-full flex-row flex-wrap justify-between gap-4">
    <Card
      v-for="card in cards"
      :key="card.title"
      class="w-full flex-1"
      :ui="{ content: 'items-start', footer: 'items-center gap-2' }"
    >
      <template #header>
        <Avatar
          class="size-[56px] rounded-xl"
          :alt="card.title"
          :src="card.image"
          :fallback="card.fallback"
        />
      </template>
      <p class="text-sm font-medium">{{ card.title }}</p>
      <p class="text-sm text-muted">{{ card.members }}</p>
      <template #footer>
        <Avatar
          class="size-4"
          :alt="card.author"
          :src="card.authorImage"
          :fallback="card.authorFallback"
        />
        <p class="text-xs text-muted">{{ card.by }}</p>
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { Avatar, Card } from '@hareui/vue'

const ASSETS = 'https://heroui-assets.nyc3.cdn.digitaloceanspaces.com'
const cards = [
  {
    title: 'Indie Hackers',
    members: '148 members',
    image: `${ASSETS}/docs/demo1.jpg`,
    fallback: 'JK',
    by: 'By John',
    author: 'John',
    authorImage: `${ASSETS}/avatars/red.jpg`,
    authorFallback: 'JK',
  },
  {
    title: 'AI Builders',
    members: '362 members',
    image: `${ASSETS}/docs/demo2.jpg`,
    fallback: 'J',
    by: 'By Martha',
    author: 'Martha',
    authorImage: `${ASSETS}/avatars/blue.jpg`,
    authorFallback: 'M',
  },
]
</script>
