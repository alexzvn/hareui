<template>
  <!-- Reka's root is a wrapper <div> (RAC's root is the area itself); `contents` keeps it out of layout so the
       area's `w-full max-w-56` sizes against the parent, not a shrink-to-fit wrapper that collapses it to 0px. -->
  <ColorAreaRoot
    class="contents"
    :model-value="rootValue"
    :default-value="rootDefault"
    :color-space="space"
    :x-channel="axes.x"
    :y-channel="axes.y"
    :disabled="isDisabled"
    :x-name="props.x?.name"
    :y-name="props.y?.name"
    @update:color="onUpdateColor"
    @change-end="onChangeEnd"
  >
    <template #default>
      <ColorAreaArea
        data-slot="color-area"
        :style="areaStyle"
        :class="ui.base({ class: [props.ui?.base, props.class] })"
        @pointerdown.capture="onPointerDownCapture"
        @keyup="onKeyup"
      >
        <ColorAreaThumb
          :id="thumbId"
          data-slot="color-area-thumb"
          :aria-label="thumbLabel"
          :aria-labelledby="thumbLabelledBy"
          :style="{ '--color-area-thumb-color': thumbColor, backgroundColor: thumbColor }"
          :data-dragging="isDragging ? 'true' : undefined"
          :data-focus-visible="isFocusVisible ? 'true' : undefined"
          @focus="onThumbFocus"
          @keydown="onThumbKeydown"
          @blur="isFocusVisible = false"
          :class="ui.thumb({ class: props.ui?.thumb })"
        />
      </ColorAreaArea>
    </template>
  </ColorAreaRoot>
</template>

<script setup lang="ts">
import type { Color, ColorChannel, ColorSpace } from 'reka-ui'
import {
  ColorAreaArea,
  ColorAreaRoot,
  ColorAreaThumb,
  colorToString,
  getChannelName,
  normalizeColor,
} from 'reka-ui'
import { computed, onBeforeUnmount, onMounted, ref, useAttrs, useId, watch } from 'vue'

import { useColorPickerContext } from '@/components/color-picker/context'
import { useFieldsetDisabled } from '@/components/fieldset/context'
import { useComponentUI } from '@/composables/useComponentUI'

import type { ColorAreaProps, ColorAreaEmits } from './ColorArea.types'
import theme from './theme'

const CHANNELS: Record<ColorSpace, ColorChannel[]> = {
  rgb: ['red', 'green', 'blue'],
  hsl: ['hue', 'saturation', 'lightness'],
  hsb: ['hue', 'saturation', 'brightness'],
}

const FIELD: Record<string, string> = {
  hue: 'h',
  saturation: 's',
  lightness: 'l',
  brightness: 'b',
  red: 'r',
  green: 'g',
  blue: 'b',
}

const toSpace = (color: Color, to: ColorSpace): Color => {
  return color.space === to ? color : normalizeColor(colorToString(color, to))
}

const props = defineProps<ColorAreaProps>()
const isDisabled = useFieldsetDisabled(() => props.disabled)
const emit = defineEmits<ColorAreaEmits>()
const modelValue = defineModel<string | Color | undefined>()

const ctx = useColorPickerContext()
const isContextControlled = computed(() => modelValue.value === undefined && !!ctx)

// Controlled when a `v-model` is given, or implicitly via an enclosing `ColorPicker`.
const rootModelValue = computed<string | Color | undefined>(() => {
  if (modelValue.value !== undefined) return modelValue.value
  if (isContextControlled.value) return ctx!.color.value

  return undefined
})

// Tracked locally so the thumb can show the full current colour (Reka's `ColorAreaThumb`
// doesn't expose it, unlike React Aria's `ColorThumb`, whose `defaultStyle.backgroundColor` HeroUI reads).
const currentColor = ref<Color>(
  normalizeColor(rootModelValue.value ?? props.defaultValue ?? '#ff0000'),
)

watch(rootModelValue, (value) => {
  if (value !== undefined) currentColor.value = normalizeColor(value)
})

const space = computed<ColorSpace>(
  () => props.colorSpace ?? (currentColor.value.space as ColorSpace),
)

const channels = computed(() => CHANNELS[space.value])

// Reka reads channels off the value as-is (a hex string is treated as HSL for `hsb`), so hand it a colour already in the area's space.
const rootValue = computed(() =>
  rootModelValue.value === undefined
    ? undefined
    : toSpace(normalizeColor(rootModelValue.value), space.value),
)

const rootDefault = computed(() =>
  toSpace(normalizeColor(props.defaultValue ?? '#ff0000'), space.value),
)

const axes = computed(() => {
  const x = props.x?.channel ?? channels.value.find((c) => c !== props.y?.channel)!
  const y = props.y?.channel ?? channels.value.find((c) => c !== x)!
  const z = channels.value.find((c) => c !== x && c !== y)!

  return { x, y, z }
})

// React Aria's `useColorAreaGradient`, which Reka's `getAreaBackgroundStyle` doesn't match.
const areaStyle = computed(() => {
  const { x, y, z } = axes.value
  const color = toSpace(currentColor.value, space.value) as unknown as Record<string, number>
  const zValue = color[FIELD[z]]
  if (space.value === 'rgb') {
    const channel = (name: ColorChannel, value: number) =>
      `rgb(${['red', 'green', 'blue'].map((c) => (c === name ? value : 0)).join(', ')})`

    return {
      background: [
        `linear-gradient(to right, ${channel(x, 0)}, ${channel(x, 255)})`,
        `linear-gradient(to top, ${channel(y, 0)}, ${channel(y, 255)})`,
        channel(z, zValue),
      ].join(','),
      backgroundBlendMode: 'screen',
    }
  }

  const isHsl = space.value === 'hsl'
  const base: Record<string, number> = isHsl ? { h: 0, s: 100, l: 50 } : { h: 0, s: 100, b: 100 }
  base[FIELD[z]] = zValue

  const css = (v: Record<string, number>) =>
    isHsl
      ? `hsl(${v.h}, ${v.s}%, ${v.l}%)`
      : colorToString({ space: 'hsb', h: v.h, s: v.s, b: v.b, alpha: 1 } as Color, 'rgb')

  const stops: Record<string, string> = {
    hue: [0, 60, 120, 180, 240, 300, 360].map((h) => css({ ...base, h })).join(', '),
    saturation: `${css({ ...base, s: 0 })}, transparent`,
    lightness: 'black, transparent, white',
    brightness: 'black, transparent',
  }

  const layers = channels.value
    .filter((c) => c !== z)
    .map((c) => `linear-gradient(to ${c === x ? 'right' : 'top'}, ${stops[c]})`)
    .reverse()

  if (z === 'hue') layers.push(css(base))

  return { background: layers.join(', ') }
})

const thumbColor = computed(() => colorToString(currentColor.value, 'rgb'))

// Inside a ColorPicker the context owns the colour; writing the local model would detach from it.
const writeColor = (color: Color) => {
  if (isContextControlled.value) {
    ctx!.setColor(color)

    return
  }

  modelValue.value = color
}

const onUpdateColor = (color: Color) => {
  currentColor.value = color
  writeColor(color)

  // Reka never fires its own `change`; every committed colour update is a change.
  emit('change', color)
}

const onChangeEnd = () => {
  emit('changeEnd', currentColor.value)
}

// Reka only commits on pointer-up; React Aria also ends a change when a keyboard step ends.
const commitKeys = new Set([
  'ArrowUp',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'PageUp',
  'PageDown',
  'Home',
  'End',
])

const onKeyup = (event: KeyboardEvent) => {
  if (commitKeys.has(event.key)) onChangeEnd()
}

// Reka's `ColorAreaArea`/`ColorAreaThumb` don't expose a `data-dragging` attribute (reka-limitation:
// Reka tracks `isDragging` privately inside `ColorAreaArea`), so it's tracked locally for the thumb's
// enlarged drag size, matching HeroUI's `[data-dragging="true"]` styling.
const isDragging = ref(false)

// Keyboard-modality focus ring, as RAC's `useFocusRing`: Reka focuses the thumb on a pointer press as well.
const isFocusVisible = ref(false)
let isPointerActive = false
const onPointerDownCapture = () => {
  isPointerActive = true
  isFocusVisible.value = false
  if (!isDisabled.value) isDragging.value = true
}

const onPointerUp = () => {
  isDragging.value = false
  isPointerActive = false
}

const onThumbFocus = () => {
  isFocusVisible.value = !isPointerActive
}

const onThumbKeydown = () => {
  isPointerActive = false
  isFocusVisible.value = true
}

onMounted(() => window.addEventListener('pointerup', onPointerUp))
onBeforeUnmount(() => window.removeEventListener('pointerup', onPointerUp))

const ui = useComponentUI('colorArea', {
  theme,
  variantProps: () => ({
    showDots: props.showDots,
  }),
})

// The group gets the consumer's `aria-label`/`aria-labelledby` (fallthrough); the focusable thumb carries it too, as
// React Aria's channel inputs are labelled "<label>, <channel>". Reka's thumb only names the channels.
const attrs = useAttrs()
const thumbId = useId()

const thumbLabel = computed(() => {
  const channels = `${getChannelName(axes.value.x)}, ${getChannelName(axes.value.y)}`
  const label = attrs['aria-label']

  return typeof label === 'string' && label ? `${label}, ${channels}` : channels
})

const thumbLabelledBy = computed(() => {
  const ids = attrs['aria-labelledby']
  return typeof ids === 'string' && ids ? `${ids} ${thumbId}` : undefined
})
</script>
