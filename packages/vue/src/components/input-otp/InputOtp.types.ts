import type { VNode } from 'vue'

import type { ValidationBehavior } from '@/components/form/context'
import type { FormFieldProps } from '@/components/form/types'
import type { ValidateFn, ValidationResult } from '@/composables/useFieldValidation'
import type { ComponentSlots, ComponentVariants } from '@/types/tv'
import type { ClassValue } from '@/utils/tv'

import type theme from './theme'

type InputOtp = typeof theme

/** Props of `InputOtp`, a field for one-time codes split into one slot per character. */
export type InputOtpProps = {
  /** The current code. Bind with `v-model`. */
  modelValue?: string
  /** The initial code when uncontrolled (no `v-model`). */
  defaultValue?: string
  /**
   * Number of slots (characters) the code has.
   * @defaultValue 6
   */
  length?: number
  /**
   * Number of slots per visual group. A separator is rendered between groups, e.g. `[3, 3]` for a
   * 6-digit code split in half. Defaults to a single group of `length` slots (no separator).
   */
  groups?: number[]
  /**
   * Restricts which characters can be entered:
   * `'digits'` only allows `0-9`, `'chars'` only allows `a-z`/`A-Z`, `'alphanumeric'` allows both.
   * Unset allows any character.
   */
  pattern?: 'digits' | 'chars' | 'alphanumeric'
  /**
   * Visual variant of the slots.
   * @defaultValue 'primary'
   */
  variant?: ComponentVariants<InputOtp>['variant']
  /** Label text rendered above the field. */
  label?: string
  /** Help text rendered above the box, below the label. */
  description?: string
  /** Error message rendered below the field while invalid. Defaults to the validation errors. */
  errorMessage?: string
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
   * Whether all slots must be filled before form submission.
   * @defaultValue false
   */
  required?: boolean
  /** Validates the code. Return an error message (or several) when invalid, `true`/`null`/`undefined` when valid. */
  validate?: ValidateFn<string>
  /**
   * `native` blocks form submission and shows errors on change or submit; `aria` shows errors in realtime.
   * Defaults to the surrounding `Form`.
   * @defaultValue 'native'
   */
  validationBehavior?: ValidationBehavior
  /** The name of the field, used when submitting an HTML form. */
  name?: string
  /** The id of the underlying input; label, description and error ids derive from it. Generated when omitted. */
  id?: string
  /** Additional classes merged into the root element. */
  class?: ClassValue
  /** Per-slot class overrides. */
  ui?: ComponentSlots<InputOtp>
} & FormFieldProps

/** Slots of `InputOtp`. */
export type InputOtpSlots = {
  /** Label content. Replaces the `label` prop. */
  label?: () => VNode[]
  /** Description content. Replaces the `description` prop. */
  description?: () => VNode[]
  /** Error content, rendered while invalid. Replaces the `errorMessage` prop. */
  error?: (props: ValidationResult) => VNode[]
}

/** Events emitted by `InputOtp`. */
export type InputOtpEmits = {
  /** Emitted once, when every slot has just become filled. */
  complete: [value: string]
}
