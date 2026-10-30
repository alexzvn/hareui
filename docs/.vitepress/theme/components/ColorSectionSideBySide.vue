<template>
  <div class="not-prose flex flex-col gap-4 sm:flex-row">
    <ThemeColumn v-bind="props" theme="Light" />
    <ThemeColumn v-bind="props" theme="Dark" />
  </div>
</template>

<script setup lang="ts">
import ThemeColumn, { type ColorTokenSet } from './color/ThemeColumn.vue'

const props = defineProps<
  ColorTokenSet & {
    name: string
    soft?: ColorTokenSet
  }
>()
</script>
