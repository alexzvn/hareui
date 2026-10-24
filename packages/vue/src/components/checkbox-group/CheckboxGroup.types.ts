import type { VNode } from 'vue'

import type checkboxTheme from '@/components/checkbox/theme'
import type { ValidationBehavior } from '@/components/form/context'
import type { FormFieldProps } from '@/components/form/types'
import type { ValidateFn, ValidationResult } from '@/composables/useFieldValidation'
import type { ComponentSlots, ComponentVariants } from '@/types/tv'
import type { ClassValue } from '@/utils/tv'

import type theme from './theme'

type CheckboxGroup = typeof theme
type Checkbox = typeof checkboxTheme

export type CheckboxGroupItem = {
  /** The value added to / removed from `v-model` when the item is toggled. */
  value: string
  /** The item label. */
  label?: string
  /** Help text rendered below the item label. */
  description?: string
  /** Whether the item is disabled. */
  disabled?: boolean
}

export type CheckboxGroupProps<T extends CheckboxGroupItem = CheckboxGroupItem> = {
  /** The checkbox items. */
  items?: T[]
  /**
   * The values selected initially when uncontrolled.
   * @defaultValue []
   */
  defaultValue?: string[]
  /** The group label. */
  label?: string
  /** Help text rendered below the group label. */
  description?: string
  /** Error message rendered below the items while invalid. Defaults to the validation errors. */
  errorMessage?: string
  /**
   * Visual style of the checkboxes.
   * @defaultValue 'primary'
   */
  variant?: ComponentVariants<CheckboxGroup>['variant']
  /**
   * Whether the whole group is disabled.
   * @defaultValue false
   */
  disabled?: boolean
  /**
   * Whether the group is invalid. Overrides validation when set.
   * @defaultValue undefined
   */
  invalid?: boolean
  /**
   * Whether the group is read only: items stay focusable and announced, but the selection can't change.
   * @defaultValue false
   */
  readonly?: boolean
  /**
   * Whether at least one item must be selected before form submission.
   * @defaultValue false
   */
  required?: boolean
  /** Validates the selected values. Return an error message (or several) when invalid. */
  validate?: ValidateFn<string[]>
  /**
   * `native` blocks form submission and shows errors on change or submit; `aria` shows errors in realtime.
   * Defaults to the surrounding `Form`.
   * @defaultValue 'native'
   */
  validationBehavior?: ValidationBehavior
  /** The name of the group, used when submitting an HTML form. */
  name?: string
  /** Base id of the group; item controls get `${id}-${index}`. Generated when omitted. */
  id?: string
  /** Additional classes merged into the root element. */
  class?: ClassValue
  /** Per-slot class overrides. `item` is each checkbox's root; `content`, `control` and `indicator` are the `checkbox` theme's. */
  ui?: ComponentSlots<CheckboxGroup> &
    Pick<ComponentSlots<Checkbox>, 'content' | 'control' | 'indicator'> & { item?: ClassValue }
} & FormFieldProps

export type CheckboxGroupSlots<T extends CheckboxGroupItem = CheckboxGroupItem> = {
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
  /** Custom content inside each control. Replaces the default checkmark. */
  indicator?: (props: { item: T; checked: boolean }) => VNode[]
}
