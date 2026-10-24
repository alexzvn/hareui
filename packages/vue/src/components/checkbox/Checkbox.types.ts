import type { VNode } from 'vue'

import type { ValidationBehavior } from '@/components/form/context'
import type { FormFieldProps } from '@/components/form/types'
import type { ValidateFn, ValidationResult } from '@/composables/useFieldValidation'
import type { ComponentSlots, ComponentVariants } from '@/types/tv'
import type { ClassValue } from '@/utils/tv'

import type theme from './theme'

type Checkbox = typeof theme

export type CheckboxState = 'checked' | 'unchecked' | 'indeterminate'

export type CheckboxProps = {
  /** The checked state (`true`, `false` or `'indeterminate'`). Bind with `v-model`. */
  modelValue?: boolean | 'indeterminate'
  /**
   * The initial checked state when uncontrolled.
   * @defaultValue false
   */
  defaultValue?: boolean | 'indeterminate'
  /** The label rendered next to the control. */
  label?: string
  /** Help text rendered below the label. */
  description?: string
  /** Error message rendered below the label while invalid. Defaults to the validation errors. */
  errorMessage?: string
  /**
   * Visual style of the checkbox.
   * @defaultValue 'primary'
   */
  variant?: ComponentVariants<Checkbox>['variant']
  /**
   * Whether the checkbox is disabled.
   * @defaultValue false
   */
  disabled?: boolean
  /**
   * Whether the checkbox is invalid. Overrides validation when set.
   * @defaultValue undefined
   */
  invalid?: boolean
  /**
   * Whether the checkbox is read only: focusable and announced, but its state can't be changed.
   * @defaultValue false
   */
  readonly?: boolean
  /**
   * Whether user input is required on the checkbox before form submission.
   * @defaultValue false
   */
  required?: boolean
  /** Validates the selection (`true` when checked). Return an error message (or several) when invalid. */
  validate?: ValidateFn<boolean>
  /**
   * `native` blocks form submission and shows errors on change or submit; `aria` shows errors in realtime.
   * Defaults to the surrounding `Form`.
   * @defaultValue 'native'
   */
  validationBehavior?: ValidationBehavior
  /** The name of the checkbox, used when submitting an HTML form. */
  name?: string
  /**
   * The value of the checkbox, used when submitting an HTML form.
   * @defaultValue 'on'
   */
  value?: string
  /** The id of the checkbox control. Generated when omitted; use it to point an external `Label` at the checkbox. */
  id?: string
  /** Additional classes merged into the root element. */
  class?: ClassValue
  /** Per-slot class overrides. */
  ui?: ComponentSlots<Checkbox>
} & FormFieldProps

export type CheckboxSlots = {
  /** The label content. Replaces the `label` prop. */
  label?: (props: { state: CheckboxState }) => VNode[]
  /** The description content. Replaces the `description` prop. */
  description?: (props: { state: CheckboxState }) => VNode[]
  /** The error content, rendered while invalid. Replaces the `errorMessage` prop. */
  error?: (props: ValidationResult) => VNode[]
  /** Custom indicator inside the control. Replaces the default checkmark / dash icons. */
  indicator?: (props: { state: CheckboxState }) => VNode[]
}
