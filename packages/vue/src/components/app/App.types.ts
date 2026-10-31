import type { ConfigProviderProps } from 'reka-ui'

import type { ToastProviderProps } from '@/components/toast-provider/ToastProvider.types'
import type { PortalTarget } from '@/config'
import type { Locale } from '@/locale/defineLocale'

/**
 * Props of `App`, the root wrapper that provides direction, locale, portal target and a toaster to everything inside
 * it, and renders the overlays opened with `useOverlay()`.
 */
export type AppProps = {
  /**
   * The reading direction of the application, inherited by every directional primitive.
   * @defaultValue the `locale`'s `dir`, then 'ltr'
   */
  dir?: ConfigProviderProps['dir']
  /**
   * The locale of the application. A `Locale` from `defineLocale()` translates the built-in strings and sets the
   * `Intl` formatting code and direction; a BCP 47 code string only sets `Intl` formatting (dates, numbers,
   * calendars) and keeps the inherited strings.
   * @defaultValue English (`en`)
   */
  locale?: Locale | string
  /** The global scroll-lock behaviour of overlays (`false` leaves the body scrollable). */
  scrollBody?: ConfigProviderProps['scrollBody']
  /** The `nonce` applied to the inline styles the primitives inject (CSP). */
  nonce?: string
  /**
   * Where overlays render by default. `true` portals to `document.body`, a selector string or element is used as the teleport target, and `false` renders in place.
   * Equivalent to `createHareUI({ portal })` for this subtree; a component's own `portal` prop still wins.
   * @defaultValue inherited from `createHareUI`, then `true`
   */
  portal?: PortalTarget
  /**
   * Props of the `ToastProvider` the app renders; `null` renders none (render your own, or none at all).
   * @defaultValue {}
   */
  toaster?: ToastProviderProps | null
}

/** Slots of `App`. */
export type AppSlots = {
  /** The application. */
  default?: () => unknown
}
