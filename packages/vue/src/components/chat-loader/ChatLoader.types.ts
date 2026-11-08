import type { ComponentSlots, ComponentVariants } from '@/types/tv'
import type { ClassValue } from '@/utils/tv'

import type theme from './theme'

type ChatLoader = typeof theme

/** Props of `ChatLoader`. */
export type ChatLoaderProps = {
  /**
   * The indicator: typing `dots`, a `pulse` dot, a `spinner`, or a `skeleton` of an assistant message.
   * @defaultValue 'dots'
   */
  variant?: ComponentVariants<ChatLoader>['variant']
  /**
   * Scales the dots, the pulse, the spinner and the skeleton.
   * @defaultValue 'md'
   */
  size?: ComponentVariants<ChatLoader>['size']
  /**
   * The number of bars `skeleton` draws.
   * @defaultValue 3
   */
  lines?: number
  /**
   * Text screen readers announce while the loader shows.
   * @defaultValue 'Loading response' (locale `chatLoader.label`)
   */
  label?: string
  /** Additional classes merged into the root element. */
  class?: ClassValue
  /** Per-slot class overrides. */
  ui?: ComponentSlots<ChatLoader>
}
