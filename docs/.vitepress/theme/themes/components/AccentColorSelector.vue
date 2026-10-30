<template>
  <div class="flex flex-col gap-1">
    <LockableLabel
      label="Accent"
      tooltip="Main color used for branding and highlights"
      variable="hue"
    />
    <div class="flex flex-row items-center gap-2 overflow-visible">
      <AccentColorSlider
        channel="hue"
        class="h-6 w-[128px] xl:w-[160px]"
        :model-value="value"
        :thumb-background="oklchColor"
        :track-background="trackBackground"
        @update:model-value="onHueSliderChange"
      />
      <AccentColorPicker show-swatches :show-alpha="false" :value="value" @change="onColorChange">
        <template #trigger>
          <Button
            icon-only
            class="group relative flex size-6 min-h-0 min-w-0 items-center overflow-visible rounded-full p-0"
            variant="ghost"
          >
            <!-- Pastel gradient to indicate custom color picker -->
            <div
              class="z-0 size-full rounded-full"
              style="
                background: conic-gradient(
                  from 0deg,
                  #f8aecf,
                  #fbc7a3,
                  #f7e8a4,
                  #d7f5b0,
                  #b5f3d2,
                  #a3eaf7,
                  #a8c9ff,
                  #c9b8ff,
                  #f8aecf
                );
              "
            />
            <div
              class="absolute inset-0 z-10 rounded-full border-2 border-white/50"
              style="background: transparent"
            />
          </Button>
        </template>
      </AccentColorPicker>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Button } from '@hareui/vue'
import { formatHsl } from 'culori'
// Port of HeroUI docs `themes/components/accent-color-selector.tsx`.
import type { Color } from 'reka-ui'
import { computed } from 'vue'

import { useVariablesState } from '../composables/variables'
import AccentColorPicker from './AccentColorPicker.vue'
import AccentColorSlider from './AccentColorSlider.vue'
import { formatColor, getHueFromColor, getValuesFromOklch } from './accentColorUtils'
import LockableLabel from './LockableLabel.vue'

const [variables, setVariables] = useVariablesState()
const oklchColor = computed(
  () => `oklch(${variables.value.lightness} ${variables.value.chroma} ${variables.value.hue})`,
)

const trackBackground = computed(() => {
  const { chroma, lightness } = variables.value

  // Build gradient with the current chroma level for accurate representation
  const gradientStops = [24, 48, 72, 96, 120, 144, 168, 192, 216, 240, 264, 288, 312, 336, 360, 24]
    .map((h) => `oklch(${lightness} ${chroma} ${h})`)
    .join(', ')

  return `linear-gradient(to right, ${gradientStops})`
})

const value = computed(() => formatHsl(oklchColor.value) ?? 'hsl(253.67, 100%, 61.99%)')

const onHueSliderChange = (color: Color) => {
  setVariables({
    ...variables.value,
    hue: getHueFromColor(color),
  })
}

const onColorChange = (color: Color) => {
  const hsl = formatColor(color, 'hsl')
  const { chroma, hue, lightness } = getValuesFromOklch(hsl)

  setVariables({
    ...variables.value,
    chroma,
    hue,
    lightness,
  })
}
</script>
