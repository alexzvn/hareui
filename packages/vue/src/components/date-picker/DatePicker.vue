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
      :class="ui.base()"
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
                  :aria-label="t('datePicker.calendar')"
                  :aria-labelledby="hasLabel ? `${triggerId} ${labelId}` : undefined"
                  :aria-describedby="describedBy"
                  data-slot="date-picker-trigger"
                  :disabled="disabled || readonly"
                  :class="ui.trigger()"
                >
                  <span
                    aria-hidden="true"
                    data-slot="date-picker-trigger-indicator"
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
        :class="ui.popover()"
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

<script setup lang="ts">
import { DateFormatter, getLocalTimeZone } from '@internationalized/date'
import type { DateValue } from 'reka-ui'
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

import Calendar from '@/components/calendar/Calendar.vue'
import type { DateInputGroupProps } from '@/components/date-input-group/DateInputGroup.types'
import {
  dropDanglingTimeZoneSeparator,
  wrapBidiIsolate,
} from '@/components/date-input-group/dateInputGroup.utils'
import DateInputGroup from '@/components/date-input-group/DateInputGroup.vue'
import { useFieldsetDisabled } from '@/components/fieldset/context'
import { useComponentUI } from '@/composables/useComponentUI'
import { useFieldChrome } from '@/composables/useFieldChrome'
import { useFieldValidation } from '@/composables/useFieldValidation'
import { useInertOutside } from '@/composables/useInertOutside'
import { useLocale } from '@/composables/useLocale'
import { usePortal } from '@/composables/usePortal'

import type { DatePickerEmits, DatePickerProps, DatePickerSlots } from './DatePicker.types'
import PopoverLabelledBy from './PopoverLabelledBy'
import theme from './theme'

const { t } = useLocale()

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

const ui = useComponentUI('datePicker', {
  theme,
  variantProps: () => ({ fullWidth: props.fullWidth }),
  props,
})

const root = useTemplateRef<ComponentPublicInstance>('root')
const trigger = useTemplateRef<HTMLButtonElement>('trigger')

// `PopoverRoot` (the template root) has no DOM element of its own to auto-inherit attrs onto;
// forward them manually to `DateFieldRoot`, the field's actual visual/semantic root.
const attrs = useAttrs()

const formatDateBoundary = (value: DateValue) => {
  const formatter = new DateFormatter(props.locale ?? 'en-US', { dateStyle: 'medium' })

  return formatter.format(value.toDate(getLocalTimeZone()))
}

// React Aria's `useDateFieldState` treats an out-of-range/unavailable value as a builtin validation error,
// combined with `validate`'s own errors the same way RAC's `mergeValidation` does (custom error wins when both
// apply); Reka only tracks this internally per-segment (unreachable from outside), so it's computed here instead
// and fed into `validate` so it follows `validationBehavior` like any other error.
const builtinValidate = (value: DateValue) => {
  if (props.minValue && value.compare(props.minValue) < 0)
    return t('validation.min', { value: formatDateBoundary(props.minValue) })

  if (props.maxValue && value.compare(props.maxValue) > 0)
    return t('validation.max', { value: formatDateBoundary(props.maxValue) })

  if (props.isDateUnavailable?.(value)) return t('validation.unavailable')

  return undefined
}

const validate = (value: DateValue) => {
  const custom = props.validate?.(value)
  return custom && custom !== true ? custom : builtinValidate(value)
}

// Untouched + uncontrolled: `modelValue` is `undefined` until the first `onUpdate`, so fall back to
// `defaultValue`. A controlled field explicitly cleared to `null` stays `null`, not fall back.
const currentValue = () => {
  const value = modelValue.value === undefined ? props.defaultValue : modelValue.value

  return value ?? undefined
}

const { validation, commitValidation } = useFieldValidation({
  value: currentValue,
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

const onFieldUpdate = (value: DateValue | undefined) => {
  modelValue.value = value

  // No real `change` event bubbles from Reka's hidden mirror input while typing segments
  commitValidation()
}

// Selecting a date in the calendar closes the popover and restores focus to the trigger,
// matching HeroUI's own DatePicker behavior.
const onCalendarSelect = (value: DateValue) => {
  modelValue.value = value
  commitValidation()
  isOpen.value = false
  trigger.value?.focus()
}

// Also runs when the already-selected date is picked again (the Calendar re-emits it): React Aria still closes.
const onCalendarUpdate = (value: DateValue | DateValue[] | undefined) => {
  if (value && !Array.isArray(value)) onCalendarSelect(value)
}

// React Aria's `useDatePickerGroup`: Alt+ArrowDown/ArrowUp on a segment opens the calendar instead of
// stepping the segment. Captured on the field root so it runs before the segment's own handler.
const onFieldKeydown = (event: KeyboardEvent) => {
  const isVerticalArrow = event.key === 'ArrowDown' || event.key === 'ArrowUp'
  const isOpenShortcut = event.altKey && isVerticalArrow
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

// React Aria's calendar takes focus on open (its focused date: the value, else the placeholder, else today, else
// the first available day). Reka's PopoverContent would focus the first tabbable (the year-picker trigger) instead.
const findInitialFocusCell = (content: HTMLElement | null) => {
  const focusDate = currentValue() ?? props.placeholder ?? props.defaultPlaceholder

  const focusDateCell = focusDate
    ? content?.querySelector<HTMLElement>(
        `[data-value="${focusDate.toString().slice(0, 10)}"]:not([data-outside-view])`,
      )
    : null

  const todayCell = () =>
    content?.querySelector<HTMLElement>('[data-today]:not([data-outside-view])')

  const firstAvailableCell = () =>
    content?.querySelector<HTMLElement>(
      '[data-value]:not([data-outside-view]):not([data-disabled]):not([data-unavailable])',
    )

  return focusDateCell ?? todayCell() ?? firstAvailableCell()
}

const onOpenAutoFocus = (event: Event) => {
  const cell = findInitialFocusCell(event.target as HTMLElement | null)
  if (!cell) return

  event.preventDefault()
  cell.focus()
}

const { name, id, labelId, hasLabel, describedBy, FieldLabel, FieldDescription, FieldError } =
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
