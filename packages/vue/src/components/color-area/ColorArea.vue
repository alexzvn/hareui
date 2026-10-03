<script lang="ts">
import type { Color, ColorChannel, ColorSpace } from 'reka-ui'
import type { ComponentSlots } from '../../types/tv'
import theme from './theme'

type ColorArea = typeof theme

export interface ColorAreaProps {
  /**
   * The colour value (controlled), as a hex/CSS colour string or a `Color` object. Use with `v-model`.
   * When omitted and used inside a `ColorPicker`, falls back to its current colour.
   */
  modelValue?: string | Color
  /** The default colour when uncontrolled. */
  defaultValue?: string | Color
  /** The colour space the channels are read from. Defaults to the colour's own space. */
  colorSpace?: ColorSpace
  /**
   * Colour channel for the horizontal (x) axis. Defaults to the first channel of the colour space
   * that isn't `yChannel` (`hue` for HSL/HSB, `red` for RGB), as in React Aria.
   */
  xChannel?: ColorChannel
  /**
   * Colour channel for the vertical (y) axis. Defaults to the first channel of the colour space
   * that isn't the x channel (`saturation` for HSL/HSB, `green` for RGB), as in React Aria.
   */
  yChannel?: ColorChannel
  /** Whether the colour area is disabled. */
  disabled?: boolean
  /** Whether to show the dot grid overlay for precision picking. */
  showDots?: boolean
  /** The name of the x channel's hidden input, for form submission. */
  xName?: string
  /** The name of the y channel's hidden input, for form submission. */
  yName?: string
  /** Additional classes merged into the root element. */
  class?: any
  /** Per-slot class overrides. */
  ui?: ComponentSlots<ColorArea>
}

export interface ColorAreaEmits {
  /** Emitted on every colour change, mirroring HeroUI's `onChange` (fired while dragging/typing). */
  'change': [value: Color]
  /** Emitted when the user stops interacting (pointer up / key up), mirroring HeroUI's `onChangeEnd`. */
  'changeEnd': [value: Color]
}
</script>

<script setup lang="ts">
import { ColorAreaArea, ColorAreaRoot, ColorAreaThumb, colorToString, normalizeColor } from 'reka-ui'
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useComponentUI } from '../../composables/useComponentUI'
import { useColorPickerContext } from '../color-picker/context'

const CHANNELS: Record<ColorSpace, ColorChannel[]> = {
  rgb: ['red', 'green', 'blue'],
  hsl: ['hue', 'saturation', 'lightness'],
  hsb: ['hue', 'saturation', 'brightness'],
}
const FIELD: Record<string, string> = { hue: 'h', saturation: 's', lightness: 'l', brightness: 'b', red: 'r', green: 'g', blue: 'b' }
function toSpace(color: Color, to: ColorSpace): Color {
  return color.space === to ? color : normalizeColor(colorToString(color, to))
}

const props = defineProps<ColorAreaProps>()
const emit = defineEmits<ColorAreaEmits>()
const modelValue = defineModel<string | Color | undefined>()

const ctx = useColorPickerContext()
const usesContext = computed(() => modelValue.value === undefined && !!ctx)

// Controlled when a `v-model` is given, or implicitly via an enclosing `ColorPicker`.
const rootModelValue = computed<string | Color | undefined>(() => {
  if (modelValue.value !== undefined)
    return modelValue.value
  if (usesContext.value)
    return ctx!.color.value
  return undefined
})

// Tracked locally so the thumb can show the full current colour (Reka's `ColorAreaThumb`
// doesn't expose it, unlike React Aria's `ColorThumb`, whose `defaultStyle.backgroundColor` HeroUI reads).
const currentColor = ref<Color>(normalizeColor(rootModelValue.value ?? props.defaultValue ?? '#ff0000'))
watch(rootModelValue, (value) => {
  if (value !== undefined)
    currentColor.value = normalizeColor(value)
})
const space = computed<ColorSpace>(() => props.colorSpace ?? currentColor.value.space as ColorSpace)
const channels = computed(() => CHANNELS[space.value])
const axes = computed(() => {
  const x = props.xChannel ?? channels.value.find(c => c !== props.yChannel)!
  const y = props.yChannel ?? channels.value.find(c => c !== x)!
  const z = channels.value.find(c => c !== x && c !== y)!
  return { x, y, z }
})

// React Aria's `useColorAreaGradient`, which Reka's `getAreaBackgroundStyle` doesn't match.
const areaStyle = computed(() => {
  const { x, y, z } = axes.value
  const color = toSpace(currentColor.value, space.value) as unknown as Record<string, number>
  const zValue = color[FIELD[z]]
  if (space.value === 'rgb') {
    const channel = (name: ColorChannel, value: number) => `rgb(${['red', 'green', 'blue'].map(c => c === name ? value : 0).join(', ')})`
    return {
      background: [
        `linear-gradient(to right, ${channel(x, 0)}, ${channel(x, 255)})`,
        `linear-gradient(to top, ${channel(y, 0)}, ${channel(y, 255)})`,
        channel(z, zValue),
      ].join(','),
      backgroundBlendMode: 'screen',
    }
  }
  const hsl = space.value === 'hsl'
  const base: Record<string, number> = hsl ? { h: 0, s: 100, l: 50 } : { h: 0, s: 100, b: 100 }
  base[FIELD[z]] = zValue
  const css = (v: Record<string, number>) => hsl
    ? `hsl(${v.h}, ${v.s}%, ${v.l}%)`
    : colorToString({ space: 'hsb', h: v.h, s: v.s, b: v.b, alpha: 1 } as Color, 'rgb')
  const stops: Record<string, string> = {
    hue: [0, 60, 120, 180, 240, 300, 360].map(h => css({ ...base, h })).join(', '),
    saturation: `${css({ ...base, s: 0 })}, transparent`,
    lightness: 'black, transparent, white',
    brightness: 'black, transparent',
  }
  const layers = channels.value
    .filter(c => c !== z)
    .map(c => `linear-gradient(to ${c === x ? 'right' : 'top'}, ${stops[c]})`)
    .reverse()
  if (z === 'hue')
    layers.push(css(base))
  return { background: layers.join(', ') }
})
const thumbColor = computed(() => colorToString(currentColor.value, 'rgb'))

function onUpdateColor(color: Color) {
  // Inside a ColorPicker the context owns the colour; writing the local model would detach from it.
  currentColor.value = color
  if (usesContext.value)
    ctx!.setColor(color)
  else
    modelValue.value = color
  // Reka never fires its own `change`; every committed colour update is a change.
  emit('change', color)
}
function onChangeEnd() {
  emit('changeEnd', currentColor.value)
}
// Reka only commits on pointer-up; React Aria also ends a change when a keyboard step ends.
const commitKeys = new Set(['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'PageUp', 'PageDown', 'Home', 'End'])
function onKeyup(event: KeyboardEvent) {
  if (commitKeys.has(event.key))
    onChangeEnd()
}

// Reka's `ColorAreaArea`/`ColorAreaThumb` don't expose a `data-dragging` attribute (reka-limitation:
// Reka tracks `isDragging` privately inside `ColorAreaArea`), so it's tracked locally for the thumb's
// enlarged drag size, matching HeroUI's `[data-dragging="true"]` styling.
const isDragging = ref(false)
// Keyboard-modality focus ring, as RAC's `useFocusRing`: Reka focuses the thumb on a pointer press as well.
const focusVisible = ref(false)
let pointerActive = false
function onPointerDownCapture() {
  pointerActive = true
  focusVisible.value = false
  if (!props.disabled)
    isDragging.value = true
}
function onPointerUp() {
  isDragging.value = false
  pointerActive = false
}
function onThumbFocus() {
  focusVisible.value = !pointerActive
}
function onThumbKeydown() {
  pointerActive = false
  focusVisible.value = true
}
onMounted(() => window.addEventListener('pointerup', onPointerUp))
onBeforeUnmount(() => window.removeEventListener('pointerup', onPointerUp))

const ui = useComponentUI('colorArea', theme, () => ({
  showDots: props.showDots,
}))
</script>

<template>
  <!-- Reka's root is a wrapper <div> (RAC's root is the area itself); `contents` keeps it out of layout so the
       area's `w-full max-w-56` sizes against the parent, not a shrink-to-fit wrapper that collapses it to 0px. -->
  <ColorAreaRoot
    class="contents"
    :model-value="rootModelValue"
    :default-value="defaultValue ?? '#ff0000'"
    :color-space="space"
    :x-channel="axes.x"
    :y-channel="axes.y"
    :disabled="disabled"
    :x-name="xName"
    :y-name="yName"
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
          data-slot="color-area-thumb"
          :style="{ '--color-area-thumb-color': thumbColor, 'backgroundColor': thumbColor }"
          :data-dragging="isDragging ? 'true' : undefined"
          :data-focus-visible="focusVisible ? 'true' : undefined"
          @focus="onThumbFocus"
          @keydown="onThumbKeydown"
          @blur="focusVisible = false"
          :class="ui.thumb({ class: props.ui?.thumb })"
        />
      </ColorAreaArea>
    </template>
  </ColorAreaRoot>
</template>
