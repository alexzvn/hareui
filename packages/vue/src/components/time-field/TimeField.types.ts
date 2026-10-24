import type { TimeFieldRootProps, TimeValue } from 'reka-ui'
import type { VNode } from 'vue'

import type dateInputGroupTheme from '@/components/date-input-group/theme'
import type { ValidationBehavior } from '@/components/form/context'
import type { FormFieldProps } from '@/components/form/types'
import type { ValidateFn, ValidationResult } from '@/composables/useFieldValidation'
import type { ComponentSlots } from '@/types/tv'
import type { ClassValue } from '@/utils/tv'

import type theme from './theme'

type TimeField = typeof theme
type DateInputGroup = typeof dateInputGroupTheme

// Reka doesn't export these as standalone types; derive them from the (exported) root props instead.
type HourCycle = NonNullable<TimeFieldRootProps['hourCycle']>
type TimeStep = NonNullable<TimeFieldRootProps['step']>

export type TimeFieldProps = {
  /** Label text rendered above the group. */
  label?: string
  /** Helper text rendered below the group. Hidden while the field is invalid. */
  description?: string
  /** Error message rendered below the group while invalid. Defaults to the validation errors. */
  errorMessage?: string
  /**
   * The id of the field; label, description and error ids derive from it.
   * @defaultValue useId()
   */
  id?: string
  /** The name of the value, used when submitting a form. */
  name?: string
  /** The initial value when uncontrolled (no `v-model`). */
  defaultValue?: TimeValue
  /** The placeholder time, used to determine which segments to show when no time is selected. Use `v-model:placeholder` to control it. */
  placeholder?: TimeValue
  /** The placeholder time when uncontrolled. */
  defaultPlaceholder?: TimeValue
  /**
   * The granularity of the field: which segments are rendered, up to and including this unit.
   * @defaultValue 'minute'
   */
  granularity?: 'hour' | 'minute' | 'second'
  /** The hour cycle used to format the time. Defaults to the locale's preference. */
  hourCycle?: HourCycle
  /**
   * The stepping interval for the time segments.
   * @defaultValue 1
   */
  step?: TimeStep
  /**
   * Whether to snap the value to the nearest `step` increment after input.
   * @defaultValue false
   */
  stepSnapping?: boolean
  /** Whether to hide the time zone segment. */
  hideTimeZone?: boolean
  /** The minimum selectable time. */
  minValue?: TimeValue
  /** The maximum selectable time. */
  maxValue?: TimeValue
  /** The locale used to format the field. Defaults to the `ConfigProvider` locale. */
  locale?: string
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
  /** Validates the committed value. Return an error message (or several) when invalid. */
  validate?: ValidateFn<TimeValue>
  /**
   * `native` blocks form submission and shows errors on commit or submit; `aria` shows errors in realtime.
   * Defaults to the surrounding `Form`.
   * @defaultValue 'native'
   */
  validationBehavior?: ValidationBehavior
  /** Additional classes merged into the root element. */
  class?: ClassValue
  /** Per-slot class overrides. `group`, `input`, `segment`, `prefix` and `suffix` are the internal `date-input-group`'s. */
  ui?: ComponentSlots<TimeField> & { group?: ComponentSlots<DateInputGroup>['base'] } & Pick<
      ComponentSlots<DateInputGroup>,
      'input' | 'segment' | 'prefix' | 'suffix'
    >
} & FormFieldProps

export type TimeFieldSlots = {
  /** Label content. Replaces the `label` prop. */
  label?: () => VNode[]
  /** Prefix content, rendered before the segments (e.g. an icon). */
  prefix?: () => VNode[]
  /** Suffix content, rendered after the segments (e.g. an icon). */
  suffix?: () => VNode[]
  /** Description content. Replaces the `description` prop. */
  description?: () => VNode[]
  /** Error content, rendered while invalid. Replaces the `errorMessage` prop. */
  error?: (props: ValidationResult) => VNode[]
}

export type TimeFieldEmits = {
  /** Emitted when the displayed placeholder time changes. */
  'update:placeholder': [value: TimeValue]
}
