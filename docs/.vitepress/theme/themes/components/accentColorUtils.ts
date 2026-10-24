import { converter, formatCss, formatHsl, mapper, parse, round } from 'culori'
// Port of HeroUI docs `components/color-picker/{constants,types}.ts` and `utils/*`, on Reka's `Color`
// (`{ space: 'rgb' | 'hsl' | 'hsb', ..., alpha }`) instead of React Aria's `Color` class.
import type { Color } from 'reka-ui'
import { convertToHsb, convertToHsl, convertToRgb, normalizeColor } from 'reka-ui'

/* -------------------------------------------------------------------------------------------------
 * Default Values
 * -----------------------------------------------------------------------------------------------*/

export const DEFAULT_COLOR = '#006FEE'
export const DEFAULT_COLOR_HSL = 'hsl(253.67, 100%, 61.99%)'

export const SWATCHES_PER_PAGE = 8

export const defaultSwatches = [
  'hsla(338, 77%, 78%, 1)', // Pink
  'hsla(309, 23%, 55%, 1)', // Muted purple
  'hsla(355, 85%, 66%, 1)', // Coral/red
  'hsla(16, 100%, 67%, 1)', // Orange
  'hsla(47, 92%, 66%, 1)', // Yellow
  'hsla(152, 80%, 56%, 1)', // Green
  'hsla(197, 59%, 64%, 1)', // Blue
  'hsla(220, 13%, 18%, 1)', // Dark slate (backgrounds)
  'hsla(220, 70%, 50%, 1)', // Royal blue
  'hsla(210, 100%, 56%, 1)', // Bright blue
  'hsla(180, 100%, 25%, 1)', // Teal
  'hsla(170, 50%, 65%, 1)', // Seafoam
  'hsla(150, 60%, 75%, 1)', // Mint green
  'hsla(280, 60%, 60%, 1)', // Violet
  'hsla(270, 50%, 70%, 1)', // Lavender
  'hsla(350, 100%, 88%, 1)', // Blush
]

export type ColorFormat = 'hex' | 'hsl' | 'rgb' | 'hsb' | 'oklch'

/* -------------------------------------------------------------------------------------------------
 * Color helpers (React Aria `Color` behaviour on Reka's Color)
 * -----------------------------------------------------------------------------------------------*/

const toFixed2 = (value: number) => Math.round(value * 100) / 100
const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max)
const wrapHue = (hue: number) => ((hue % 360) + 360) % 360

/** React Aria clamps channels (and keeps two decimals) when it parses a color; Reka's `normalizeColor` does neither. */
const clampColor = (color: Color): Color => {
  const alpha = clamp(color.alpha, 0, 1)
  if (color.space === 'rgb')
    return {
      ...color,
      r: clamp(color.r, 0, 255),
      g: clamp(color.g, 0, 255),
      b: clamp(color.b, 0, 255),
      alpha,
    }

  if (color.space === 'hsl')
    return {
      ...color,
      h: toFixed2(wrapHue(color.h)),
      s: toFixed2(clamp(color.s, 0, 100)),
      l: toFixed2(clamp(color.l, 0, 100)),
      alpha,
    }

  return {
    ...color,
    h: toFixed2(wrapHue(color.h)),
    s: toFixed2(clamp(color.s, 0, 100)),
    b: toFixed2(clamp(color.b, 0, 100)),
    alpha,
  }
}

/** `parseColor` of React Aria: throws when the string is not a supported color. */
const parseColor = (value: string): Color => {
  return clampColor(normalizeColor(value))
}

/** React Aria's `color.toString('css')`. */
const toCss = (color: Color): string => {
  if (color.space === 'rgb') {
    return `rgb(${Math.round(color.r)}, ${Math.round(color.g)}, ${Math.round(color.b)})`
  }

  const hsl = convertToHsl(color)

  return `hsl(${toFixed2(hsl.h)}, ${toFixed2(hsl.s)}%, ${toFixed2(hsl.l)}%)`
}

const toHex = (color: Color): string => {
  const rgb = convertToRgb(color)
  const channel = (value: number) => Math.round(value).toString(16).padStart(2, '0')

  return `#${channel(rgb.r)}${channel(rgb.g)}${channel(rgb.b)}`.toUpperCase()
}

/* -------------------------------------------------------------------------------------------------
 * Normalize Color Syntax
 * -----------------------------------------------------------------------------------------------*/

/**
 * Normalizes modern CSS color syntax (space-separated) to legacy syntax (comma-separated)
 * that the color parser expects.
 *
 * @example
 * normalizeColorSyntax("hsl(220 70% 50%)") // → "hsl(220, 70%, 50%)"
 * normalizeColorSyntax("hsl(220 70% 50% / 0.5)") // → "hsla(220, 70%, 50%, 0.5)"
 * normalizeColorSyntax("rgb(255 128 0)") // → "rgb(255, 128, 0)"
 * normalizeColorSyntax("rgb(255 128 0 / 0.5)") // → "rgba(255, 128, 0, 0.5)"
 */
export const normalizeColorSyntax = (color: string): string => {
  const trimmed = color.trim()

  // Match hsl/hsla with space-separated values
  const hslMatch = trimmed.match(
    /^(hsla?)\s*\(\s*([^\s,]+)\s+([^\s,]+)\s+([^\s,/]+)(?:\s*\/\s*([^\s)]+))?\s*\)$/i,
  )

  if (hslMatch) {
    const [, func, h, s, l, a] = hslMatch

    if (a !== undefined) {
      return `hsla(${h}, ${s}, ${l}, ${a})`
    }

    return `${func}(${h}, ${s}, ${l})`
  }

  // Match rgb/rgba with space-separated values
  const rgbMatch = trimmed.match(
    /^(rgba?)\s*\(\s*([^\s,]+)\s+([^\s,]+)\s+([^\s,/]+)(?:\s*\/\s*([^\s)]+))?\s*\)$/i,
  )

  if (rgbMatch) {
    const [, func, r, g, b, a] = rgbMatch

    if (a !== undefined) {
      return `rgba(${r}, ${g}, ${b}, ${a})`
    }

    return `${func}(${r}, ${g}, ${b})`
  }

  // Match hsb/hsba with space-separated values
  const hsbMatch = trimmed.match(
    /^(hsba?)\s*\(\s*([^\s,]+)\s+([^\s,]+)\s+([^\s,/]+)(?:\s*\/\s*([^\s)]+))?\s*\)$/i,
  )

  if (hsbMatch) {
    const [, func, h, s, b, a] = hsbMatch

    if (a !== undefined) {
      return `hsba(${h}, ${s}, ${b}, ${a})`
    }

    return `${func}(${h}, ${s}, ${b})`
  }

  return trimmed
}

/* -------------------------------------------------------------------------------------------------
 * Detect Color Format
 * -----------------------------------------------------------------------------------------------*/

/**
 * Detects the color format from an input string.
 * Returns null if the format cannot be determined.
 */
export const detectColorFormat = (value: string): ColorFormat | null => {
  const trimmed = value.trim().toLowerCase()

  if (trimmed.startsWith('oklch(')) return 'oklch'
  if (trimmed.startsWith('hsl(') || trimmed.startsWith('hsla(')) return 'hsl'
  if (trimmed.startsWith('rgb(') || trimmed.startsWith('rgba(')) return 'rgb'
  if (trimmed.startsWith('hsb(') || trimmed.startsWith('hsba(')) return 'hsb'

  // Detect hex format (with or without #)
  if (/^#?[0-9a-f]{3,8}$/i.test(trimmed)) return 'hex'

  return null
}

/* -------------------------------------------------------------------------------------------------
 * Format Color
 * -----------------------------------------------------------------------------------------------*/

/**
 * Formats a Color object to a string in the specified format.
 * Handles OKLCH conversion using culori.
 */
export const formatColor = (color: Color, format: ColorFormat): string => {
  switch (format) {
    case 'hex':
      return toHex(color)
    case 'rgb': {
      const rgb = convertToRgb(color)
      return `rgb(${Math.round(rgb.r)}, ${Math.round(rgb.g)}, ${Math.round(rgb.b)})`
    }
    case 'hsl': {
      const hsl = convertToHsl(color)
      return `hsl(${toFixed2(hsl.h)}, ${toFixed2(hsl.s)}%, ${toFixed2(hsl.l)}%)`
    }
    case 'hsb': {
      const hsb = convertToHsb(color)
      return `hsb(${toFixed2(hsb.h)}, ${toFixed2(hsb.s)}%, ${toFixed2(hsb.b)}%)`
    }
    default: {
      const oklch = converter('oklch')
      const roundTo4 = round(4)
      const oklchColor = oklch(toCss(color))

      if (!oklchColor) {
        return toHex(color)
      }

      // Round each channel value
      const roundedColor = mapper(roundTo4, 'oklch')(oklchColor)

      return formatCss(roundedColor)
    }
  }
}

export const getHueFromColor = (color: Color): number => {
  const oklch = converter('oklch')(formatColor(color, 'hsl'))

  if (!oklch || oklch.h === undefined) {
    return 0
  }

  return oklch.h
}

export const getValuesFromOklch = (
  hsl: string,
): {
  lightness: number
  chroma: number
  hue: number
} => {
  const oklch = converter('oklch')
  const oklchColor = oklch(hsl)

  return { chroma: oklchColor?.c ?? 0, hue: oklchColor?.h ?? 0, lightness: oklchColor?.l ?? 0 }
}

/* -------------------------------------------------------------------------------------------------
 * Validate Color Input
 * -----------------------------------------------------------------------------------------------*/

/**
 * Validates if a string is a valid color for the given format.
 * Returns the parsed Color if valid, null otherwise.
 */
export const validateColorInput = (input: string, format: ColorFormat): Color | null => {
  const trimmed = input.trim()

  if (!trimmed) return null

  try {
    // Use culori to parse and validate the color
    const parsed = parse(trimmed)

    if (!parsed) return null

    // For format-specific validation
    switch (format) {
      case 'hex':
        // Accept hex colors (with or without #)
        if (/^#?([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})$/.test(trimmed)) {
          const hexValue = trimmed.startsWith('#') ? trimmed : `#${trimmed}`

          return parseColor(hexValue)
        }

        return null

      case 'hsl':
        // Accept hsl/hsla format (both comma and space-separated)
        if (/^hsla?\s*\(/i.test(trimmed)) {
          const normalized = normalizeColorSyntax(trimmed)

          return parseColor(normalized)
        }

        return null

      case 'rgb':
        // Accept rgb/rgba format (both comma and space-separated)
        if (/^rgba?\s*\(/i.test(trimmed)) {
          const normalized = normalizeColorSyntax(trimmed)

          return parseColor(normalized)
        }

        return null

      case 'hsb':
        // Accept hsb/hsba format (both comma and space-separated)
        if (/^hsba?\s*\(/i.test(trimmed)) {
          const normalized = normalizeColorSyntax(trimmed)

          return parseColor(normalized)
        }

        return null

      case 'oklch':
        // Accept oklch format
        if (/^oklch\s*\(/i.test(trimmed)) {
          // Convert oklch to hsl for the color parser
          const hsl = formatHsl(trimmed)

          if (hsl) {
            return parseColor(hsl)
          }
        }

        return null

      default:
        return null
    }
  } catch {
    return null
  }
}

/* -------------------------------------------------------------------------------------------------
 * Safe Color Parser
 * -----------------------------------------------------------------------------------------------*/

/**
 * Safely parses a color string into a Color object.
 * Handles OKLCH conversion since the color parser doesn't support it natively.
 * Falls back to DEFAULT_COLOR if parsing fails.
 */
export const safeParseColor = (color: string): Color => {
  try {
    if (color.startsWith('oklch')) {
      const hsl = formatHsl(color)

      if (!hsl) {
        return parseColor(DEFAULT_COLOR)
      }

      return parseColor(hsl)
    }

    return parseColor(color)
  } catch {
    return parseColor(DEFAULT_COLOR)
  }
}

/** The color as a HSL `Color` from a random hue, saturation and lightness (the picker's shuffle button). */
export const randomColor = (): Color => {
  const randomHue = Math.floor(Math.random() * 360)
  const randomSaturation = 50 + Math.floor(Math.random() * 50)
  const randomLightness = 40 + Math.floor(Math.random() * 30)

  return parseColor(`hsl(${randomHue}, ${randomSaturation}%, ${randomLightness}%)`)
}

/**
 * Chunks an array into smaller arrays of a specified size.
 * Useful for pagination of swatches.
 */
export const chunkArray = <T>(array: T[], chunkSize: number): T[][] => {
  const chunks: T[][] = []

  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize))
  }

  return chunks
}

export { parseColor }
