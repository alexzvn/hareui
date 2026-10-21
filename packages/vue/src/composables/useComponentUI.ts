import type { ComputedRef } from 'vue'
import type { Themes } from '../components/themes'
import type { HareUIConfig } from '../config'
import type { ComponentUI, ThemeShape } from '../types/tv'
import { computed, inject } from 'vue'
import { hareUIConfigKey } from '../config'
import { tv } from '../utils/tv'

/** Theme overrides inlined by the `@hareui/vue/vite` plugin's `ui` option; undeclared without it. */
declare const __HAREUI_UI__: HareUIConfig['ui'] | undefined

// A theme (or extended tv component) plus an override is a valid tv config; tv's generics can't infer the spread.
function extendOptions(extend: unknown, override: object | undefined) {
  return { extend, ...override } as unknown as Parameters<typeof tv>[0]
}

/**
 * Builds the slot class functions for a component: default theme, extended by the Vite plugin's `ui`
 * option, then by the app config (`createHareUI({ ui })`), resolved for the current variant props.
 */
export function useComponentUI<T extends ThemeShape>(
  name: keyof Themes,
  theme: T,
  variantProps: () => Record<string, unknown>,
): ComputedRef<ComponentUI<T>> {
  const config = inject(hareUIConfigKey, {})
  const buildUI = typeof __HAREUI_UI__ === 'undefined' ? undefined : __HAREUI_UI__?.[name]
  const base = buildUI ? tv(extendOptions(theme, buildUI)) : theme
  return computed(() => tv(extendOptions(base, config.ui?.[name]))(variantProps()) as unknown as ComponentUI<T>)
}
