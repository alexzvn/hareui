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
      :class="ui.base()"
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
              :class="ui.rangeSeparator()"
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
                :class="ui.trigger()"
              >
                <span
                  aria-hidden="true"
                  data-slot="date-range-picker-trigger-indicator"
                  :class="ui.triggerIndicator()"
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
        :class="ui.popover()"
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

<script setup lang="ts">
import type { DateValue } from '@internationalized/date'
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

import type { DateInputGroupProps } from '@/components/date-input-group/DateInputGroup.types'
import {
  dropDanglingTimeZoneSeparator,
  wrapBidiIsolate,
} from '@/components/date-input-group/dateInputGroup.utils'
import DateInputGroup from '@/components/date-input-group/DateInputGroup.vue'
import PopoverLabelledBy from '@/components/date-picker/PopoverLabelledBy'
import { useFieldsetDisabled } from '@/components/fieldset/context'
import type { DateRange } from '@/components/range-calendar/RangeCalendar.types'
import RangeCalendar from '@/components/range-calendar/RangeCalendar.vue'
import { useComponentUI } from '@/composables/useComponentUI'
import { useFieldChrome } from '@/composables/useFieldChrome'
import { useFieldValidation } from '@/composables/useFieldValidation'
import { useInertOutside } from '@/composables/useInertOutside'
import { usePortal } from '@/composables/usePortal'

import type {
  DateRangePickerEmits,
  DateRangePickerProps,
  DateRangePickerSlots,
  DateRangeValue,
} from './DateRangePicker.types'
import { validateDateRange } from './dateRangeValidation'
import { mergeRangeTime } from './mergeRangeTime'
import theme from './theme'

defineOptions({ inheritAttrs: false })

// `invalid: undefined`/`open: undefined`: an absent boolean would cast to `false`, which would count as
// controlled-valid/controlled-closed and hide validation errors / force the popover shut
const props = withDefaults(defineProps<DateRangePickerProps>(), {
  invalid: undefined,
  open: undefined,
  portal: undefined,
  defaultOpen: false,
  inputContainer: false,
})

const emit = defineEmits<DateRangePickerEmits>()
const slots = defineSlots<DateRangePickerSlots>()

/** The selected range (`null` when empty). Bind with `v-model`. Only complete ranges are emitted, as in React Aria. */
const modelValue = defineModel<DateRangeValue | null>()

const disabled = useFieldsetDisabled(() => props.disabled)
const portalTarget = usePortal(() => props.portal)
const attrs = useAttrs()

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

const ui = useComponentUI('dateRangePicker', {
  theme,
  variantProps: () => ({ fullWidth: props.fullWidth }),
  props,
})

const root = useTemplateRef<ComponentPublicInstance>('root')
const trigger = useTemplateRef<HTMLButtonElement>('trigger')

const getFieldElement = () => root.value?.$el as HTMLElement | undefined

const EMPTY: DateRange = { start: undefined, end: undefined }

const isComplete = (value: DateRange | null | undefined): value is DateRangeValue => {
  return !!value?.start && !!value.end
}

// The committed value: `v-model` once set, else `defaultValue`.
const committed = computed<DateRangeValue | null>(() => {
  const value = modelValue.value === undefined ? props.defaultValue : modelValue.value
  return value ?? null
})

// What the segments show: React Aria's `useDateRangePickerState` keeps a partially typed range as a local
// placeholder and only emits complete ranges (or `null`), so Reka is driven from this draft instead of `v-model`.
const draft = shallowRef<DateRange>(committed.value ?? EMPTY)

watch(committed, (value) => {
  const isDraftInSync = value?.start === draft.value.start && value?.end === draft.value.end
  if (isDraftInSync) return

  draft.value = value ?? EMPTY
})

const commit = (value: DateRangeValue | null, shouldValidate = true) => {
  draft.value = value ?? EMPTY
  modelValue.value = value
  if (shouldValidate) commitValidation()
}

// React Aria commits a segment-edited range's validation when focus leaves the field, not on every keystroke,
// so e.g. a range that is briefly reversed mid-edit isn't flagged until the user is done.
let isValidationPending = false

const onFieldUpdate = (value: DateRange) => {
  draft.value = value

  // Only a complete range, or clearing a committed one, reaches `v-model`; a partial range stays a draft.
  const isCleared = !value.start && !value.end && committed.value !== null
  if (!isComplete(value) && !isCleared) return

  commit(isComplete(value) ? value : null, false)
  isValidationPending = true
}

const onFieldFocusOut = (event: FocusEvent) => {
  if (!isValidationPending) return

  // Moving between the field's own segments isn't leaving it.
  const next = event.relatedTarget
  const isFocusInside = next instanceof Node && getFieldElement()?.contains(next) === true
  if (isFocusInside) return

  isValidationPending = false
  commitValidation()
}

const onCalendarChange = (range: DateRangeValue) => {
  commit(range)
}

// Completing a range in the calendar closes the popover and refocuses the trigger (React Aria's
// `shouldCloseOnSelect` default).
const onCalendarSelect = (range: DateRangeValue) => {
  isValidationPending = false
  commit(range)
  isOpen.value = false
  trigger.value?.focus()
}

const onCalendarUpdate = (value: DateRange | undefined) => {
  if (!isComplete(value)) return

  const range = mergeRangeTime(value, { current: draft.value, granularity: props.granularity })
  onCalendarSelect(range)
}

// Combined with the builtin range validation the way RAC's `mergeValidation` does: a custom error wins.
const validate = (value: DateRangeValue) => {
  const custom = props.validate?.(value)
  return custom && custom !== true ? custom : validateDateRange(value, props)
}

const { validation, commitValidation } = useFieldValidation<DateRangeValue>({
  value: () => committed.value ?? undefined,
  validate: () => validate,
  invalid: () => props.invalid,
  validationBehavior: () => props.validationBehavior,
  name: () => props.startName,
  root: getFieldElement,
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

const IN_VIEW = ':not([data-outside-view])'

// React Aria's calendar focuses its focused date: the range start, else the placeholder, else today, else the
// first available day.
const findInitialFocusCell = (content: HTMLElement) => {
  const focusDate = committed.value?.start ?? props.placeholder ?? props.defaultPlaceholder

  // Day cells carry the plain ISO date, without time or zone.
  const focusDateKey = focusDate?.toString().slice(0, 10)
  const focusDateCell = focusDateKey
    ? content.querySelector<HTMLElement>(`[data-value="${focusDateKey}"]${IN_VIEW}`)
    : null

  return (
    focusDateCell ??
    content.querySelector<HTMLElement>(`[data-today]${IN_VIEW}`) ??
    content.querySelector<HTMLElement>(
      `[data-value]${IN_VIEW}:not([data-disabled]):not([data-unavailable])`,
    )
  )
}

// The calendar takes focus on open; Reka's PopoverContent would focus the first tabbable (the year-picker
// trigger) instead.
const onOpenAutoFocus = (event: Event) => {
  const content = event.target as HTMLElement | null
  const cell = content ? findInitialFocusCell(content) : null
  if (!cell) return

  event.preventDefault()
  cell.focus()
}

// React Aria's `useDatePickerGroup`: Alt+ArrowDown/ArrowUp on a segment opens the calendar instead of
// stepping the segment. Captured on the field root so it runs before the segment's own handler.
const onFieldKeydown = (event: KeyboardEvent) => {
  const isOpenShortcut = event.altKey && (event.key === 'ArrowDown' || event.key === 'ArrowUp')
  if (!isOpenShortcut || disabled.value || props.readonly) return

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
  const segment = getFieldElement()?.querySelector?.<HTMLElement>(
    '[data-slot=date-input-group-segment][contenteditable=true]',
  )

  segment?.focus()
}
</script>
