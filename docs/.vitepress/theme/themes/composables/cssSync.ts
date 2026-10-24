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
import { getCustomFontInfoFromUrl, injectFontLink, isCustomFontUrl } from '../utils/font-utils'
// Port of HeroUI docs `themes/hooks/use-css-sync.ts`: turns the builder variables into CSS custom properties.
// Colors go on the page (#theme-builder-page); colors + radius + font go on the preview (#theme-builder-content,
// its dialogs, and the mobile bottom sheet). Light/dark follow `.dark` / `[data-theme]` like the rest of the docs.
import type { SemanticOverrides } from '../utils/generate-theme-colors'
import {
  calculateAccentForeground,
  generateThemeColors,
  getColorVariablesForElement,
  getDerivedColorFormulas,
  radiusDerivedVariables,
} from '../utils/generate-theme-colors'
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
function parseOklch(oklch: string): { lightness: number; chroma: number; hue: number } | null {
  const match = oklch.match(/oklch\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)\s*\)/)
  if (!match?.[1] || !match[2] || !match[3]) return null
  return {
    chroma: Number.parseFloat(match[2]),
    hue: Number.parseFloat(match[3]),
    lightness: Number.parseFloat(match[1]),
  }
}

function buildVarsCSS(vars: Record<string, string>) {
  return Object.entries(vars)
    .map(([prop, val]) => `${prop}: ${val};`)
    .join('\n    ')
}

/**
 * Radius and font apply to both modes. Derived radius values are re-declared on the scoped elements
 * because custom properties resolve `var()` where they are defined.
 */
function getCommonVariables(
  radius: string,
  fieldRadius: string,
  fontVariable: string,
): Record<string, string> {
  return {
    '--field-radius': fieldRadius,
    '--font-sans': `var(${fontVariable})`,
    '--radius': radius,
    ...radiusDerivedVariables,
  }
}

function scopedCSS(
  colorLightVars: Record<string, string>,
  colorDarkVars: Record<string, string>,
  commonVars: Record<string, string>,
) {
  const fullLightVars = { ...commonVars, ...colorLightVars }
  const fullDarkVars = { ...commonVars, ...colorDarkVars }
  return `
  /* Page level: colors only */
  :is([data-theme="light"], .light) ${PAGE_SELECTORS},
  ${PAGE_SELECTORS}:not(:is([data-theme="dark"] *, .dark *)) {
    ${buildVarsCSS(colorLightVars)}
  }
  :is([data-theme="dark"], .dark) ${PAGE_SELECTORS} {
    ${buildVarsCSS(colorDarkVars)}
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

/** Adaptive accents (e.g. black/white) use a different accent value in light and dark mode. */
function getAdaptiveColorCSS(
  accentColor: string,
  chroma: number,
  hue: number,
  lightness: number,
  commonVars: Record<string, string>,
  semanticOverrides?: SemanticOverrides,
  vibrant?: boolean,
): string | null {
  const adaptiveConfig = adaptiveColors[accentColor]
  if (!adaptiveConfig) return null

  const lightAccent = parseOklch(adaptiveConfig.light)
  const darkAccent = parseOklch(adaptiveConfig.dark)
  const lightFg = lightAccent
    ? calculateAccentForeground(lightAccent.lightness, lightAccent.chroma, lightAccent.hue)
    : calculateAccentForeground(0, 0, 0)
  const darkFg = darkAccent
    ? calculateAccentForeground(darkAccent.lightness, darkAccent.chroma, darkAccent.hue)
    : calculateAccentForeground(1, 0, 0)

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
  return scopedCSS(colorLightVars, colorDarkVars, commonVars)
}

function getThemeColorsCSS(
  chroma: number,
  hue: number,
  lightness: number,
  grayChroma: number,
  commonVars: Record<string, string>,
  semanticOverrides?: SemanticOverrides,
  vibrant?: boolean,
) {
  const colors = generateThemeColors({ chroma, grayChroma, hue, lightness, semanticOverrides })
  const derivedOpts = { vibrant }
  return scopedCSS(
    {
      ...getColorVariablesForElement(colors, 'light'),
      ...getDerivedColorFormulas('light', derivedOpts),
    },
    {
      ...getColorVariablesForElement(colors, 'dark'),
      ...getDerivedColorFormulas('dark', derivedOpts),
    },
    commonVars,
  )
}

function injectStyleElement(id: string, css: string) {
  document.getElementById(id)?.remove()
  const style = document.createElement('style')
  style.id = id
  style.textContent = css
  document.head.appendChild(style)
}

function removeInjected() {
  for (const id of [ADAPTIVE_STYLE_ID, THEME_COLORS_STYLE_ID]) document.getElementById(id)?.remove()
}

/** Syncs the builder variables to injected `<style>` elements. Call once, from the page root (client only). */
export function useCssSync() {
  const [variables] = useVariablesState()

  function sync() {
    const v = variables.value
    const accentColor = `oklch(${v.lightness} ${v.chroma} ${v.hue})`
    const matchingThemeId = findMatchingTheme(v)
    const semanticOverrides = matchingThemeId
      ? themeValuesById[matchingThemeId].semanticOverrides
      : undefined

    // Every font (predefined or custom URL) is loaded on demand from its CDN stylesheet.
    let fontVariable: string
    let fontFamilyName: string
    const customFontInfo = isCustomFontUrl(v.fontFamily)
      ? getCustomFontInfoFromUrl(v.fontFamily)
      : undefined
    if (customFontInfo) {
      injectFontLink(customFontInfo.variable, v.fontFamily)
      fontVariable = customFontInfo.variable
      fontFamilyName = customFontInfo.fontFamily
    } else {
      // Unparseable custom URLs fall back to Inter, like unknown ids.
      const font =
        (!isCustomFontUrl(v.fontFamily) && fontMap[v.fontFamily as keyof typeof fontMap]) ||
        fontMap.inter
      injectFontLink(font.variable, font.cdnUrl)
      fontVariable = font.variable
      fontFamilyName = font.label
    }

    const commonVars = getCommonVariables(
      radiusCssMap[v.radius],
      radiusCssMap[v.formRadius],
      fontVariable,
    )
    injectStyleElement(
      FONT_VAR_STYLE_ID,
      `:root { ${fontVariable}: "${fontFamilyName}", sans-serif; }`,
    )

    removeInjected()
    const vibrant = v.vibrantPalette
    if (vibrant) document.documentElement.setAttribute('data-vibrant-palette', 'true')
    else document.documentElement.removeAttribute('data-vibrant-palette')

    if (accentColor in adaptiveColors) {
      const css = getAdaptiveColorCSS(
        accentColor,
        v.chroma,
        v.hue,
        v.lightness,
        commonVars,
        semanticOverrides,
        vibrant,
      )
      if (css) injectStyleElement(ADAPTIVE_STYLE_ID, css)
    } else {
      injectStyleElement(
        THEME_COLORS_STYLE_ID,
        getThemeColorsCSS(
          v.chroma,
          v.hue,
          v.lightness,
          v.base,
          commonVars,
          semanticOverrides,
          vibrant,
        ),
      )
    }
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
