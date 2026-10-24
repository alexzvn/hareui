import type { PrimitiveProps } from 'reka-ui'
import type { VNode } from 'vue'

import type { ComponentSlots } from '@/types/tv'
import type { ClassValue } from '@/utils/tv'

import type theme from './theme'

type Fieldset = typeof theme

export type FieldsetProps = {
  /**
   * The element or component to render as.
   * @defaultValue 'fieldset'
   */
  as?: PrimitiveProps['as']
  /** The legend text. */
  legend?: string
  /** Help text rendered below the legend. */
  description?: string
  /**
   * Disables every control inside, like a native `<fieldset disabled>`, including div-based ones.
   * @defaultValue false
   */
  disabled?: boolean
  /** Additional classes merged into the root element. */
  class?: ClassValue
  /** Per-slot class overrides. */
  ui?: ComponentSlots<Fieldset>
}

export type FieldsetSlots = {
  /** The legend content. Replaces the `legend` prop. */
  legend?: () => VNode[]
  /** The description content. Replaces the `description` prop. */
  description?: () => VNode[]
  /** Form fields, rendered inside the field group. */
  default?: () => VNode[]
  /** Action buttons or helper text below the fields. */
  actions?: () => VNode[]
}
