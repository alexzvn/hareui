import type { ValidationBehavior } from '@/components/form/context'
import type { FormFieldValidationProps } from '@/components/form/types'
import type { ValidateFn } from '@/composables/useFieldValidation'
import type { ComponentSlots, ComponentVariants } from '@/types/tv'
import type { ModelModifiers } from '@/utils/modelModifiers'
import type { ClassValue } from '@/utils/tv'

import type theme from './theme'

type Input = typeof theme

/** Props of `Input`: a styled native `<input>`, used on its own or inside a `TextField`, which supplies its id, label and validation. */
export type InputProps = {
  /**
   * The native input type.
   * @defaultValue 'text'
   */
  type?: string
  /** The id of the input. Defaults to the id provided by a surrounding `TextField`. */
  id?: string
  /** The name of the input, used when submitting a form. */
  name?: string
  /** Temporary text shown when the input is empty. */
  placeholder?: string
  /** The initial value when uncontrolled (no `v-model`). */
  defaultValue?: string | number
  /**
   * `v-model` modifiers: `trim`, `number`, `lazy` (update on change), `nullable` (empty → `null`), `optional`
   * (empty → `undefined`). Inside a `TextField`, an Input without its own `v-model` follows the field's.
   */
  modelModifiers?: ModelModifiers
  /**
   * Visual variant of the input. Defaults to the surrounding `TextField` variant.
   * @defaultValue 'primary'
   */
  variant?: ComponentVariants<Input>['variant']
  /**
   * Whether the input takes the full width of its container.
   * @defaultValue false
   */
  fullWidth?: boolean
  /**
   * Whether the input is disabled.
   * @defaultValue false
   */
  disabled?: boolean
  /**
   * Whether the input is invalid.
   * @defaultValue false
   */
  invalid?: boolean
  /**
   * Whether the input is required.
   * @defaultValue false
   */
  required?: boolean
  /**
   * Whether the input can be selected but not changed. Defaults to the surrounding `TextField`.
   * @defaultValue false
   */
  readonly?: boolean
  /** Validates the value when used without a `TextField` (inside one, set `validate` on the TextField). */
  validate?: ValidateFn<string | number>
  /**
   * Validation behavior when used without a `TextField`. Defaults to the surrounding `Form`.
   * @defaultValue 'native'
   */
  validationBehavior?: ValidationBehavior
  /** Additional classes merged into the root element. */
  class?: ClassValue
  /** Per-slot class overrides. */
  ui?: ComponentSlots<Input>
} & FormFieldValidationProps
