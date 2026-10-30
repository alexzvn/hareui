import { onBeforeUnmount, onMounted, watch } from 'vue'

import {
  THEME_BUILDER_BOTTOM_SHEET_ID,
  THEME_BUILDER_CONTENT_ID,
  THEME_BUILDER_PAGE_ID,
  adaptiveColors,
  findMatchingTheme,
  fontMap,
  radiusCssMap,
  themeValuesById,
} from '../constants'
// Port of HeroUI docs `themes/hooks/use-css-sync.ts`: turns the builder variables into CSS custom properties.
// Colors go on the page (#theme-builder-page); colors + radius + font go on the preview (#theme-builder-content,
// its dialogs, and the mobile bottom sheet). Light/dark follow `.dark` / `[data-theme]` like the rest of the docs.
import {
  getColorVariablesForElement,
  getDerivedColorFormulas,
  radiusDerivedVariables,
} from '../utils/color-variables'
import { getCustomFontInfoFromUrl, injectFontLink, isCustomFontUrl } from '../utils/font-utils'
import { calculateAccentForeground } from '../utils/foreground-colors'
import { generateThemeColors } from '../utils/generate-theme-colors'
import type { SemanticOverrides } from '../utils/theme-colors.types'
import { useVariablesState } from './variables'

const ADAPTIVE_STYLE_ID = 'theme-builder-adaptive-colors'
const THEME_COLORS_STYLE_ID = 'theme-builder-theme-colors'
const FONT_VAR_STYLE_ID = 'theme-builder-font-var'

const PAGE_SELECTORS = `#${THEME_BUILDER_PAGE_ID}`

const CONTENT_SELECTORS = [
  `#${THEME_BUILDER_BOTTOM_SHEET_ID}`,
  `#${THEME_BUILDER_CONTENT_ID}`,
  `#${THEME_BUILDER_CONTENT_ID} [role='dialog']`,
].join(', ')

/** Parses `oklch(L C H)` into its components. */
const parseOklch = (oklch: string): { lightness: number; chroma: number; hue: number } | null => {
  const match = oklch.match(/oklch\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)\s*\)/)
  if (!match?.[1] || !match[2] || !match[3]) return null

  return {
    chroma: Number.parseFloat(match[2]),
    hue: Number.parseFloat(match[3]),
    lightness: Number.parseFloat(match[1]),
  }
}

const buildVarsCSS = (vars: Record<string, string>) => {
  return Object.entries(vars)
    .map(([prop, val]) => `${prop}: ${val};`)
    .join('\n    ')
}

type CssVariables = Record<string, string>

/**
 * Radius and font apply to both modes. Derived radius values are re-declared on the scoped elements
 * because custom properties resolve `var()` where they are defined.
 */
const getCommonVariables = ({
  radius,
  fieldRadius,
  fontVariable,
}: {
  radius: string
  fieldRadius: string
  fontVariable: string
}): CssVariables => {
  return {
    '--field-radius': fieldRadius,
    '--font-sans': `var(${fontVariable})`,
    '--radius': radius,
    ...radiusDerivedVariables,
  }
}

const scopedCSS = ({
  light,
  dark,
  common,
}: {
  light: CssVariables
  dark: CssVariables
  common: CssVariables
}) => {
  const fullLightVars = { ...common, ...light }
  const fullDarkVars = { ...common, ...dark }

  return `
  /* Page level: colors only */
  :is([data-theme="light"], .light) ${PAGE_SELECTORS},
  ${PAGE_SELECTORS}:not(:is([data-theme="dark"] *, .dark *)) {
    ${buildVarsCSS(light)}
  }
  :is([data-theme="dark"], .dark) ${PAGE_SELECTORS} {
    ${buildVarsCSS(dark)}
  }
  /* Content level: colors + radius + fonts */
  :is([data-theme="light"], .light) :is(${CONTENT_SELECTORS}),
  :is(${CONTENT_SELECTORS}):not(:is([data-theme="dark"] *, .dark *)) {
    ${buildVarsCSS(fullLightVars)}
  }
  :is([data-theme="dark"], .dark) :is(${CONTENT_SELECTORS}) {
    ${buildVarsCSS(fullDarkVars)}
  }
  `
}

type ThemeColorOptions = {
  chroma: number
  hue: number
  lightness: number
  /** Chroma of the gray scale (the builder's `base`). */
  grayChroma: number
  commonVars: CssVariables
  semanticOverrides?: SemanticOverrides
  vibrant?: boolean
}

/** Adaptive accents (e.g. black/white) use a different accent value in light and dark mode. */
const getAdaptiveColorCSS = (
  accentColor: string,
  { chroma, hue, lightness, commonVars, semanticOverrides, vibrant }: ThemeColorOptions,
): string | null => {
  const adaptiveConfig = adaptiveColors[accentColor]
  if (!adaptiveConfig) return null

  const lightAccent = parseOklch(adaptiveConfig.light)
  const darkAccent = parseOklch(adaptiveConfig.dark)

  const lightFg = lightAccent
    ? calculateAccentForeground({
        c: lightAccent.chroma,
        h: lightAccent.hue,
        l: lightAccent.lightness,
      })
    : calculateAccentForeground({ c: 0, h: 0, l: 0 })

  const darkFg = darkAccent
    ? calculateAccentForeground({
        c: darkAccent.chroma,
        h: darkAccent.hue,
        l: darkAccent.lightness,
      })
    : calculateAccentForeground({ c: 0, h: 0, l: 1 })

  // Same as HeroUI: the adaptive path ignores `base` (no grayChroma).
  const colors = generateThemeColors({ chroma, hue, lightness, semanticOverrides })
  const derivedOpts = { vibrant }
  const colorLightVars = {
    ...getColorVariablesForElement(colors, 'light'),
    ...getDerivedColorFormulas('light', derivedOpts),
    '--accent': adaptiveConfig.light,
    '--accent-foreground': lightFg,
    '--accent-soft-foreground': adaptiveConfig.light,
    '--focus': adaptiveConfig.light,
  }

  const colorDarkVars = {
    ...getColorVariablesForElement(colors, 'dark'),
    ...getDerivedColorFormulas('dark', derivedOpts),
    '--accent': adaptiveConfig.dark,
    '--accent-foreground': darkFg,
    '--accent-soft-foreground': adaptiveConfig.dark,
    '--focus': adaptiveConfig.dark,
  }

  return scopedCSS({ light: colorLightVars, dark: colorDarkVars, common: commonVars })
}

const getThemeColorsCSS = ({
  chroma,
  hue,
  lightness,
  grayChroma,
  commonVars,
  semanticOverrides,
  vibrant,
}: ThemeColorOptions) => {
  const colors = generateThemeColors({ chroma, grayChroma, hue, lightness, semanticOverrides })
  const derivedOpts = { vibrant }

  return scopedCSS({
    light: {
      ...getColorVariablesForElement(colors, 'light'),
      ...getDerivedColorFormulas('light', derivedOpts),
    },
    dark: {
      ...getColorVariablesForElement(colors, 'dark'),
      ...getDerivedColorFormulas('dark', derivedOpts),
    },
    common: commonVars,
  })
}

const injectStyleElement = (id: string, css: string) => {
  document.getElementById(id)?.remove()
  const style = document.createElement('style')
  style.id = id
  style.textContent = css
  document.head.appendChild(style)
}

const removeInjected = () => {
  for (const id of [ADAPTIVE_STYLE_ID, THEME_COLORS_STYLE_ID]) document.getElementById(id)?.remove()
}

/** Every font (predefined or custom URL) is loaded on demand from its CDN stylesheet. */
const loadFont = (fontFamily: string): { variable: string; name: string } => {
  const customFontInfo = isCustomFontUrl(fontFamily)
    ? getCustomFontInfoFromUrl(fontFamily)
    : undefined

  if (customFontInfo) {
    injectFontLink(customFontInfo.variable, fontFamily)

    return { variable: customFontInfo.variable, name: customFontInfo.fontFamily }
  }

  // Unparseable custom URLs fall back to Inter, like unknown ids.
  const font =
    (!isCustomFontUrl(fontFamily) && fontMap[fontFamily as keyof typeof fontMap]) || fontMap.inter

  injectFontLink(font.variable, font.cdnUrl)

  return { variable: font.variable, name: font.label }
}

const setVibrantPaletteAttribute = (isVibrant: boolean) => {
  if (!isVibrant) {
    document.documentElement.removeAttribute('data-vibrant-palette')

    return
  }

  document.documentElement.setAttribute('data-vibrant-palette', 'true')
}

const injectColorCSS = (accentColor: string, options: ThemeColorOptions) => {
  if (!(accentColor in adaptiveColors)) {
    injectStyleElement(THEME_COLORS_STYLE_ID, getThemeColorsCSS(options))

    return
  }

  const css = getAdaptiveColorCSS(accentColor, options)

  if (css) injectStyleElement(ADAPTIVE_STYLE_ID, css)
}

/** Syncs the builder variables to injected `<style>` elements. Call once, from the page root (client only). */
export const useCssSync = () => {
  const [variables] = useVariablesState()

  const sync = () => {
    const v = variables.value
    const accentColor = `oklch(${v.lightness} ${v.chroma} ${v.hue})`
    const matchingThemeId = findMatchingTheme(v)
    const semanticOverrides = matchingThemeId
      ? themeValuesById[matchingThemeId].semanticOverrides
      : undefined

    const font = loadFont(v.fontFamily)
    const commonVars = getCommonVariables({
      radius: radiusCssMap[v.radius],
      fieldRadius: radiusCssMap[v.formRadius],
      fontVariable: font.variable,
    })

    injectStyleElement(FONT_VAR_STYLE_ID, `:root { ${font.variable}: "${font.name}", sans-serif; }`)

    removeInjected()
    const isVibrant = v.vibrantPalette
    setVibrantPaletteAttribute(isVibrant)

    injectColorCSS(accentColor, {
      chroma: v.chroma,
      hue: v.hue,
      lightness: v.lightness,
      grayChroma: v.base,
      commonVars,
      semanticOverrides,
      vibrant: isVibrant,
    })
  }

  let stop: (() => void) | undefined
  onMounted(() => {
    // `lockedVariables` changes don't affect the CSS; watch only what does.
    stop = watch(
      () => {
        const v = variables.value
        return [
          v.lightness,
          v.chroma,
          v.hue,
          v.base,
          v.fontFamily,
          v.formRadius,
          v.radius,
          v.vibrantPalette,
        ].join('|')
      },
      sync,
      { immediate: true },
    )
  })

  onBeforeUnmount(() => {
    stop?.()
    removeInjected()
    document.documentElement.removeAttribute('data-vibrant-palette')
    document.getElementById(FONT_VAR_STYLE_ID)?.remove()
  })
}
