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

<script lang="ts">
import type { DateValue } from '@internationalized/date'
import type { VNode } from 'vue'

import type { ComponentSlots } from '@/types/tv'
import type { ClassValue } from '@/utils/tv'

import theme from './theme'
import type { PageBehavior, VisibleDuration } from './useCalendarDurationView'

type Calendar = typeof theme

export type CalendarProps = {
  /** Accessible label for the calendar. */
  ariaLabel?: string
  /** The selected date(s). Use `v-model` to control it. */
  modelValue?: DateValue | DateValue[] | null
  /**
   * The selected date(s) when initially rendered (uncontrolled).
   * Reka UI's `defaultValue` prop type only accepts a single `DateValue`, not an array, even in
   * multiple-selection mode (see reka-limitations in the Calendar report); cast at the call site.
   */
  defaultValue?: DateValue | DateValue[]
  /** The currently displayed month/year. Use `v-model:placeholder` to control it. */
  placeholder?: DateValue
  /** The date initially displayed, before navigation (uncontrolled). */
  defaultPlaceholder?: DateValue
  /**
   * The minimum selectable date.
   * @defaultValue 1900-01-01
   */
  minValue?: DateValue
  /**
   * The maximum selectable date.
   * @defaultValue 2099-12-31
   */
  maxValue?: DateValue
  /** Callback returning whether a given date is unavailable for selection. */
  isDateUnavailable?: (date: DateValue) => boolean
  /**
   * Whether the whole calendar is disabled.
   * @defaultValue false
   */
  disabled?: boolean
  /**
   * Whether the calendar is read-only (dates stay visible but cannot be changed).
   * @defaultValue false
   */
  readonly?: boolean
  /** The locale used for formatting and week calculations. */
  locale?: string
  /** The day the week starts on. */
  firstDayOfWeek?: 'sun' | 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat'
  /**
   * Whether to always display 6 weeks, avoiding layout shift between months.
   * Reka UI only supports a fixed 6-week grid (HeroUI's React `weeksInMonth` accepts
   * any count up to 6; see reka-limitations in the Calendar report).
   * @defaultValue false
   */
  fixedWeeks?: boolean
  /**
   * Whether one or multiple dates can be selected.
   * @defaultValue 'single'
   */
  selectionMode?: 'single' | 'multiple'
  /**
   * Replaces the plain month/year heading with a toggleable year grid.
   * @defaultValue false
   */
  yearPicker?: boolean
  /** Callback returning whether a small dot indicator should render under a date. */
  indicator?: (date: DateValue) => boolean
  /**
   * This property causes the previous/next buttons to navigate by the number of
   * months displayed at once rather than one month.
   * @defaultValue false
   */
  pagedNavigation?: boolean
  /**
   * Shows this many months side by side. Navigating with the prev/next buttons always pages
   * by the full visible width (Reka's `pagedNavigation`, forced on regardless of the
   * `pagedNavigation` prop, matching React Aria's default `pageBehavior: "visible"`).
   * Reka's heading only formats the combined range, so each panel renders its own
   * "<Month> <Year>" label derived from that panel's `Grid.value` (see reka-limitations in
   * the Calendar report).
   * @defaultValue 1
   */
  numberOfMonths?: number
  /**
   * Marks the calendar as invalid for consumer-driven validation. Reka's own `isInvalid` is a
   * read-only computed derived from `isDateUnavailable`/`minValue`/`maxValue`, with no input prop
   * to override it (see reka-limitations in the Calendar report), so this sets
   * `aria-invalid`/`data-invalid` directly instead. HeroUI's styles don't key off it either, so
   * it has no visual effect by itself.
   * @defaultValue false
   */
  invalid?: boolean
  /** The reading direction of the calendar. */
  dir?: 'ltr' | 'rtl'
  /**
   * The visible time range. `{ weeks: n }` shows a week view and `{ days: n }` a day view (a rolling window of
   * consecutive days); anything else shows the month view (use `number-of-months` for several months).
   * Navigation advances by the visible range.
   * @defaultValue { months: 1 }
   */
  visibleDuration?: VisibleDuration
  /**
   * In week/day views, whether the prev/next buttons and page keys move by the whole visible range
   * (`'visible'`) or by one week/day (`'single'`).
   * @defaultValue 'visible'
   */
  pageBehavior?: PageBehavior
  /** Additional classes merged into the root element. */
  class?: ClassValue
  /** Per-slot class overrides. */
  ui?: ComponentSlots<Calendar>
}

export type CalendarSlots = {
  /** Replaces the chevron icon inside a nav button. */
  navIcon?: (props: { direction: 'previous' | 'next' }) => VNode[]
  /** Replaces a cell's default formatted-date content. */
  cell?: (props: {
    date: DateValue
    today: boolean
    selected: boolean
    disabled: boolean
    unavailable: boolean
    outsideView: boolean
  }) => VNode[]
}

export type CalendarEmits = {
  /** Emitted when the selected date(s) change. */
  'update:modelValue': [value: DateValue | DateValue[] | undefined]
  /** Emitted when the displayed month/year changes. */
  'update:placeholder': [value: DateValue]
}
type CalendarCellSlotProps = Parameters<NonNullable<CalendarSlots['cell']>>[0]
</script>

<script setup lang="ts">
import { isSameDay } from '@internationalized/date'
import { CalendarCell, CalendarCellTrigger } from 'reka-ui'
import { computed, useTemplateRef } from 'vue'

import { useComponentUI } from '@/composables/useComponentUI'

import { calendarCellDate, calendarCellFrom } from './calendarCells'
import type { CalendarMonthShellExposed } from './CalendarMonthShell.vue'
import CalendarMonthShell from './CalendarMonthShell.vue'
import { defaultMaxValue, defaultMinValue } from './useCalendarBounds'

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
const ui = useComponentUI('calendar', theme, () => ({ view: viewKind.value }))

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
  emit(
    'update:modelValue',
    current && !Array.isArray(current) && isSameDay(current, date) ? current : date,
  )
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
  if (
    (event.key !== 'Enter' && event.key !== ' ') ||
    event.altKey ||
    event.ctrlKey ||
    event.metaKey
  )
    return
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
