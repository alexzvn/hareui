/** A color in OKLCH space: lightness (0-1), chroma, hue (degrees). */
export type OklchColor = {
  l: number
  c: number
  h: number
}

/** A CSS color variable with its light and dark theme values. */
export type ThemeColor = {
  name: string
  oklchLight: string
  oklchDark: string
}

/** Every color variable the theme builder generates. */
export type GeneratedThemeColors = {
  // Core colors
  background: ThemeColor
  foreground: ThemeColor
  accent: ThemeColor
  accentForeground: ThemeColor
  focus: ThemeColor

  // UI colors
  muted: ThemeColor
  default: ThemeColor
  defaultForeground: ThemeColor
  surface: ThemeColor
  surfaceForeground: ThemeColor
  surfaceSecondary: ThemeColor
  surfaceSecondaryForeground: ThemeColor
  surfaceTertiary: ThemeColor
  surfaceTertiaryForeground: ThemeColor
  overlay: ThemeColor
  overlayForeground: ThemeColor
  scrollbar: ThemeColor
  segment: ThemeColor
  segmentForeground: ThemeColor
  border: ThemeColor
  separator: ThemeColor

  // Field colors
  fieldBackground: ThemeColor
  fieldForeground: ThemeColor
  fieldPlaceholder: ThemeColor

  // Semantic colors
  success: ThemeColor
  successForeground: ThemeColor
  warning: ThemeColor
  warningForeground: ThemeColor
  danger: ThemeColor
  dangerForeground: ThemeColor
}

/**
 * Semantic color override for a single color (success, warning, or danger)
 */
type SemanticColorOverride = {
  /** OKLCH color string e.g. "oklch(0.5148 0.1337 146.82)" */
  color: string
  /** Optional foreground color - if not provided, will be calculated automatically */
  foreground?: string
}

/**
 * Semantic color overrides for light and dark modes.
 * Allows themes to specify exact semantic colors instead of using calculated values.
 */
export type SemanticOverrides = {
  light?: {
    /** Override the accent foreground color (text on accent background) */
    accentForeground?: string
    danger?: SemanticColorOverride
    success?: SemanticColorOverride
    warning?: SemanticColorOverride
  }
  dark?: {
    /** Override the accent foreground color (text on accent background) */
    accentForeground?: string
    danger?: SemanticColorOverride
    success?: SemanticColorOverride
    warning?: SemanticColorOverride
  }
}

/** Inputs of `generateThemeColors`. */
export type ColorGenerationParams = {
  /** Lightness value for accent color (0-1) */
  lightness: number
  /** Chroma value for accent and gray tinting (0-0.4) */
  chroma: number
  /** Hue value for all colors (0-360) */
  hue: number
  /** Base chroma for gray/neutral colors (optional, defaults to subtle value) */
  grayChroma?: number
  /** Optional semantic color overrides for light/dark modes */
  semanticOverrides?: SemanticOverrides
}
