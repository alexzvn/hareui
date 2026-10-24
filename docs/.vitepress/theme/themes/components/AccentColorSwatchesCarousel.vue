<script setup lang="ts">
import { Button, ColorSwatchPicker } from '@hareui/vue'
import { Icon } from '@iconify/vue'
// Port of HeroUI docs `components/color-picker/components/color-swatches-carousel.tsx`.
import type { Color } from 'reka-ui'
import { computed, ref } from 'vue'

import { chunkArray, SWATCHES_PER_PAGE } from './accentColorUtils'

const props = defineProps<{
  /** Array of color swatches to display */
  swatches: string[]
  /** Initial color hex to determine starting page */
  initialColorHex?: string
  /** The current color (the swatch matching it is selected) */
  color: Color
}>()
const emit = defineEmits<{ select: [color: Color] }>()

// Chunk swatches into pages
const swatchPages = computed(() => chunkArray(props.swatches, SWATCHES_PER_PAGE))
const totalPages = computed(() => swatchPages.value.length)

// Calculate initial swatch page based on current color
const swatchPage = ref(
  (() => {
    if (!props.initialColorHex) return 0
    const swatchIndex = props.swatches.findIndex(
      (s) => s.toLowerCase() === props.initialColorHex!.toLowerCase(),
    )

    return swatchIndex !== -1 ? Math.floor(swatchIndex / SWATCHES_PER_PAGE) : 0
  })(),
)

function navigateSwatches(direction: 'left' | 'right') {
  if (direction === 'left') {
    swatchPage.value = Math.max(0, swatchPage.value - 1)
  } else {
    swatchPage.value = Math.min(totalPages.value - 1, swatchPage.value + 1)
  }
}

const isFirstPage = computed(() => swatchPage.value === 0)
const isLastPage = computed(() => swatchPage.value === totalPages.value - 1)

// The docs carousel uses react-aria's unstyled swatch picker: plain circles, a ring (offset 1px) on the selected one,
// no checkmark and none of HeroUI's selected-swatch shrink.
const SWATCH_UI = {
  base: 'flex-nowrap items-center justify-start gap-1.5',
  item: [
    'size-4 rounded-full border-0 [transition:all_150ms_cubic-bezier(0.4,0,0.2,1)]',
    'data-[state=checked]:[box-shadow:0_0_0_1px_#fff,0_0_0_2px_var(--color-foreground)]',
    'data-[state=checked]:[&_[data-slot=color-swatch-picker-swatch]]:[transform:none]',
  ],
  swatch: 'size-full cursor-pointer rounded-full [@media(hover:hover)]:hover:[transform:none]',
  indicator: 'hidden',
}
</script>

<template>
  <div v-if="totalPages !== 0" class="flex items-center gap-2">
    <Button
      icon-only
      class="size-5 min-w-5 shrink-0 rounded-full"
      :disabled="isFirstPage"
      size="sm"
      variant="ghost"
      @click="navigateSwatches('left')"
    >
      <Icon icon="gravity-ui:chevron-left" class="size-4" />
    </Button>
    <div class="relative flex-1 overflow-hidden">
      <div
        class="flex transition-transform duration-300 ease-out"
        :style="{
          transform: `translateX(-${swatchPage * 100}%)`,
        }"
      >
        <div
          v-for="(pageSwatches, pageIndex) in swatchPages"
          :key="pageIndex"
          class="flex h-[22px] w-full shrink-0 justify-center"
        >
          <ColorSwatchPicker
            :items="pageSwatches"
            :model-value="color"
            :ui="SWATCH_UI"
            @update:model-value="emit('select', $event as Color)"
          />
        </div>
      </div>
    </div>
    <Button
      icon-only
      class="size-5 min-w-5 shrink-0 rounded-full"
      :disabled="isLastPage"
      size="sm"
      variant="ghost"
      @click="navigateSwatches('right')"
    >
      <Icon icon="gravity-ui:chevron-right" class="size-4" />
    </Button>
  </div>
</template>
