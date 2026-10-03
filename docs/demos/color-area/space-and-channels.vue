<script setup lang="ts">
import type { ColorChannel, ColorSpace, ListBoxItem, SelectValue } from '@hareui/vue'
import { ColorArea, colorToString, parseColor, Select } from '@hareui/vue'
import { computed, ref } from 'vue'

const colorSpaces: ListBoxItem[] = [
  { value: 'rgb', label: 'RGB' },
  { value: 'hsl', label: 'HSL' },
  { value: 'hsb', label: 'HSB' },
]

const channelsBySpace: Record<ColorSpace, Array<{ value: ColorChannel, label: string }>> = {
  hsb: [
    { value: 'hue', label: 'Hue' },
    { value: 'saturation', label: 'Saturation' },
    { value: 'brightness', label: 'Brightness' },
  ],
  hsl: [
    { value: 'hue', label: 'Hue' },
    { value: 'saturation', label: 'Saturation' },
    { value: 'lightness', label: 'Lightness' },
  ],
  rgb: [
    { value: 'red', label: 'Red' },
    { value: 'green', label: 'Green' },
    { value: 'blue', label: 'Blue' },
  ],
}

const colorSpace = ref<ColorSpace>('hsb')
const color = ref(parseColor('hsb(219, 58%, 93%)'))
const xChannel = ref<ColorChannel>('saturation')
const yChannel = ref<ColorChannel>('brightness')

function onSpaceChange(space: SelectValue | undefined) {
  if (!space || typeof space !== 'string')
    return
  colorSpace.value = space as ColorSpace
  // Reset the channels to sensible defaults for the new colour space
  if (space === 'rgb') {
    xChannel.value = 'blue'
    yChannel.value = 'green'
  }
  else if (space === 'hsl') {
    xChannel.value = 'saturation'
    yChannel.value = 'lightness'
  }
  else {
    xChannel.value = 'saturation'
    yChannel.value = 'brightness'
  }
}

// A channel can't be on both axes, so each axis hides the other's channel
const xChannelOptions = computed(() => channelsBySpace[colorSpace.value].filter(c => c.value !== yChannel.value))
const yChannelOptions = computed(() => channelsBySpace[colorSpace.value].filter(c => c.value !== xChannel.value))
</script>

<template>
  <div class="flex flex-col items-center gap-6">
    <div class="flex gap-4">
      <Select class="w-32" label="Color Space" :model-value="colorSpace" :items="colorSpaces" @update:model-value="onSpaceChange" />
      <Select v-model="xChannel" class="w-36" label="X Axis" :items="xChannelOptions" />
      <Select v-model="yChannel" class="w-36" label="Y Axis" :items="yChannelOptions" />
    </div>

    <ColorArea
      v-model="color"
      :color-space="colorSpace"
      :x-channel="xChannel"
      :y-channel="yChannel"
    />

    <div class="flex items-center gap-3">
      <div
        class="size-8 rounded-md border border-default"
        :style="{ backgroundColor: colorToString(color, 'rgb') }"
      />
      <code class="rounded bg-default/50 px-2 py-1 text-sm">
        {{ colorToString(color, colorSpace) }}
      </code>
    </div>
  </div>
</template>
