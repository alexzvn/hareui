<template>
  <Carousel
    :items="photos"
    :prev="{ variant: 'secondary', 'aria-label': 'Previous photo' }"
    :next="{ variant: 'secondary', 'aria-label': 'Next photo' }"
    arrows
    aria-label="Trail photos"
    class="w-full max-w-sm"
  >
    <template #default="{ item }">
      <img
        :src="item.src"
        :alt="item.alt"
        class="aspect-video w-full rounded-3xl object-cover select-none"
        draggable="false"
      />
    </template>

    <template #prevIcon>
      <Icon aria-hidden="true" class="size-4" icon="gravity-ui:arrow-left" />
    </template>
    <template #nextIcon>
      <Icon aria-hidden="true" class="size-4" icon="gravity-ui:arrow-right" />
    </template>
  </Carousel>
</template>

<script setup lang="ts">
import { Carousel } from '@hareui/vue/carousel'
import { Icon } from '@iconify/vue'

const PHOTOS = [
  { id: 1015, alt: 'A fjord seen from a cliff top' },
  { id: 1016, alt: 'A red rock ridge in the evening sun' },
  { id: 1018, alt: 'A road winding through a green valley' },
  { id: 1036, alt: 'Snowy peaks above a frozen slope' },
  { id: 1039, alt: 'A waterfall in a mossy forest' },
  { id: 1050, alt: 'Sea stacks along a turquoise coast' },
]

const photos = PHOTOS.map(({ id, alt }) => ({ src: `https://picsum.photos/id/${id}/960/540`, alt }))
</script>
