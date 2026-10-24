import { computed, shallowRef } from 'vue'

// Port of HeroUI docs `themes/hooks/use-variables-state.ts` (nuqs `useQueryStates`) and the small hooks built on it
// (use-variable-setter, use-toggle-locked-variable, use-randomize-variables, use-reset-variables).
// The URL is the single source of truth, read through a module-level ref so every component shares it.
// nuqs semantics kept: values equal to their default are removed from the URL (`clearOnDefault`), updates
// merge into the existing query (keys keep their position, new keys are appended), each update pushes a history entry.
import type { LockableThemeVariableKey, RadiusId, ThemeVariables } from '../constants'
import {
  defaultThemeVariables,
  fontIds,
  radiusIds,
  radiusOptions,
  themeVariableKeys,
} from '../constants'

export type ThemeBuilderState = {
  lockedVariables: LockableThemeVariableKey[]
  vibrantPalette: boolean
} & ThemeVariables

type Parser<T> = {
  parse: (raw: string) => T | null
  serialize: (value: T) => string
  eq: (a: T, b: T) => boolean
  defaultValue: T
}

const float = (defaultValue: number): Parser<number> => ({
  defaultValue,
  eq: (a, b) => a === b,
  parse: (raw) => {
    const n = Number.parseFloat(raw)
    return Number.isNaN(n) ? null : n
  },
  serialize: String,
})

const string = (defaultValue: string): Parser<string> => ({
  defaultValue,
  eq: (a, b) => a === b,
  parse: (raw) => raw,
  serialize: String,
})

const literal = <T extends string>(values: readonly T[], defaultValue: T): Parser<T> => ({
  defaultValue,
  eq: (a, b) => a === b,
  parse: (raw) => (values.includes(raw as T) ? (raw as T) : null),
  serialize: String,
})

const literalArray = <T extends string>(values: readonly T[]): Parser<T[]> => ({
  defaultValue: [],
  eq: (a, b) => a.length === b.length && a.every((v, i) => v === b[i]),
  parse: (raw) => (raw === '' ? [] : raw.split(',').filter((v): v is T => values.includes(v as T))),
  serialize: (value) => value.join(','),
})

const boolean = (defaultValue: boolean): Parser<boolean> => ({
  defaultValue,
  eq: (a, b) => a === b,
  parse: (raw) => raw.toLowerCase() === 'true',
  serialize: String,
})

const parsers: { [K in keyof ThemeBuilderState]: Parser<ThemeBuilderState[K]> } = {
  base: float(defaultThemeVariables.base),
  chroma: float(defaultThemeVariables.chroma),
  // Plain string so custom font URLs are accepted.
  fontFamily: string(defaultThemeVariables.fontFamily),
  formRadius: literal<RadiusId>(radiusIds, defaultThemeVariables.formRadius),
  hue: float(defaultThemeVariables.hue),
  lightness: float(defaultThemeVariables.lightness),
  lockedVariables: literalArray(themeVariableKeys),
  radius: literal<RadiusId>(radiusIds, defaultThemeVariables.radius),
  vibrantPalette: boolean(false),
}

const keys = Object.keys(parsers) as (keyof ThemeBuilderState)[]

/** The current query string without `?`. Updated by `setVariables` and by browser navigation. */
export const search = shallowRef(
  typeof window === 'undefined' ? '' : window.location.search.slice(1),
)

if (typeof window !== 'undefined')
  window.addEventListener('popstate', () => (search.value = window.location.search.slice(1)))

const parse = (query: string): ThemeBuilderState => {
  const params = new URLSearchParams(query)
  const state = {} as Record<string, unknown>
  for (const key of keys) {
    const raw = params.get(key)
    state[key] = (raw === null ? null : parsers[key].parse(raw)) ?? parsers[key].defaultValue
  }

  return state as unknown as ThemeBuilderState
}

// Same minimal encoding as nuqs' `renderQueryString`, so URLs read like heroui.com's (`,` and `:` stay literal).
const encodeValue = (value: string) => {
  return value
    .replace(/%/g, '%25')
    .replace(/\+/g, '%2B')
    .replace(/ /g, '+')
    .replace(/#/g, '%23')
    .replace(/&/g, '%26')
    .replace(/"/g, '%22')
    .replace(/'/g, '%27')
    .replace(/`/g, '%60')
    .replace(/</g, '%3C')
    .replace(/>/g, '%3E')
}

export const renderQuery = (params: URLSearchParams) => {
  return [...params]
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeValue(value)}`)
    .join('&')
}

const state = computed(() => parse(search.value))

/** Merges `update` into the URL (nuqs `setState` semantics) and pushes a history entry. */
const setVariables = (update: Partial<ThemeBuilderState>) => {
  const params = new URLSearchParams(search.value)
  for (const key of keys) {
    if (!(key in update)) continue
    const value = update[key] as never
    const parser = parsers[key] as Parser<unknown>
    const isDefault = value === null || value === undefined || parser.eq(value, parser.defaultValue)

    if (isDefault) {
      params.delete(key)
      continue
    }

    params.set(key, parser.serialize(value))
  }

  const query = renderQuery(params)
  if (query === search.value) return
  search.value = query

  window.history.pushState(
    window.history.state,
    '',
    `${window.location.pathname}${query ? `?${query}` : ''}${window.location.hash}`,
  )
}

export const useVariablesState = () => {
  return [state, setVariables] as const
}

export const useVariableSetter = () => {
  const setVariable = <K extends keyof ThemeBuilderState>(
    variable: K,
    value: ThemeBuilderState[K],
  ) => setVariables({ ...state.value, [variable]: value })

  return { setVariable, variables: state }
}

export const useToggleLockedVariable = (key: LockableThemeVariableKey) => {
  const isLocked = computed(() => state.value.lockedVariables.includes(key))
  const toggleLockedVariable = () => {
    const { lockedVariables } = state.value
    setVariables({
      ...state.value,
      lockedVariables: isLocked.value
        ? lockedVariables.filter((v) => v !== key)
        : [...lockedVariables, key],
    })
  }

  return { isLocked, toggleLockedVariable }
}

export const useRandomizeVariables = () => {
  return () => {
    const variables = state.value
    const randomPick = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)] as T
    const truncate2 = (v: number) => Math.round(v * 100) / 100
    const randomInRange = (min: number, max: number) => truncate2(min + Math.random() * (max - min))
    const locked = (key: LockableThemeVariableKey) => variables.lockedVariables.includes(key)

    setVariables({
      base: locked('base') ? variables.base : Math.random() * 0.02,
      chroma: locked('chroma') ? variables.chroma : randomInRange(0.1, 0.26),
      fontFamily: locked('fontFamily') ? variables.fontFamily : randomPick([...fontIds]),
      formRadius: locked('formRadius') ? variables.formRadius : randomPick([...radiusIds]),
      hue: locked('hue') ? variables.hue : Math.floor(Math.random() * 360),
      lightness: locked('lightness') ? variables.lightness : randomInRange(0.5, 0.85),
      radius: locked('radius') ? variables.radius : randomPick(radiusOptions.map((r) => r.id)),
    })
  }
}

export const useResetVariables = () => {
  return () => setVariables({ ...defaultThemeVariables, lockedVariables: [] })
}
