import type { ValidationBehavior } from '@/components/form/context'
import type { FormFieldProps } from '@/components/form/types'
import type { ValidateFn } from '@/composables/useFieldValidation'
import type { ComponentSlots, ComponentVariants } from '@/types/tv'
import type { ClassValue } from '@/utils/tv'

import type theme from './theme'

type TextArea = typeof theme

/** Props of `TextArea`, a multi-line text input usable alone or inside a `TextField`. */
export type TextAreaProps = {
  /** The id of the textarea. Defaults to the id provided by a surrounding `TextField`. */
  id?: string
  /** The name of the textarea, used when submitting a form. */
  name?: string
  /** Temporary text shown when the textarea is empty. */
  placeholder?: string
  /** The initial value when uncontrolled (no `v-model`). */
  defaultValue?: string | number
  /**
   * Visual variant of the textarea. Defaults to the surrounding `TextField` variant.
   * @defaultValue 'primary'
   */
  variant?: ComponentVariants<TextArea>['variant']
  /**
   * Whether the textarea takes the full width of its container.
   * @defaultValue false
   */
  fullWidth?: boolean
  /**
   * Whether the textarea is disabled.
   * @defaultValue false
   */
  disabled?: boolean
  /**
   * Whether the textarea is invalid.
   * @defaultValue false
   */
  invalid?: boolean
  /**
   * Whether the textarea is required.
   * @defaultValue false
   */
  required?: boolean
  /**
   * Whether the textarea can be selected but not changed. Defaults to the surrounding `TextField`.
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
  ui?: ComponentSlots<TextArea>
} & FormFieldProps
