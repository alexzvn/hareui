<template>
  <Carousel
    v-slot="{ item }"
    :items="photos"
    arrows
    dots
    thumbnails
    aria-label="Trail photos"
    class="w-full max-w-sm"
  >
    <div class="overflow-hidden rounded-3xl">
      <img
        :src="item.src"
        :alt="item.alt"
        class="aspect-square w-full object-cover select-none"
        draggable="false"
      />
    </div>
  </Carousel>
</template>

<script setup lang="ts">
import { Carousel } from '@hareui/vue/carousel'

const PHOTOS = [
  { id: 1015, alt: 'A fjord seen from a cliff top' },
  { id: 1016, alt: 'A red rock ridge in the evening sun' },
  { id: 1018, alt: 'A road winding through a green valley' },
  { id: 1036, alt: 'Snowy peaks above a frozen slope' },
  { id: 1039, alt: 'A waterfall in a mossy forest' },
  { id: 1050, alt: 'Sea stacks along a turquoise coast' },
]

const photos = PHOTOS.map(({ id, alt }) => ({
  src: `https://picsum.photos/id/${id}/800/800`,
  thumbnail: `https://picsum.photos/id/${id}/160/160`,
  alt,
}))
</script>
