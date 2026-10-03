<script setup lang="ts">
import { Avatar, Card } from '@hareui/vue'
</script>

<template>
  <div class="flex flex-wrap gap-4">
    <Card class="w-[200px] gap-2" description="148 members" title="Indie Hackers" :ui="{ footer: 'flex gap-2' }">
      <template #leading>
        <img
          alt="Indie Hackers community"
          class="pointer-events-none aspect-square w-14 rounded-2xl object-cover select-none"
          loading="lazy"
          src="https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/docs/demo1.jpg"
        />
      </template>
      <template #footer>
        <Avatar
          alt="Martha's avatar"
          aria-label="Martha's profile picture"
          class="size-5"
          fallback="IH"
          src="https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/red.jpg"
          :ui="{ fallback: 'text-xs' }"
        />
        <span class="text-xs">By Martha</span>
      </template>
    </Card>

    <Card class="w-[200px] gap-2" description="362 members" title="AI Builders" :ui="{ footer: 'flex gap-2' }">
      <template #leading>
        <img
          alt="AI Builders community"
          class="pointer-events-none aspect-square w-14 rounded-2xl object-cover select-none"
          loading="lazy"
          src="https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/docs/demo2.jpg"
        />
      </template>
      <template #footer>
        <Avatar
          alt="John's avatar - blue themed"
          aria-label="John's profile picture"
          class="size-5"
          fallback="B"
          src="https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/blue.jpg"
          :ui="{ fallback: 'text-xs' }"
        />
        <span class="text-xs">By John</span>
      </template>
    </Card>
  </div>
</template>
