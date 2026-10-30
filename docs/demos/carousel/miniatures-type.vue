<template>
  <Carousel
    v-slot="{ item }"
    :items="photos"
    type="miniatures"
    arrows
    thumbnails
    aria-label="Trail photos"
    class="w-full max-w-sm"
  >
    <div class="overflow-hidden rounded-3xl">
      <img
        :src="item.src"
        :alt="item.alt"
        class="aspect-video w-full object-cover select-none"
        draggable="false"
      />
    </div>
  </Carousel>
</template>

<script setup lang="ts">
import { Carousel } from '@hareui/vue/carousel'

const PHOTOS = [
  { id: 1043, alt: 'Granite cliffs above a pine forest' },
  { id: 1044, alt: 'An angler wading a misty river' },
  { id: 1057, alt: 'A coastal hillside at sunset' },
  { id: 1035, alt: 'A hiker in front of a waterfall and a rainbow' },
]

const photos = PHOTOS.map(({ id, alt }) => ({
  src: `https://picsum.photos/id/${id}/960/540`,
  thumbnail: `https://picsum.photos/id/${id}/160/160`,
  alt,
}))
</script>
