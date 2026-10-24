import type { ComputedRef } from 'vue'
import { computed, inject } from 'vue'

import type { Themes } from '@/components/themes'
import type { HareUIConfig } from '@/config'
import { hareUIConfigKey } from '@/config'
import type { ComponentUI, ThemeShape } from '@/types/tv'
import { tv } from '@/utils/tv'

/** Theme overrides inlined by the `@hareui/vue/vite` plugin's `ui` option; undeclared without it. */
declare const __HAREUI_UI__: HareUIConfig['ui'] | undefined

// A theme (or extended tv component) plus an override is a valid tv config; tv's generics can't infer the spread.
const extendOptions = (extend: unknown, override: object | undefined) => {
  return { extend, ...override } as unknown as Parameters<typeof tv>[0]
}

type TV = (props: Record<string, unknown>) => unknown

type Shared = {
  tv: TV
  results: Map<string, unknown>
}

const NO_CONFIG: HareUIConfig = {}
const MEMO_LIMIT = 256

// theme → build-time override signature → base (theme or extended tv component). Keyed by content, not identity:
// Vite's `define` inlines `__HAREUI_UI__` as a fresh object literal at every read, and tests swap it between mounts.
const bases = new WeakMap<object, Map<string, object>>()

// app config → base → shared tv component. Vue 3.5 computeds aren't owned by the setup's effect scope, so a shared
// one outlives the instance that created it; it is collected with its app config.
const shared = new WeakMap<object, WeakMap<object, ComputedRef<Shared>>>()

const getBase = (name: keyof Themes, theme: object) => {
  const buildUI = typeof __HAREUI_UI__ === 'undefined' ? undefined : __HAREUI_UI__?.[name]
  const key = buildUI ? JSON.stringify(buildUI) : ''
  let byOverride = bases.get(theme)
  if (!byOverride) bases.set(theme, (byOverride = new Map()))
  let base = byOverride.get(key)
  if (!base)
    byOverride.set(key, (base = buildUI ? (tv(extendOptions(theme, buildUI)) as object) : theme))

  return base
}

const getComponent = (config: HareUIConfig, name: keyof Themes, base: object) => {
  let byBase = shared.get(config)
  if (!byBase) shared.set(config, (byBase = new WeakMap()))
  let component = byBase.get(base)
  if (!component) {
    // Reads `config.ui` reactively, so replacing or mutating it restyles every instance.
    component = computed(() => ({
      tv: tv(extendOptions(base, config.ui?.[name])) as unknown as TV,
      results: new Map(),
    }))

    byBase.set(base, component)
  }

  return component
}

// Keyed over every prop (compound variants may reference any of them); undefined if a value is an object.
const memoKey = (props: Record<string, unknown>) => {
  let key = ''
  for (const name in props) {
    const value = props[name]
    if (value !== null && typeof value === 'object') return undefined
    key += `${String(value)}\0`
  }

  return key
}

// tv's own result cache isn't used: it re-signs every compound variant per call, slower than this for themes with compounds.
const resolve = (component: Shared, props: Record<string, unknown>) => {
  const key = memoKey(props)
  if (key === undefined) return component.tv(props)
  let result = component.results.get(key)
  if (result === undefined) {
    if (component.results.size >= MEMO_LIMIT) component.results.clear()
    component.results.set(key, (result = component.tv(props)))
  }

  return result
}

/**
 * Builds the slot class functions for a component: default theme, extended by the Vite plugin's `ui`
 * option, then by the app config (`createHareUI({ ui })`), resolved for the current variant props.
 * The tv component is shared by every instance of the same app config and theme.
 */
export const useComponentUI = <T extends ThemeShape>(
  name: keyof Themes,
  theme: T,
  variantProps: () => Record<string, unknown>,
): ComputedRef<ComponentUI<T>> => {
  const config = inject(hareUIConfigKey, NO_CONFIG)
  const component = getComponent(config, name, getBase(name, theme))

  return computed(() => resolve(component.value, variantProps()) as ComponentUI<T>)
}
