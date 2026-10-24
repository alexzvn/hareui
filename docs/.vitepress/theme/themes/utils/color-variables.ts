import type { GeneratedThemeColors, ThemeColor } from './theme-colors.types'

type ThemeMode = 'light' | 'dark'

const VIBRANT_SOFT_FOREGROUND = 'color-mix(in oklab, var(--VAR) 92%, var(--foreground) 8%)'

/**
 * Static var()-based formulas that mirror packages/styles/themes/default/variables.css.
 * These must be re-declared on scoped elements because CSS custom properties
 * resolve var() at the element where they are defined, not where inherited.
 *
 * Light and dark themes differ in soft percentages:
 *   - Light: accent/warning/success soft 15%/20%, danger 15%/20%
 *   - Dark:  accent/warning/success soft 12%/16%, danger 15%/20%
 */
export const getDerivedColorFormulas = (
  theme: ThemeMode,
  { vibrant: isVibrant = false }: { vibrant?: boolean } = {},
): Record<string, string> => {
  const isLight = theme === 'light'
  const [softPct, softHoverPct] = isLight ? ['15%', '20%'] : ['12%', '16%']

  // A vibrant palette tints soft foregrounds with the color itself instead of the accessible mix
  const resolveSoftForeground = (colorVar: string, accessibleFormula: string) =>
    isVibrant ? VIBRANT_SOFT_FOREGROUND.replace('VAR', colorVar) : accessibleFormula

  return {
    '--accent-hover': 'color-mix(in oklab, var(--accent) 90%, var(--accent-foreground) 10%)',
    '--accent-soft': `color-mix(in oklab, var(--accent) ${softPct}, transparent)`,
    '--accent-soft-foreground': resolveSoftForeground(
      'accent',
      isLight
        ? 'color-mix(in oklab, var(--accent) 70%, var(--foreground) 30%)'
        : 'color-mix(in oklab, var(--accent) 80%, var(--foreground) 30%)',
    ),
    '--accent-soft-hover': `color-mix(in oklab, var(--accent) ${softHoverPct}, transparent)`,
    '--background-inverse': 'var(--foreground)',
    '--background-secondary': 'color-mix(in oklab, var(--background) 96%, var(--foreground) 4%)',
    '--background-tertiary': 'color-mix(in oklab, var(--background) 92%, var(--foreground) 8%)',
    '--border-secondary': 'color-mix(in oklab, var(--surface) 78%, var(--surface-foreground) 22%)',
    '--border-tertiary': 'color-mix(in oklab, var(--surface) 66%, var(--surface-foreground) 34%)',
    '--danger-hover': 'color-mix(in oklab, var(--danger) 90%, var(--danger-foreground) 10%)',
    '--danger-soft': 'color-mix(in oklab, var(--danger) 15%, transparent)',
    '--danger-soft-foreground': resolveSoftForeground(
      'danger',
      isLight
        ? 'color-mix(in oklab, var(--danger) 70%, var(--foreground) 40%)'
        : 'color-mix(in oklab, var(--danger) 80%, var(--foreground) 30%)',
    ),
    '--danger-soft-hover': 'color-mix(in oklab, var(--danger) 20%, transparent)',
    '--default-hover': 'color-mix(in oklab, var(--default) 96%, var(--default-foreground) 4%)',
    '--default-soft': 'color-mix(in oklab, var(--default) 50%, transparent)',
    '--default-soft-foreground': 'var(--default-foreground)',
    '--default-soft-hover': 'color-mix(in oklab, var(--default) 60%, transparent)',
    '--field-border-focus':
      'color-mix(in oklab, var(--field-border, var(--border)) 74%, var(--field-foreground, var(--foreground)) 22%)',
    '--field-border-hover':
      'color-mix(in oklab, var(--field-border, var(--border)) 88%, var(--field-foreground, var(--foreground)) 10%)',
    '--field-focus': 'var(--field-background, var(--default))',
    '--field-hover':
      'color-mix(in oklab, var(--field-background, var(--default)) 90%, var(--field-foreground, var(--foreground)) 2%)',
    '--separator-secondary':
      'color-mix(in oklab, var(--surface) 85%, var(--surface-foreground) 15%)',
    '--separator-tertiary':
      'color-mix(in oklab, var(--surface) 81%, var(--surface-foreground) 19%)',
    '--success-hover': 'color-mix(in oklab, var(--success) 90%, var(--success-foreground) 10%)',
    '--success-soft': `color-mix(in oklab, var(--success) ${softPct}, transparent)`,
    '--success-soft-foreground': resolveSoftForeground(
      'success',
      isLight
        ? 'color-mix(in oklab, var(--success) 80%, var(--foreground) 60%)'
        : 'color-mix(in oklab, var(--success) 80%, var(--foreground) 30%)',
    ),
    '--success-soft-hover': `color-mix(in oklab, var(--success) ${softHoverPct}, transparent)`,
    '--surface-hover': 'color-mix(in oklab, var(--surface) 92%, var(--surface-foreground) 8%)',
    '--tw-ring-color': 'var(--focus)',
    '--warning-hover': 'color-mix(in oklab, var(--warning) 90%, var(--warning-foreground) 10%)',
    '--warning-soft': `color-mix(in oklab, var(--warning) ${softPct}, transparent)`,
    '--warning-soft-foreground': resolveSoftForeground(
      'warning',
      isLight
        ? 'color-mix(in oklab, var(--warning) 80%, var(--foreground) 70%)'
        : 'color-mix(in oklab, var(--warning) 80%, var(--foreground) 30%)',
    ),
    '--warning-soft-hover': `color-mix(in oklab, var(--warning) ${softHoverPct}, transparent)`,
  }
}

/**
 * Radius-derived variables
 */
export const radiusDerivedVariables: Record<string, string> = {
  '--radius-2xl': 'calc(var(--radius) * 2)',
  '--radius-3xl': 'calc(var(--radius) * 3)',
  '--radius-4xl': 'calc(var(--radius) * 4)',
  '--radius-field': 'var(--field-radius, var(--radius-xl))',
  '--radius-lg': 'calc(var(--radius) * 1)',
  '--radius-md': 'calc(var(--radius) * 0.75)',
  '--radius-sm': 'calc(var(--radius) * 0.5)',
  '--radius-xl': 'calc(var(--radius) * 1.5)',
  '--radius-xs': 'calc(var(--radius) * 0.25)',
}

/**
 * Get all color variables as a flat record for applying to an element
 */
export const getColorVariablesForElement = (
  colors: GeneratedThemeColors,
  theme: ThemeMode,
): Record<string, string> => {
  const isLight = theme === 'light'
  const getValue = (color: ThemeColor) => (isLight ? color.oklchLight : color.oklchDark)

  return {
    // Core colors
    '--background': getValue(colors.background),
    '--foreground': getValue(colors.foreground),

    // Accent
    '--accent': getValue(colors.accent),
    '--accent-foreground': getValue(colors.accentForeground),
    '--focus': getValue(colors.focus),

    // UI colors
    '--muted': getValue(colors.muted),
    '--default': getValue(colors.default),
    '--default-foreground': getValue(colors.defaultForeground),
    '--surface': getValue(colors.surface),
    '--surface-foreground': getValue(colors.surfaceForeground),
    '--surface-secondary': getValue(colors.surfaceSecondary),
    '--surface-secondary-foreground': getValue(colors.surfaceSecondaryForeground),
    '--surface-tertiary': getValue(colors.surfaceTertiary),
    '--surface-tertiary-foreground': getValue(colors.surfaceTertiaryForeground),
    '--overlay': getValue(colors.overlay),
    '--overlay-foreground': getValue(colors.overlayForeground),
    '--scrollbar': getValue(colors.scrollbar),
    '--segment': getValue(colors.segment),
    '--segment-foreground': getValue(colors.segmentForeground),
    '--border': getValue(colors.border),
    '--separator': getValue(colors.separator),

    // Field colors
    '--field-background': getValue(colors.fieldBackground),
    '--field-border': 'transparent',
    '--field-foreground': getValue(colors.fieldForeground),
    '--field-placeholder': getValue(colors.fieldPlaceholder),

    // Semantic colors
    '--success': getValue(colors.success),
    '--success-foreground': getValue(colors.successForeground),
    '--warning': getValue(colors.warning),
    '--warning-foreground': getValue(colors.warningForeground),
    '--danger': getValue(colors.danger),
    '--danger-foreground': getValue(colors.dangerForeground),
  }
}
