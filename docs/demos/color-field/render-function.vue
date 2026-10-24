<template>
  <!-- Attributes other than aria-label/aria-labelledby fall through to the root element (HeroUI's `render` prop) -->
  <ColorField v-model="color" class="w-[280px]" data-custom="foo" name="color" label="Color">
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
