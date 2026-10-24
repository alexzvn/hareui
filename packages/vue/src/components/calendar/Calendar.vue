<template>
  <CalendarMonthShell
    ref="shell"
    kind="calendar"
    :ui="ui"
    :ui-overrides="props.ui"
    :root-class="props.class"
    :aria-label="ariaLabel"
    :placeholder="placeholder"
    :default-placeholder="placeholderSeed"
    :min-value="minValue"
    :max-value="maxValue"
    :selection="selection"
    :root-bindings="rootBindings"
    :disabled="disabled"
    :readonly="readonly"
    :invalid="invalid"
    :locale="locale"
    :first-day-of-week="firstDayOfWeek"
    :fixed-weeks="fixedWeeks"
    :year-picker="yearPicker"
    :paged-navigation="pagedNavigation"
    :number-of-months="numberOfMonths"
    :dir="dir"
    :visible-duration="visibleDuration"
    :page-behavior="pageBehavior"
    :indicator="indicator"
    @update:placeholder="emit('update:placeholder', $event)"
    @select="emit('update:modelValue', $event)"
  >
    <template v-if="$slots.navIcon" #navIcon="slotProps">
      <slot name="navIcon" v-bind="slotProps" />
    </template>
    <template v-if="$slots.cell" #cell="slotProps">
      <slot name="cell" v-bind="slotProps as CalendarCellSlotProps" />
    </template>
    <template #monthCell="{ date, month }">
      <CalendarCell :date="date">
        <CalendarCellTrigger
          v-if="$slots.cell || indicator"
          v-slot="{ dayValue, today, selected, disabled: cellDisabled, unavailable, outsideView }"
          :day="date"
          :month="month"
          data-slot="calendar-cell"
          :class="ui.cell({ class: props.ui?.cell })"
        >
          <slot
            name="cell"
            :date="date"
            :today="today"
            :selected="selected"
            :disabled="cellDisabled"
            :unavailable="unavailable"
            :outside-view="outsideView"
          >
            {{ dayValue }}
          </slot>
          <span
            v-if="indicator?.(date)"
            data-slot="calendar-cell-indicator"
            aria-hidden="true"
            :class="ui.cellIndicator({ class: props.ui?.cellIndicator })"
          />
        </CalendarCellTrigger>
        <!-- no slot content -> no slot-scope ref, so moving focus doesn't force-update every trigger -->
        <CalendarCellTrigger
          v-else
          :day="date"
          :month="month"
          data-slot="calendar-cell"
          :class="ui.cell({ class: props.ui?.cell })"
        />
      </CalendarCell>
    </template>
  </CalendarMonthShell>
</template>

<script setup lang="ts">
import type { DateValue } from '@internationalized/date'
import { isSameDay } from '@internationalized/date'
import { CalendarCell, CalendarCellTrigger } from 'reka-ui'
import { computed, useTemplateRef } from 'vue'

import { useComponentUI } from '@/composables/useComponentUI'

import type {
  CalendarCellSlotProps,
  CalendarEmits,
  CalendarProps,
  CalendarSlots,
} from './Calendar.types'
import { defaultMaxValue, defaultMinValue } from './calendarBounds'
import { calendarCellDate, calendarCellFrom } from './calendarCells'
import type { CalendarMonthShellExposed } from './CalendarMonthShell.types'
import CalendarMonthShell from './CalendarMonthShell.vue'
import theme from './theme'

const props = withDefaults(defineProps<CalendarProps>(), {
  modelValue: undefined,
  placeholder: undefined,
  disabled: false,
  readonly: false,
  fixedWeeks: false,
  selectionMode: 'single',
  yearPicker: false,
  pagedNavigation: false,
  numberOfMonths: 1,
  invalid: false,
  pageBehavior: 'visible',
})

const emit = defineEmits<CalendarEmits>()
defineSlots<CalendarSlots>()

const viewKind = computed(() => {
  if (props.visibleDuration?.days != null) return 'day' as const
  return props.visibleDuration?.weeks != null ? ('week' as const) : ('month' as const)
})

const ui = useComponentUI('calendar', {
  theme,
  variantProps: () => ({ view: viewKind.value }),
})

const monthShell = useTemplateRef<CalendarMonthShellExposed>('shell')
const minValue = computed(() => props.minValue ?? defaultMinValue())
const maxValue = computed(() => props.maxValue ?? defaultMaxValue())

const initial = props.modelValue ?? props.defaultValue

// React Aria's useCalendarState resolves the initial focused date via
// `constrainValue(Array.isArray(value) ? value[0] : value, minValue, maxValue)` whenever a
// value/defaultValue was passed at all (even an empty array, which is truthy). constrainValue's
// min-clamp treats an `undefined` date as below range, so `value[0]` on an empty array resolves to
// `minValue` instead of today. Replicate that exactly so multiple-selection with `[]` matches HeroUI.
const placeholderSeed =
  props.defaultPlaceholder ??
  (Array.isArray(initial) ? (initial[0] ?? minValue.value) : (initial ?? undefined))

// React Aria disables outside-month cells, so pressing one neither selects nor pages; Reka would do both. And
// re-pressing the selected date keeps it selected (Reka's `prevent-deselect`) but still reports it, as React Aria's
// `onChange` does, which DatePicker relies on to close its popover. Both run in the capture phase, before the cell's
// own Reka handler.
const reselect = (event: Event, cell: HTMLElement) => {
  const isReselectable =
    props.selectionMode !== 'multiple' &&
    !props.readonly &&
    !props.disabled &&
    cell.hasAttribute('data-selected') &&
    !cell.hasAttribute('data-disabled')

  if (!isReselectable) return

  event.preventDefault()
  event.stopPropagation()

  const date = calendarCellDate(cell, monthShell.value!.placeholder)
  const current = props.modelValue
  const isSameDate = current && !Array.isArray(current) && isSameDay(current, date)
  emit('update:modelValue', isSameDate ? current : date)
}

const onRootClickCapture = (event: MouseEvent) => {
  const cell = calendarCellFrom(event.target, monthShell.value?.rootEl)
  if (!cell) return

  if (cell.hasAttribute('data-outside-view')) {
    event.preventDefault()
    event.stopPropagation()

    return
  }

  reselect(event, cell)
}

const onRootKeyDownCapture = (event: KeyboardEvent) => {
  const isActivationKey = event.key === 'Enter' || event.key === ' '
  const hasModifier = event.altKey || event.ctrlKey || event.metaKey
  if (!isActivationKey || hasModifier) return

  const cell = calendarCellFrom(event.target, monthShell.value?.rootEl)
  if (cell) reselect(event, cell)
}

const rootBindings = computed(() => ({
  modelValue: props.modelValue,
  defaultValue: props.defaultValue,
  multiple: props.selectionMode === 'multiple',
  preventDeselect: props.selectionMode !== 'multiple',
  isDateUnavailable: props.isDateUnavailable,
  'onUpdate:modelValue': (value: DateValue | DateValue[] | undefined) =>
    emit('update:modelValue', value),
  onClickCapture: onRootClickCapture,
  onKeydownCapture: onRootKeyDownCapture,
}))

const selection = computed(() => ({
  value: props.modelValue,
  defaultValue: props.defaultValue,
  mode: props.selectionMode,
  isDateUnavailable: props.isDateUnavailable,
}))
</script>
