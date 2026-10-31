import type { enMessages } from './en'

/** Reading direction of a locale. */
export type Direction = 'ltr' | 'rtl'

/** Every built-in string, nested by component. Shape of the English catalog. */
export type Messages = typeof enMessages

/** Makes every nested key optional: a locale may translate any subset of `Messages`. */
export type DeepPartial<T> = { [K in keyof T]?: T[K] extends string ? string : DeepPartial<T[K]> }

/** A translation catalog for the built-in strings, passed to `App` `locale`. */
export type Locale<M = DeepPartial<Messages>> = {
  /** The language's display name, e.g. `'English'`. */
  name: string
  /** The BCP 47 code used for `Intl` formatting (dates, numbers, calendars), e.g. `'en'`. */
  code: string
  /** The reading direction, applied to every directional primitive unless `App` `dir` is set. */
  dir: Direction
  /** The translated strings, nested by component. Missing keys fall back to English one by one. */
  messages: M
}

/** Options of `defineLocale()`. */
export type DefineLocaleOptions<M> = {
  /** The language's display name. */
  name: string
  /** The BCP 47 code used for `Intl` formatting. */
  code: string
  /**
   * The reading direction.
   * @defaultValue 'ltr'
   */
  dir?: Direction
  /** The translated strings, nested by component. */
  messages: M
}

/** Builds a `Locale` for `App` `locale`. Strings may contain `{param}` placeholders, filled in at render. */
export const defineLocale = <M extends DeepPartial<Messages> = DeepPartial<Messages>>(
  options: DefineLocaleOptions<M>,
): Locale<M> => ({
  ...options,
  dir: options.dir ?? 'ltr',
})
