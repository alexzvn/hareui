import type { PrimitiveProps } from 'reka-ui'
import type { VNode } from 'vue'

import type { ComponentSlots, ComponentVariants } from '@/types/tv'
import type { ClassValue } from '@/utils/tv'

import type theme from './theme'

type Alert = typeof theme

export type AlertProps = {
  /**
   * The element or component to render as.
   * @defaultValue 'div'
   */
  as?: PrimitiveProps['as']
  /**
   * The visual status of the alert. Also picks the default indicator icon.
   * @defaultValue 'default'
   */
  status?: ComponentVariants<Alert>['status']
  /** Title text. */
  title?: string
  /** Description text rendered under the title. */
  description?: string
  /**
   * Show the indicator. Set to `false` to render the alert without one.
   * @defaultValue true
   */
  indicator?: boolean
  /** Additional classes merged into the root element. */
  class?: ClassValue
  /** Per-slot class overrides. */
  ui?: ComponentSlots<Alert>
}

export type AlertSlots = {
  /** Content rendered inside the root before the indicator, without a wrapper (e.g. a decorative background). */
  leading?: () => VNode[]
  /** Replaces the status icon inside the indicator. */
  indicator?: () => VNode[]
  /** Replaces the title text. */
  title?: () => VNode[]
  /** Replaces the description text. */
  description?: () => VNode[]
  /** Extra content rendered inside the content wrapper, after the description (e.g. an action button). */
  default?: () => VNode[]
  /** Content rendered after the content wrapper (e.g. actions or a close button). */
  trailing?: () => VNode[]
}
