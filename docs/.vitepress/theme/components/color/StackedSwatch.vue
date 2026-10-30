<template>
  <ColorTooltip tooltip-class="min-w-0 basis-full sm:flex-1 sm:basis-0" :content="tooltip">
    <div
      :style="{ backgroundColor: bgValue }"
      class="flex min-h-14 w-full cursor-pointer flex-col justify-center rounded-xl px-4 py-2"
      :class="border && 'border border-border'"
      @click="onClick"
    >
      <span class="text-sm font-medium tracking-tight" :style="style">{{ label }}</span>
      <span
        class="truncate font-mono text-[10px] leading-tight opacity-60 sm:hidden"
        :style="style"
        >{{ token }}</span
      >
    </div>
  </ColorTooltip>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import { contrastStyle, copyColorValue, getTokenName } from '../../composables/useColorCopy'
import ColorTooltip from './ColorTooltip.vue'

const props = defineProps<{
  label: string
  variable: string
  cssValue?: string
  border?: boolean
  tooltip?: string
}>()

const bgValue = computed(() => props.cssValue || `var(${props.variable})`)
const token = computed(() => getTokenName(props.tooltip, props.variable))
const style = computed(() => contrastStyle(props.variable))

const onClick = (event: MouseEvent) => {
  void copyColorValue(event, props.cssValue || props.variable)
}
</script>
