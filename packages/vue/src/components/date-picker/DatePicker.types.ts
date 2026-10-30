import type { DateFieldRootProps, DateValue } from 'reka-ui'
import type { VNode } from 'vue'

import type dateInputGroupTheme from '@/components/date-input-group/theme'
import type { ValidationBehavior } from '@/components/form/context'
import type { FormFieldProps } from '@/components/form/types'
import type { ValidateFn, ValidationResult } from '@/composables/useFieldValidation'
import type { PortalTarget } from '@/config'
import type { ComponentSlots } from '@/types/tv'
import type { ClassValue } from '@/utils/tv'

import type theme from './theme'

type DatePicker = typeof theme
type DateInputGroup = typeof dateInputGroupTheme

// Reka doesn't export these as standalone types; derive them from the (exported) root props instead.
type Granularity = NonNullable<DateFieldRootProps['granularity']>
type HourCycle = NonNullable<DateFieldRootProps['hourCycle']>
type DateStep = NonNullable<DateFieldRootProps['step']>
type DateUnavailableMatcher = NonNullable<DateFieldRootProps['isDateUnavailable']>

/** Props of `DatePicker`, a date field with a button that opens a calendar popover to pick the date. */
export type DatePickerProps = {
  /**
   * Renders the calendar popover in a portal. `true` portals to `document.body`, a selector string or element is used as the teleport target, and `false` disables portalling.
   * Falls back to `createHareUI({ portal })`, then `true`.
   */
  portal?: PortalTarget
  /** Label text rendered above the group. */
  label?: string
  /** Accessible label for the calendar inside the popover. Set independently of `label`. */
  calendarLabel?: string
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
  defaultValue?: DateValue
  /** The placeholder date, used to determine which segments/month to show when no date is selected. */
  placeholder?: DateValue
  /** The placeholder date when uncontrolled. */
  defaultPlaceholder?: DateValue
  /**
   * The granularity of the field: which segments are rendered, up to and including this unit.
   * @defaultValue 'day' (a `CalendarDate` value), otherwise 'minute'
   */
  granularity?: Granularity
  /** The hour cycle used to format times. Defaults to the locale's preference. */
  hourCycle?: HourCycle
  /**
   * The stepping interval for the time segments.
   * @defaultValue 1
   */
  step?: DateStep
  /**
   * Whether to snap the time value to the nearest `step` increment after input.
   * @defaultValue false
   */
  stepSnapping?: boolean
  /** Whether to hide the time zone segment. */
  hideTimeZone?: boolean
  /** The minimum selectable date. */
  minValue?: DateValue
  /** The maximum selectable date. */
  maxValue?: DateValue
  /** The locale used to format the field and calendar. Defaults to the `ConfigProvider` locale. */
  locale?: string
  /** A function that returns whether a given date is unavailable for selection. */
  isDateUnavailable?: DateUnavailableMatcher
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
   * Whether the picker is disabled.
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
  validate?: ValidateFn<DateValue>
  /**
   * `native` blocks form submission and shows errors on commit or submit; `aria` shows errors in realtime.
   * Defaults to the surrounding `Form`.
   * @defaultValue 'native'
   */
  validationBehavior?: ValidationBehavior
  /**
   * The controlled open state of the popover.
   */
  open?: boolean
  /**
   * The open state of the popover when it is initially rendered.
   * @defaultValue false
   */
  defaultOpen?: boolean
  /** Additional classes merged into the root element. */
  class?: ClassValue
  /** Per-slot class overrides. `group`, `input` and `segment` are the internal `date-input-group`'s. */
  ui?: ComponentSlots<DatePicker> & { group?: ComponentSlots<DateInputGroup>['base'] } & Pick<
      ComponentSlots<DateInputGroup>,
      'input' | 'segment'
    >
} & FormFieldProps

/** Slots of `DatePicker`. */
export type DatePickerSlots = {
  /** Label content. Replaces the `label` prop. */
  label?: () => VNode[]
  /** Replaces the default calendar icon inside the trigger. */
  indicator?: () => VNode[]
  /** Description content. Replaces the `description` prop. */
  description?: () => VNode[]
  /** Error content, rendered while invalid. Replaces the `errorMessage` prop. */
  error?: (props: ValidationResult) => VNode[]
  /**
   * Replaces the default `Calendar` rendered inside the popover. Bind `value` and call `onSelect`
   * on your own `Calendar` to keep it wired to the picker (see the `custom-styles` demo).
   */
  calendar?: (props: {
    value: DateValue | null | undefined
    onSelect: (value: DateValue) => void
  }) => VNode[]
}

/** Events emitted by `DatePicker`. */
export type DatePickerEmits = {
  /** Emitted when the displayed placeholder date changes. */
  'update:placeholder': [value: DateValue]
  /** Emitted when the popover open state changes. */
  'update:open': [value: boolean]
}
