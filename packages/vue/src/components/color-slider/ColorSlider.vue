<template>
  <ColorSliderRoot
    :model-value="boundValue"
    :channel="channel"
    :color-space="validColorSpace"
    :orientation="orientation"
    thumb-alignment="overflow"
    :disabled="isDisabled"
    :step="step"
    data-slot="color-slider"
    role="group"
    :aria-labelledby="hasLabel ? autoId : undefined"
    :class="ui.base({ class: [props.ui?.base, props.class] })"
    @update:color="handleUpdate"
    @change="(value: string) => emit('change', value)"
    @change-end="(value: string) => emit('changeEnd', value)"
    @pointerdown="onPointerDown"
    @pointerup="onPointerEnd"
    @pointercancel="onPointerEnd"
    @gotpointercapture="captureOnDraggedThumb"
  >
    <!-- Split so Label's slot is only forwarded (and force-updated) when a `label` slot is passed. -->
    <Label
      v-if="hasLabel && $slots.label"
      :id="autoId"
      :disabled="isDisabled"
      :class="ui.label({ class: props.ui?.label })"
    >
      <slot name="label">
        {{ label }}
      </slot>
    </Label>
    <Label
      v-else-if="hasLabel"
      :id="autoId"
      :disabled="isDisabled"
      :class="ui.label({ class: props.ui?.label })"
    >
      {{ label }}
    </Label>
    <span
      v-if="hasOutput"
      data-slot="color-slider-output"
      :class="ui.output({ class: props.ui?.output })"
    >
      <slot name="output" v-bind="slotProps">{{ slotProps.valueText }}</slot>
    </span>
    <SliderTrack
      data-slot="color-slider-track"
      :style="trackStyle"
      :class="ui.track({ class: props.ui?.track })"
    >
      <ColorSliderThumb
        ref="thumbRef"
        data-slot="color-slider-thumb"
        :aria-label="thumbLabel"
        :aria-labelledby="thumbLabelledBy"
        :aria-valuetext="valueText"
        :data-dragging="isDragging ? 'true' : undefined"
        :style="thumbStyle"
        :class="ui.thumb({ class: props.ui?.thumb })"
      >
        <slot name="thumb" v-bind="slotProps" />
      </ColorSliderThumb>
    </SliderTrack>
    <!-- RAC submits the channel value from its `<input type="range">`; Reka's hidden input would submit the hex. -->
    <input v-if="name" type="hidden" :name="name" :value="formValue" :disabled="isDisabled" />
  </ColorSliderRoot>
</template>

<script lang="ts">
import type { Color, ColorChannel, ColorSpace } from 'reka-ui'

import type { ComponentSlots } from '@/types/tv'

import theme from './theme'

type ColorSlider = typeof theme

/** Channels that require a specific color space (HeroUI auto-corrects a conflicting `colorSpace`). */
const CHANNEL_TO_REQUIRED_COLOR_SPACE: Partial<Record<ColorChannel, ColorSpace>> = {
  red: 'rgb',
  green: 'rgb',
  blue: 'rgb',
  lightness: 'hsl',
  brightness: 'hsb',
}

/** Channels that only exist in HSL/HSB (not RGB). */
const HSL_HSB_ONLY_CHANNELS = new Set<ColorChannel>(['hue', 'saturation'])

function warnInDev(message: string) {
  if (import.meta.env?.DEV) console.warn(message)
}

/**
 * Validates and corrects the `colorSpace` prop for the given `channel`, exactly like HeroUI's
 * React ColorSlider: an incompatible combination (e.g. `channel="red"` with `colorSpace="hsl"`)
 * is auto-corrected with a dev warning instead of producing a broken gradient.
 */
function getValidColorSpace(
  channel: ColorChannel,
  colorSpace?: ColorSpace,
): ColorSpace | undefined {
  const required = CHANNEL_TO_REQUIRED_COLOR_SPACE[channel]
  if (required && colorSpace && colorSpace !== required) {
    warnInDev(
      `[HareUI ColorSlider] Invalid combination: channel="${channel}" requires colorSpace="${required}", but received colorSpace="${colorSpace}". Auto-correcting to "${required}".`,
    )
    return required
  }
  if (HSL_HSB_ONLY_CHANNELS.has(channel) && colorSpace === 'rgb') {
    warnInDev(
      `[HareUI ColorSlider] Invalid combination: channel="${channel}" is not available in RGB color space. Use colorSpace="hsl" or colorSpace="hsb" instead. Auto-correcting to "hsl".`,
    )
    return 'hsl'
  }
  return colorSpace
}

export type ColorSliderProps = {
  /** The color channel that this slider manipulates. */
  channel: ColorChannel
  /**
   * The color space the channel/gradient is resolved in. Auto-corrected with a dev warning when
   * it conflicts with `channel` (e.g. `channel="red"` forces `"rgb"`).
   * @defaultValue 'hsl'
   */
  colorSpace?: ColorSpace
  /**
   * The color value (controlled). Falls back to the enclosing `ColorPicker`'s color when omitted
   * and one is present.
   */
  modelValue?: string | Color
  /**
   * The default color (uncontrolled), used when there's no `v-model` and no enclosing `ColorPicker`.
   * @defaultValue '#000000'
   */
  defaultValue?: string | Color
  /**
   * The orientation of the slider.
   * @defaultValue 'horizontal'
   */
  orientation?: 'horizontal' | 'vertical'
  /**
   * Whether the slider is disabled.
   * @defaultValue false
   */
  disabled?: boolean
  /** Custom step value for increment/decrement. Defaults to the channel's natural step. */
  step?: number
  /** Visible label, rendered above (horizontal) or below (vertical) the track. */
  label?: string
  /**
   * Whether to render the formatted value output.
   * @defaultValue true when there's a label
   */
  showOutput?: boolean
  /** The name of the hidden input, used for form submission. Submits the channel value (e.g. `200` for hue, `0.5` for alpha), as React Aria does. */
  name?: string
  /** Additional classes merged into the root element. */
  class?: any
  /** Per-slot class overrides. */
  ui?: ComponentSlots<ColorSlider>
}

export type ColorSliderSlotProps = {
  /** The display name of the current channel (e.g. `'Hue'`). */
  channelName: string
  /** The current numeric value of the channel. */
  channelValue: number
  /** The formatted value text, as rendered in the output. */
  valueText: string
}

export type ColorSliderSlots = {
  /** Label content. Replaces the `label` prop. */
  label?: () => any
  /** Output content. Replaces the formatted value text. */
  output?: (props: ColorSliderSlotProps) => any
  /** Thumb content. */
  thumb?: (props: ColorSliderSlotProps) => any
}

export type ColorSliderEmits = {
  /** Emitted on every value change with the new color, in the channel's native color space. */
  'update:modelValue': [value: Color]
  /** Emitted on every value change while dragging/keying, with the new color as a hex string. */
  change: [value: string]
  /** Emitted when a drag/key interaction ends, with the resulting color as a hex string. */
  changeEnd: [value: string]
}
</script>

<script setup lang="ts">
import {
  colorToString,
  ColorSliderRoot,
  ColorSliderThumb,
  convertToHsb,
  convertToHsl,
  convertToRgb,
  getChannelName,
  getChannelRange,
  getChannelValue,
  getSliderBackgroundStyle,
  normalizeColor,
  setChannelValue,
  SliderTrack,
  useId,
  useLocale,
} from 'reka-ui'
import { computed, ref, useAttrs, watch } from 'vue'

import { useColorPickerContext } from '@/components/color-picker/context'
import { useFieldsetDisabled } from '@/components/fieldset/context'
import Label from '@/components/label/Label.vue'
import { captureOnDraggedThumb } from '@/composables/thumbPointerCapture'
import { useComponentUI } from '@/composables/useComponentUI'
import { refElement } from '@/composables/useFirstChild'

const props = withDefaults(defineProps<ColorSliderProps>(), {
  orientation: 'horizontal',
  disabled: false,
  defaultValue: '#000000',
  showOutput: undefined,
})
const isDisabled = useFieldsetDisabled(() => props.disabled)
const emit = defineEmits<ColorSliderEmits>()
const slots = defineSlots<ColorSliderSlots>()

const pickerCtx = useColorPickerContext()
// Uncontrolled-and-no-ColorPicker state: tracked locally, as NumberField tracks `formValue`.
const localValue = ref<string | Color>(props.defaultValue ?? '#000000')
const isControlled = computed(() => props.modelValue !== undefined)
const boundValue = computed<string | Color>(() => {
  if (isControlled.value) return props.modelValue!
  if (pickerCtx) return pickerCtx.color.value
  return localValue.value
})

function handleUpdate(color: Color) {
  if (!isControlled.value) {
    if (pickerCtx) pickerCtx.setColor(color)
    else localValue.value = color
  }
  emit('update:modelValue', color)
}

const validColorSpace = computed(() => getValidColorSpace(props.channel, props.colorSpace))
const effectiveColorSpace = computed(() => validColorSpace.value ?? 'hsl')

/**
 * Mirrors Reka's internal `ColorSliderRoot` channel->space conversion, so the externally
 * computed channel value / track gradient / edge colors stay consistent with what the slider
 * itself is dragging (in particular `saturation`, which is ambiguous between HSL and HSB).
 */
function toNativeSpace(color: Color, channel: ColorChannel, space: ColorSpace): Color {
  switch (channel) {
    case 'hue':
    case 'lightness':
      return convertToHsl(color)
    case 'saturation':
      return space === 'hsb' ? convertToHsb(color) : convertToHsl(color)
    case 'brightness':
      return convertToHsb(color)
    case 'red':
    case 'green':
    case 'blue':
      return convertToRgb(color)
    default:
      return color
  }
}

const nativeColor = computed(() =>
  toNativeSpace(normalizeColor(boundValue.value), props.channel, effectiveColorSpace.value),
)
const channelValue = computed(() => getChannelValue(nativeColor.value, props.channel))
const channelName = computed(() => getChannelName(props.channel))

const locale = useLocale()
// Mirrors RAC's `formatChannelValue`: hue in degrees, percentages for saturation / lightness /
// brightness / alpha, plain numbers for red / green / blue. The formatter is rebuilt only when the
// locale or channel changes, not on every drag move.
const channelFormat = computed(() => {
  switch (props.channel) {
    case 'hue':
      return {
        formatter: new Intl.NumberFormat(locale.value, {
          style: 'unit',
          unit: 'degree',
          unitDisplay: 'narrow',
          maximumFractionDigits: 0,
        }),
        divisor: 1,
      }
    case 'saturation':
    case 'lightness':
    case 'brightness':
    case 'alpha':
      return { formatter: new Intl.NumberFormat(locale.value, { style: 'percent' }), divisor: 100 }
    default:
      return {
        formatter: new Intl.NumberFormat(locale.value, { maximumFractionDigits: 0 }),
        divisor: 1,
      }
  }
})
const valueText = computed(() =>
  channelFormat.value.formatter.format(channelValue.value / channelFormat.value.divisor),
)

// React Aria's alpha channel ranges 0..1, while Reka's runs 0..100. The submitted form value and the
// thumb's `aria-value*` use RAC's scale (the value text stays "50%" either way).
const formValue = computed(() =>
  String(props.channel === 'alpha' ? channelValue.value / 100 : channelValue.value),
)
// reka-limitation: `SliderThumbImpl` binds `aria-valuenow/min/max` after `$attrs`, so they can't be
// overridden by props; they're rewritten on the thumb element after each render instead.
const thumbRef = ref<{ $el?: Element } | null>(null)
watch(
  [channelValue, () => props.channel, thumbRef],
  () => {
    const el = refElement(thumbRef.value)
    if (props.channel !== 'alpha' || !el) return
    el.setAttribute('aria-valuenow', formValue.value)
    el.setAttribute('aria-valuemin', '0')
    el.setAttribute('aria-valuemax', '1')
  },
  { flush: 'post', immediate: true },
)

const slotProps = computed<ColorSliderSlotProps>(() => ({
  channelName: channelName.value,
  channelValue: channelValue.value,
  valueText: valueText.value,
}))

// RAC's `getDisplayColor`: the hue slider shows the fully saturated hue, alpha keeps its alpha, every
// other channel is shown opaque. The thumb swatch and the track edge caps are derived from it.
const displayColor = computed<Color>(() => {
  const native = nativeColor.value
  if (props.channel === 'hue') return { ...convertToHsl(native), s: 100, l: 50, alpha: 1 } as Color
  if (props.channel === 'alpha') return native
  return { ...native, alpha: 1 } as Color
})
const thumbPercent = computed(() => {
  const { min, max } = getChannelRange(props.channel)
  return ((channelValue.value - min) / (max - min)) * 100
})
// RAC positions the thumb with `translate(-50%, -50%)` and a plain percentage along the main axis (and
// `left`/`top: 50%` from the theme on the cross axis). Reka offsets the main axis by a thumb-size
// correction and, vertically, anchors to `bottom`; both are overridden here.
const thumbStyle = computed(() => ({
  '--reka-slider-thumb-transform': 'translate(-50%, -50%)',
  ...(props.orientation === 'vertical' ? { top: `${100 - thumbPercent.value}%` } : {}),
  ...(isDisabled.value ? {} : { backgroundColor: colorToString(displayColor.value, 'rgb') }),
}))

/**
 * reka-limitation: Reka's `getSliderBackgroundStyle`/`getSliderGradient` hardcode a
 * `to right` gradient direction regardless of orientation (unlike RAC, which flips it for
 * vertical sliders). A vertical slider would otherwise render a near-flat gradient across its
 * narrow width instead of varying along its height. Worked around here with a string
 * replacement rather than re-implementing the eight per-channel gradient formulas; see report.
 */
const trackMainGradient = computed(() => {
  const direction = props.orientation === 'vertical' ? 'to top' : 'to right'
  if (props.channel === 'alpha') {
    const opaque = { ...convertToRgb(nativeColor.value), alpha: 1 }
    return `linear-gradient(${direction}, ${colorToString({ ...opaque, alpha: 0 } as Color, 'rgb')}, ${colorToString(opaque, 'rgb')})`
  }
  const gradient = getSliderBackgroundStyle(
    nativeColor.value,
    props.channel,
    effectiveColorSpace.value,
  ).background
  return gradient.replace(/to right/g, direction)
})

const edgeColors = computed(() => {
  const range = getChannelRange(props.channel)
  const start = setChannelValue(displayColor.value, props.channel, range.min)
  const end = setChannelValue(displayColor.value, props.channel, range.max)
  return { start: colorToString(start, 'rgb'), end: colorToString(end, 'rgb') }
})

// HeroUI's exact alpha checkerboard (`repeating-conic-gradient(#efefef 0% 25%, #f7f7f7 0% 50%) 50% / 16px 16px`),
// painted beneath the channel gradient; invisible for opaque (non-alpha) channels.
const trackStyle = computed(() => ({
  background: `${trackMainGradient.value}, repeating-conic-gradient(#efefef 0% 25%, #f7f7f7 0% 50%) 50% / 16px 16px`,
  '--track-start-color': edgeColors.value.start,
  '--track-end-color': edgeColors.value.end,
}))

const autoId = useId(undefined, 'hareui-color-slider-label')
const hasLabel = computed(() => !!(props.label || slots.label))
const hasOutput = computed(() => props.showOutput ?? hasLabel.value)
const ui = useComponentUI('colorSlider', theme, () => ({
  orientation: props.orientation,
  hasLabel: hasLabel.value,
  hasOutput: hasOutput.value,
}))

// RAC labels the slider's input with the visible label, or with the group's own `aria-label`/`aria-labelledby`
// (fallthrough on the root here); Reka's thumb only carries the channel name.
const attrs = useAttrs()
const thumbLabel = computed(() =>
  typeof attrs['aria-label'] === 'string' && attrs['aria-label']
    ? attrs['aria-label']
    : channelName.value,
)
const thumbLabelledBy = computed(() =>
  hasLabel.value ? autoId : (attrs['aria-labelledby'] as string | undefined),
)

// reka-limitation: Reka's thumb exposes no `isDragging` state (RAC's `data-dragging`), so it is tracked
// here: a press anywhere on the slider starts a drag of its single thumb.
const isDragging = ref(false)
function onPointerDown() {
  if (!isDisabled.value) isDragging.value = true
}
function onPointerEnd() {
  isDragging.value = false
}
</script>
