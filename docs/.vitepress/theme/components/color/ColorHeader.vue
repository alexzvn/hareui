<script setup lang="ts">
import { computed } from 'vue'

import { contrastStyle, copyColorValue, getTokenName } from '../../composables/useColorCopy'
import ColorTooltip from './ColorTooltip.vue'

const props = defineProps<{
  name: string
  theme: 'Light' | 'Dark'
  bgVariable: string
  tooltip?: string
}>()

const token = computed(() => getTokenName(props.tooltip, props.bgVariable))
const style = computed(() => contrastStyle(props.bgVariable))

function onClick(event: MouseEvent) {
  void copyColorValue(event, props.bgVariable)
}
</script>

<template>
  <ColorTooltip :content="tooltip">
    <div
      class="flex cursor-pointer items-center justify-between rounded-xl px-4 py-3"
      :style="{ backgroundColor: `var(${bgVariable})` }"
      @click="onClick"
    >
      <div class="flex flex-col">
        <span class="text-lg font-medium tracking-tight" :style="style">{{ name }}</span>
        <span class="font-mono text-[10px] leading-tight opacity-60 sm:hidden" :style="style">{{
          token
        }}</span>
      </div>
      <span class="text-xs font-medium" :style="style">{{ theme }}</span>
    </div>
  </ColorTooltip>
</template>
