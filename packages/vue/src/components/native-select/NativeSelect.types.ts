import type { VNode } from 'vue'

import type { ValidationBehavior } from '@/components/form/context'
import type { FormFieldProps } from '@/components/form/types'
import type { ValidateFn, ValidationResult } from '@/composables/useFieldValidation'
import type { ComponentSlots, ComponentVariants } from '@/types/tv'
import type { ClassValue } from '@/utils/tv'

import type theme from './theme'

type NativeSelect = typeof theme

/** An `<option>`: a plain string is used as both value and label. */
export type NativeSelectOption =
  | string
  | {
      /** The submitted value. */
      value: string
      /** The visible text. Defaults to `value`. */
      label?: string
      /** Whether the option can't be chosen. */
      disabled?: boolean
    }

/** An `<optgroup>` holding options. */
export type NativeSelectGroup = {
  /** The group heading. */
  label: string
  /** The options in the group. */
  items: NativeSelectOption[]
  /** Whether every option in the group is disabled. */
  disabled?: boolean
}

/** One entry of `NativeSelect`'s `items`: an option, or a group of options rendered as an `<optgroup>`. */
export type NativeSelectItem = NativeSelectOption | NativeSelectGroup

/**
 * Props of `NativeSelect`: a styled native `<select>` with a label, description and error message, for when
 * the platform's own picker is preferred over a custom listbox.
 */
export type NativeSelectProps = {
  /** The selected value. Bind with `v-model`. */
  modelValue?: string
  /** The initial value when uncontrolled. */
  defaultValue?: string
  /** The options and groups to render. Options in the default slot render after them. */
  items?: NativeSelectItem[]
  /** Text of a first empty option (`value=""`), shown while nothing is selected. */
  placeholder?: string
  /** The label rendered above the select. */
  label?: string
  /** Help text rendered below the select. Hidden while invalid. */
  description?: string
  /** Error message rendered below the select while invalid. Defaults to the validation errors. */
  errorMessage?: string
  /**
   * Visual style. Use `secondary` on surfaces.
   * @defaultValue 'primary'
   */
  variant?: ComponentVariants<NativeSelect>['variant']
  /**
   * Whether the select fills the width of its container.
   * @defaultValue false
   */
  fullWidth?: boolean
  /**
   * Whether the select is disabled.
   * @defaultValue false
   */
  disabled?: boolean
  /**
   * Whether the select is invalid. Sets `aria-invalid` on the select and `data-invalid` on the root. Overrides validation when set.
   * @defaultValue undefined
   */
  invalid?: boolean
  /**
   * Whether a non-empty value is required before form submission.
   * @defaultValue false
   */
  required?: boolean
  /** Validates the value. Return an error message (or several) when invalid. */
  validate?: ValidateFn<string>
  /**
   * `native` blocks form submission and shows errors on change or submit; `aria` shows errors in realtime.
   * Defaults to the surrounding `Form`.
   * @defaultValue 'native'
   */
  validationBehavior?: ValidationBehavior
  /** The name of the select, used when submitting an HTML form. */
  name?: string
  /** The `autocomplete` hint of the select, e.g. `country`. */
  autocomplete?: string
  /** The id of the select. Generated when omitted. */
  id?: string
  /** Additional classes merged into the root element. */
  class?: ClassValue
  /** Per-slot class overrides. */
  ui?: ComponentSlots<NativeSelect>
} & FormFieldProps

/** Slots of `NativeSelect`. */
export type NativeSelectSlots = {
  /** `<option>` and `<optgroup>` elements, rendered after `items`. */
  default?: () => VNode[]
  /** The label content. Replaces the `label` prop. */
  label?: () => VNode[]
  /** The description content. Replaces the `description` prop. */
  description?: () => VNode[]
  /** The error content, rendered while invalid. Replaces the `errorMessage` prop. */
  error?: (props: ValidationResult) => VNode[]
  /** The icon at the end of the select. Replaces the chevron. */
  indicator?: () => VNode[]
}
