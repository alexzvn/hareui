<template>
  <Carousel
    v-slot="{ item }"
    :items="photos"
    orientation="vertical"
    arrows
    aria-label="Trail photos"
    class="w-full max-w-xs"
    :ui="{ container: 'h-80' }"
  >
    <img
      :src="item.src"
      :alt="item.alt"
      class="h-80 w-full rounded-3xl object-cover select-none"
      draggable="false"
    />
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

const photos = PHOTOS.map(({ id, alt }) => ({ src: `https://picsum.photos/id/${id}/640/640`, alt }))
</script>
