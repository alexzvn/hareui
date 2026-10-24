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
    @update:color="onUpdateColor"
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

<script setup lang="ts">
import type { Color } from 'reka-ui'
import {
  colorToString,
  ColorSliderRoot,
  ColorSliderThumb,
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

import type {
  ColorSliderEmits,
  ColorSliderProps,
  ColorSliderSlotProps,
  ColorSliderSlots,
} from './ColorSlider.types'
import { createChannelFormat, resolveColorSpace, toNativeSpace } from './colorSliderChannel'
import theme from './theme'

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

const setUncontrolledColor = (color: Color) => {
  if (pickerCtx) {
    pickerCtx.setColor(color)
    return
  }

  localValue.value = color
}

const onUpdateColor = (color: Color) => {
  if (!isControlled.value) setUncontrolledColor(color)

  emit('update:modelValue', color)
}

const validColorSpace = computed(() => resolveColorSpace(props.channel, props.colorSpace))
const effectiveColorSpace = computed(() => validColorSpace.value ?? 'hsl')

const nativeColor = computed(() => {
  const color = normalizeColor(boundValue.value)

  return toNativeSpace(color, { channel: props.channel, space: effectiveColorSpace.value })
})

const channelValue = computed(() => getChannelValue(nativeColor.value, props.channel))
const channelName = computed(() => getChannelName(props.channel))

const locale = useLocale()

// The formatter is rebuilt only when the locale or channel changes, not on every drag move.
const channelFormat = computed(() => createChannelFormat(props.channel, locale.value))

const valueText = computed(() => {
  const { formatter, divisor } = channelFormat.value

  return formatter.format(channelValue.value / divisor)
})

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
    const transparentStop = colorToString({ ...opaque, alpha: 0 } as Color, 'rgb')
    const opaqueStop = colorToString(opaque, 'rgb')

    return `linear-gradient(${direction}, ${transparentStop}, ${opaqueStop})`
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

const ui = useComponentUI('colorSlider', {
  theme,
  variantProps: () => ({
    orientation: props.orientation,
    hasLabel: hasLabel.value,
    hasOutput: hasOutput.value,
  }),
})

// RAC labels the slider's input with the visible label, or with the group's own `aria-label`/`aria-labelledby`
// (fallthrough on the root here); Reka's thumb only carries the channel name.
const attrs = useAttrs()

const thumbLabel = computed(() => {
  const ariaLabel = attrs['aria-label']

  return typeof ariaLabel === 'string' && ariaLabel ? ariaLabel : channelName.value
})

const thumbLabelledBy = computed(() =>
  hasLabel.value ? autoId : (attrs['aria-labelledby'] as string | undefined),
)

// reka-limitation: Reka's thumb exposes no `isDragging` state (RAC's `data-dragging`), so it is tracked
// here: a press anywhere on the slider starts a drag of its single thumb.
const isDragging = ref(false)

const onPointerDown = () => {
  if (!isDisabled.value) isDragging.value = true
}

const onPointerEnd = () => {
  isDragging.value = false
}
</script>
