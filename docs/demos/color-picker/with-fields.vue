<script setup lang="ts">
import type { ListBoxItem } from '@hareui/vue'
import {
  ColorArea,
  ColorField,
  ColorPicker,
  ColorSlider,
  ColorSwatch,
  Label,
  Select,
} from '@hareui/vue'
import type { ColorChannel, ColorSpace } from 'reka-ui'
import { ref } from 'vue'

const colorSpace = ref<ColorSpace>('hsl')
const channels: Record<ColorSpace, ColorChannel[]> = {
  hsb: ['hue', 'saturation', 'brightness'],
  hsl: ['hue', 'saturation', 'lightness'],
  rgb: ['red', 'green', 'blue'],
}
const spaces: ListBoxItem[] = Object.keys(channels).map((value) => ({ value, label: value }))
</script>

<template>
  <ColorPicker default-value="hsla(220, 90%, 50%, 0.8)" :ui="{ popover: 'max-w-62 gap-2' }">
    <template #trigger>
      <ColorSwatch size="lg" />
      <Label>Pick a color</Label>
    </template>
    <ColorArea class="max-w-full" color-space="hsb" x-channel="saturation" y-channel="brightness" />
    <ColorSlider
      channel="hue"
      class="gap-1 px-1"
      color-space="hsb"
      label="Hue"
      :ui="{ output: 'text-muted' }"
    />
    <Select
      v-model="colorSpace"
      aria-label="Color space"
      variant="secondary"
      class="uppercase"
      :items="spaces"
    />
    <div class="grid w-full grid-cols-3 items-center gap-2">
      <ColorField
        v-for="channel in channels[colorSpace]"
        :key="channel"
        :aria-label="channel"
        :channel="channel"
        :color-space="colorSpace"
        variant="secondary"
      />
    </div>
  </ColorPicker>
</template>
