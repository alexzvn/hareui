import type { VNode } from 'vue'

import type { ValidationBehavior } from '@/components/form/context'
import type { FormFieldValidationProps } from '@/components/form/types'
import type { ValidateFn, ValidationResult } from '@/composables/useFieldValidation'
import type { ComponentSlots, ComponentVariants } from '@/types/tv'
import type { ClassValue } from '@/utils/tv'

import type theme from './theme'

type CellSwitch = typeof theme

/** Props of `CellSwitch`, a settings-list row with a label at the start and a switch at the end. */
export type CellSwitchProps = {
  /** The checked state. Bind with `v-model`. */
  modelValue?: boolean
  /**
   * The initial checked state when uncontrolled.
   * @defaultValue false
   */
  defaultValue?: boolean
  /** The text at the start of the row. */
  label?: string
  /**
   * Visual style of the row. Use `secondary` on a surface or card.
   * @defaultValue 'default'
   */
  variant?: ComponentVariants<CellSwitch>['variant']
  /** Error message rendered below the row while invalid. Defaults to the validation errors. */
  errorMessage?: string
  /**
   * Whether the switch is disabled.
   * @defaultValue false
   */
  disabled?: boolean
  /**
   * Whether the switch is invalid. Sets `aria-invalid` on the row and `data-invalid` on the root. Overrides validation when set.
   * @defaultValue undefined
   */
  invalid?: boolean
  /**
   * Whether the switch is read only: focusable and announced, but its state can't be changed.
   * @defaultValue false
   */
  readonly?: boolean
  /**
   * Whether the switch must be on before form submission.
   * @defaultValue false
   */
  required?: boolean
  /** Validates the selection (`true` when on). Return an error message (or several) when invalid. */
  validate?: ValidateFn<boolean>
  /**
   * `native` blocks form submission and shows errors on change or submit; `aria` shows errors in realtime.
   * Defaults to the surrounding `Form`.
   * @defaultValue 'native'
   */
  validationBehavior?: ValidationBehavior
  /** The name of the switch, used when submitting an HTML form. */
  name?: string
  /**
   * The value of the switch, used when submitting an HTML form.
   * @defaultValue 'on'
   */
  value?: string
  /** The id of the row's switch button. Generated when omitted. */
  id?: string
  /** Additional classes merged into the root element. */
  class?: ClassValue
  /** Per-slot class overrides. */
  ui?: ComponentSlots<CellSwitch>
} & FormFieldValidationProps

/** Events of `CellSwitch`. */
export type CellSwitchEmits = {
  /** Emitted when the checked state changes. */
  'update:modelValue': [value: boolean]
}

/** Slots of `CellSwitch`. */
export type CellSwitchSlots = {
  /** The content at the start of the row. Replaces the `label` prop. */
  label?: (props: { checked: boolean }) => VNode[]
  /** The error content, rendered below the row while invalid. Replaces the `errorMessage` prop. */
  error?: (props: ValidationResult) => VNode[]
  /** Icon rendered inside the switch thumb. */
  icon?: (props: { checked: boolean }) => VNode[]
}
