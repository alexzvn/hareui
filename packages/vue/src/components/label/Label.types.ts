import type { PrimitiveProps } from 'reka-ui'
import type { VNode } from 'vue'

import type { ComponentSlots } from '@/types/tv'
import type { ClassValue } from '@/utils/tv'

import type theme from './theme'

type Label = typeof theme

export type LabelProps = {
  /**
   * The element or component to render as. Use `span` for a group label named via `aria-labelledby`, which has no single control for `for`.
   * @defaultValue 'label'
   */
  as?: PrimitiveProps['as']
  /** The id of the form control the label is associated with. Only applied when rendered as a `label`. */
  for?: string
  /**
   * Whether the label is disabled.
   * @defaultValue false
   */
  disabled?: boolean
  /**
   * Whether the label is in an invalid state.
   * @defaultValue false
   */
  invalid?: boolean
  /**
   * Whether the label shows a required asterisk.
   * @defaultValue false
   */
  required?: boolean
  /** Additional classes merged into the root element. */
  class?: ClassValue
  /** Per-slot class overrides. */
  ui?: ComponentSlots<Label>
}

export type LabelSlots = {
  /** The label content. */
  default?: () => VNode[]
}
