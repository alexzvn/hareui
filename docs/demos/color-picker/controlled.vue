<template>
  <div class="flex flex-col gap-4">
    <ColorPicker v-model="color">
      <template #trigger>
        <ColorSwatch size="lg" />
        <Label>Pick a color</Label>
      </template>
      <ColorSwatchPicker
        aria-label="Presets"
        :items="presets"
        class="justify-center pt-2"
        size="xs"
      />
      <ColorArea
        aria-label="Color area"
        class="max-w-full"
        color-space="hsb"
        x-channel="saturation"
        y-channel="brightness"
      />
      <div class="flex items-center gap-2 px-1">
        <ColorSlider aria-label="Hue slider" channel="hue" class="flex-1" color-space="hsb" />
        <Button
          icon-only
          aria-label="Shuffle color"
          size="sm"
          variant="tertiary"
          @click="shuffleColor"
        >
          <svg
            class="size-4"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            aria-hidden="true"
          >
            <path
              d="M2 4h2.5c3 0 4 8 7 8H14M2 12h2.5c1 0 1.8-1.4 2.5-2.6M14 4h-2.5c-1 0-1.8 1-2.5 2.2M12 2l2 2-2 2M12 10l2 2-2 2"
            />
          </svg>
        </Button>
      </div>
      <ColorField aria-label="Color field" variant="secondary">
        <template #prefix>
          <ColorSwatch size="xs" />
        </template>
      </ColorField>
    </ColorPicker>
    <p class="w-60 text-sm text-muted">
      Selected: <span class="font-medium">{{ colorToString(color, 'hex') }}</span>
    </p>
  </div>
</template>

<script setup lang="ts">
import type { ColorSwatchPickerItem } from '@hareui/vue'
import {
  Button,
  ColorArea,
  ColorField,
  ColorPicker,
  ColorSlider,
  ColorSwatch,
  ColorSwatchPicker,
  Label,
  colorToString,
  parseColor,
} from '@hareui/vue'
import { ref } from 'vue'

const color = ref(parseColor('#325578'))

const presets: ColorSwatchPickerItem[] = [
  '#ef4444',
  '#f97316',
  '#eab308',
  '#22c55e',
  '#06b6d4',
  '#3b82f6',
  '#8b5cf6',
  '#ec4899',
  '#f43f5e',
]

const shuffleColor = () => {
  const h = Math.floor(Math.random() * 360)
  const s = 50 + Math.floor(Math.random() * 50)
  const l = 40 + Math.floor(Math.random() * 30)
  color.value = parseColor(`hsl(${h}, ${s}%, ${l}%)`)
}
</script>
