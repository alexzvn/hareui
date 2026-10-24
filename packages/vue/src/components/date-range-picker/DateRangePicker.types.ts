import type { DateValue } from '@internationalized/date'
import type { DateRangePickerRootProps } from 'reka-ui'
import type { VNode } from 'vue'

import type dateInputGroupTheme from '@/components/date-input-group/theme'
import type { ValidationBehavior } from '@/components/form/context'
import type { FormFieldProps } from '@/components/form/types'
import type { ValidateFn, ValidationResult } from '@/composables/useFieldValidation'
import type { PortalTarget } from '@/config'
import type { ComponentSlots } from '@/types/tv'
import type { ClassValue } from '@/utils/tv'

import type theme from './theme'

type DateRangePicker = typeof theme
type DateInputGroup = typeof dateInputGroupTheme

// Reka doesn't export these as standalone types; derive them from the (exported) root props instead.
type Granularity = NonNullable<DateRangePickerRootProps['granularity']>
type HourCycle = NonNullable<DateRangePickerRootProps['hourCycle']>
type DateStep = NonNullable<DateRangePickerRootProps['step']>

/** A complete date range, as emitted by `DateRangePicker`'s `v-model`. */
export type DateRangeValue = {
  start: DateValue
  end: DateValue
}

/** Props of `DateRangePicker`. */
export type DateRangePickerProps = {
  /**
   * Renders the calendar popover in a portal. `true` portals to `document.body`, a selector string or element is used as the teleport target, and `false` disables portalling.
   * Falls back to `createHareUI({ portal })`, then `true`.
   */
  portal?: PortalTarget
  /** Label text rendered above the group. */
  label?: string
  /** Accessible label for the range calendar inside the popover. */
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
  /** The name of the start date, used when submitting a form. */
  startName?: string
  /** The name of the end date, used when submitting a form. */
  endName?: string
  /** The initial range when uncontrolled (no `v-model`). */
  defaultValue?: DateRangeValue | null
  /** The placeholder date, used to determine which segments/month to show when no range is selected. */
  placeholder?: DateValue
  /** The placeholder date when uncontrolled. */
  defaultPlaceholder?: DateValue
  /**
   * The granularity of the fields: which segments are rendered, up to and including this unit.
   * @defaultValue 'day' (a `CalendarDate` value), otherwise 'minute'
   */
  granularity?: Granularity
  /** The hour cycle used to format times. Defaults to the locale's preference. */
  hourCycle?: HourCycle
  /** The stepping interval for the time segments. */
  step?: DateStep
  /** Whether to hide the time zone segment. */
  hideTimeZone?: boolean
  /** The minimum selectable date. */
  minValue?: DateValue
  /** The maximum selectable date. */
  maxValue?: DateValue
  /** The locale used to format the fields and the calendar. Defaults to the `ConfigProvider` locale. */
  locale?: string
  /**
   * Callback returning whether a date is unavailable. Inside the calendar, `anchorDate` is the already-picked
   * start of an in-progress selection (`null` otherwise), matching React Aria's `isDateUnavailable(date, anchorDate)`.
   */
  isDateUnavailable?: (date: DateValue, anchorDate: DateValue | null) => boolean
  /**
   * Whether a range may contain unavailable dates.
   * @defaultValue false
   */
  allowNonContiguousRanges?: boolean
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
   * Wraps the start/end inputs in a horizontally scrollable container (HeroUI's `DateField.InputContainer`),
   * for long time ranges that overflow the group.
   * @defaultValue false
   */
  inputContainer?: boolean
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
   * Whether a range is required.
   * @defaultValue false
   */
  required?: boolean
  /**
   * Whether the range can be selected but not changed.
   * @defaultValue false
   */
  readonly?: boolean
  /** Validates the committed range. Return an error message (or several) when invalid. */
  validate?: ValidateFn<DateRangeValue>
  /**
   * `native` blocks form submission and shows errors on commit or submit; `aria` shows errors in realtime.
   * Defaults to the surrounding `Form`.
   * @defaultValue 'native'
   */
  validationBehavior?: ValidationBehavior
  /** The controlled open state of the popover. */
  open?: boolean
  /**
   * The open state of the popover when it is initially rendered.
   * @defaultValue false
   */
  defaultOpen?: boolean
  /** Additional classes merged into the root element. */
  class?: ClassValue
  /** Per-slot class overrides. `group`, `inputContainer`, `input` and `segment` are the internal `date-input-group`'s. */
  ui?: ComponentSlots<DateRangePicker> & { group?: ComponentSlots<DateInputGroup>['base'] } & Pick<
      ComponentSlots<DateInputGroup>,
      'inputContainer' | 'input' | 'segment'
    >
} & FormFieldProps

/** Props passed to `DateRangePicker`'s `calendar` slot. */
export type DateRangePickerCalendarSlotProps = {
  /** The committed range, or `null`. */
  value: DateRangeValue | null
  /** Commits a range, closes the popover and refocuses the trigger (what the default calendar calls). */
  onSelect: (value: DateRangeValue) => void
  /** Commits a range and keeps the popover open (e.g. from a time field composed next to the calendar). */
  onChange: (value: DateRangeValue) => void
}

/** Slots of `DateRangePicker`. */
export type DateRangePickerSlots = {
  /** Label content. Replaces the `label` prop. */
  label?: () => VNode[]
  /** Replaces the default calendar icon inside the trigger. */
  indicator?: () => VNode[]
  /** Replaces the default ` - ` between the start and end inputs. */
  separator?: () => VNode[]
  /** Description content. Replaces the `description` prop. */
  description?: () => VNode[]
  /** Error content, rendered while invalid. Replaces the `errorMessage` prop. */
  error?: (props: ValidationResult) => VNode[]
  /** Replaces the default `RangeCalendar` rendered inside the popover. */
  calendar?: (props: DateRangePickerCalendarSlotProps) => VNode[]
}

/** Events emitted by `DateRangePicker`. */
export type DateRangePickerEmits = {
  /** Emitted when the displayed placeholder date changes. */
  'update:placeholder': [value: DateValue]
  /** Emitted when the popover open state changes. */
  'update:open': [value: boolean]
}
