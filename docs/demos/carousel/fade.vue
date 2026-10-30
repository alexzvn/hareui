<template>
  <Carousel
    v-slot="{ item }"
    :items="photos"
    fade
    arrows
    dots
    aria-label="Trail photos"
    class="w-full max-w-sm"
  >
    <img
      :src="item"
      alt=""
      class="aspect-square w-full rounded-3xl object-cover select-none"
      draggable="false"
    />
  </Carousel>
</template>

<script setup lang="ts">
import { Carousel } from '@hareui/vue/carousel'

const photos = [1015, 1016, 1018, 1036, 1039, 1050].map(
  (id) => `https://picsum.photos/id/${id}/480/480`,
)
</script>
