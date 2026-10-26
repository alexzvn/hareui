<template>
  <ColorField v-model="color" class="w-[280px]" name="color" label="Color">
    <template #prefix>
      <ColorSwatch :color="color" size="xs" />
    </template>
  </ColorField>
</template>

<script setup lang="ts">
import { ColorField, ColorSwatch, parseColor } from '@hareui/vue'
import { ref } from 'vue'

const color = ref(parseColor('#0485F7'))
</script>
