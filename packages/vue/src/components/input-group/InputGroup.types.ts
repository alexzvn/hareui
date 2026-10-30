import type { VNode } from 'vue'

import type { ValidationBehavior } from '@/components/form/context'
import type { FormFieldProps } from '@/components/form/types'
import type { ValidateFn } from '@/composables/useFieldValidation'
import type { ComponentSlots, ComponentVariants } from '@/types/tv'
import type { ClassValue } from '@/utils/tv'

import type theme from './theme'

type InputGroup = typeof theme

/** Props of `InputGroup`, a text input (or textarea) with prefix and suffix content inside one field frame. */
export type InputGroupProps = {
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
   * Visual variant of the group. Defaults to the surrounding `TextField` variant.
   * @defaultValue 'primary'
   */
  variant?: ComponentVariants<InputGroup>['variant']
  /**
   * Whether the input group takes the full width of its container.
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
  /** Text content rendered before the input. Replaced by the `#prefix` slot. */
  prefix?: string
  /** Text content rendered after the input. Replaced by the `#suffix` slot. */
  suffix?: string
  /**
   * Renders a multiline `<textarea>` (`data-slot="input-group-textarea"`) instead of the input.
   * The group then grows with the content and aligns the prefix/suffix to the top.
   * @defaultValue false
   */
  textarea?: boolean
  /** Number of visible text lines when `textarea` is set. */
  rows?: number
  /** Additional classes merged into the root element. */
  class?: ClassValue
  /** Per-slot class overrides. */
  ui?: ComponentSlots<InputGroup>
} & FormFieldProps

/** Slots of `InputGroup`. */
export type InputGroupSlots = {
  /** Content rendered before the input (icon, text or a button). Replaces the `prefix` prop. */
  prefix?: () => VNode[]
  /** Content rendered after the input (icon, text or a button). Replaces the `suffix` prop. */
  suffix?: () => VNode[]
}
