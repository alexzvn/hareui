<template>
  <div class="flex flex-col gap-4">
    <ColorField
      v-model="value"
      class="w-[280px]"
      name="color"
      label="Color"
      :description="`Current value: ${value ? colorToString(value, 'hex') : '(empty)'}`"
    >
      <template #prefix>
        <ColorSwatch :color="value ?? undefined" size="xs" />
      </template>
    </ColorField>
    <div class="flex gap-2">
      <Button variant="tertiary" @click="value = parseColor('#EF4444')"> Set Red </Button>
      <Button variant="tertiary" @click="value = parseColor('#10B981')"> Set Green </Button>
      <Button variant="tertiary" @click="value = null"> Clear </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Color } from '@hareui/vue'
import { Button, ColorField, ColorSwatch, colorToString, parseColor } from '@hareui/vue'
import { ref } from 'vue'

const value = ref<Color | null>(parseColor('#0485F7'))
</script>
