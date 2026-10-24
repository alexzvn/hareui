import type { Color, ColorChannel, ColorSpace } from 'reka-ui'
import { convertToHsb, convertToHsl, convertToRgb } from 'reka-ui'

import { warn } from '@/utils/warn'

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

/** Channels whose value text is a percentage. */
const PERCENT_CHANNELS = new Set<ColorChannel>(['saturation', 'lightness', 'brightness', 'alpha'])

/**
 * Validates and corrects the `colorSpace` prop for the given `channel`, exactly like HeroUI's
 * React ColorSlider: an incompatible combination (e.g. `channel="red"` with `colorSpace="hsl"`)
 * is auto-corrected with a dev warning instead of producing a broken gradient.
 */
export const resolveColorSpace = (
  channel: ColorChannel,
  colorSpace?: ColorSpace,
): ColorSpace | undefined => {
  const required = CHANNEL_TO_REQUIRED_COLOR_SPACE[channel]
  if (required && colorSpace && colorSpace !== required) {
    warn(
      `ColorSlider: invalid combination: channel="${channel}" requires colorSpace="${required}", but received colorSpace="${colorSpace}". Auto-correcting to "${required}".`,
    )

    return required
  }

  if (HSL_HSB_ONLY_CHANNELS.has(channel) && colorSpace === 'rgb') {
    warn(
      `ColorSlider: invalid combination: channel="${channel}" is not available in RGB color space. Use colorSpace="hsl" or colorSpace="hsb" instead. Auto-correcting to "hsl".`,
    )

    return 'hsl'
  }

  return colorSpace
}

type NativeSpaceConverter = (color: Color, space: ColorSpace) => Color

const NATIVE_SPACE_CONVERTERS: Partial<Record<ColorChannel, NativeSpaceConverter>> = {
  hue: convertToHsl,
  lightness: convertToHsl,
  saturation: (color, space) => (space === 'hsb' ? convertToHsb(color) : convertToHsl(color)),
  brightness: convertToHsb,
  red: convertToRgb,
  green: convertToRgb,
  blue: convertToRgb,
}

/**
 * Mirrors Reka's internal `ColorSliderRoot` channel->space conversion, so the externally
 * computed channel value / track gradient / edge colors stay consistent with what the slider
 * itself is dragging (in particular `saturation`, which is ambiguous between HSL and HSB).
 */
export const toNativeSpace = (
  color: Color,
  { channel, space }: { channel: ColorChannel; space: ColorSpace },
): Color => {
  const convert = NATIVE_SPACE_CONVERTERS[channel]

  return convert ? convert(color, space) : color
}

/** A channel value formatter, plus the divisor applied to the raw value before formatting. */
export type ChannelFormat = {
  formatter: Intl.NumberFormat
  divisor: number
}

/**
 * Mirrors RAC's `formatChannelValue`: hue in degrees, percentages for saturation / lightness /
 * brightness / alpha, plain numbers for red / green / blue.
 */
export const createChannelFormat = (channel: ColorChannel, locale: string): ChannelFormat => {
  if (channel === 'hue') {
    const formatter = new Intl.NumberFormat(locale, {
      style: 'unit',
      unit: 'degree',
      unitDisplay: 'narrow',
      maximumFractionDigits: 0,
    })

    return { formatter, divisor: 1 }
  }

  if (PERCENT_CHANNELS.has(channel)) {
    return { formatter: new Intl.NumberFormat(locale, { style: 'percent' }), divisor: 100 }
  }

  return { formatter: new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }), divisor: 1 }
}
