<script setup lang="ts">
import { computed } from 'vue'

import { contrastStyle, copyColorValue, getTokenName } from '../../composables/useColorCopy'
import ColorBlock from './ColorBlock.vue'
import ColorHeader from './ColorHeader.vue'
import ColorTooltip from './ColorTooltip.vue'

export interface SoftProps {
  baseVariable: string
  baseCssValue?: string
  baseTooltip?: string
  hoverVariable: string
  hoverCssValue?: string
  hoverTooltip?: string
  foregroundVariable: string
  foregroundCssValue?: string
  foregroundTooltip?: string
}

const props = defineProps<{
  theme: 'Light' | 'Dark'
  name: string
  baseVariable: string
  baseTooltip?: string
  hoverVariable: string
  hoverCssValue?: string
  hoverTooltip?: string
  foregroundVariable: string
  foregroundTooltip?: string
  soft?: SoftProps
}>()

const baseStyle = computed(() => contrastStyle(props.baseVariable))
const softHoverToken = computed(() =>
  props.soft ? getTokenName(props.soft.hoverTooltip, props.soft.hoverVariable) : '',
)

function onSoftHoverClick(event: MouseEvent) {
  if (!props.soft) return
  void copyColorValue(event, props.soft.hoverCssValue || props.soft.hoverVariable)
}
</script>

<template>
  <div class="flex flex-1 flex-col gap-2" :data-theme="theme.toLowerCase()">
    <ColorHeader :bg-variable="baseVariable" :name="name" :theme="theme" :tooltip="baseTooltip" />
    <div class="flex gap-2" :class="soft ? 'flex-col sm:flex-row' : 'flex-col'">
      <div
        class="flex flex-1 flex-col gap-1.5 rounded-xl p-3"
        :style="{ backgroundColor: `var(${baseVariable})` }"
      >
        <span class="text-base font-medium tracking-tight" :style="baseStyle">{{ name }}</span>
        <ColorBlock
          :bg-variable="hoverVariable"
          :css-value="hoverCssValue"
          label="Hover"
          :tooltip="hoverTooltip"
        />
        <ColorBlock
          :bg-variable="foregroundVariable"
          label="Foreground"
          :tooltip="foregroundTooltip"
        />
      </div>
      <div v-if="soft" class="relative flex flex-1 flex-col gap-1.5 overflow-hidden rounded-xl p-3">
        <div class="absolute inset-0" style="background-color: var(--surface)" />
        <div
          class="absolute inset-0"
          :style="{ backgroundColor: soft.baseCssValue || `var(${soft.baseVariable})` }"
        />
        <span class="relative text-base font-medium tracking-tight text-foreground"
          >{{ name }} Soft</span
        >
        <div class="relative">
          <ColorTooltip tooltip-class="block w-full" :content="soft.hoverTooltip">
            <div
              class="flex w-full cursor-pointer flex-col justify-center rounded-xl border border-black/12 px-4 py-2.5 dark:border-white/12"
              :style="{ backgroundColor: soft.hoverCssValue || `var(${soft.hoverVariable})` }"
              @click="onSoftHoverClick"
            >
              <span class="text-sm font-medium tracking-tight text-foreground">Hover</span>
              <span
                class="font-mono text-[10px] leading-tight text-foreground opacity-60 sm:hidden"
                >{{ softHoverToken }}</span
              >
            </div>
          </ColorTooltip>
        </div>
        <div class="relative">
          <ColorBlock
            :bg-variable="soft.foregroundVariable"
            :css-value="soft.foregroundCssValue"
            label="Foreground"
            :tooltip="soft.foregroundTooltip"
          />
        </div>
      </div>
    </div>
  </div>
</template>
