import type { VNode } from 'vue'

import type { FormFieldValidationProps } from '@/components/form/types'
import type { ComponentSlots, ComponentVariants } from '@/types/tv'
import type { ClassValue } from '@/utils/tv'

import type theme from './theme'

type FormField = typeof theme

/**
 * Props of `FormField`: a label, description, hint, help and error around any control. A HareUI field inside takes
 * the field's id, name and error state and hides its own label, description and error.
 */
export type FormFieldProps = {
  /** Label text rendered above the control. */
  label?: string
  /** Text rendered under the label, above the control. */
  description?: string
  /** Short text rendered beside the label, e.g. "Optional". */
  hint?: string
  /** Text rendered below the control. Replaced by the error while one shows. */
  help?: string
  /**
   * An error message, or `true` to mark the field invalid without one. `false` hides the error message, including the
   * `Form` error for `name` and the control's validation errors.
   */
  error?: boolean | string
  /**
   * Whether the label shows the required marker.
   * @defaultValue false
   */
  required?: boolean
  /** The name used by the control inside when it has none, and to show the `Form` error for this name. */
  name?: string
  /**
   * Text size of the label, hint, description, help and error (label 12/14/16px). Also the size of a HareUI field
   * inside that has a `size` and sets none.
   * @defaultValue 'md'
   */
  size?: ComponentVariants<FormField>['size']
  /** Additional classes merged into the root element. */
  class?: ClassValue
  /** Per-slot class overrides. */
  ui?: ComponentSlots<FormField>
} & FormFieldValidationProps

/** Props passed to the `FormField` default slot, for wiring a custom control. */
export type FormFieldSlotProps = {
  /** The displayed error: a message, `true` for an error without one, or `undefined`. */
  error: string | true | undefined
  /** The id to put on the control, so the label points at it. */
  id: string
  /** The name to put on the control. */
  name: string | undefined
  /** The id of the label, for `aria-labelledby` on controls a `<label>` can't target; `undefined` without a label. */
  labelId: string | undefined
  /** Ids of the rendered description, hint, help and error, for `aria-describedby`. */
  describedBy: string | undefined
  /** Whether the field has an error, for `aria-invalid`. */
  invalid: boolean
  /** Whether the field is marked required. */
  required: boolean
}

/** Slots of `FormField`. */
export type FormFieldSlots = {
  /** The control. */
  default?: (props: FormFieldSlotProps) => VNode[]
  /** The label content, replacing `label`. */
  label?: (props: { label: string | undefined }) => VNode[]
  /** The content beside the label, replacing `hint`. */
  hint?: (props: { hint: string | undefined }) => VNode[]
  /** The content under the label, replacing `description`. */
  description?: (props: { description: string | undefined }) => VNode[]
  /** The content below the control, replacing `help`. */
  help?: (props: { help: string | undefined }) => VNode[]
  /** The error content, replacing the message; rendered while the field has an error. */
  error?: (props: { error: string | true | undefined }) => VNode[]
}
