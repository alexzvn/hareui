import { formatOklch, parseOklch } from './oklch'
import type { OklchColor } from './theme-colors.types'

/** "Snow": the near-white foreground for dark backgrounds. */
export const SNOW = 'oklch(99.11% 0 0)'

/**
 * "Eclipse" tinted with `hue`: the near-black foreground for light backgrounds
 */
export const formatEclipse = (hue: number): string => {
  return formatOklch({ c: 0.0059, h: hue, l: 0.2103 })
}

/**
 * Calculate foreground color based on background lightness
 * Uses OKLCH perceptual uniformity for accurate contrast decisions
 */
export const calculateForeground = (oklchString: string): string => {
  const color = parseOklch(oklchString)
  if (!color) return SNOW

  const { c, h, l } = color

  // OKLCH lightness is perceptually uniform, so 0.65 is a reliable light/dark threshold
  const isLightBackground = l > 0.65
  if (isLightBackground) {
    return `oklch(15% ${Math.min(c * 0.3, 0.05).toFixed(4)} ${h.toFixed(2)})`
  }

  return `oklch(98% ${Math.min(c * 0.1, 0.02).toFixed(4)} ${h.toFixed(2)})`
}

/**
 * Calculate accent foreground color for solid accent backgrounds
 * Optimized for button text on accent-colored backgrounds: a light accent (> 0.65) gets a
 * dark, slightly tinted foreground; a dark accent gets Snow.
 */
export const calculateAccentForeground = (accent: OklchColor): string => {
  const isLightAccent = accent.l > 0.65
  if (!isLightAccent) return SNOW

  return `oklch(15% ${Math.min(accent.c * 0.2, 0.03).toFixed(4)} ${accent.h.toFixed(2)})`
}
