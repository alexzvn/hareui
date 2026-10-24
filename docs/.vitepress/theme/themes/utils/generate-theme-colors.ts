/**
 * Color generation for the HeroUI Theme Builder
 * Generates all theme colors based on hue, chroma, AND lightness adjustments
 *
 * Based on packages/storybook/.storybook/utils/apcach-colors.ts but extended
 * to support lightness customization for accent colors.
 */

import { calculateAccentForeground, formatEclipse, SNOW } from './foreground-colors'
import { formatOklch, tintOklch } from './oklch'
import { resolveSemanticColor } from './semantic-colors'
import type { ColorGenerationParams, GeneratedThemeColors, ThemeColor } from './theme-colors.types'
import { NEUTRAL_DEFAULTS } from './theme-defaults'
import type { NeutralColorKey } from './theme-defaults'

type NeutralColor = {
  /** CSS variable the color is emitted as */
  name: string
  /** Default the color is tinted from */
  base: NeutralColorKey
  /** Gray-chroma multiplier per theme mode (1 when omitted) */
  chromaScale?: { dark: number; light: number }
}

type NeutralTint = { grayChroma: number; hue: number }

/**
 * Tint a neutral default with the theme hue and a share of its gray chroma
 */
const createNeutralColor = (neutral: NeutralColor, tint: NeutralTint): ThemeColor => {
  const { dark: darkScale = 1, light: lightScale = 1 } = neutral.chromaScale ?? {}

  const dark = tintOklch(NEUTRAL_DEFAULTS.dark[neutral.base], {
    chroma: tint.grayChroma * darkScale,
    hue: tint.hue,
  })

  const light = tintOklch(NEUTRAL_DEFAULTS.light[neutral.base], {
    chroma: tint.grayChroma * lightScale,
    hue: tint.hue,
  })

  return {
    name: neutral.name,
    oklchDark: formatOklch(dark),
    oklchLight: formatOklch(light),
  }
}

/**
 * A color variable that reuses another variable's values
 */
const mirrorColor = (name: string, source: ThemeColor): ThemeColor => {
  return {
    name,
    oklchDark: source.oklchDark,
    oklchLight: source.oklchLight,
  }
}

/**
 * Generate all theme colors based on lightness, chroma, and hue
 *
 * Unlike the storybook version, this supports:
 * - Lightness customization for accent colors
 * - Full theme color generation for both light and dark modes
 * - Semantic color overrides for specific themes
 */
export const generateThemeColors = (params: ColorGenerationParams): GeneratedThemeColors => {
  const {
    lightness,
    chroma,
    hue,
    grayChroma = Math.min(chroma * 0.05, 0.015),
    semanticOverrides,
  } = params

  // Accent: the only color using all three parameters, identical in both modes
  const accentValue = formatOklch({ c: chroma, h: hue, l: lightness })
  const accent: ThemeColor = { name: '--accent', oklchDark: accentValue, oklchLight: accentValue }
  const focus = mirrorColor('--focus', accent)

  const calculatedAccentForeground = calculateAccentForeground({ c: chroma, h: hue, l: lightness })

  const accentForeground: ThemeColor = {
    name: '--accent-foreground',
    oklchDark: semanticOverrides?.dark?.accentForeground ?? calculatedAccentForeground,
    oklchLight: semanticOverrides?.light?.accentForeground ?? calculatedAccentForeground,
  }

  // Neutrals: defaults rotated to the theme hue, tinted with gray chroma
  const tint: NeutralTint = { grayChroma, hue }

  const background = createNeutralColor({ base: 'background', name: '--background' }, tint)
  const foreground = createNeutralColor({ base: 'foreground', name: '--foreground' }, tint)
  const border = createNeutralColor({ base: 'border', name: '--border' }, tint)
  const separator = createNeutralColor({ base: 'separator', name: '--separator' }, tint)
  const scrollbar = createNeutralColor({ base: 'scrollbar', name: '--scrollbar' }, tint)
  const segment = createNeutralColor({ base: 'segment', name: '--segment' }, tint)
  const defaultColor = createNeutralColor({ base: 'default', name: '--default' }, tint)

  const muted = createNeutralColor(
    { base: 'muted', chromaScale: { dark: 2, light: 2 }, name: '--muted' },
    tint,
  )

  const surface = createNeutralColor(
    { base: 'surface', chromaScale: { dark: 2, light: 0.5 }, name: '--surface' },
    tint,
  )

  const surfaceSecondary = createNeutralColor(
    {
      base: 'surfaceSecondary',
      chromaScale: { dark: 1.5, light: 0.8 },
      name: '--surface-secondary',
    },
    tint,
  )

  const surfaceTertiary = createNeutralColor(
    {
      base: 'surfaceTertiary',
      chromaScale: { dark: 1.5, light: 0.8 },
      name: '--surface-tertiary',
    },
    tint,
  )

  const overlay = createNeutralColor(
    { base: 'overlay', chromaScale: { dark: 2, light: 0.3 }, name: '--overlay' },
    tint,
  )

  // Text on the default color: Snow in dark mode, Eclipse in the theme hue in light mode
  const defaultForeground: ThemeColor = {
    name: '--default-foreground',
    oklchDark: SNOW,
    oklchLight: formatEclipse(hue),
  }

  // Semantic colors: blended toward the theme hue unless the theme overrides them
  const semanticContext = { baseHue: hue, grayChroma, overrides: semanticOverrides }

  const success = resolveSemanticColor('success', semanticContext)
  const warning = resolveSemanticColor('warning', semanticContext)
  const danger = resolveSemanticColor('danger', semanticContext)

  return {
    accent,
    accentForeground,
    background,
    border,
    danger: danger.color,
    dangerForeground: danger.foreground,
    default: defaultColor,
    defaultForeground,
    fieldBackground: mirrorColor('--field-background', surface),
    fieldForeground: mirrorColor('--field-foreground', foreground),
    fieldPlaceholder: mirrorColor('--field-placeholder', muted),
    focus,
    foreground,
    muted,
    overlay,
    overlayForeground: mirrorColor('--overlay-foreground', foreground),
    scrollbar,
    segment,
    segmentForeground: mirrorColor('--segment-foreground', foreground),
    separator,
    success: success.color,
    successForeground: success.foreground,
    surface,
    surfaceForeground: mirrorColor('--surface-foreground', foreground),
    surfaceSecondary,
    surfaceSecondaryForeground: mirrorColor('--surface-secondary-foreground', foreground),
    surfaceTertiary,
    surfaceTertiaryForeground: mirrorColor('--surface-tertiary-foreground', foreground),
    warning: warning.color,
    warningForeground: warning.foreground,
  }
}
