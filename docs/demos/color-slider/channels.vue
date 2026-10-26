<template>
  <div class="flex w-full max-w-xs flex-col gap-4">
    <ColorSlider v-model="color" channel="hue" label="Hue" />
    <ColorSlider v-model="color" channel="saturation" label="Saturation" />
    <ColorSlider v-model="color" channel="lightness" label="Lightness" />
    <div class="flex items-center gap-2">
      <ColorSwatch :color="color" size="sm" />
      <p class="text-sm text-muted">
        Current color: <code class="font-mono">{{ colorToString(color, 'hsl') }}</code>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ColorSlider, ColorSwatch, colorToString, parseColor } from '@hareui/vue'
import { ref } from 'vue'

const color = ref(parseColor('hsl(0, 100%, 50%)'))
</script>
