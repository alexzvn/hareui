import type { ComputedRef, InjectionKey } from 'vue'
import { computed, inject } from 'vue'

import type { Direction, Locale, MessageKey } from '@/locale/defineLocale'
import { en } from '@/locale/en'

/** Fills `{param}` placeholders; unknown params stay as written. */
export type TranslateParams = Record<string, string | number>

/** Resolves a message key (`'modal.close'`) to the active locale's string. */
export type Translate = (path: MessageKey, params?: TranslateParams) => string

/** Injection key of the `Locale` provided by `App` `locale`. */
export const localeKey: InjectionKey<ComputedRef<Locale | undefined>> = Symbol('hareui-locale')

const lookup = (messages: unknown, path: string): string | undefined => {
  const value = path
    .split('.')
    .reduce<unknown>(
      (node, key) =>
        node && typeof node === 'object' ? (node as Record<string, unknown>)[key] : undefined,
      messages,
    )

  return typeof value === 'string' ? value : undefined
}

/**
 * The built-in strings of the nearest `App` locale. `t(key, params)` reads `messages.<key>`, falls back to
 * English per key, then to the key itself.
 */
export const useLocale = () => {
  const provided = inject(localeKey, undefined)
  const locale = computed<Locale>(() => provided?.value ?? en)

  const t: Translate = (path, params) => {
    const message = lookup(locale.value.messages, path) ?? lookup(en.messages, path) ?? path

    return message.replace(/\{(\w+)\}/g, (match, key: string) =>
      params?.[key] === undefined ? match : String(params[key]),
    )
  }

  return {
    locale,
    t,
    code: computed(() => locale.value.code),
    dir: computed<Direction>(() => locale.value.dir),
  }
}
