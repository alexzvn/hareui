/*
 * Default theme values from packages/styles/themes/default/variables.css: the baseline the
 * builder tints with the chosen hue and chroma.
 */

import type { OklchColor } from './theme-colors.types'

/** Default accent from variables.css: oklch(0.6204 0.195 253.83). */
export const DEFAULT_ACCENT = {
  chroma: 0.195,
  hue: 253.83,
  lightness: 0.6204,
}

/** Neutral color variables that get tinted from their default value. */
export type NeutralColorKey =
  | 'background'
  | 'border'
  | 'default'
  | 'foreground'
  | 'muted'
  | 'overlay'
  | 'scrollbar'
  | 'segment'
  | 'separator'
  | 'surface'
  | 'surfaceSecondary'
  | 'surfaceTertiary'

/** Default neutral colors per theme mode. */
export const NEUTRAL_DEFAULTS: Record<'dark' | 'light', Record<NeutralColorKey, OklchColor>> = {
  dark: {
    background: { c: 0.005, h: 285.823, l: 0.12 },
    border: { c: 0.006, h: 286.033, l: 0.28 },
    default: { c: 0.006, h: 286.033, l: 0.274 },

    // Snow
    foreground: { c: 0, h: 0, l: 0.9911 },

    muted: { c: 0.015, h: 286.067, l: 0.705 },
    overlay: { c: 0.0059, h: 285.89, l: 0.2103 },
    scrollbar: { c: 0.015, h: 286.067, l: 0.705 },
    segment: { c: 0.01, h: 285.93, l: 0.3964 },
    separator: { c: 0.006, h: 286.033, l: 0.25 },
    surface: { c: 0.0059, h: 285.89, l: 0.2103 },
    surfaceSecondary: { c: 0.0037, h: 286.14, l: 0.257 },
    surfaceTertiary: { c: 0.0024, h: 247.91, l: 0.2721 },
  },
  light: {
    background: { c: 0, h: 0, l: 0.9702 },
    border: { c: 0.004, h: 286.32, l: 0.9 },
    default: { c: 0.001, h: 286.375, l: 0.94 },

    // Eclipse
    foreground: { c: 0.0059, h: 285.89, l: 0.2103 },

    muted: { c: 0.0138, h: 285.94, l: 0.5517 },

    // Pure white
    overlay: { c: 0, h: 0, l: 1 },

    scrollbar: { c: 0.006, h: 286.286, l: 0.871 },

    // Pure white
    segment: { c: 0, h: 0, l: 1 },

    separator: { c: 0.004, h: 286.32, l: 0.92 },

    // Pure white
    surface: { c: 0, h: 0, l: 1 },

    surfaceSecondary: { c: 0.0013, h: 286.37, l: 0.9524 },
    surfaceTertiary: { c: 0.0013, h: 286.37, l: 0.9373 },
  },
}
