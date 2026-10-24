import type { Color, ColorChannel, ColorSpace } from 'reka-ui'
import type { VNode } from 'vue'

import type { ValidationBehavior } from '@/components/form/context'
import type { FormFieldProps } from '@/components/form/types'
import type { ValidateFn, ValidationResult } from '@/composables/useFieldValidation'
import type { ComponentSlots } from '@/types/tv'
import type { ClassValue } from '@/utils/tv'

import type theme from './theme'

type ColorField = typeof theme

/** Props for `ColorField`, a text input for editing a color as hex or a single channel value. */
export type ColorFieldProps = {
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
  /** The name of the field, used when submitting a form. */
  name?: string
  /** Temporary text shown when the input is empty. */
  placeholder?: string
  /**
   * The committed color (controlled). A hex string or a Reka `Color` object; `null` shows an empty
   * input. Falls back to the enclosing `ColorPicker`'s color when neither this nor `v-model` is set.
   */
  modelValue?: string | Color | null
  /**
   * The initial value when uncontrolled (no `v-model`) and outside a `ColorPicker`. When omitted the
   * input starts empty (the submitted form value is still `#000000`).
   */
  defaultValue?: string | Color
  /** The color space to operate in when `channel` is set. */
  colorSpace?: ColorSpace
  /** The color channel to edit (e.g. `'hue'`, `'red'`, `'alpha'`). If unset, edits the hex value. */
  channel?: ColorChannel
  /** Locale used to format and parse channel numbers. Defaults to the `ConfigProvider` locale. */
  locale?: string
  /** Custom step for increment/decrement. Defaults to the channel's natural step, or 1 for hex. */
  step?: number
  /**
   * Whether changing the value with the mouse wheel is disabled.
   * @defaultValue false
   */
  disableWheelChange?: boolean
  /**
   * Visual variant of the group.
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
   * Whether the value can be selected but not changed.
   * @defaultValue false
   */
  readonly?: boolean
  /** Validates the committed color. Return an error message (or several) when invalid. */
  validate?: ValidateFn<Color>
  /**
   * `native` blocks form submission and shows errors on commit or submit; `aria` shows errors in realtime.
   * Defaults to the surrounding `Form`.
   * @defaultValue 'native'
   */
  validationBehavior?: ValidationBehavior
  /** Additional classes merged into the root element. */
  class?: ClassValue
  /** Per-slot class overrides. */
  ui?: ComponentSlots<ColorField>
} & FormFieldProps

/** Slots for `ColorField`. */
export type ColorFieldSlots = {
  /** Label content. Replaces the `label` prop. */
  label?: () => VNode[]
  /** Content rendered before the input, e.g. a `ColorSwatch`. */
  prefix?: () => VNode[]
  /** Content rendered after the input, e.g. a unit label. */
  suffix?: () => VNode[]
  /** Description content. Replaces the `description` prop. */
  description?: () => VNode[]
  /** Error content, rendered while invalid. Replaces the `errorMessage` prop. */
  error?: (props: ValidationResult) => VNode[]
}

/** Events emitted by `ColorField`. */
export type ColorFieldEmits = {
  /**
   * Emitted when the committed color changes (on blur, Enter, stepper or wheel). `null` when the
   * input is cleared.
   */
  'update:modelValue': [value: string | Color | null]
}
