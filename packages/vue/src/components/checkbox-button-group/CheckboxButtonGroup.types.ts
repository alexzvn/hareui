import type { VNode } from 'vue'

import type { ValidationBehavior } from '@/components/form/context'
import type { FormFieldValidationProps } from '@/components/form/types'
import type { ValidateFn, ValidationResult } from '@/composables/useFieldValidation'
import type { ComponentSlots, ComponentVariants } from '@/types/tv'
import type { ClassValue } from '@/utils/tv'

import type theme from './theme'

type CheckboxButtonGroup = typeof theme

/** Props of `CheckboxButtonGroup`: a multi-select group of card-like checkbox buttons with label, description and validation. Bind the selected values with `v-model`. */
export type CheckboxButtonGroupProps = {
  /**
   * The values selected initially when uncontrolled.
   * @defaultValue []
   */
  defaultValue?: string[]
  /** The group label. */
  label?: string
  /** Help text rendered below the group label. */
  description?: string
  /** Error message rendered below the items while invalid. Defaults to the validation errors. */
  errorMessage?: string
  /**
   * How the items are laid out. `grid` lets you set columns with a `grid-cols-*` class.
   * @defaultValue 'flex'
   */
  layout?: ComponentVariants<CheckboxButtonGroup>['layout']
  /**
   * Visual style of the default checkbox indicator. Use `secondary` on a surface.
   * @defaultValue 'primary'
   */
  variant?: ComponentVariants<CheckboxButtonGroup>['variant']
  /**
   * Whether the whole group is disabled.
   * @defaultValue false
   */
  disabled?: boolean
  /**
   * Whether the group is invalid. Overrides validation when set.
   * @defaultValue undefined
   */
  invalid?: boolean
  /**
   * Whether the group is read only: items stay focusable, but the selection can't change.
   * @defaultValue false
   */
  readonly?: boolean
  /**
   * Whether at least one item must be selected before form submission.
   * @defaultValue false
   */
  required?: boolean
  /** Validates the selected values. Return an error message (or several) when invalid. */
  validate?: ValidateFn<string[]>
  /**
   * `native` blocks form submission and shows errors on change or submit; `aria` shows errors in realtime.
   * Defaults to the surrounding `Form`.
   * @defaultValue 'native'
   */
  validationBehavior?: ValidationBehavior
  /** The name of the group, used when submitting an HTML form. */
  name?: string
  /** Base id of the group. Generated when omitted. */
  id?: string
  /** Additional classes merged into the root element. */
  class?: ClassValue
  /** Per-slot class overrides, applied to every item. */
  ui?: ComponentSlots<CheckboxButtonGroup>
} & FormFieldValidationProps

/** Slots of `CheckboxButtonGroup`: the items plus overrides for the label, description and error message. */
export type CheckboxButtonGroupSlots = {
  /** The `CheckboxButtonGroupItem` components. */
  default?: () => VNode[]
  /** The group label content. Replaces the `label` prop. */
  label?: () => VNode[]
  /** The group description content. Replaces the `description` prop. */
  description?: () => VNode[]
  /** The error content, rendered while invalid. Replaces the `errorMessage` prop. */
  error?: (props: ValidationResult) => VNode[]
}
