import type { VNode } from 'vue'

import type { ValidationBehavior } from '@/components/form/context'
import type { FormFieldProps } from '@/components/form/types'
import type { ValidateFn, ValidationResult } from '@/composables/useFieldValidation'
import type { ComponentSlots, ComponentVariants } from '@/types/tv'
import type { ClassValue } from '@/utils/tv'

import type theme from './theme'

type RadioGroup = typeof theme

export type RadioGroupItem = {
  /** The value submitted and bound to `v-model` when the item is selected. */
  value: string
  /** The item label. */
  label?: string
  /** Help text rendered below the item label. */
  description?: string
  /** Whether the item is disabled. */
  disabled?: boolean
}

export type RadioGroupProps<T extends RadioGroupItem = RadioGroupItem> = {
  /** The radio items. */
  items?: T[]
  /** The value selected initially when uncontrolled. */
  defaultValue?: string
  /** The group label. */
  label?: string
  /** Help text rendered below the group label. */
  description?: string
  /** Error message rendered below the items while invalid. Defaults to the validation errors. */
  errorMessage?: string
  /**
   * Whether the group is invalid. Overrides validation when set.
   * @defaultValue undefined
   */
  invalid?: boolean
  /**
   * Whether the whole group is disabled.
   * @defaultValue false
   */
  disabled?: boolean
  /**
   * Whether the group is read only: items stay focusable and announced, but the selection can't change.
   * @defaultValue false
   */
  readonly?: boolean
  /**
   * Whether a selection is required before form submission.
   * @defaultValue false
   */
  required?: boolean
  /** Validates the selected value (not called while nothing is selected). Return an error message (or several) when invalid. */
  validate?: ValidateFn<string>
  /**
   * `native` blocks form submission and shows errors on change or submit; `aria` shows errors in realtime.
   * Defaults to the surrounding `Form`.
   * @defaultValue 'native'
   */
  validationBehavior?: ValidationBehavior
  /** The name of the group, used when submitting an HTML form. */
  name?: string
  /**
   * The axis the items are laid out along.
   * @defaultValue 'vertical'
   */
  orientation?: ComponentVariants<RadioGroup>['orientation']
  /**
   * Visual style of the radios.
   * @defaultValue 'primary'
   */
  variant?: ComponentVariants<RadioGroup>['variant']
  /** Base id of the group; item controls get `${id}-${index}`. Generated when omitted. */
  id?: string
  /** Additional classes merged into the root element. */
  class?: ClassValue
  /** Per-slot class overrides. */
  ui?: ComponentSlots<RadioGroup>
} & FormFieldProps

export type RadioGroupSlots<T extends RadioGroupItem = RadioGroupItem> = {
  /** The group label content. Replaces the `label` prop. */
  label?: () => VNode[]
  /** The group description content. Replaces the `description` prop. */
  description?: () => VNode[]
  /** The error content, rendered while invalid. Replaces the `errorMessage` prop. */
  error?: (props: ValidationResult) => VNode[]
  /** The label of each item. Replaces `item.label`. */
  'item-label'?: (props: { item: T; index: number }) => VNode[]
  /** The description of each item. Replaces `item.description`. */
  'item-description'?: (props: { item: T; index: number }) => VNode[]
  /** Custom content inside each control. Replaces the default dot. */
  indicator?: (props: { item: T; checked: boolean }) => VNode[]
}
