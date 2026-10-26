import type { OklchColor } from './theme-colors.types'

/**
 * Format a color object to OKLCH string
 */
export const formatOklch = (color: OklchColor): string => {
  return `oklch(${(color.l * 100).toFixed(2)}% ${color.c.toFixed(4)} ${color.h.toFixed(2)})`
}

/**
 * Parse an OKLCH string (`oklch(L C H)` or `oklch(L% C H)`) to a color object.
 * CSS variable references and unparsable strings yield `null`.
 */
export const parseOklch = (value: string): OklchColor | null => {
  if (value.startsWith('var(')) return null

  const match = value.match(/oklch\(([0-9.]+)%?\s+([0-9.]+)\s+([0-9.]+|none)\)/)
  if (!match?.[1] || !match[2] || !match[3]) return null

  const lightness = parseFloat(match[1])
  const chroma = parseFloat(match[2])
  const hue = match[3] === 'none' ? 0 : parseFloat(match[3])

  // Lightness above 1 was written as a percentage
  const normalizedLightness = lightness > 1 ? lightness / 100 : lightness

  return { c: chroma, h: hue, l: normalizedLightness }
}

/**
 * Rotate a color to `hue` and set its chroma (clamped at 0), keeping its lightness
 */
export const tintOklch = (color: OklchColor, tint: { hue: number; chroma: number }): OklchColor => {
  return { ...color, c: Math.max(0, tint.chroma), h: tint.hue }
}

/**
 * Wrap a hue into the 0-360 range
 */
export const normalizeHue = (hue: number): number => {
  let normalized = hue

  while (normalized < 0) normalized += 360
  while (normalized >= 360) normalized -= 360

  return normalized
}
