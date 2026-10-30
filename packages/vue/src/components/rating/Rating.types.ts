import type { Component, VNode } from 'vue'

import type { ValidationBehavior } from '@/components/form/context'
import type { FormFieldProps } from '@/components/form/types'
import type { ValidateFn, ValidationResult } from '@/composables/useFieldValidation'
import type { ComponentSlots, ComponentVariants } from '@/types/tv'
import type { ClassValue } from '@/utils/tv'

import type theme from './theme'

type Rating = typeof theme

/** The granularity each rating icon is divided into. */
export type RatingStep = 1 | 0.5 | 0.25 | 0.1

/** Props of `Rating`: a row of icons to display or collect a score, with label, description and validation. */
export type RatingProps = {
  /** The current value. Bind with `v-model`; `0` means no rating. */
  modelValue?: number
  /**
   * The value shown initially when uncontrolled. `0` means no rating.
   * @defaultValue 0
   */
  defaultValue?: number
  /**
   * The number of icons.
   * @defaultValue 5
   */
  length?: number
  /**
   * The granularity each icon is divided into: `0.5` allows half ratings. A read-only rating shows any fraction.
   * @defaultValue 1
   */
  step?: RatingStep
  /**
   * Whether pressing the current value again clears the rating to `0`.
   * @defaultValue false
   */
  clearable?: boolean
  /**
   * Whether the icons preview the value under the pointer.
   * @defaultValue false
   */
  hoverable?: boolean
  /**
   * Whether the rating only displays its value: it can't be focused or changed, and isn't dimmed.
   * @defaultValue false
   */
  readonly?: boolean
  /**
   * Whether the rating is disabled.
   * @defaultValue false
   */
  disabled?: boolean
  /**
   * Whether a rating is required before form submission.
   * @defaultValue false
   */
  required?: boolean
  /**
   * Whether the rating is invalid. Overrides validation when set.
   * @defaultValue undefined
   */
  invalid?: boolean
  /** Validates the value (not called while the value is `0`). Return an error message (or several) when invalid. */
  validate?: ValidateFn<number>
  /**
   * `native` blocks form submission and shows errors on change or submit; `aria` shows errors in realtime.
   * Defaults to the surrounding `Form`.
   * @defaultValue 'native'
   */
  validationBehavior?: ValidationBehavior
  /** The name of the rating, used when submitting an HTML form. */
  name?: string
  /** The label rendered above the icons. */
  label?: string
  /** Help text rendered below the label. */
  description?: string
  /** Error message rendered below the icons while invalid. Defaults to the validation errors. */
  errorMessage?: string
  /**
   * The icon of each item: a class string (such as `i-lucide-heart`) or a component. Defaults to the gravity-ui
   * `star-fill` icon.
   */
  icon?: string | Component
  /** The icon shown behind the filled part of each item. Defaults to `icon`. */
  emptyIcon?: string | Component
  /**
   * The accessible name of each selectable value.
   * @defaultValue (value, length) => `${value} out of ${length}`
   */
  itemLabel?: (value: number, length: number) => string
  /**
   * The color of the filled icons.
   * @defaultValue 'warning'
   */
  color?: ComponentVariants<Rating>['color']
  /**
   * The icon size: 16px, 20px or 28px.
   * @defaultValue 'md'
   */
  size?: ComponentVariants<Rating>['size']
  /**
   * The axis the icons are laid out along.
   * @defaultValue 'horizontal'
   */
  orientation?: ComponentVariants<Rating>['orientation']
  /** Base id of the rating; the label, description and error ids derive from it. Generated when omitted. */
  id?: string
  /** Additional classes merged into the root element. */
  class?: ClassValue
  /** Per-slot class overrides. */
  ui?: ComponentSlots<Rating>
} & FormFieldProps

/** Emits of `Rating`. */
export type RatingEmits = {
  /** Emitted when the value changes. */
  'update:modelValue': [value: number]
  /** Emitted after the user changes the rating, with the new value. */
  change: [value: number]
}

/** Props of the `Rating` `#item` slot. */
export type RatingItemSlotProps = {
  /** The 1-based position of the item. */
  index: number
  /** `false` for the empty layer behind the item, `true` for the filled layer clipped to the rated fraction. */
  filled: boolean
}

/** Slots of `Rating`. */
export type RatingSlots = {
  /** The label content. Replaces the `label` prop. */
  label?: () => VNode[]
  /** The description content. Replaces the `description` prop. */
  description?: () => VNode[]
  /** The error content, rendered while invalid. Replaces the `errorMessage` prop. */
  error?: (props: ValidationResult) => VNode[]
  /** The icon of each item, rendered once per layer. Replaces `icon` and `emptyIcon`. */
  item?: (props: RatingItemSlotProps) => VNode[]
}
