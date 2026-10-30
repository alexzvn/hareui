<script setup lang="ts">
import { Card } from '@hareui/vue'
import { ref } from 'vue'

import { Carousel } from '@/components/carousel'

const photos = [1015, 1016, 1018, 1036, 1039, 1050].map((id) => ({
  src: `https://picsum.photos/id/${id}/640/640`,
  thumbnail: `https://picsum.photos/id/${id}/160/160`,
  alt: `Photo ${id}`,
}))

const numbers = [1, 2, 3, 4, 5, 6, 7, 8]

const selected = ref(0)
const isRtl = ref(false)
</script>

<template>
  <div class="flex flex-col gap-12 p-8">
    <h1 class="text-2xl font-semibold">Carousel</h1>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">
        in-place: arrows + dots + thumbnails (selected {{ selected }})
      </h2>
      <Carousel
        v-slot="{ item }"
        :items="photos"
        arrows
        dots
        thumbnails
        aria-label="Photos"
        class="max-w-sm"
        @select="selected = $event"
      >
        <img :src="item.src" :alt="item.alt" class="aspect-square w-full rounded-3xl object-cover" />
      </Carousel>
    </section>

    <section class="px-16">
      <h2 class="mb-2 text-sm font-medium text-muted">type="modal"</h2>
      <Carousel
        v-slot="{ item }"
        :items="photos"
        type="modal"
        arrows
        thumbnails
        aria-label="Photos"
        class="max-w-64"
      >
        <img :src="item.src" :alt="item.alt" class="aspect-4/3 w-full rounded-3xl object-cover" />
      </Carousel>
    </section>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">type="miniatures" (thumbnails, then dots)</h2>
      <div class="flex flex-wrap gap-8">
        <Carousel
          v-slot="{ item }"
          :items="photos"
          type="miniatures"
          arrows
          thumbnails
          aria-label="Photos"
          class="w-80"
        >
          <img :src="item.src" :alt="item.alt" class="aspect-video w-full rounded-3xl object-cover" />
        </Carousel>
        <Carousel
          v-slot="{ item }"
          :items="photos"
          type="miniatures"
          arrows
          dots
          aria-label="Photos"
          class="w-80"
        >
          <img :src="item.src" :alt="item.alt" class="aspect-video w-full rounded-3xl object-cover" />
        </Carousel>
      </div>
    </section>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">
        multiple slides, slidesToScroll 3, disabled ends, dots per group
      </h2>
      <Carousel
        v-slot="{ item }"
        :items="numbers"
        :options="{ align: 'start', slidesToScroll: 3 }"
        :ui="{ item: 'basis-1/3' }"
        arrows
        dots
        aria-label="Numbers"
        class="max-w-sm"
      >
        <div class="p-1">
          <Card :ui="{ content: 'flex aspect-square items-center justify-center' }">
            <span class="text-2xl font-semibold">{{ item }}</span>
          </Card>
        </div>
      </Carousel>
    </section>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">vertical (in-place and modal)</h2>
      <div class="flex flex-wrap gap-24 py-16">
        <Carousel
          v-slot="{ item }"
          :items="photos"
          orientation="vertical"
          arrows
          aria-label="Photos"
          class="w-64"
          :ui="{ container: 'h-64' }"
        >
          <img :src="item.src" :alt="item.alt" class="h-64 w-full rounded-3xl object-cover" />
        </Carousel>
        <Carousel
          v-slot="{ item }"
          :items="photos"
          orientation="vertical"
          type="modal"
          arrows
          aria-label="Photos"
          class="w-64"
          :ui="{ container: 'h-64' }"
        >
          <img :src="item.src" :alt="item.alt" class="h-64 w-full rounded-3xl object-cover" />
        </Carousel>
      </div>
    </section>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">
        loop + autoplay + custom prev/next + icon slots
      </h2>
      <Carousel
        :items="numbers"
        :options="{ loop: true }"
        :autoplay="{ delay: 2000 }"
        :prev="{ variant: 'secondary', 'aria-label': 'Back' }"
        :next="{ variant: 'primary', 'aria-label': 'Forward' }"
        arrows
        dots
        aria-label="Numbers"
        class="max-w-xs"
      >
        <template #default="{ item }">
          <div class="p-1">
            <Card :ui="{ content: 'flex aspect-square items-center justify-center' }">
              <span class="text-4xl font-semibold">{{ item }}</span>
            </Card>
          </div>
        </template>
        <template #prevIcon>←</template>
        <template #nextIcon>→</template>
      </Carousel>
    </section>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">plugins: fade, class-names, wheel-gestures</h2>
      <div class="flex flex-wrap gap-8">
        <Carousel v-slot="{ item }" :items="photos" fade arrows dots aria-label="Fade" class="w-64">
          <img :src="item.src" :alt="item.alt" class="aspect-square w-full rounded-3xl object-cover" />
        </Carousel>
        <Carousel
          v-slot="{ item }"
          :items="photos"
          class-names
          wheel-gestures
          :ui="{ item: 'basis-[70%] transition-opacity [&:not(.is-snapped)]:opacity-30' }"
          aria-label="Class names"
          class="w-64"
        >
          <img :src="item.src" :alt="item.alt" class="aspect-square w-full rounded-3xl object-cover" />
        </Carousel>
      </div>
    </section>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">
        thumbnail slot + RTL ({{ isRtl ? 'rtl' : 'ltr' }})
        <button type="button" class="underline" @click="isRtl = !isRtl">toggle</button>
      </h2>
      <div :dir="isRtl ? 'rtl' : 'ltr'">
        <Carousel
          :items="numbers"
          :dir="isRtl ? 'rtl' : 'ltr'"
          arrows
          thumbnails
          aria-label="Numbers"
          class="max-w-xs"
        >
          <template #default="{ item }">
            <div class="p-1">
              <Card :ui="{ content: 'flex aspect-video items-center justify-center' }">
                <span class="text-4xl font-semibold">{{ item }}</span>
              </Card>
            </div>
          </template>
          <template #thumbnail="{ item: n, selected: isSelected }">
            <span
              class="flex size-full items-center justify-center bg-default text-sm"
              :class="isSelected ? 'font-semibold' : 'text-muted'"
            >
              {{ n }}
            </span>
          </template>
        </Carousel>
      </div>
    </section>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">:ui override (bar dots, square arrows)</h2>
      <Carousel
        v-slot="{ item }"
        :items="photos"
        arrows
        dots
        aria-label="Photos"
        class="max-w-sm"
        :ui="{
          dot: 'h-1 w-6 rounded-full data-[selected=true]:bg-foreground',
          prev: 'rounded-lg',
          next: 'rounded-lg',
        }"
      >
        <img :src="item.src" :alt="item.alt" class="aspect-video w-full rounded-3xl object-cover" />
      </Carousel>
    </section>
  </div>
</template>
