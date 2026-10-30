<template>
  <div class="flex flex-1 flex-col gap-2" :data-theme="theme.toLowerCase()">
    <ColorHeader :bg-variable="base.variable" :name="name" :theme="theme" :tooltip="base.tooltip" />
    <div class="flex gap-2" :class="soft ? 'flex-col sm:flex-row' : 'flex-col'">
      <div
        class="flex flex-1 flex-col gap-1.5 rounded-xl p-3"
        :style="{ backgroundColor: `var(${base.variable})` }"
      >
        <span class="text-base font-medium tracking-tight" :style="baseStyle">{{ name }}</span>
        <ColorBlock
          :bg-variable="hover.variable"
          :css-value="hover.cssValue"
          label="Hover"
          :tooltip="hover.tooltip"
        />
        <ColorBlock
          :bg-variable="foreground.variable"
          label="Foreground"
          :tooltip="foreground.tooltip"
        />
      </div>
      <div v-if="soft" class="relative flex flex-1 flex-col gap-1.5 overflow-hidden rounded-xl p-3">
        <div class="absolute inset-0" style="background-color: var(--surface)" />
        <div
          class="absolute inset-0"
          :style="{ backgroundColor: soft.base.cssValue || `var(${soft.base.variable})` }"
        />
        <span class="relative text-base font-medium tracking-tight text-foreground"
          >{{ name }} Soft</span
        >
        <div class="relative">
          <ColorTooltip tooltip-class="block w-full" :content="soft.hover.tooltip">
            <div
              class="flex w-full cursor-pointer flex-col justify-center rounded-xl border border-black/12 px-4 py-2.5 dark:border-white/12"
              :style="{ backgroundColor: soft.hover.cssValue || `var(${soft.hover.variable})` }"
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
            :bg-variable="soft.foreground.variable"
            :css-value="soft.foreground.cssValue"
            label="Foreground"
            :tooltip="soft.foreground.tooltip"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import { contrastStyle, copyColorValue, getTokenName } from '../../composables/useColorCopy'
import ColorBlock from './ColorBlock.vue'
import ColorHeader from './ColorHeader.vue'
import ColorTooltip from './ColorTooltip.vue'

/** One colour token: its CSS variable, an optional literal CSS value to paint instead, and its tooltip. */
type ColorToken = {
  variable: string
  cssValue?: string
  tooltip?: string
}

/** The base, hover and foreground tokens of a colour. */
export type ColorTokenSet = {
  base: ColorToken
  hover: ColorToken
  foreground: ColorToken
}

const props = defineProps<
  ColorTokenSet & {
    theme: 'Light' | 'Dark'
    name: string
    soft?: ColorTokenSet
  }
>()

const baseStyle = computed(() => contrastStyle(props.base.variable))

const softHoverToken = computed(() =>
  props.soft ? getTokenName(props.soft.hover.tooltip, props.soft.hover.variable) : '',
)

const onSoftHoverClick = (event: MouseEvent) => {
  if (!props.soft) return
  void copyColorValue(event, props.soft.hover.cssValue || props.soft.hover.variable)
}
</script>
