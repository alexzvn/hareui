import type { VNode } from 'vue'

import type { ValidationBehavior } from '@/components/form/context'
import type { FormFieldProps } from '@/components/form/types'
import type { InputProps } from '@/components/input/Input.types'
import type { ValidateFn, ValidationResult } from '@/composables/useFieldValidation'
import type { ComponentSlots } from '@/types/tv'
import type { ClassValue } from '@/utils/tv'

import type theme from './theme'

type TextField = typeof theme

/** Props of the `TextField` component: a labelled input with description, error message and validation. */
export type TextFieldProps = {
  /** Label text rendered above the input. */
  label?: string
  /** Helper text rendered below the input. Hidden while the field is invalid. */
  description?: string
  /** Error message rendered below the input while invalid. Defaults to the validation errors. */
  errorMessage?: string
  /**
   * The id of the input; label, description and error ids derive from it.
   * @defaultValue useId()
   */
  id?: string
  /** The name of the input, used when submitting a form. */
  name?: string
  /**
   * The native input type.
   * @defaultValue 'text'
   */
  type?: string
  /** Temporary text shown when the input is empty. */
  placeholder?: string
  /** The initial value when uncontrolled (no `v-model`). */
  defaultValue?: string | number
  /**
   * Visual variant of the input.
   * @defaultValue 'primary'
   */
  variant?: InputProps['variant']
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
  validate?: ValidateFn<string | number>
  /**
   * `native` blocks form submission and shows errors on change or submit; `aria` shows errors in realtime.
   * Defaults to the surrounding `Form`.
   * @defaultValue 'native'
   */
  validationBehavior?: ValidationBehavior
  /** Additional classes merged into the root element. */
  class?: ClassValue
  /** Per-slot class overrides. */
  ui?: ComponentSlots<TextField>
} & FormFieldProps

/** Props passed to the `TextField` default slot, for wiring a custom control to the field. */
export type TextFieldSlotProps = {
  /** Id to put on the control so the field's label points at it. */
  id: string
  /** Space-separated ids of the rendered description and error elements, for the control's `aria-describedby`. */
  describedBy: string | undefined
  /** Whether the field is invalid (from the `invalid` prop or validation). */
  invalid: boolean
  /** Whether the field is disabled. */
  disabled: boolean
  /** Whether the field is required. */
  required: boolean
  /** Whether the field's value can be selected but not changed. */
  readonly: boolean
  /** Whether any element inside the field has focus. */
  focusWithin: boolean
  /** Whether that focus is keyboard-visible (`:focus-visible`). */
  focusVisible: boolean
}

/** Slots of the `TextField` component. */
export type TextFieldSlots = {
  /** Label content. Replaces the `label` prop. */
  label?: () => VNode[]
  /** Control slot. Replaces the default `Input` (e.g. an `Input` with custom props); `Input`s inside read the field context. */
  default?: (props: TextFieldSlotProps) => VNode[]
  /** Description content. Replaces the `description` prop. */
  description?: () => VNode[]
  /** Error content, rendered while invalid. Replaces the `errorMessage` prop. */
  error?: (props: ValidationResult) => VNode[]
}
