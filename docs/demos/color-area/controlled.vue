<script setup lang="ts">
import { ColorArea, ColorSwatch, colorToString, parseColor } from '@hareui/vue'
import { ref } from 'vue'

const color = ref(parseColor('#9B80FF'))
</script>

<template>
  <div class="flex flex-col gap-4">
    <ColorArea v-model="color" color-space="rgb" x-channel="red" y-channel="green" />
    <div class="flex w-[300px] items-center gap-3">
      <ColorSwatch :color="color" size="md" />
      <p class="text-sm text-muted">
        Current color:
        <span class="font-medium">{{ color ? colorToString(color, 'hex') : '(empty)' }}</span>
      </p>
    </div>
  </div>
</template>
