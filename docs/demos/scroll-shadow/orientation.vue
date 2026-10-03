<script setup lang="ts">
import { Card, ScrollShadow } from '@hareui/vue'

const images = [
  'https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/docs/robot1.jpeg',
  'https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/docs/avocado.jpeg',
  'https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/docs/oranges.jpeg',
]

const getRandomImage = (idx: number) => images[idx % images.length]
</script>

<template>
  <div class="w-full sm:max-w-sm">
    <div class="mb-8 w-full">
      <h4 class="mb-2 text-sm font-semibold">
        Vertical
      </h4>
      <Card class="w-full p-0">
        <ScrollShadow class="max-h-[240px] p-4" orientation="vertical">
          <div class="space-y-4">
            <p v-for="idx in 10" :key="`scroll-shadow-lorem-content-${idx}`">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam pulvinar risus non
              risus hendrerit venenatis. Pellentesque sit amet hendrerit risus, sed porttitor quam.
              Morbi accumsan cursus enim, sed ultricies sapien.
            </p>
          </div>
        </ScrollShadow>
      </Card>
    </div>

    <div class="w-full">
      <h4 class="mb-2 text-sm font-semibold">
        Horizontal
      </h4>
      <Card class="w-full p-0">
        <ScrollShadow class="p-4" orientation="horizontal">
          <div class="flex flex-row gap-4">
            <Card
              v-for="idx in 10"
              :key="`scroll-shadow-lorem-cards-${idx}`"
              class="flex min-w-[200px] flex-row gap-3 p-1"
              :ui="{ content: 'justify-center' }"
              variant="transparent"
            >
              <template #leading>
                <img
                  alt="Lorem Card"
                  class="aspect-square h-16 w-16 shrink-0 rounded-xl object-cover select-none sm:h-20 sm:w-20"
                  loading="lazy"
                  :src="getRandomImage(idx - 1)"
                >
              </template>
              <h3 class="text-sm leading-6 font-medium text-foreground">
                Bridging the Future
              </h3>
              <p class="text-xs leading-5 text-muted">
                Today, 6:30 PM
              </p>
            </Card>
          </div>
        </ScrollShadow>
      </Card>
    </div>
  </div>
</template>
