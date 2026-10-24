<template>
  <!-- Modal like HeroUI's (React Aria) popover dialog: focus stays inside, the page behind is hidden from assistive tech -->
  <PopoverRoot v-model:open="isOpen" modal>
    <PopoverLabelledBy :labelledby="hasLabel ? `${triggerId} ${labelId}` : triggerId" />
    <DateFieldRoot
      :id="id"
      ref="root"
      v-bind="attrs"
      :model-value="modelValue"
      :default-value="defaultValue"
      :placeholder="placeholder"
      :default-placeholder="defaultPlaceholder"
      :granularity="granularity"
      :hour-cycle="hourCycle"
      :step="step"
      :step-snapping="stepSnapping"
      :hide-time-zone="hideTimeZone"
      :min-value="minValue"
      :max-value="maxValue"
      :locale="locale"
      :is-date-unavailable="isDateUnavailable"
      :disabled="disabled"
      :readonly="readonly"
      :required="required"
      :name="name"
      data-slot="date-picker"
      :data-required="required ? 'true' : undefined"
      :aria-describedby="describedBy"
      :class="ui.base({ class: [props.ui?.base, props.class] })"
      @update:model-value="onFieldUpdate"
      @update:placeholder="emit('update:placeholder', $event)"
      @keydown.capture="onFieldKeydown"
    >
      <template #default="{ segments }">
        <!-- `as` falls through to Reka `Label`: the group label names the input group via aria-labelledby, not a single form control (HeroUI renders a span) -->
        <FieldLabel :id="labelId" as="span" />
        <PopoverAnchor as-child>
          <DateInputGroup
            :segments="wrapBidiIsolate(dropDanglingTimeZoneSeparator(segments))"
            :segment-input="DateFieldInput"
            :variant="variant"
            :full-width="fullWidth"
            :disabled="disabled"
            :invalid="invalid"
            :aria-label="attrs['aria-label'] as string | undefined"
            :labelledby="hasLabel ? labelId : undefined"
            :describedby="describedBy"
            :ui="{ base: props.ui?.group, ...groupUiProps }"
          >
            <template #suffix>
              <PopoverTrigger as-child>
                <button
                  :id="triggerId"
                  ref="trigger"
                  type="button"
                  aria-label="Calendar"
                  :aria-labelledby="hasLabel ? `${triggerId} ${labelId}` : undefined"
                  :aria-describedby="describedBy"
                  data-slot="date-picker-trigger"
                  :disabled="disabled || readonly"
                  :class="ui.trigger({ class: props.ui?.trigger })"
                >
                  <span
                    aria-hidden="true"
                    data-slot="date-picker-trigger-indicator"
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
              </PopoverTrigger>
            </template>
          </DateInputGroup>
        </PopoverAnchor>
        <FieldDescription />
        <FieldError />
      </template>
    </DateFieldRoot>
    <PopoverPortal :disabled="portalTarget.disabled" :to="portalTarget.to">
      <PopoverContent
        ref="popoverContent"
        data-slot="date-picker-popover"
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
        <slot name="calendar" :value="modelValue" :on-select="onCalendarSelect">
          <!--
            No `min-value`/`max-value`: HeroUI's composed `Calendar` passes its own 1900/2099 defaults explicitly, which
            override the picker's bounds from React Aria's context, so the popover never greys out-of-range days (the
            field still validates them). `is-date-unavailable` does reach it.
          -->
          <Calendar
            :model-value="modelValue"
            :default-value="defaultValue"
            :placeholder="placeholder"
            :default-placeholder="defaultPlaceholder"
            :is-date-unavailable="isDateUnavailable"
            :locale="locale"
            :disabled="disabled"
            :invalid="invalid"
            :aria-label="calendarLabel"
            year-picker
            @update:model-value="onCalendarUpdate"
          />
        </slot>
      </PopoverContent>
    </PopoverPortal>
  </PopoverRoot>
</template>

<script lang="ts">
import type { DateFieldRootProps, DateValue } from 'reka-ui'

import type { ValidateFn, ValidationResult } from '../../composables/useFieldValidation'
import type { PortalTarget } from '../../config'
import type { ComponentSlots } from '../../types/tv'
import type { DateInputGroupProps } from '../date-input-group/DateInputGroup.vue'
import dateInputGroupTheme from '../date-input-group/theme'
import type { ValidationBehavior } from '../form/context'
import type { FormFieldProps } from '../form/types'
import theme from './theme'

type DatePicker = typeof theme
type DateInputGroup = typeof dateInputGroupTheme

// Reka doesn't export these as standalone types; derive them from the (exported) root props instead.
type Granularity = NonNullable<DateFieldRootProps['granularity']>
type HourCycle = NonNullable<DateFieldRootProps['hourCycle']>
type DateStep = NonNullable<DateFieldRootProps['step']>
type DateUnavailableMatcher = NonNullable<DateFieldRootProps['isDateUnavailable']>

export interface DatePickerProps extends FormFieldProps {
  /**
   * Renders the calendar popover in a portal. `true` portals to `document.body`, a selector string or element is used as the teleport target, and `false` disables portalling.
   * Falls back to `createHareUI({ portal })`, then `true`.
   */
  portal?: PortalTarget
  /** Label text rendered above the group. */
  label?: string
  /** Accessible label for the calendar inside the popover. HeroUI's demos set this independently of `label`. */
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
  class?: any
  /** Per-slot class overrides. `group`, `input` and `segment` are the internal `date-input-group`'s. */
  ui?: ComponentSlots<DatePicker> & { group?: ComponentSlots<DateInputGroup>['base'] } & Pick<
      ComponentSlots<DateInputGroup>,
      'input' | 'segment'
    >
}

export interface DatePickerSlots {
  /** Label content. Replaces the `label` prop. */
  label?: () => any
  /** Replaces the default calendar icon inside the trigger. */
  indicator?: () => any
  /** Description content. Replaces the `description` prop. */
  description?: () => any
  /** Error content, rendered while invalid. Replaces the `errorMessage` prop. */
  error?: (props: ValidationResult) => any
  /**
   * Replaces the default `Calendar` rendered inside the popover. Bind `value` and call `onSelect`
   * on your own `Calendar` to keep it wired to the picker (see the `custom-styles` demo).
   */
  calendar?: (props: {
    value: DateValue | null | undefined
    onSelect: (value: DateValue) => void
  }) => any
}

export interface DatePickerEmits {
  /** Emitted when the displayed placeholder date changes. */
  'update:placeholder': [value: DateValue]
  /** Emitted when the popover open state changes. */
  'update:open': [value: boolean]
}
</script>

<script setup lang="ts">
import { DateFormatter, getLocalTimeZone } from '@internationalized/date'
import {
  DateFieldInput,
  DateFieldRoot,
  PopoverAnchor,
  PopoverContent,
  PopoverPortal,
  PopoverRoot,
  PopoverTrigger,
} from 'reka-ui'
import type { ComponentPublicInstance } from 'vue'
import { computed, ref, useAttrs, useTemplateRef, watch } from 'vue'

import { useComponentUI } from '../../composables/useComponentUI'
import { useFieldChrome } from '../../composables/useFieldChrome'
import { useFieldValidation } from '../../composables/useFieldValidation'
import { useInertOutside } from '../../composables/useInertOutside'
import { usePortal } from '../../composables/usePortal'
import Calendar from '../calendar/Calendar.vue'
import DateInputGroup, {
  dropDanglingTimeZoneSeparator,
  wrapBidiIsolate,
} from '../date-input-group/DateInputGroup.vue'
import { useFieldsetDisabled } from '../fieldset/context'
import PopoverLabelledBy from './PopoverLabelledBy'

// `invalid: undefined`/`open: undefined`: an absent boolean would cast to `false`, which would count as
// controlled-valid/controlled-closed and hide validation errors / force the popover shut
const props = withDefaults(defineProps<DatePickerProps>(), {
  invalid: undefined,
  open: undefined,
  portal: undefined,
  defaultOpen: false,
})
const disabled = useFieldsetDisabled(() => props.disabled)
const portalTarget = usePortal(() => props.portal)
defineOptions({ inheritAttrs: false })
const emit = defineEmits<DatePickerEmits>()
const slots = defineSlots<DatePickerSlots>()
/** The selected date. Bind with `v-model`. */
const modelValue = defineModel<DateValue | null>()
/** The popover's open state. Bind with `v-model:open`. */
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

const ui = useComponentUI('datePicker', theme, () => ({ fullWidth: props.fullWidth }))

const root = useTemplateRef<ComponentPublicInstance>('root')
const trigger = useTemplateRef<HTMLButtonElement>('trigger')
// `PopoverRoot` (the template root) has no DOM element of its own to auto-inherit attrs onto;
// forward them manually to `DateFieldRoot`, the field's actual visual/semantic root.
const attrs = useAttrs()

// React Aria's `useDateFieldState` treats an out-of-range/unavailable value as a builtin validation error,
// combined with `validate`'s own errors the same way RAC's `mergeValidation` does (custom error wins when both
// apply); Reka only tracks this internally per-segment (unreachable from outside), so it's computed here instead
// and fed into `validate` so it follows `validationBehavior` like any other error.
function formatDateBoundary(value: DateValue) {
  return new DateFormatter(props.locale ?? 'en-US', { dateStyle: 'medium' }).format(
    value.toDate(getLocalTimeZone()),
  )
}
function builtinValidate(value: DateValue) {
  if (props.minValue && value.compare(props.minValue) < 0)
    return `Value must be ${formatDateBoundary(props.minValue)} or later.`
  if (props.maxValue && value.compare(props.maxValue) > 0)
    return `Value must be ${formatDateBoundary(props.maxValue)} or earlier.`
  if (props.isDateUnavailable?.(value)) return 'Selected date unavailable.'
  return undefined
}
function validate(value: DateValue) {
  const custom = props.validate?.(value)
  return custom && custom !== true ? custom : builtinValidate(value)
}
const { validation, commitValidation } = useFieldValidation({
  // Untouched + uncontrolled: `modelValue` is `undefined` until the first `onUpdate`, so fall back to
  // `defaultValue`. A controlled field explicitly cleared to `null` stays `null`, not fall back.
  value: () =>
    (modelValue.value === undefined ? props.defaultValue : modelValue.value) ?? undefined,
  validate: () => validate,
  invalid: () => props.invalid,
  validationBehavior: () => props.validationBehavior,
  name: () => props.name,
  root: () => root.value?.$el as Element | undefined,
  formField: props,
  onReset: () => {
    modelValue.value = props.defaultValue
  },
})
const invalid = computed(() => props.invalid ?? validation.value.isInvalid)

function onFieldUpdate(value: DateValue | undefined) {
  modelValue.value = value
  // No real `change` event bubbles from Reka's hidden mirror input while typing segments
  commitValidation()
}
// Selecting a date in the calendar closes the popover and restores focus to the trigger,
// matching HeroUI's own DatePicker behavior.
function onCalendarSelect(value: DateValue) {
  modelValue.value = value
  commitValidation()
  isOpen.value = false
  trigger.value?.focus()
}
// Also runs when the already-selected date is picked again (the Calendar re-emits it): React Aria still closes.
function onCalendarUpdate(value: DateValue | DateValue[] | undefined) {
  if (value && !Array.isArray(value)) onCalendarSelect(value)
}

// React Aria's `useDatePickerGroup`: Alt+ArrowDown/ArrowUp on a segment opens the calendar instead of
// stepping the segment. Captured on the field root so it runs before the segment's own handler.
function onFieldKeydown(event: KeyboardEvent) {
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
function onCloseAutoFocus(event: Event) {
  event.preventDefault()
  trigger.value?.focus()
}
// Escape closes the whole popover even while the calendar's year picker is open (the year picker marks the
// event handled to close itself, which would otherwise stop Reka's dismissal).
function onEscapeKeyDown(event: KeyboardEvent) {
  if (event.defaultPrevented) isOpen.value = false
}

// React Aria's calendar takes focus on open (its focused date: the value, else the placeholder, else today, else
// the first available day). Reka's PopoverContent would focus the first tabbable (the year-picker trigger) instead.
function onOpenAutoFocus(event: Event) {
  const content = event.target as HTMLElement | null
  const focusDate =
    (modelValue.value === undefined ? props.defaultValue : modelValue.value) ??
    props.placeholder ??
    props.defaultPlaceholder
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

const { id, labelId, hasLabel, describedBy, FieldLabel, FieldDescription, FieldError } =
  useFieldChrome({
    props,
    slots,
    invalid,
    validation,
    disabled,
    required: () => props.required,
    // Matches DateField/TimeField's own convention: hide the description while invalid
    hideDescriptionWhenInvalid: true,
  })
const triggerId = computed(() => `${id.value}-trigger`)

const groupUiProps = computed<DateInputGroupProps['ui']>(() => ({
  input: props.ui?.input,
  segment: props.ui?.segment,
  // HeroUI's `.date-picker .date-input-group__suffix { pointer-events-auto }`: the suffix slot
  // defaults to `pointer-events-none` (it's normally just a decorative icon), but here it holds the
  // clickable trigger button. `pointer-events-none`/`-auto` share no variant prefix, so twMerge drops
  // the group default cleanly.
  suffix: 'pointer-events-auto',
}))
</script>
