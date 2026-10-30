<template>
  <Carousel
    v-slot="{ item }"
    :items="photos"
    :options="{ loop: true, dragFree: true }"
    :auto-scroll="{ speed: 1 }"
    :ui="{ viewport: 'mask-x-from-90%', item: 'basis-1/3 ps-2', container: '-ms-2' }"
    aria-label="Trail photos"
    class="w-full max-w-md"
  >
    <img
      :src="item"
      alt=""
      class="aspect-square w-full rounded-2xl object-cover select-none"
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
