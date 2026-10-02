<script setup lang="ts">
// Port of the HeroUI docs' own `components/color-picker/components/color-slider.tsx` (horizontal only): a herouse
// ColorSlider restyled to the docs' pill track (`h-8 rounded-full`, no end caps) and round 16px thumb.
import type { Color, ColorChannel, ColorSpace } from 'reka-ui'
import { ColorSlider } from 'herouse'
import { computed } from 'vue'

const props = defineProps<{
  channel: ColorChannel
  colorSpace?: ColorSpace
  modelValue?: string | Color
  /** Overrides the channel gradient of the track */
  trackBackground?: string
  /** Overrides the color of the thumb (defaults to the slider color) */
  thumbBackground?: string
  class?: any
}>()
const emit = defineEmits<{ 'update:modelValue': [value: Color] }>()

const ui = computed(() => ({
  // The track fills the root (react-aria's flex-col root shrinks the `h-8` track to the root's height)
  base: 'grid-rows-[minmax(0,1fr)]',
  track: [
    'h-full min-h-0 w-full rounded-full before:hidden after:hidden [box-shadow:none]',
    // `!`: herouse sets the track/thumb colors inline
    props.trackBackground && '[background:var(--accent-slider-track)!]',
  ],
  thumb: [
    'size-4 cursor-grab rounded-full border-[1.5px] border-white [box-shadow:0_10px_15px_-3px_rgb(0_0_0/0.1),0_4px_6px_-4px_rgb(0_0_0/0.1)] [transition:none] active:cursor-grabbing',
    props.thumbBackground && '[background:var(--accent-slider-thumb)!]',
  ],
}))
</script>

<template>
  <ColorSlider
    :channel="channel"
    :color-space="colorSpace"
    :model-value="modelValue"
    :class="props.class"
    :ui="ui"
    :style="{
      '--accent-slider-track': trackBackground,
      '--accent-slider-thumb': thumbBackground,
    }"
    @update:model-value="emit('update:modelValue', $event)"
  />
</template>
