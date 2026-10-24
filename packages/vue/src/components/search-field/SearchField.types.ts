import type { VNode } from 'vue'

import type { ValidationBehavior } from '@/components/form/context'
import type { FormFieldProps } from '@/components/form/types'
import type { ValidateFn, ValidationResult } from '@/composables/useFieldValidation'
import type { ComponentSlots } from '@/types/tv'
import type { ClassValue } from '@/utils/tv'

import type theme from './theme'

type SearchField = typeof theme

/** Props of `SearchField`, a text input for search queries with a search icon and a clear button. */
export type SearchFieldProps = {
  /** Label text rendered above the field. */
  label?: string
  /** Helper text rendered below the field. Hidden while the field is invalid. */
  description?: string
  /** Error message rendered below the field while invalid. Defaults to the validation errors. */
  errorMessage?: string
  /**
   * The id of the input; label, description and error ids derive from it.
   * @defaultValue useId()
   */
  id?: string
  /** The name of the input, used when submitting a form. */
  name?: string
  /** Temporary text shown when the input is empty. */
  placeholder?: string
  /** The initial value when uncontrolled (no `v-model`). */
  defaultValue?: string
  /**
   * Visual variant of the field.
   * @defaultValue 'primary'
   */
  variant?: 'primary' | 'secondary'
  /**
   * Whether the field takes the full width of its container.
   * @defaultValue false
   */
  fullWidth?: boolean
  /**
   * Whether the field is disabled.
   * @defaultValue false
   */
  disabled?: boolean
  /**
   * Whether the field is invalid. Overrides validation when set.
   * @defaultValue undefined
   */
  invalid?: boolean
  /**
   * Whether the field is required.
   * @defaultValue false
   */
  required?: boolean
  /**
   * Whether the input can be selected but not changed.
   * @defaultValue false
   */
  readonly?: boolean
  /** Validates the value. Return an error message (or several) when invalid, `true`/`null`/`undefined` when valid. */
  validate?: ValidateFn<string>
  /**
   * `native` blocks form submission and shows errors on change or submit; `aria` shows errors in realtime.
   * Defaults to the surrounding `Form`.
   * @defaultValue 'native'
   */
  validationBehavior?: ValidationBehavior
  /** Additional classes merged into the root element. */
  class?: ClassValue
  /** Per-slot class overrides. */
  ui?: ComponentSlots<SearchField>
} & FormFieldProps

/** Slots of `SearchField`. */
export type SearchFieldSlots = {
  /** Label content. Replaces the `label` prop. */
  label?: () => VNode[]
  /** Replaces the default search icon. */
  icon?: () => VNode[]
  /** Replaces the default clear (×) icon inside the clear button. */
  clearIcon?: () => VNode[]
  /** Description content. Replaces the `description` prop. */
  description?: () => VNode[]
  /** Error content, rendered while invalid. Replaces the `errorMessage` prop. */
  error?: (props: ValidationResult) => VNode[]
}

/** Events emitted by `SearchField`. */
export type SearchFieldEmits = {
  /** Emitted when the value changes. */
  'update:modelValue': [value: string]
  /** Emitted when the user presses Enter inside the input. */
  submit: [value: string]
  /** Emitted when the value is cleared, via the clear button or Escape. */
  clear: []
}
