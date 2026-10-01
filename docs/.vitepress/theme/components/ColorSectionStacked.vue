<script setup lang="ts">
import ThemeChip from './color/ThemeChip.vue'
import StackedSwatch from './color/StackedSwatch.vue'

interface StackedColor {
  label: string
  variable: string
  cssValue?: string
  border?: boolean
  tooltip?: string
}

defineProps<{ lightColors: StackedColor[]; darkColors: StackedColor[] }>()
</script>

<template>
  <div class="not-prose flex flex-col gap-2">
    <div data-theme="light">
      <div class="flex flex-col gap-2">
        <ThemeChip theme="Light" />
        <div class="flex flex-wrap gap-2 sm:flex-nowrap">
          <StackedSwatch v-for="color in lightColors" :key="color.variable + color.label" v-bind="color" />
        </div>
      </div>
    </div>
    <div data-theme="dark">
      <div class="flex flex-col gap-2">
        <ThemeChip theme="Dark" />
        <div class="flex flex-wrap gap-2 sm:flex-nowrap">
          <StackedSwatch v-for="color in darkColors" :key="color.variable + color.label" v-bind="color" />
        </div>
      </div>
    </div>
  </div>
</template>
