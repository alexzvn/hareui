import type { VNode } from 'vue'

import type { ButtonProps } from '@/components/button/Button.types'
import type { ValidationBehavior } from '@/components/form/context'
import type { FormFieldValidationProps } from '@/components/form/types'
import type { ValidateFn, ValidationResult } from '@/composables/useFieldValidation'
import type { ComponentSlots } from '@/types/tv'
import type { ClassValue } from '@/utils/tv'

import type theme from './theme'

type NumberStepper = typeof theme

/** Props for `NumberStepper`, a numeric value adjusted with increment and decrement buttons. */
export type NumberStepperProps = {
  /** Label text rendered above the stepper. */
  label?: string
  /** Helper text rendered below the stepper. Hidden while the field is invalid. */
  description?: string
  /** Error message rendered below the stepper while invalid. Defaults to the validation errors. */
  errorMessage?: string
  /**
   * The id of the input; label, description and error ids derive from it.
   * @defaultValue useId()
   */
  id?: string
  /** The name of the value, used when submitting a form. */
  name?: string
  /** The initial value when uncontrolled (no `v-model`). */
  defaultValue?: number
  /** The smallest allowed value. The decrement button is disabled at this value. */
  min?: number
  /** The largest allowed value. The increment button is disabled at this value. */
  max?: number
  /**
   * The amount the value changes per press. When set, values are also snapped to it (relative to `min`).
   * @defaultValue 1 (0.01 with `formatOptions.style: 'percent'`)
   */
  step?: number
  /** Formatting options for the displayed value (`Intl.NumberFormat`). */
  formatOptions?: Intl.NumberFormatOptions
  /** Locale used to format the value. Defaults to the `ConfigProvider` locale. */
  locale?: string
  /**
   * Size of the buttons and the value.
   * @defaultValue 'md'
   */
  size?: 'sm' | 'md' | 'lg'
  /**
   * Places the increment button first and the decrement button last.
   * @defaultValue false
   */
  reversed?: boolean
  /**
   * Renders the increment button. Pass `Button` props (`variant`, `size`, …) to render a `Button` instead of the built-in one.
   * @defaultValue true
   */
  increment?: boolean | Omit<ButtonProps, 'as' | 'type' | 'disabled' | 'pending'>
  /**
   * Renders the decrement button. Pass `Button` props (`variant`, `size`, …) to render a `Button` instead of the built-in one.
   * @defaultValue true
   */
  decrement?: boolean | Omit<ButtonProps, 'as' | 'type' | 'disabled' | 'pending'>
  /**
   * Whether the stepper is disabled.
   * @defaultValue false
   */
  disabled?: boolean
  /**
   * Whether the stepper is invalid. Overrides validation when set.
   * @defaultValue undefined
   */
  invalid?: boolean
  /**
   * Whether a value is required.
   * @defaultValue false
   */
  required?: boolean
  /**
   * Whether the value can be read but not changed.
   * @defaultValue false
   */
  readonly?: boolean
  /** Validates the committed value (`NaN` while empty). Return an error message (or several) when invalid. */
  validate?: ValidateFn<number>
  /**
   * `native` blocks form submission and shows errors on commit or submit; `aria` shows errors in realtime.
   * Defaults to the surrounding `Form`.
   * @defaultValue 'native'
   */
  validationBehavior?: ValidationBehavior
  /** Additional classes merged into the root element. */
  class?: ClassValue
  /** Per-slot class overrides. */
  ui?: ComponentSlots<NumberStepper>
} & FormFieldValidationProps

/** Slots for `NumberStepper`. */
export type NumberStepperSlots = {
  /** Label content. Replaces the `label` prop. */
  label?: () => VNode[]
  /** Decrement button content. Defaults to a minus icon. */
  decrement?: () => VNode[]
  /** Value content. Defaults to the formatted value. */
  value?: (props: {
    /** The current value; `undefined` while empty. */
    value: number | undefined
    /** The value formatted with `formatOptions` and `locale`. */
    formattedValue: string
  }) => VNode[]
  /** Increment button content. Defaults to a plus icon. */
  increment?: () => VNode[]
  /** Description content. Replaces the `description` prop. */
  description?: () => VNode[]
  /** Error content, rendered while invalid. Replaces the `errorMessage` prop. */
  error?: (props: ValidationResult) => VNode[]
}
