import type { PrimitiveProps } from 'reka-ui'
import type { VNode } from 'vue'

import type { CloseButtonProp } from '@/types/closeButton'
import type { ComponentSlots, ComponentVariants } from '@/types/tv'
import type { ClassValue } from '@/utils/tv'

import type theme from './theme'

type Alert = typeof theme

/** Props of `Alert`: an inline status message with an indicator icon, a title and a description. */
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
  /**
   * Renders a close button; an object customises its `icon` and `label` (accessible name). Clicking it sets
   * `open` to `false`.
   * @defaultValue false
   */
  closeButton?: CloseButtonProp
  /** Additional classes merged into the root element. */
  class?: ClassValue
  /** Per-slot class overrides. */
  ui?: ComponentSlots<Alert>
}

/** Events emitted by `Alert`. */
export type AlertEmits = {
  /** Emitted when the close button hides the alert (`v-model:open`, default `true`). */
  'update:open': [value: boolean]
}

/** Slots of `Alert`, for replacing its parts or adding leading, trailing and extra content. */
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
