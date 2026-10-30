import { calculateForeground, formatEclipse, SNOW } from './foreground-colors'
import { formatOklch, normalizeHue } from './oklch'
import type { SemanticOverrides, ThemeColor } from './theme-colors.types'
import { DEFAULT_ACCENT } from './theme-defaults'

type SemanticColorName = 'danger' | 'success' | 'warning'

/** A semantic color variable and the foreground drawn on it. */
type SemanticColorPair = { color: ThemeColor; foreground: ThemeColor }

/** Base hue and gray chroma of the theme a semantic color is blended into. */
type SemanticColorContext = { baseHue: number; grayChroma: number }

type SemanticColorDefaults = {
  chromaDark: number
  chromaLight: number
  hue: number
  /** Hue for the dark theme when it differs from the light one */
  hueDark?: number
  lightnessDark: number
  lightnessLight: number
}

type SemanticShade = { chroma: number; hue: number; lightness: number }

// Semantic color defaults (from variables.css)
const SEMANTIC_DEFAULTS: Record<SemanticColorName, SemanticColorDefaults> = {
  danger: {
    chromaDark: 0.1967,
    chromaLight: 0.2328,
    hue: 25.74,
    hueDark: 24.63,
    lightnessDark: 0.594,
    lightnessLight: 0.6532,
  },
  success: {
    chromaDark: 0.1935,
    chromaLight: 0.1935,
    hue: 150.81,
    lightnessDark: 0.7329,
    lightnessLight: 0.7329,
  },
  warning: {
    chromaDark: 0.1388,
    chromaLight: 0.1585,
    hue: 72.33,
    hueDark: 76.34,
    lightnessDark: 0.8203,
    lightnessLight: 0.7819,
  },
}

// Share of the base hue's distance from the default accent that semantic hues follow
const SEMANTIC_HUE_BLEND_FACTOR = 0.12

const MAX_SEMANTIC_CHROMA = 0.35

// Success (0.73) and warning (0.78) sit above it and get a dark foreground; danger (0.65) gets Snow
const FOREGROUND_LIGHTNESS_THRESHOLD = 0.67

/**
 * Shift a semantic hue toward the base hue: themes stay cohesive while red still reads as danger
 */
const calculateSemanticHue = (semanticDefaultHue: number, baseHue: number): number => {
  const hueOffset = (baseHue - DEFAULT_ACCENT.hue) * SEMANTIC_HUE_BLEND_FACTOR

  return normalizeHue(semanticDefaultHue + hueOffset)
}

/**
 * Blend one theme mode of a semantic color into the base theme and pick its foreground
 */
const createSemanticShade = (
  shade: SemanticShade,
  context: SemanticColorContext,
): { color: string; foreground: string } => {
  const hue = calculateSemanticHue(shade.hue, context.baseHue)

  // Grayer themes get slightly more saturated semantic colors for visual harmony
  const chromaBoost = 1 + context.grayChroma * 2
  const chroma = Math.min(shade.chroma * chromaBoost, MAX_SEMANTIC_CHROMA)

  const isLightShade = shade.lightness > FOREGROUND_LIGHTNESS_THRESHOLD

  return {
    color: formatOklch({ c: chroma, h: hue, l: shade.lightness }),
    foreground: isLightShade ? formatEclipse(hue) : SNOW,
  }
}

/**
 * Generate a semantic color with appropriate foreground
 */
const generateSemanticColor = (
  name: SemanticColorName,
  context: SemanticColorContext,
): SemanticColorPair => {
  const defaults = SEMANTIC_DEFAULTS[name]

  const light = createSemanticShade(
    { chroma: defaults.chromaLight, hue: defaults.hue, lightness: defaults.lightnessLight },
    context,
  )

  const dark = createSemanticShade(
    {
      chroma: defaults.chromaDark,
      hue: defaults.hueDark ?? defaults.hue,
      lightness: defaults.lightnessDark,
    },
    context,
  )

  return {
    color: {
      name: `--${name}`,
      oklchDark: dark.color,
      oklchLight: light.color,
    },
    foreground: {
      name: `--${name}-foreground`,
      oklchDark: dark.foreground,
      oklchLight: light.foreground,
    },
  }
}

/**
 * Resolve a semantic color: a theme's override wins per mode, the calculated color fills the rest.
 * An overridden color without its own foreground gets one calculated from its lightness.
 */
export const resolveSemanticColor = (
  name: SemanticColorName,
  context: SemanticColorContext & { overrides?: SemanticOverrides },
): SemanticColorPair => {
  const calculated = generateSemanticColor(name, context)

  const lightOverride = context.overrides?.light?.[name]
  const darkOverride = context.overrides?.dark?.[name]
  if (!lightOverride && !darkOverride) return calculated

  const colorLight = lightOverride?.color ?? calculated.color.oklchLight
  const colorDark = darkOverride?.color ?? calculated.color.oklchDark

  return {
    color: {
      name: `--${name}`,
      oklchDark: colorDark,
      oklchLight: colorLight,
    },
    foreground: {
      name: `--${name}-foreground`,
      oklchDark: darkOverride?.foreground ?? calculateForeground(colorDark),
      oklchLight: lightOverride?.foreground ?? calculateForeground(colorLight),
    },
  }
}
