<template>
  <!-- Modal like HeroUI's (React Aria) popover dialog: focus stays inside, the page behind is hidden from assistive tech -->
  <DateRangePickerRoot
    :id="id"
    v-model:open="isOpen"
    :model-value="draft"
    :placeholder="placeholder"
    :default-placeholder="defaultPlaceholder"
    :granularity="granularity"
    :hour-cycle="hourCycle"
    :step="step"
    :hide-time-zone="hideTimeZone"
    :min-value="minValue"
    :max-value="maxValue"
    :locale="locale"
    :is-date-unavailable="isDateUnavailable ? fieldIsDateUnavailable : undefined"
    :disabled="disabled"
    :readonly="readonly"
    modal
    @update:model-value="onFieldUpdate"
    @update:placeholder="emit('update:placeholder', $event)"
  >
    <PopoverLabelledBy :labelledby="hasLabel ? `${triggerId} ${labelId}` : triggerId" />
    <DateRangePickerField
      ref="root"
      v-slot="{ segments }"
      v-bind="attrs"
      data-slot="date-range-picker"
      :data-required="required ? 'true' : undefined"
      :aria-describedby="describedBy"
      :class="ui.base({ class: [props.ui?.base, props.class] })"
      @keydown.capture="onFieldKeydown"
      @focusout="onFieldFocusOut"
    >
      <FieldLabel :id="labelId" as="span" />
      <DateRangePickerAnchor as-child>
        <DateInputGroup
          :segments="wrapBidiIsolate(dropDanglingTimeZoneSeparator(segments.start))"
          :end-segments="wrapBidiIsolate(dropDanglingTimeZoneSeparator(segments.end))"
          :segment-input="DateRangePickerInput"
          :input-container="inputContainer"
          :variant="variant"
          :full-width="fullWidth"
          :disabled="disabled"
          :invalid="invalid"
          :aria-label="attrs['aria-label'] as string | undefined"
          :labelledby="hasLabel ? labelId : undefined"
          :describedby="describedBy"
          :ui="groupUiProps"
        >
          <template #separator>
            <span
              aria-hidden="true"
              data-slot="date-range-picker-range-separator"
              :class="ui.rangeSeparator({ class: props.ui?.rangeSeparator })"
            >
              <slot name="separator">{{ ' - ' }}</slot>
            </span>
          </template>
          <template #suffix>
            <DateRangePickerTrigger as-child>
              <button
                :id="triggerId"
                ref="trigger"
                type="button"
                aria-label="Calendar"
                :aria-labelledby="hasLabel ? `${triggerId} ${labelId}` : undefined"
                :aria-describedby="describedBy"
                :data-reka-date-field-segment="undefined"
                data-slot="date-range-picker-trigger"
                :disabled="disabled || readonly"
                :class="ui.trigger({ class: props.ui?.trigger })"
              >
                <span
                  aria-hidden="true"
                  data-slot="date-range-picker-trigger-indicator"
                  :class="ui.triggerIndicator({ class: props.ui?.triggerIndicator })"
                >
                  <slot name="indicator">
                    <svg
                      aria-hidden="true"
                      fill="none"
                      height="1em"
                      role="presentation"
                      viewBox="0 0 13 14"
                      width="1em"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        clip-rule="evenodd"
                        d="M3.75 4.5A.75.75 0 0 1 3 3.75v-.748a1.5 1.5 0 0 0-1.5 1.5v1h10v-1a1.5 1.5 0 0 0-1.5-1.5v.75a.75.75 0 1 1-1.5 0v-.75h-4v.747a.75.75 0 0 1-.75.75ZM8.5 1.501h-4V.75a.75.75 0 0 0-1.5 0v.752a3 3 0 0 0-3 3v6a3 3 0 0 0 3 3h7a3 3 0 0 0 3-3v-6a3 3 0 0 0-3-3v-.75a.75.75 0 0 0-1.5 0v.75Zm-7 5.5v3.5a1.5 1.5 0 0 0 1.5 1.5h7a1.5 1.5 0 0 0 1.5-1.5v-3.5h-10Z"
                        fill="currentColor"
                        fill-rule="evenodd"
                      />
                    </svg>
                  </slot>
                </span>
              </button>
            </DateRangePickerTrigger>
          </template>
        </DateInputGroup>
      </DateRangePickerAnchor>
      <!-- React Aria's HiddenDateInput pair: carries `startName`/`endName` and native `required` (Reka's own mirror input holds one combined string) -->
      <VisuallyHidden
        v-for="part in ['start', 'end'] as const"
        :key="part"
        as="input"
        feature="focusable"
        aria-hidden="true"
        tabindex="-1"
        :name="part === 'start' ? startName : endName"
        :value="committed?.[part]?.toString() ?? ''"
        :required="required"
        :disabled="disabled"
        @focus="focusFirstSegment"
      />
      <FieldDescription />
      <FieldError />
    </DateRangePickerField>
    <PopoverPortal :disabled="portalTarget.disabled" :to="portalTarget.to">
      <PopoverContent
        ref="popoverContent"
        data-slot="date-range-picker-popover"
        side="bottom"
        align="center"
        :side-offset="8"
        :avoid-collisions="true"
        :collision-padding="8"
        :class="ui.popover({ class: props.ui?.popover })"
        @open-auto-focus="onOpenAutoFocus"
        @close-auto-focus="onCloseAutoFocus"
        @escape-key-down="onEscapeKeyDown"
      >
        <slot
          name="calendar"
          :value="committed"
          :on-select="onCalendarSelect"
          :on-change="onCalendarChange"
        >
          <!--
            No `min-value`/`max-value`: HeroUI's composed `RangeCalendar` passes its own 1900/2099 defaults explicitly,
            which override the picker's bounds from React Aria's context, so the popover never greys out-of-range days
            (the field still validates them). `is-date-unavailable` does reach it.
          -->
          <RangeCalendar
            :model-value="committed ?? EMPTY"
            :default-placeholder="committed?.start ?? placeholder ?? defaultPlaceholder"
            :is-date-unavailable="isDateUnavailable"
            :allow-non-contiguous-ranges="allowNonContiguousRanges"
            :locale="locale"
            :disabled="disabled"
            :readonly="readonly"
            :invalid="invalid"
            :aria-label="calendarLabel"
            year-picker
            @update:model-value="onCalendarUpdate"
          />
        </slot>
      </PopoverContent>
    </PopoverPortal>
  </DateRangePickerRoot>
</template>

<script lang="ts">
import type { DateValue } from '@internationalized/date'
import type { DateRangePickerRootProps } from 'reka-ui'
import type { VNode } from 'vue'

import type { DateInputGroupProps } from '@/components/date-input-group/DateInputGroup.vue'
import dateInputGroupTheme from '@/components/date-input-group/theme'
import type { ValidationBehavior } from '@/components/form/context'
import type { FormFieldProps } from '@/components/form/types'
import type { DateRange } from '@/components/range-calendar/RangeCalendar.vue'
import type { ValidateFn, ValidationResult } from '@/composables/useFieldValidation'
import type { PortalTarget } from '@/config'
import type { ComponentSlots } from '@/types/tv'
import type { ClassValue } from '@/utils/tv'

import theme from './theme'

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

export type DateRangePickerCalendarSlotProps = {
  /** The committed range, or `null`. */
  value: DateRangeValue | null
  /** Commits a range, closes the popover and refocuses the trigger (what the default calendar calls). */
  onSelect: (value: DateRangeValue) => void
  /** Commits a range and keeps the popover open (e.g. from a time field composed next to the calendar). */
  onChange: (value: DateRangeValue) => void
}

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

export type DateRangePickerEmits = {
  /** Emitted when the displayed placeholder date changes. */
  'update:placeholder': [value: DateValue]
  /** Emitted when the popover open state changes. */
  'update:open': [value: boolean]
}
</script>

<script setup lang="ts">
import { DateFormatter, getLocalTimeZone, toCalendarDateTime } from '@internationalized/date'
import {
  DateRangePickerAnchor,
  DateRangePickerField,
  DateRangePickerInput,
  DateRangePickerRoot,
  DateRangePickerTrigger,
  PopoverContent,
  PopoverPortal,
  VisuallyHidden,
} from 'reka-ui'
import type { ComponentPublicInstance } from 'vue'
import { computed, ref, shallowRef, useAttrs, useTemplateRef, watch } from 'vue'

import DateInputGroup, {
  dropDanglingTimeZoneSeparator,
  wrapBidiIsolate,
} from '@/components/date-input-group/DateInputGroup.vue'
import PopoverLabelledBy from '@/components/date-picker/PopoverLabelledBy'
import { useFieldsetDisabled } from '@/components/fieldset/context'
import RangeCalendar from '@/components/range-calendar/RangeCalendar.vue'
import { useComponentUI } from '@/composables/useComponentUI'
import { useFieldChrome } from '@/composables/useFieldChrome'
import { useFieldValidation } from '@/composables/useFieldValidation'
import { useInertOutside } from '@/composables/useInertOutside'
import { usePortal } from '@/composables/usePortal'

// `invalid: undefined`/`open: undefined`: an absent boolean would cast to `false`, which would count as
// controlled-valid/controlled-closed and hide validation errors / force the popover shut
const props = withDefaults(defineProps<DateRangePickerProps>(), {
  invalid: undefined,
  open: undefined,
  portal: undefined,
  defaultOpen: false,
  inputContainer: false,
})
const disabled = useFieldsetDisabled(() => props.disabled)
const portalTarget = usePortal(() => props.portal)
defineOptions({ inheritAttrs: false })
const emit = defineEmits<DateRangePickerEmits>()
const slots = defineSlots<DateRangePickerSlots>()
/** The selected range (`null` when empty). Bind with `v-model`. Only complete ranges are emitted, as in React Aria. */
const modelValue = defineModel<DateRangeValue | null>()
// Also mirrors a controlled `open` synchronously, so `useInertOutside` releases before Reka refocuses the trigger.
const openLocal = ref(props.open ?? props.defaultOpen ?? false)
watch(
  () => props.open,
  (open) => {
    if (open !== undefined) openLocal.value = open
  },
  { flush: 'sync' },
)
const isOpen = computed({
  get: () => props.open ?? openLocal.value,
  set: (value: boolean) => {
    openLocal.value = value
    emit('update:open', value)
  },
})
useInertOutside(useTemplateRef<ComponentPublicInstance>('popoverContent'), openLocal)

const ui = useComponentUI('dateRangePicker', theme, () => ({ fullWidth: props.fullWidth }))

const root = useTemplateRef<ComponentPublicInstance>('root')
const trigger = useTemplateRef<HTMLButtonElement>('trigger')
const attrs = useAttrs()

const EMPTY: DateRange = { start: undefined, end: undefined }
const isComplete = (value: DateRange | null | undefined): value is DateRangeValue => {
  return !!value?.start && !!value.end
}
// The committed value: `v-model` once set, else `defaultValue`.
const committed = computed<DateRangeValue | null>(
  () => (modelValue.value === undefined ? props.defaultValue : modelValue.value) ?? null,
)
// What the segments show: React Aria's `useDateRangePickerState` keeps a partially typed range as a local
// placeholder and only emits complete ranges (or `null`), so Reka is driven from this draft instead of `v-model`.
const draft = shallowRef<DateRange>(committed.value ?? EMPTY)
watch(committed, (value) => {
  const current = draft.value
  if (value?.start === current.start && value?.end === current.end) return
  draft.value = value ?? EMPTY
})

const commit = (value: DateRangeValue | null, validate = true) => {
  draft.value = value ?? EMPTY
  modelValue.value = value
  if (validate) commitValidation()
}
// React Aria commits a segment-edited range's validation when focus leaves the field, not on every keystroke,
// so e.g. a range that is briefly reversed mid-edit isn't flagged until the user is done.
let validationPending = false
const onFieldUpdate = (value: DateRange) => {
  draft.value = value
  if (isComplete(value)) commit(value, false)
  else if (!value.start && !value.end && committed.value) commit(null, false)
  else return
  validationPending = true
}
const onFieldFocusOut = (event: FocusEvent) => {
  const field = root.value?.$el as HTMLElement | undefined
  if (
    !validationPending ||
    (event.relatedTarget instanceof Node && field?.contains(event.relatedTarget))
  )
    return
  validationPending = false
  commitValidation()
}

// React Aria's `useDateRangePickerState`: picking dates in the calendar keeps the time of day already in the
// field, and falls back to midnight when the field shows time segments but holds no value yet.
const hasTimeGranularity = computed(
  () =>
    props.granularity === 'hour' ||
    props.granularity === 'minute' ||
    props.granularity === 'second',
)
const withTime = (date: DateValue, current: DateValue | undefined): DateValue => {
  if (current && 'hour' in current)
    return current.set({
      era: date.era,
      year: date.year,
      month: date.month,
      day: date.day,
    })
  if (hasTimeGranularity.value && !('hour' in date)) return toCalendarDateTime(date)
  return date
}
const mergeTime = (range: DateRangeValue): DateRangeValue => {
  return {
    start: withTime(range.start, draft.value.start),
    end: withTime(range.end, draft.value.end),
  }
}
const onCalendarChange = (range: DateRangeValue) => {
  commit(range)
}
// Completing a range in the calendar closes the popover and refocuses the trigger (React Aria's
// `shouldCloseOnSelect` default).
const onCalendarSelect = (range: DateRangeValue) => {
  validationPending = false
  commit(range)
  isOpen.value = false
  trigger.value?.focus()
}
const onCalendarUpdate = (value: DateRange | undefined) => {
  if (isComplete(value)) onCalendarSelect(mergeTime(value))
}

// React Aria's builtin range validation (`validateDateRange`): each end against min/max/unavailable, plus a
// reversed range; combined with `validate` the way RAC's `mergeValidation` does (custom error wins).
const formatDateBoundary = (value: DateValue) => {
  return new DateFormatter(props.locale ?? 'en-US', { dateStyle: 'medium' }).format(
    value.toDate(getLocalTimeZone()),
  )
}
const validateDate = (value: DateValue) => {
  const errors: string[] = []
  if (props.minValue && value.compare(props.minValue) < 0)
    errors.push(`Value must be ${formatDateBoundary(props.minValue)} or later.`)
  if (props.maxValue && value.compare(props.maxValue) > 0)
    errors.push(`Value must be ${formatDateBoundary(props.maxValue)} or earlier.`)
  if (props.isDateUnavailable?.(value, null)) errors.push('Selected date unavailable.')
  return errors
}
const builtinValidate = (value: DateRangeValue) => {
  const errors = [...new Set([...validateDate(value.start), ...validateDate(value.end)])]
  if (value.end.compare(value.start) < 0) errors.push('Start date must be before end date.')
  return errors.length ? errors : undefined
}
const validate = (value: DateRangeValue) => {
  const custom = props.validate?.(value)
  return custom && custom !== true ? custom : builtinValidate(value)
}
const { validation, commitValidation } = useFieldValidation<DateRangeValue>({
  value: () => committed.value ?? undefined,
  validate: () => validate,
  invalid: () => props.invalid,
  validationBehavior: () => props.validationBehavior,
  name: () => props.startName,
  root: () => root.value?.$el as Element | undefined,
  formField: props,
  onReset: () => {
    commit(props.defaultValue ?? null)
  },
})
const invalid = computed(() => props.invalid ?? validation.value.isInvalid)

// Reka's matcher is single-argument and read once at setup; outside the calendar React Aria calls it with a `null` anchor.
const fieldIsDateUnavailable = (date: DateValue) => props.isDateUnavailable?.(date, null) ?? false

const { id, labelId, hasLabel, describedBy, FieldLabel, FieldDescription, FieldError } =
  useFieldChrome({
    props,
    slots,
    invalid,
    validation,
    disabled,
    required: () => props.required,
    hideDescriptionWhenInvalid: true,
  })
const triggerId = computed(() => `${id.value}-trigger`)

const groupUiProps = computed<DateInputGroupProps['ui']>(() => ({
  base: props.ui?.group,
  inputContainer: props.ui?.inputContainer,
  input: props.ui?.input,
  segment: props.ui?.segment,
  // HeroUI's `.date-range-picker .date-input-group__suffix/__prefix { pointer-events-auto }`
  prefix: 'pointer-events-auto',
  suffix: 'pointer-events-auto',
}))

// React Aria's calendar takes focus on open (its focused date: the range start, else the placeholder, else
// today, else the first available day). Reka's PopoverContent would focus the first tabbable (the year-picker trigger) instead.
const onOpenAutoFocus = (event: Event) => {
  const content = event.target as HTMLElement | null
  const focusDate = committed.value?.start ?? props.placeholder ?? props.defaultPlaceholder
  const cell =
    (focusDate
      ? content?.querySelector<HTMLElement>(
          `[data-value="${focusDate.toString().slice(0, 10)}"]:not([data-outside-view])`,
        )
      : null) ??
    content?.querySelector<HTMLElement>('[data-today]:not([data-outside-view])') ??
    content?.querySelector<HTMLElement>(
      '[data-value]:not([data-outside-view]):not([data-disabled]):not([data-unavailable])',
    )
  if (cell) {
    event.preventDefault()
    cell.focus()
  }
}

// React Aria's `useDatePickerGroup`: Alt+ArrowDown/ArrowUp on a segment opens the calendar instead of
// stepping the segment. Captured on the field root so it runs before the segment's own handler.
const onFieldKeydown = (event: KeyboardEvent) => {
  if (
    !event.altKey ||
    (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') ||
    disabled.value ||
    props.readonly
  )
    return
  event.preventDefault()
  event.stopPropagation()
  isOpen.value = true
}

// React Aria returns focus to the trigger whenever the popover closes; Reka's modal popover skips that after a
// right-click outside.
const onCloseAutoFocus = (event: Event) => {
  event.preventDefault()
  trigger.value?.focus()
}
// Escape closes the whole popover even while the calendar's year picker is open (the year picker marks the
// event handled to close itself, which would otherwise stop Reka's dismissal).
const onEscapeKeyDown = (event: KeyboardEvent) => {
  if (event.defaultPrevented) isOpen.value = false
}

const focusFirstSegment = () => {
  root.value?.$el
    ?.querySelector?.('[data-slot=date-input-group-segment][contenteditable=true]')
    ?.focus()
}
</script>
