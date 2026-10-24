<template>
  <div :data-theme="theme">
    <div class="flex flex-col gap-2">
      <ThemeChip :theme="theme === 'light' ? 'Light' : 'Dark'" />
      <div class="flex flex-col gap-2 sm:flex-row">
        <div
          class="flex flex-1 flex-col gap-1.5 rounded-xl border border-black/12 p-3"
          :style="{ backgroundColor: `var(${colors.bg})` }"
        >
          <ColorTooltip :content="colors.bgTooltip">
            <span class="cursor-default text-base font-medium tracking-tight" :style="bgStyle"
              >Bg</span
            >
          </ColorTooltip>
          <ColorBlock
            has-border
            :bg-variable="colors.bg"
            :css-value="colors.bgHover"
            label="Hover"
            :tooltip="colors.bgHoverTooltip"
          />
          <ColorBlock
            has-border
            :bg-variable="colors.bg"
            label="Focus"
            :tooltip="colors.bgFocusTooltip"
          />
        </div>
        <div class="flex min-w-0 flex-row gap-2 sm:w-40 sm:flex-col">
          <ColorTooltip tooltip-class="min-w-0 flex-1" :content="colors.placeholderTooltip">
            <div
              class="flex h-full cursor-pointer items-center rounded-xl border border-border px-4 py-3"
              :style="{ backgroundColor: `var(${colors.placeholder})` }"
              @click="onPlaceholderClick"
            >
              <span class="text-sm font-medium tracking-tight" :style="placeholderStyle"
                >Placeholder</span
              >
            </div>
          </ColorTooltip>
          <ColorTooltip tooltip-class="min-w-0 flex-1" :content="colors.foregroundTooltip">
            <div
              class="flex h-full cursor-pointer items-center rounded-xl px-4 py-3"
              :style="{ backgroundColor: `var(${colors.foreground})` }"
              @click="onForegroundClick"
            >
              <span class="text-sm font-medium tracking-tight" :style="foregroundStyle"
                >Foreground</span
              >
            </div>
          </ColorTooltip>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import { contrastStyle, copyColorValue } from '../../composables/useColorCopy'
import ColorBlock from './ColorBlock.vue'
import ColorTooltip from './ColorTooltip.vue'
import ThemeChip from './ThemeChip.vue'

export interface FormFieldColors {
  bg: string
  bgTooltip?: string
  bgHover: string
  bgHoverTooltip?: string
  bgFocusTooltip?: string
  placeholder: string
  placeholderTooltip?: string
  foreground: string
  foregroundTooltip?: string
}

const props = defineProps<{ colors: FormFieldColors; theme: 'light' | 'dark' }>()

const bgStyle = computed(() => contrastStyle(props.colors.bg))
const placeholderStyle = computed(() => contrastStyle(props.colors.placeholder))
const foregroundStyle = computed(() => contrastStyle(props.colors.foreground))

function onPlaceholderClick(event: MouseEvent) {
  void copyColorValue(event, props.colors.placeholder)
}
function onForegroundClick(event: MouseEvent) {
  void copyColorValue(event, props.colors.foreground)
}
</script>
