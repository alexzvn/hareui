import type { VNode } from 'vue'

import type { ValidationBehavior } from '@/components/form/context'
import type { FormFieldProps } from '@/components/form/types'
import type { ValidateFn, ValidationResult } from '@/composables/useFieldValidation'
import type { ComponentSlots, ComponentVariants } from '@/types/tv'
import type { ClassValue } from '@/utils/tv'

import type theme from './theme'

type Switch = typeof theme

export type SwitchProps = {
  /** The checked state. Bind with `v-model`. */
  modelValue?: boolean
  /**
   * The initial checked state when uncontrolled.
   * @defaultValue false
   */
  defaultValue?: boolean
  /** The label rendered next to the control. */
  label?: string
  /** Help text rendered below the label. */
  description?: string
  /** Error message rendered below the label while invalid. Defaults to the validation errors. */
  errorMessage?: string
  /**
   * Size of the switch.
   * @defaultValue 'md'
   */
  size?: ComponentVariants<Switch>['size']
  /**
   * Whether the switch is disabled.
   * @defaultValue false
   */
  disabled?: boolean
  /**
   * Whether the switch is invalid. Sets `aria-invalid` on the control and `data-invalid` on the root. Overrides validation when set.
   * @defaultValue undefined
   */
  invalid?: boolean
  /**
   * Whether the switch is read only: focusable and announced, but its state can't be changed.
   * @defaultValue false
   */
  readonly?: boolean
  /**
   * Whether user input is required on the switch before form submission.
   * @defaultValue false
   */
  required?: boolean
  /** Validates the selection (`true` when on). Return an error message (or several) when invalid. */
  validate?: ValidateFn<boolean>
  /**
   * `native` blocks form submission and shows errors on change or submit; `aria` shows errors in realtime.
   * Defaults to the surrounding `Form`.
   * @defaultValue 'native'
   */
  validationBehavior?: ValidationBehavior
  /** The name of the switch, used when submitting an HTML form. */
  name?: string
  /**
   * The value of the switch, used when submitting an HTML form.
   * @defaultValue 'on'
   */
  value?: string
  /** The id of the switch control. Generated when omitted; use it to point an external `Label` at the switch. */
  id?: string
  /** Additional classes merged into the root element. */
  class?: ClassValue
  /** Per-slot class overrides. */
  ui?: ComponentSlots<Switch>
} & FormFieldProps

export type SwitchSlots = {
  /** The label content. Replaces the `label` prop. */
  label?: (props: { checked: boolean }) => VNode[]
  /** The description content. Replaces the `description` prop. */
  description?: (props: { checked: boolean }) => VNode[]
  /** The error content, rendered while invalid. Replaces the `errorMessage` prop. */
  error?: (props: ValidationResult) => VNode[]
  /** Icon rendered inside the thumb. */
  icon?: (props: { checked: boolean }) => VNode[]
}
