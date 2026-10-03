<script lang="ts">
import type { DateValue } from '@internationalized/date'
import type { DateRangePickerRootProps } from 'reka-ui'
import type { ValidateFn, ValidationResult } from '../../composables/useFieldValidation'
import type { ComponentSlots } from '../../types/tv'
import type { DateInputGroupProps } from '../date-input-group/DateInputGroup.vue'
import type { ValidationBehavior } from '../form/context'
import type { DateRange } from '../range-calendar/RangeCalendar.vue'
import dateInputGroupTheme from '../date-input-group/theme'
import theme from './theme'

type DateRangePicker = typeof theme
type DateInputGroup = typeof dateInputGroupTheme

// Reka doesn't export these as standalone types; derive them from the (exported) root props instead.
type Granularity = NonNullable<DateRangePickerRootProps['granularity']>
type HourCycle = NonNullable<DateRangePickerRootProps['hourCycle']>
type DateStep = NonNullable<DateRangePickerRootProps['step']>

/** A complete date range, as emitted by `DateRangePicker`'s `v-model`. */
export interface DateRangeValue {
  start: DateValue
  end: DateValue
}

export interface DateRangePickerProps {
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
  class?: any
  /** Per-slot class overrides. `group`, `inputContainer`, `input` and `segment` are the internal `date-input-group`'s. */
  ui?: ComponentSlots<DateRangePicker> & { group?: ComponentSlots<DateInputGroup>['base'] } & Pick<ComponentSlots<DateInputGroup>, 'inputContainer' | 'input' | 'segment'>
}

export interface DateRangePickerCalendarSlotProps {
  /** The committed range, or `null`. */
  value: DateRangeValue | null
  /** Commits a range, closes the popover and refocuses the trigger (what the default calendar calls). */
  onSelect: (value: DateRangeValue) => void
  /** Commits a range and keeps the popover open (e.g. from a time field composed next to the calendar). */
  onChange: (value: DateRangeValue) => void
}

export interface DateRangePickerSlots {
  /** Label content. Replaces the `label` prop. */
  label?: () => any
  /** Replaces the default calendar icon inside the trigger. */
  indicator?: () => any
  /** Replaces the default ` - ` between the start and end inputs. */
  separator?: () => any
  /** Description content. Replaces the `description` prop. */
  description?: () => any
  /** Error content, rendered while invalid. Replaces the `errorMessage` prop. */
  error?: (props: ValidationResult) => any
  /** Replaces the default `RangeCalendar` rendered inside the popover. */
  calendar?: (props: DateRangePickerCalendarSlotProps) => any
}

export interface DateRangePickerEmits {
  /** Emitted when the displayed placeholder date changes. */
  'update:placeholder': [value: DateValue]
  /** Emitted when the popover open state changes. */
  'update:open': [value: boolean]
}
</script>

<script setup lang="ts">
import { DateFormatter, getLocalTimeZone, toCalendarDateTime } from '@internationalized/date'
import { DateRangePickerAnchor, DateRangePickerField, DateRangePickerInput, DateRangePickerRoot, DateRangePickerTrigger, PopoverContent, PopoverPortal, VisuallyHidden } from 'reka-ui'
import type { ComponentPublicInstance } from 'vue'
import { computed, ref, shallowRef, useAttrs, useId, useTemplateRef, watch } from 'vue'
import { useComponentUI } from '../../composables/useComponentUI'
import { useFieldValidation } from '../../composables/useFieldValidation'
import DateInputGroup, { dropDanglingTimeZoneSeparator, wrapBidiIsolate } from '../date-input-group/DateInputGroup.vue'
import Description from '../description/Description.vue'
import FieldError from '../field-error/FieldError.vue'
import Label from '../label/Label.vue'
import RangeCalendar from '../range-calendar/RangeCalendar.vue'

// `invalid: undefined`/`open: undefined`: an absent boolean would cast to `false`, which would count as
// controlled-valid/controlled-closed and hide validation errors / force the popover shut
const props = withDefaults(defineProps<DateRangePickerProps>(), { invalid: undefined, open: undefined, defaultOpen: false, inputContainer: false })
defineOptions({ inheritAttrs: false })
const emit = defineEmits<DateRangePickerEmits>()
const slots = defineSlots<DateRangePickerSlots>()
/** The selected range (`null` when empty). Bind with `v-model`. Only complete ranges are emitted, as in React Aria. */
const modelValue = defineModel<DateRangeValue | null>()
const openLocal = ref(props.defaultOpen ?? false)
const isOpen = computed({
  get: () => props.open ?? openLocal.value,
  set: (value: boolean) => {
    openLocal.value = value
    emit('update:open', value)
  },
})

const ui = useComponentUI('dateRangePicker', theme, () => ({ fullWidth: props.fullWidth }))

const root = useTemplateRef<ComponentPublicInstance>('root')
const trigger = useTemplateRef<HTMLButtonElement>('trigger')
const attrs = useAttrs()

const EMPTY: DateRange = { start: undefined, end: undefined }
function isComplete(value: DateRange | null | undefined): value is DateRangeValue {
  return !!value?.start && !!value.end
}
// The committed value: `v-model` once set, else `defaultValue`.
const committed = computed<DateRangeValue | null>(() => (modelValue.value === undefined ? props.defaultValue : modelValue.value) ?? null)
// What the segments show: React Aria's `useDateRangePickerState` keeps a partially typed range as a local
// placeholder and only emits complete ranges (or `null`), so Reka is driven from this draft instead of `v-model`.
const draft = shallowRef<DateRange>(committed.value ?? EMPTY)
watch(committed, (value) => {
  const current = draft.value
  if (value?.start === current.start && value?.end === current.end)
    return
  draft.value = value ?? EMPTY
})

function commit(value: DateRangeValue | null, validate = true) {
  draft.value = value ?? EMPTY
  modelValue.value = value
  if (validate)
    commitValidation()
}
// React Aria commits a segment-edited range's validation when focus leaves the field, not on every keystroke,
// so e.g. a range that is briefly reversed mid-edit isn't flagged until the user is done.
let validationPending = false
function onFieldUpdate(value: DateRange) {
  draft.value = value
  if (isComplete(value))
    commit(value, false)
  else if (!value.start && !value.end && committed.value)
    commit(null, false)
  else
    return
  validationPending = true
}
function onFieldFocusOut(event: FocusEvent) {
  const field = root.value?.$el as HTMLElement | undefined
  if (!validationPending || (event.relatedTarget instanceof Node && field?.contains(event.relatedTarget)))
    return
  validationPending = false
  commitValidation()
}

// React Aria's `useDateRangePickerState`: picking dates in the calendar keeps the time of day already in the
// field, and falls back to midnight when the field shows time segments but holds no value yet.
const hasTimeGranularity = computed(() => props.granularity === 'hour' || props.granularity === 'minute' || props.granularity === 'second')
function withTime(date: DateValue, current: DateValue | undefined): DateValue {
  if (current && 'hour' in current)
    return (current as any).set({ era: (date as any).era, year: date.year, month: date.month, day: date.day })
  if (hasTimeGranularity.value && !('hour' in date))
    return toCalendarDateTime(date)
  return date
}
function mergeTime(range: DateRangeValue): DateRangeValue {
  return { start: withTime(range.start, draft.value.start), end: withTime(range.end, draft.value.end) }
}
function onCalendarChange(range: DateRangeValue) {
  commit(range)
}
// Completing a range in the calendar closes the popover and refocuses the trigger (React Aria's
// `shouldCloseOnSelect` default).
function onCalendarSelect(range: DateRangeValue) {
  validationPending = false
  commit(range)
  isOpen.value = false
  trigger.value?.focus()
}
function onCalendarUpdate(value: DateRange | undefined) {
  if (isComplete(value))
    onCalendarSelect(mergeTime(value))
}

// React Aria's builtin range validation (`validateDateRange`): each end against min/max/unavailable, plus a
// reversed range; combined with `validate` the way RAC's `mergeValidation` does (custom error wins).
function formatDateBoundary(value: DateValue) {
  return new DateFormatter(props.locale ?? 'en-US', { dateStyle: 'medium' }).format(value.toDate(getLocalTimeZone()))
}
function validateDate(value: DateValue) {
  const errors: string[] = []
  if (props.minValue && value.compare(props.minValue) < 0)
    errors.push(`Value must be ${formatDateBoundary(props.minValue)} or later.`)
  if (props.maxValue && value.compare(props.maxValue) > 0)
    errors.push(`Value must be ${formatDateBoundary(props.maxValue)} or earlier.`)
  if (props.isDateUnavailable?.(value, null))
    errors.push('Selected date unavailable.')
  return errors
}
function builtinValidate(value: DateRangeValue) {
  const errors = [...new Set([...validateDate(value.start), ...validateDate(value.end)])]
  if (value.end.compare(value.start) < 0)
    errors.push('Start date must be before end date.')
  return errors.length ? errors : undefined
}
function validate(value: DateRangeValue) {
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
  onReset: () => {
    commit(props.defaultValue ?? null)
  },
})
const invalid = computed(() => props.invalid ?? validation.value.isInvalid)

// Reka's matcher is single-argument and read once at setup; outside the calendar React Aria calls it with a `null` anchor.
const fieldIsDateUnavailable = (date: DateValue) => props.isDateUnavailable?.(date, null) ?? false

const autoId = useId()
const id = computed(() => props.id ?? autoId)
const hasLabel = computed(() => !!(props.label || slots.label))
const labelId = computed(() => `${id.value}-label`)
const triggerId = computed(() => `${id.value}-trigger`)
const hasError = computed(() => invalid.value && !!(props.errorMessage || slots.error || validation.value.validationErrors.length))
const hasDescription = computed(() => !!(props.description || slots.description) && !invalid.value)
const descriptionId = computed(() => `${id.value}-description`)
const errorId = computed(() => `${id.value}-error`)
const describedBy = computed(() => [
  hasDescription.value ? descriptionId.value : undefined,
  hasError.value ? errorId.value : undefined,
].filter(Boolean).join(' ') || undefined)

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
function onOpenAutoFocus(event: Event) {
  const content = event.target as HTMLElement | null
  const focusDate = committed.value?.start ?? props.placeholder ?? props.defaultPlaceholder
  const cell = (focusDate ? content?.querySelector<HTMLElement>(`[data-value="${focusDate.toString().slice(0, 10)}"]:not([data-outside-view])`) : null)
    ?? content?.querySelector<HTMLElement>('[data-today]:not([data-outside-view])')
    ?? content?.querySelector<HTMLElement>('[data-value]:not([data-outside-view]):not([data-disabled]):not([data-unavailable])')
  if (cell) {
    event.preventDefault()
    cell.focus()
  }
}

// React Aria's `useDatePickerGroup`: Alt+ArrowDown/ArrowUp on a segment opens the calendar instead of
// stepping the segment. Captured on the field root so it runs before the segment's own handler.
function onFieldKeydown(event: KeyboardEvent) {
  if (!event.altKey || (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') || props.disabled || props.readonly)
    return
  event.preventDefault()
  event.stopPropagation()
  isOpen.value = true
}

// React Aria returns focus to the trigger whenever the popover closes, outside clicks included; Reka's
// non-modal popover skips that after an outside interaction.
function onCloseAutoFocus(event: Event) {
  event.preventDefault()
  trigger.value?.focus()
}
// Escape closes the whole popover even while the calendar's year picker is open (the year picker marks the
// event handled to close itself, which would otherwise stop Reka's dismissal).
function onEscapeKeyDown(event: KeyboardEvent) {
  if (event.defaultPrevented)
    isOpen.value = false
}

function focusFirstSegment() {
  root.value?.$el?.querySelector?.('[data-slot=date-input-group-segment][contenteditable=true]')?.focus()
}
</script>

<template>
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
    :modal="false"
    @update:model-value="onFieldUpdate"
    @update:placeholder="emit('update:placeholder', $event)"
  >
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
      <Label v-if="hasLabel" :id="labelId" as="span" :disabled="disabled" :invalid="invalid" :required="required">
        <slot name="label">{{ label }}</slot>
      </Label>
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
          :aria-labelledby="hasLabel ? labelId : undefined"
          :ui="groupUiProps"
        >
          <template #separator>
            <span aria-hidden="true" data-slot="date-range-picker-range-separator" :class="ui.rangeSeparator({ class: props.ui?.rangeSeparator })">
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
                :data-reka-date-field-segment="undefined"
                data-slot="date-range-picker-trigger"
                :disabled="disabled"
                :class="ui.trigger({ class: props.ui?.trigger })"
              >
                <span aria-hidden="true" data-slot="date-range-picker-trigger-indicator" :class="ui.triggerIndicator({ class: props.ui?.triggerIndicator })">
                  <slot name="indicator">
                    <svg aria-hidden="true" fill="none" height="1em" role="presentation" viewBox="0 0 13 14" width="1em" xmlns="http://www.w3.org/2000/svg">
                      <path clip-rule="evenodd" d="M3.75 4.5A.75.75 0 0 1 3 3.75v-.748a1.5 1.5 0 0 0-1.5 1.5v1h10v-1a1.5 1.5 0 0 0-1.5-1.5v.75a.75.75 0 1 1-1.5 0v-.75h-4v.747a.75.75 0 0 1-.75.75ZM8.5 1.501h-4V.75a.75.75 0 0 0-1.5 0v.752a3 3 0 0 0-3 3v6a3 3 0 0 0 3 3h7a3 3 0 0 0 3-3v-6a3 3 0 0 0-3-3v-.75a.75.75 0 0 0-1.5 0v.75Zm-7 5.5v3.5a1.5 1.5 0 0 0 1.5 1.5h7a1.5 1.5 0 0 0 1.5-1.5v-3.5h-10Z" fill="currentColor" fill-rule="evenodd" />
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
        v-for="part in (['start', 'end'] as const)"
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
      <Description v-if="hasDescription" :id="descriptionId">
        <slot name="description">{{ description }}</slot>
      </Description>
      <FieldError v-if="hasError" :id="errorId">
        <slot name="error" v-bind="validation">{{ errorMessage ?? validation.validationErrors.join(' ') }}</slot>
      </FieldError>
    </DateRangePickerField>
    <PopoverPortal>
      <PopoverContent
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
        <slot name="calendar" :value="committed" :on-select="onCalendarSelect" :on-change="onCalendarChange">
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
