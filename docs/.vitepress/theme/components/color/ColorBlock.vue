<script setup lang="ts">
import { computed } from 'vue'
import ColorTooltip from './ColorTooltip.vue'
import { contrastStyle, copyColorValue, getTokenName } from '../../composables/useColorCopy'

const props = defineProps<{
  label: string
  bgVariable: string
  cssValue?: string
  hasBorder?: boolean
  tooltip?: string
}>()

const bgValue = computed(() => props.cssValue || `var(${props.bgVariable})`)
const token = computed(() => getTokenName(props.tooltip, props.bgVariable))
const style = computed(() => contrastStyle(props.bgVariable))

function onClick(event: MouseEvent) {
  void copyColorValue(event, props.cssValue || props.bgVariable)
}
</script>

<template>
  <ColorTooltip tooltip-class="block w-full" :content="tooltip">
    <div
      :style="{ backgroundColor: bgValue }"
      class="flex w-full cursor-pointer flex-col justify-center rounded-xl px-4 py-2.5"
      :class="hasBorder && 'border border-black/12 dark:border-white/12'"
      @click="onClick"
    >
      <span class="text-sm font-medium tracking-tight" :style="style">{{ label }}</span>
      <span class="font-mono text-[10px] leading-tight opacity-60 sm:hidden" :style="style">{{ token }}</span>
    </div>
  </ColorTooltip>
</template>
