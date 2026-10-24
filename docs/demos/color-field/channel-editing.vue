<template>
  <div class="flex flex-col gap-4">
    <p class="text-sm text-muted">Edit individual HSL channels:</p>
    <div class="flex gap-4">
      <ColorField
        v-model="color"
        channel="hue"
        color-space="hsl"
        class="w-[100px]"
        name="hue"
        label="Hue"
      />
      <ColorField
        v-model="color"
        channel="saturation"
        color-space="hsl"
        class="w-[100px]"
        name="saturation"
        label="Saturation"
      >
        <template #suffix>
          <span class="text-sm text-muted">%</span>
        </template>
      </ColorField>
      <ColorField
        v-model="color"
        channel="lightness"
        color-space="hsl"
        class="w-[100px]"
        name="lightness"
        label="Lightness"
      >
        <template #suffix>
          <span class="text-sm text-muted">%</span>
        </template>
      </ColorField>
    </div>
    <div class="flex items-center gap-2">
      <ColorSwatch :color="color" size="md" />
      <span class="text-sm">Current: {{ colorToString(color, 'hex') }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ColorField, ColorSwatch, colorToString, parseColor } from '@hareui/vue'
import { ref } from 'vue'

const color = ref(parseColor('#7F007F'))
</script>
