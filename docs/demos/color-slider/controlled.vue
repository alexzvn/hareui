<script setup lang="ts">
import { ColorSlider, ColorSwatch, colorToString, parseColor } from '@hareui/vue'
import { ref } from 'vue'

const color = ref(parseColor('hsl(200, 100%, 50%)'))
</script>

<template>
  <div class="flex w-full max-w-xs flex-col gap-4">
    <ColorSlider v-model="color" channel="hue" label="Hue" />
    <div class="flex items-center gap-2">
      <ColorSwatch :color="color" size="sm" />
      <p class="text-sm text-muted">
        Current color: <code class="font-mono">{{ colorToString(color, 'hsl') }}</code>
      </p>
    </div>
  </div>
</template>
