<script setup lang="ts">
import { ColorSlider, ColorSwatch, colorToString, parseColor } from 'herouse'
import { ref } from 'vue'

const color = ref(parseColor('rgb(255, 100, 50)'))
</script>

<template>
  <div class="flex w-full max-w-xs flex-col gap-4">
    <ColorSlider v-model="color" channel="red" label="Red" />
    <ColorSlider v-model="color" channel="green" label="Green" />
    <ColorSlider v-model="color" channel="blue" label="Blue" />
    <div class="flex items-center gap-2">
      <ColorSwatch :color="color" size="sm" />
      <p class="text-sm text-muted">
        Current color: <code class="font-mono">{{ colorToString(color, 'rgb') }}</code>
      </p>
    </div>
  </div>
</template>
