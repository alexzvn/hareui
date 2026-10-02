<script setup lang="ts">
import type { ScrollShadowVisibility } from 'herouse'
import { Card, ScrollShadow } from 'herouse'
import { ref } from 'vue'

const images = [
  'https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/docs/robot1.jpeg',
  'https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/docs/avocado.jpeg',
  'https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/docs/oranges.jpeg',
]

const getRandomImage = (idx: number) => images[idx % images.length]

const verticalState = ref<ScrollShadowVisibility>('none')
const horizontalState = ref<ScrollShadowVisibility>('none')
</script>

<template>
  <div class="w-full sm:max-w-sm">
    <div class="mb-8 flex flex-col gap-2">
      <div class="rounded bg-default p-4">
        <p class="text-sm font-semibold">
          Vertical Shadow State: {{ verticalState }}
        </p>
      </div>
      <div class="w-full">
        <ScrollShadow class="max-h-[240px] p-4" orientation="vertical" @visibility-change="verticalState = $event">
          <div class="space-y-4">
            <p v-for="idx in 10" :key="`scroll-shadow-lorem-content-${idx}`">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam pulvinar risus non
              risus hendrerit venenatis. Pellentesque sit amet hendrerit risus, sed porttitor quam.
              Morbi accumsan cursus enim, sed ultricies sapien.
            </p>
          </div>
        </ScrollShadow>
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <div class="rounded bg-default p-4">
        <p class="text-sm font-semibold">
          Horizontal Shadow State: {{ horizontalState }}
        </p>
      </div>
      <div class="w-full">
        <ScrollShadow class="p-4" orientation="horizontal" @visibility-change="horizontalState = $event">
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
      </div>
    </div>
  </div>
</template>
