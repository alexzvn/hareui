import type { ComputedRef, MaybeRefOrGetter } from 'vue'
import { computed, inject, toValue } from 'vue'

import type { Themes } from '@/components/themes'
import type { HareUIConfig } from '@/config'
import { hareUIConfigKey } from '@/config'
import type { ComponentUI, SlotClasses, ThemeShape } from '@/types/tv'
import type { ClassValue } from '@/utils/tv'
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

const getComponent = (
  config: HareUIConfig,
  { name, base }: { name: keyof Themes; base: object },
) => {
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

/** The user-facing class props a component layers over its theme: per-slot `ui` and the root `class`. */
type UIProps<Slot extends string> = {
  ui?: Partial<Record<Slot, ClassValue>>
  class?: ClassValue
}

type SlotFunction = (options?: Record<string, unknown>) => string

type SlotOptions = SlotClasses & Record<string, unknown>

type Layers = {
  props?: UIProps<string>
  classSlot: MaybeRefOrGetter<string>
}

// Keys besides `class` / `override` are per-call variant values (e.g. a list item's own `variant`), passed to tv.
const getVariants = (options: SlotOptions | undefined) => {
  let variants: Record<string, unknown> | undefined
  for (const key in options) {
    if (key !== 'class' && key !== 'override') (variants ??= {})[key] = options[key]
  }

  return variants
}

// A single layer goes to tv as-is: tv caches string merges, and a call without options returns its cached core class.
const callSlot = (
  resolveSlot: SlotFunction,
  { layers, variants }: { layers: ClassValue[]; variants?: Record<string, unknown> },
) => {
  if (layers.length === 0 && !variants) return resolveSlot()

  return resolveSlot({ ...variants, class: layers.length > 1 ? layers : layers[0] })
}

// Lowest to highest precedence (tailwind-merge: last wins). `props` is read per call, inside the render effect.
const layerSlot = (
  resolveSlot: SlotFunction,
  { slot, props, classSlot }: Layers & { slot: string },
) => {
  return (options?: SlotOptions) => {
    const userClass = slot === toValue(classSlot) ? props?.class : undefined
    const layers = [options?.class, props?.ui?.[slot], userClass, options?.override]

    return callSlot(resolveSlot, {
      layers: layers.filter((layer) => layer != null),
      variants: getVariants(options),
    })
  }
}

const layerSlots = (slots: Record<string, SlotFunction>, layers: Layers) => {
  const layered: Record<string, (options?: SlotOptions) => string> = {}
  for (const slot in slots) layered[slot] = layerSlot(slots[slot], { ...layers, slot })

  return layered
}

/** What `useComponentUI` resolves: the component's default theme and a getter for its current variant props. */
export type UseComponentUIOptions<T extends ThemeShape> = {
  /** The component's default theme (`./theme.ts`). */
  theme: T
  /** Reads the props that select variants; tracked, so the classes update when they change. */
  variantProps: () => Record<string, unknown>
  /** The component's props: `ui` classes are layered over every slot, `class` over `classSlot`. */
  props?: UIProps<NoInfer<keyof T['slots'] & string>>
  /** The slot that receives `props.class`; defaults to `base`. A getter when the root element changes. */
  classSlot?: MaybeRefOrGetter<NoInfer<keyof T['slots'] & string>>
}

/**
 * Builds the slot class functions for a component: default theme, extended by the Vite plugin's `ui`
 * option, then by the app config (`createHareUI({ ui })`), resolved for the current variant props.
 * Each slot function then layers the call's `class`, `props.ui[slot]`, `props.class` (on `classSlot`)
 * and the call's `override`. The tv component is shared by every instance of the same app config and theme.
 */
export const useComponentUI = <T extends ThemeShape>(
  name: keyof Themes,
  { theme, variantProps, props, classSlot = 'base' }: UseComponentUIOptions<T>,
): ComputedRef<ComponentUI<T>> => {
  const config = inject(hareUIConfigKey, NO_CONFIG)
  const component = getComponent(config, { name, base: getBase(name, theme) })

  // Memoized per variant key, so the layered slots below are rebuilt only when the variant result changes.
  const slots = computed(
    () => resolve(component.value, variantProps()) as Record<string, SlotFunction>,
  )

  return computed(() => layerSlots(slots.value, { props, classSlot }) as ComponentUI<T>)
}
