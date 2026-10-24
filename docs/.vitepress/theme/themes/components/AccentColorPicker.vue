<template>
  <Popover
    side="top"
    :class="cn('w-[248px] rounded-[20px]', popoverClassName)"
    :ui="{ dialog: 'flex flex-col gap-2 px-2 pt-4 pb-2' }"
  >
    <ControlsPopoverTrigger>
      <slot name="trigger" />
    </ControlsPopoverTrigger>
    <template #content>
      <slot :color="colorValue">
        <!-- Color Swatches Carousel -->
        <AccentColorSwatchesCarousel
          v-if="showSwatches"
          :color="colorValue"
          :initial-color-hex="initialColorHex"
          :swatches="swatches"
          @select="handleColorChange"
        />

        <!-- Color Area -->
        <ColorArea
          class="aspect-auto size-[232px] max-w-none border border-border shadow-none"
          color-space="hsl"
          :model-value="colorValue"
          :ui="{
            thumb:
              'size-6 rounded-full border-2 border-white [box-shadow:0_10px_15px_-3px_rgb(0_0_0/0.1),0_4px_6px_-4px_rgb(0_0_0/0.1)] [transition:none] data-[dragging=true]:size-6',
          }"
          x-channel="saturation"
          y-channel="lightness"
          @change="handleColorChange"
        />

        <!-- Hue Slider with Shuffle -->
        <div class="flex w-full items-center justify-between gap-2">
          <AccentColorSlider
            channel="hue"
            class="h-5 max-w-[184px] flex-1"
            color-space="hsl"
            :model-value="colorValue"
            @update:model-value="handleColorChange"
          />
          <Button
            v-if="showShuffle"
            icon-only
            class="size-8 min-w-8 shrink-0 rounded-full"
            size="sm"
            variant="tertiary"
            @click="handleShuffle"
          >
            <Icon icon="gravity-ui:shuffle" class="size-4" />
          </Button>
        </div>

        <!-- Alpha Slider -->
        <AccentColorSlider
          v-if="showAlpha"
          channel="alpha"
          :model-value="colorValue"
          @update:model-value="handleColorChange"
        />

        <!-- Color Field with Color Space Selector -->
        <TextField v-if="showColorField" aria-labelledby="Accent color" :invalid="inputError">
          <InputGroup
            full-width
            class="rounded-xl"
            variant="secondary"
            :model-value="displayedInputValue"
            :ui="{ input: 'w-full flex-1 px-4 text-sm', suffix: 'border-s border-separator px-0' }"
            @update:model-value="handleInputChange"
            @focusin="handleInputFocus"
            @focusout="handleInputBlur"
            @keydown="handleInputKeyDown"
          >
            <template #suffix>
              <Select
                aria-label="Color format"
                :items="FORMAT_ITEMS"
                :model-value="currentColorFormat"
                :ui="{ trigger: 'h-full min-w-22 rounded-none border-none bg-transparent px-3' }"
                @update:model-value="onFormatChange"
              />
            </template>
          </InputGroup>
        </TextField>
      </slot>
    </template>
  </Popover>
</template>

<script setup lang="ts">
import { Button, ColorArea, InputGroup, Popover, Select, TextField } from '@hareui/vue'
import { Icon } from '@iconify/vue'
// Port of the HeroUI docs' own `components/color-picker/color-picker.tsx` (the popover with swatch carousel,
// color area, hue slider + shuffle, and color field with format select), composed from HareUI parts.
import type { Color } from 'reka-ui'
import { computed, ref } from 'vue'

import AccentColorSlider from './AccentColorSlider.vue'
import AccentColorSwatchesCarousel from './AccentColorSwatchesCarousel.vue'
import type { ColorFormat } from './accentColorUtils'
import {
  DEFAULT_COLOR,
  defaultSwatches,
  detectColorFormat,
  formatColor,
  randomColor,
  safeParseColor,
  validateColorInput,
} from './accentColorUtils'
import { cn } from './controlsCn'
import ControlsPopoverTrigger from './ControlsPopoverTrigger.vue'

const props = withDefaults(
  defineProps<{
    /** The color, as a CSS color string (controlled) */
    value?: string
    /** Show alpha slider */
    showAlpha?: boolean
    /** Show hex/color field */
    showColorField?: boolean
    /** Show color swatches */
    showSwatches?: boolean
    /** Custom swatches array */
    swatches?: string[]
    /** Show shuffle/random button */
    showShuffle?: boolean
    /** Class name for popover content */
    popoverClassName?: string
  }>(),
  {
    value: DEFAULT_COLOR,
    showAlpha: false,
    showColorField: true,
    showSwatches: true,
    swatches: () => defaultSwatches,
    showShuffle: true,
  },
)

const emit = defineEmits<{ change: [color: Color] }>()

const FORMAT_ITEMS = [
  { value: 'hex', label: 'HEX', textValue: 'HEX' },
  { value: 'hsl', label: 'HSL', textValue: 'HSL' },
  { value: 'rgb', label: 'RGB', textValue: 'RGB' },
  { value: 'hsb', label: 'HSB', textValue: 'HSB' },
  { value: 'oklch', label: 'OKLCH', textValue: 'OKLCH' },
]

const currentColorFormat = ref<ColorFormat>('hex')
const editingValue = ref<string | null>(null)
const inputError = ref(false)

const colorValue = computed(() => safeParseColor(props.value))
const initialColorHex = computed(() => props.value.toLowerCase())

const handleColorChange = (newColor: Color) => {
  emit('change', newColor)
}

// Compute the displayed input value
const displayedInputValue = computed(
  () => editingValue.value ?? formatColor(colorValue.value, currentColorFormat.value),
)

// Handle input change - validate on every change
const handleInputChange = (newValue: string | number | undefined) => {
  const value = String(newValue ?? '')

  editingValue.value = value

  // Auto-detect and switch color format based on input
  const detectedFormat = detectColorFormat(value)
  const colorFormat = detectedFormat ?? currentColorFormat.value

  currentColorFormat.value = colorFormat
  const validatedColor = validateColorInput(value, colorFormat)

  if (validatedColor) {
    handleColorChange(validatedColor)
    inputError.value = false
  } else {
    inputError.value = true
  }
}

const isInput = (event: Event) => (event.target as HTMLElement).matches('input')

// On blur, reset to the current valid color if there was an error
const handleInputBlur = (event: FocusEvent) => {
  if (!isInput(event)) return

  if (inputError.value) {
    editingValue.value = null
    inputError.value = false
  } else {
    editingValue.value = null
  }
}

const handleInputKeyDown = (event: KeyboardEvent) => {
  if (!isInput(event)) return

  if (event.key === 'Escape') {
    editingValue.value = null
    inputError.value = false
    ;(event.target as HTMLInputElement).blur()
  }
}

const handleInputFocus = (event: FocusEvent) => {
  if (!isInput(event)) return
  editingValue.value = formatColor(colorValue.value, currentColorFormat.value)
}

const handleShuffle = () => {
  handleColorChange(randomColor())
}

const onFormatChange = (key: unknown) => {
  if (key) {
    currentColorFormat.value = key as ColorFormat
  }
}
</script>
