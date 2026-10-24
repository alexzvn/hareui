<template>
  <ColorPicker default-value="hsl(219, 58%, 93%)" :ui="{ popover: 'max-w-62 gap-2 px-2 py-3' }">
    <template #trigger>
      <ColorSwatch size="lg" />
      <Label>Pick a color</Label>
    </template>
    <Select
      v-model="colorSpace"
      aria-label="Color space"
      variant="secondary"
      class="uppercase"
      :items="spaces"
    />
    <div class="flex flex-col gap-2">
      <ColorSlider
        v-for="channel in channels[colorSpace]"
        :key="channel"
        :aria-label="channel"
        :channel="channel"
        class="gap-1 px-1"
        :color-space="colorSpace"
        :label="title(channel)"
        :ui="{ output: 'text-muted' }"
      />
    </div>
  </ColorPicker>
</template>

<script setup lang="ts">
import type { ListBoxItem } from '@hareui/vue'
import { ColorPicker, ColorSlider, ColorSwatch, Label, Select } from '@hareui/vue'
import type { ColorChannel, ColorSpace } from 'reka-ui'
import { ref } from 'vue'

const colorSpace = ref<ColorSpace>('hsl')
const channels: Record<ColorSpace, ColorChannel[]> = {
  hsb: ['hue', 'saturation', 'brightness', 'alpha'],
  hsl: ['hue', 'saturation', 'lightness', 'alpha'],
  rgb: ['red', 'green', 'blue', 'alpha'],
}
const spaces: ListBoxItem[] = Object.keys(channels).map((value) => ({ value, label: value }))
const title = (s: string) => s[0].toUpperCase() + s.slice(1)
</script>
