import type { ComponentSlots, ComponentVariants } from '@/types/tv'
import type { ClassValue } from '@/utils/tv'

import type theme from './theme'

type Spinner = typeof theme

export type SpinnerProps = {
  /**
   * Size of the spinner.
   * @defaultValue 'md'
   */
  size?: ComponentVariants<Spinner>['size']
  /**
   * Color of the spinner.
   * @defaultValue 'accent'
   */
  color?: ComponentVariants<Spinner>['color']
  /** Additional classes merged into the root element. */
  class?: ClassValue
  /** Per-slot class overrides. */
  ui?: ComponentSlots<Spinner>
}
