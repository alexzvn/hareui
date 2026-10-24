import type { ConfigProviderProps } from 'reka-ui'

import type { ToastProviderProps } from '@/components/toast-provider/ToastProvider.types'
import type { PortalTarget } from '@/config'

export type AppProps = {
  /**
   * The reading direction of the application, inherited by every directional primitive.
   * @defaultValue 'ltr'
   */
  dir?: ConfigProviderProps['dir']
  /**
   * The locale (BCP 47 code) of the application, inherited by the date, number and calendar components.
   * @defaultValue 'en'
   */
  locale?: string
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

export type AppSlots = {
  /** The application. */
  default?: () => unknown
}
