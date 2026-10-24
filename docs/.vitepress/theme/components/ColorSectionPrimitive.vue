<template>
  <div class="not-prose flex flex-wrap gap-2 sm:flex-nowrap">
    <StackedSwatch v-for="color in colors" :key="color.variable + color.label" v-bind="color" />
  </div>
</template>

<script setup lang="ts">
import StackedSwatch from './color/StackedSwatch.vue'

interface StackedColor {
  label: string
  variable: string
  cssValue?: string
  border?: boolean
  tooltip?: string
}

defineProps<{ colors: StackedColor[] }>()
</script>
