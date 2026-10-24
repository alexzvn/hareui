import type { VNode } from 'vue'

import type { ValidationBehavior } from '@/components/form/context'
import type { FormFieldProps } from '@/components/form/types'
import type { ValidateFn, ValidationResult } from '@/composables/useFieldValidation'
import type { ComponentSlots, ComponentVariants } from '@/types/tv'
import type { ClassValue } from '@/utils/tv'

import type theme from './theme'

type RadioButtonGroup = typeof theme

/** Props of `RadioButtonGroup`: a single-selection group of card-style radio buttons. */
export type RadioButtonGroupProps = {
  /** The value selected initially when uncontrolled. */
  defaultValue?: string
  /** The group label. */
  label?: string
  /** Help text rendered below the group label. */
  description?: string
  /** Error message rendered below the items while invalid. Defaults to the validation errors. */
  errorMessage?: string
  /**
   * Whether the group is invalid. Overrides validation when set.
   * @defaultValue undefined
   */
  invalid?: boolean
  /**
   * Whether the whole group is disabled.
   * @defaultValue false
   */
  disabled?: boolean
  /**
   * Whether the group is read only: items stay focusable and announced, but the selection can't change.
   * @defaultValue false
   */
  readonly?: boolean
  /**
   * Whether a selection is required before form submission.
   * @defaultValue false
   */
  required?: boolean
  /** Validates the selected value (not called while nothing is selected). Return an error message (or several) when invalid. */
  validate?: ValidateFn<string>
  /**
   * `native` blocks form submission and shows errors on change or submit; `aria` shows errors in realtime.
   * Defaults to the surrounding `Form`.
   * @defaultValue 'native'
   */
  validationBehavior?: ValidationBehavior
  /** The name of the group, used when submitting an HTML form. */
  name?: string
  /**
   * How the items are laid out. `grid` makes the root a CSS grid: set the columns with a class such as `grid-cols-3`.
   * @defaultValue 'flex'
   */
  layout?: ComponentVariants<RadioButtonGroup>['layout']
  /**
   * Visual style of the default radio indicator. Use `secondary` on a surface.
   * @defaultValue 'primary'
   */
  variant?: ComponentVariants<RadioButtonGroup>['variant']
  /** The arrow keys that move focus. Both axes work when omitted. */
  orientation?: 'horizontal' | 'vertical'
  /** Base id of the group. Generated when omitted. */
  id?: string
  /** Additional classes merged into the root element. */
  class?: ClassValue
  /** Per-slot class overrides, applied to every item. */
  ui?: ComponentSlots<RadioButtonGroup>
} & FormFieldProps

/** Slots of `RadioButtonGroup`. */
export type RadioButtonGroupSlots = {
  /** The `RadioButtonGroupItem` components. */
  default?: () => VNode[]
  /** The group label content. Replaces the `label` prop. */
  label?: () => VNode[]
  /** The group description content. Replaces the `description` prop. */
  description?: () => VNode[]
  /** The error content, rendered while invalid. Replaces the `errorMessage` prop. */
  error?: (props: ValidationResult) => VNode[]
}
