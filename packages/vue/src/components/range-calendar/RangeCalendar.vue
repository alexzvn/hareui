<script lang="ts">
import type { DateValue } from '@internationalized/date'
import type { PageBehavior, VisibleDuration } from '../calendar/useCalendarDurationView'
import type { ComponentSlots } from '../../types/tv'
import theme from './theme'

type RangeCalendar = typeof theme

export interface DateRange {
  start: DateValue | undefined
  end: DateValue | undefined
}

export interface RangeCalendarProps {
  /** Accessible label for the calendar. */
  ariaLabel?: string
  /** The selected date range. Use `v-model` to control it. */
  modelValue?: DateRange
  /** The selected date range when initially rendered (uncontrolled). */
  defaultValue?: DateRange
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
  /**
   * Callback returning whether a given date is unavailable for selection. During an
   * in-progress range selection, `anchorDate` is the already-picked start date (or `null`
   * before any date is picked), matching React Aria's `isDateUnavailable(date, anchorDate)`.
   */
  isDateUnavailable?: (date: DateValue, anchorDate: DateValue | null) => boolean
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
  /**
   * Whether non-contiguous ranges are allowed, skipping over unavailable dates in the middle
   * of the range instead of resetting the selection.
   * @defaultValue false
   */
  allowNonContiguousRanges?: boolean
  /** Restricts a range selection to a fixed number of days from the start date. */
  maximumDays?: number
  /** The locale used for formatting and week calculations. */
  locale?: string
  /** The day the week starts on. */
  firstDayOfWeek?: 'sun' | 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat'
  /**
   * Whether to always display 6 weeks, avoiding layout shift between months.
   * Reka UI only supports a fixed 6-week grid (HeroUI's React `weeksInMonth` accepts
   * any count up to 6; see reka-limitations in the RangeCalendar report).
   * @defaultValue false
   */
  fixedWeeks?: boolean
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
   * the RangeCalendar report).
   * @defaultValue 1
   */
  numberOfMonths?: number
  /**
   * Marks the calendar as invalid for consumer-driven validation (e.g. a selected range that's
   * too long). Reka's own `isInvalid` is a read-only computed derived from `isDateUnavailable`/
   * `minValue`/`maxValue`, with no input prop to override it (see reka-limitations in the
   * RangeCalendar report), so this sets `aria-invalid`/`data-invalid` directly instead. HeroUI's
   * styles don't key off it either, so it has no visual effect by itself.
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
  class?: any
  /** Per-slot class overrides. */
  ui?: ComponentSlots<RangeCalendar>
}

export interface RangeCalendarSlots {
  /** Replaces the chevron icon inside a nav button. */
  navIcon?: (props: { direction: 'previous' | 'next' }) => any
  /** Replaces a cell's default formatted-date content. */
  cell?: (props: {
    date: DateValue
    today: boolean
    selected: boolean
    disabled: boolean
    unavailable: boolean
    outsideView: boolean
    selectionStart: boolean
    selectionEnd: boolean
  }) => any
}

export interface RangeCalendarEmits {
  /** Emitted when the selected date range changes. */
  'update:modelValue': [value: DateRange | undefined]
  /** Emitted when the displayed month/year changes. */
  'update:placeholder': [value: DateValue]
}
</script>

<script setup lang="ts">
import {
  CalendarHeadCell,
  RangeCalendarGrid,
  RangeCalendarGridBody,
  RangeCalendarGridHead,
  RangeCalendarGridRow,
  RangeCalendarHeading,
  RangeCalendarNext,
  RangeCalendarPrev,
  RangeCalendarRoot,
} from 'reka-ui'
import { isSameDay, isSameMonth } from '@internationalized/date'
import { computed, nextTick, onBeforeUnmount, onMounted, provide, ref, shallowRef, watch } from 'vue'
import RangeCalendarDay, { rangeCalendarDayKey } from './RangeCalendarDay.vue'
import { isDurationView } from '../calendar/useCalendarDurationView'
import { useComponentUI } from '../../composables/useComponentUI'
import { useSlotOutlet } from '../../composables/useSlotOutlet'
import CalendarDurationView from '../calendar/CalendarDurationView.vue'
import { defaultMaxValue, defaultMinValue, weekStartsOnFromFirstDay } from '../calendar/useCalendarBounds'
import { formatPanelHeading } from '../calendar/useCalendarPanelHeading'
import { calendarCellDate, calendarCellFrom, compareDay, focusCalendarCell, useCalendarMonthKeys } from '../calendar/useCalendarMonthKeys'
import { useCalendarPlaceholder } from '../calendar/useCalendarPlaceholder'
import { useCalendarYearPicker } from '../calendar/useCalendarYearPicker'

const props = withDefaults(defineProps<RangeCalendarProps>(), {
  modelValue: undefined,
  placeholder: undefined,
  disabled: false,
  readonly: false,
  allowNonContiguousRanges: false,
  fixedWeeks: false,
  yearPicker: false,
  pagedNavigation: false,
  numberOfMonths: 1,
  invalid: false,
  pageBehavior: 'visible',
})
const effectivePagedNavigation = computed(() => props.numberOfMonths > 1 ? true : props.pagedNavigation)
const emit = defineEmits<RangeCalendarEmits>()
const slots = defineSlots<RangeCalendarSlots>()

const viewKind = computed(() => props.visibleDuration?.days != null ? 'day' as const : props.visibleDuration?.weeks != null ? 'week' as const : 'month' as const)
const durationView = computed(() => isDurationView(props.visibleDuration))
const ui = useComponentUI('rangeCalendar', theme, () => ({ view: viewKind.value }))

const rootInstance = ref<{ $el: HTMLElement } | null>(null)
const rootEl = computed(() => rootInstance.value?.$el)
const minValue = computed(() => props.minValue ?? defaultMinValue())
const maxValue = computed(() => props.maxValue ?? defaultMaxValue())
const weekStartsOn = computed(() => weekStartsOnFromFirstDay(props.firstDayOfWeek))

const placeholderModel = useCalendarPlaceholder(
  () => props.placeholder,
  props.defaultPlaceholder ?? (props.modelValue ?? props.defaultValue)?.start ?? undefined,
  value => emit('update:placeholder', value),
)

const isYearPickerOpen = ref(false)
const focusedYear = computed(() => placeholderModel.value.year)

// React Aria's year picker keeps the focused month/day and only swaps the year.
function onSelectYear(year: number) {
  placeholderModel.value = placeholderModel.value.set({ year })
  isYearPickerOpen.value = false
}

const yearPickerState = useCalendarYearPicker({
  open: isYearPickerOpen,
  focusedYear,
  minValue,
  maxValue,
  rootEl,
  gridSlot: 'range-calendar-grid',
  onSelect: onSelectYear,
})
const { activeYear: yearPickerActiveYear, gridRef: yearPickerGridRef, onKeyDown: onYearPickerKeyDown, selectYear: selectYearPickerYear, years: yearPickerYears } = yearPickerState

// The month view runs React Aria's range state machine (`useRangeCalendarState` + `useCalendarCell`) here and uses
// Reka only for the grid, focus movement and paging. Reka's own selection is never fed (its model stays empty) and its
// cell click/Enter/Space handlers are pre-empted in the capture phase: Reka has no live range preview with the
// selected styling, no press-drag selection, re-anchors its placeholder on every start change and marks unavailable
// days inside a non-contiguous range as selected. The cell attributes (`data-selected`/`data-selection-start`/
// `data-selection-end`) are bound from this state and override Reka's.
const EMPTY_RANGE: DateRange = { start: undefined, end: undefined }
const internalValue = shallowRef<DateRange | undefined>(props.defaultValue)
const committed = computed(() => props.modelValue !== undefined ? props.modelValue : internalValue.value)
// react-stately's `anchorDate`: the first picked day of an in-progress selection, `null` otherwise
const anchor = shallowRef<DateValue | null>(null)
// react-stately's `focusedDate` (keyboard focus, or the hovered day while anchored): the preview's moving end
const focusedDate = shallowRef<DateValue | null>(null)
let lastEmitted: DateRange | undefined

// React Aria's `isDateUnavailable(date, anchorDate)` lets the matcher depend on the in-progress range's start date
// (see HeroUI's anchor-unavailable-dates demo). Reka's `Matcher` type is single-argument only (reka-limitation), so
// the consumer's 2-arg callback is wrapped into the 1-arg shape Reka expects, reading the anchor at call time.
const wrappedIsDateUnavailable = computed(() => {
  if (!props.isDateUnavailable)
    return undefined
  return (date: DateValue) => props.isDateUnavailable!(date, anchor.value)
})
// react-stately's `getAvailableRange`: while a range is anchored (and non-contiguous ranges are off), the selectable
// window shrinks to the run of available days around the anchor, which also disables paging past it.
function edgeOfAvailableRun(from: DateValue, dir: 1 | -1) {
  const span = { months: Math.max(1, props.numberOfMonths) }
  const limit = dir < 0 ? from.subtract(span) : from.add(span)
  let next = from.add({ days: dir })
  while ((dir < 0 ? next.compare(limit) >= 0 : next.compare(limit) <= 0) && !wrappedIsDateUnavailable.value!(next))
    next = next.add({ days: dir })
  return wrappedIsDateUnavailable.value!(next) ? next.add({ days: -dir }) : undefined
}
const availableRun = computed(() => {
  const from = anchor.value
  if (!from || !wrappedIsDateUnavailable.value || props.allowNonContiguousRanges)
    return null
  return { start: edgeOfAvailableRun(from, -1), end: edgeOfAvailableRun(from, 1) }
})
const effectiveMinValue = computed(() => {
  const start = availableRun.value?.start
  return start && compareDay(start, minValue.value) > 0 ? start : minValue.value
})
const effectiveMaxValue = computed(() => {
  const end = availableRun.value?.end
  return end && compareDay(end, maxValue.value) < 0 ? end : maxValue.value
})
// Reka's `maximumDays`: while anchored, days `maximumDays` or more away from the anchor are disabled. Reka only applies
// it to its own start value, which isn't fed, so it is passed back in as `is-date-disabled`.
function isDateDisabledByMaximumDays(date: DateValue) {
  return !!props.maximumDays && !!anchor.value && Math.abs(compareDay(date, anchor.value)) >= props.maximumDays
}
function isCellDisabled(date: DateValue) {
  return compareDay(date, effectiveMinValue.value) < 0 || compareDay(date, effectiveMaxValue.value) > 0 || isDateDisabledByMaximumDays(date)
}

function makeRange(a: DateValue, b: DateValue): { start: DateValue, end: DateValue } {
  return compareDay(a, b) <= 0 ? { start: a, end: b } : { start: b, end: a }
}
const highlightedRange = computed(() => {
  if (anchor.value)
    return makeRange(anchor.value, focusedDate.value ?? anchor.value)
  const value = committed.value
  return value?.start && value.end ? makeRange(value.start, value.end) : null
})
// react-stately's `isInvalidSelection` (+ the `invalid` prop): a committed range whose ends are unavailable or out of
// bounds. Its cells are flagged `data-invalid` and stay selected even where unavailable.
const isValueInvalid = computed(() => {
  if (props.invalid)
    return true
  const value = committed.value
  if (anchor.value || !value?.start || !value.end)
    return false
  const outOfBounds = (date: DateValue) => compareDay(date, minValue.value) < 0 || compareDay(date, maxValue.value) > 0
  return !!wrappedIsDateUnavailable.value?.(value.start) || !!wrappedIsDateUnavailable.value?.(value.end) || outOfBounds(value.start) || outOfBounds(value.end)
})
// `useCalendarCell`: outside-month and disabled days are never selected, unavailable ones only inside an invalid range
function cellState(date: DateValue, month: DateValue) {
  const range = highlightedRange.value
  const inRange = !!range && compareDay(date, range.start) >= 0 && compareDay(date, range.end) <= 0
  const disabled = !isSameMonth(date, month) || isCellDisabled(date)
  const invalid = inRange && !disabled && isValueInvalid.value
  const selected = inRange && !disabled && (invalid || !wrappedIsDateUnavailable.value?.(date))
  return {
    selected,
    selectionStart: !!range && isSameDay(date, range.start),
    selectionEnd: !!range && isSameDay(date, range.end),
    invalid,
  }
}

function emitValue(value: DateRange) {
  lastEmitted = value
  emit('update:modelValue', value)
}
// react-stately's `selectDate`: the first pick anchors, the second commits the ordered range. The anchor is also
// emitted as a half-open range (`end: undefined`), as Reka did, so v-model consumers see the selection start.
function selectDate(date: DateValue) {
  if (props.readonly || props.disabled)
    return
  if (!anchor.value) {
    anchor.value = date
    focusedDate.value = date
    emitValue({ start: date, end: undefined })
    return
  }
  const range = makeRange(anchor.value, date)
  anchor.value = null
  internalValue.value = range
  emitValue(range)
}
// A cell React Aria would let you press: not outside the month, disabled or unavailable
function isSelectableCell(el: HTMLElement) {
  return !el.hasAttribute('data-disabled') && !el.hasAttribute('data-unavailable') && !el.hasAttribute('data-outside-view')
}
// `focusNearestAvailableDate`: anchoring with the keyboard advances focus one day (back one at the end of the
// available run) so the preview shows a range immediately.
function focusNearestAvailableDate(from: DateValue) {
  const outside = (date: DateValue) => compareDay(date, effectiveMinValue.value) < 0 || compareDay(date, effectiveMaxValue.value) > 0
  let next = from.add({ days: 1 })
  if (outside(next))
    next = from.subtract({ days: 1 })
  if (outside(next))
    return
  focusedDate.value = next
  placeholderModel.value = next
  nextTick(() => focusCalendarCell(rootEl.value, next))
}

// RAC's `usePress` focuses the pressed cell from script and flags pointer focus with `data-focused` (no
// `data-focus-visible`), which keeps HeroUI's focus ring off. Reka's `data-focused` means "focused date" instead, so
// pointer focus is flagged with `data-pointer-focus` until blur.
function pointerFocus(el: HTMLElement) {
  el.setAttribute('data-pointer-focus', '')
  el.addEventListener('blur', () => el.removeAttribute('data-pointer-focus'), { once: true })
  el.focus()
}
// The current mouse press (`useCalendarCell`'s per-cell refs): `anchor` when the press started the selection,
// `boundary` when it grabbed an end of the committed range. Leaving the pressed cell cancels it, as RAC's
// `shouldCancelOnPointerExit` does while anchored.
let press: { el: HTMLElement, anchor: boolean, boundary: boolean } | null = null
let dragging = false
// A mouse press is handled on pointerdown/pointerup, so the click that follows it is swallowed
let swallowClick = false

function onCellPointerDown(event: PointerEvent, date: DateValue) {
  if (event.button !== 0)
    return
  const el = event.currentTarget as HTMLElement
  if (!isSelectableCell(el))
    return
  event.preventDefault()
  pointerFocus(el)
  // Chrome drops `:active` once Reka re-renders the pressed cell, so mirror RAC's `data-pressed` (which HeroUI's
  // CSS styles alongside `:active`) until the press ends.
  el.setAttribute('data-pressed', 'true')
  const release = () => el.removeAttribute('data-pressed')
  window.addEventListener('pointerup', release, { once: true })
  window.addEventListener('pointercancel', release, { once: true })
  if (event.pointerType === 'touch' || props.disabled || props.readonly)
    return
  swallowClick = true
  press = { el, anchor: false, boundary: false }
  // A second press (anchor already set) commits on release
  if (anchor.value)
    return
  dragging = true
  // Pressing an end of the committed range re-anchors on the opposite end, so dragging adjusts that end
  const range = highlightedRange.value
  if (range && !isValueInvalid.value && (isSameDay(date, range.start) || isSameDay(date, range.end))) {
    anchor.value = isSameDay(date, range.start) ? range.end : range.start
    focusedDate.value = date
    press.boundary = true
    return
  }
  // React Aria anchors on press start so the user can drag out the range
  selectDate(date)
  press.anchor = true
}
function onCellPointerUp(event: PointerEvent, date: DateValue) {
  if (event.button !== 0 || event.pointerType === 'touch')
    return
  const el = event.currentTarget as HTMLElement
  const pressedHere = press?.el === el ? press : null
  press = null
  dragging = false
  if (props.disabled || props.readonly || !isSelectableCell(el))
    return
  // Releasing on a grabbed range end without dragging starts a new selection there
  if (pressedHere?.boundary) {
    anchor.value = date
    focusedDate.value = date
  }
  // Releasing a drag, or the second press of a selection, commits
  else if (anchor.value && !pressedHere?.anchor) {
    selectDate(date)
  }
}
// `useRangeCalendar`'s `endDragging`: releasing a drag outside the cells commits the focused date
function onWindowPointerUp(event: PointerEvent) {
  setTimeout(() => {
    swallowClick = false
  })
  const wasDragging = dragging
  dragging = false
  press = null
  const root = rootEl.value
  if (!wasDragging || !anchor.value || !root?.contains(document.activeElement))
    return
  const target = event.target as Element | null
  if (target && root.contains(target) && target.closest('button, [role="button"]'))
    return
  selectDate(focusedDate.value ?? anchor.value)
}
onMounted(() => window.addEventListener('pointerup', onWindowPointerUp))
onBeforeUnmount(() => window.removeEventListener('pointerup', onWindowPointerUp))

// `highlightDate`: while anchored, hovering (or dragging over) a day moves the preview's end there, and keyboard
// focus follows when the calendar has it
function onCellMouseEnter(event: MouseEvent, date: DateValue) {
  const el = event.currentTarget as HTMLElement
  if (press && press.el !== el)
    press = null
  if (!anchor.value || !isSelectableCell(el))
    return
  focusedDate.value = date
  if (rootEl.value?.contains(document.activeElement) && document.activeElement !== el)
    pointerFocus(el)
}
// Each day reads its range state through this, so a hover re-renders only the days whose state flips
provide(rangeCalendarDayKey, {
  cellState,
  onPointerDown: onCellPointerDown,
  onPointerUp: onCellPointerUp,
  onMouseEnter: onCellMouseEnter,
  cellClass: computed(() => ui.value.cell({ class: props.ui?.cell })),
  cellButtonClass: computed(() => ui.value.cellButton({ class: props.ui?.cellButton })),
  indicatorClass: computed(() => ui.value.cellIndicator({ class: props.ui?.cellIndicator })),
  indicator: () => props.indicator,
  CellOutlet: useSlotOutlet(slots, 'cell'),
})
function onRootFocusIn(event: FocusEvent) {
  const cell = calendarCellFrom(event.target, rootEl.value)
  if (cell && !cell.hasAttribute('data-disabled') && !cell.hasAttribute('data-outside-view'))
    focusedDate.value = calendarCellDate(cell, placeholderModel.value)
}
// Clicks without a handled mouse press (keyboard-less screen readers, touch taps, scripted clicks) select directly.
// Outside-month cells are inert, as in React Aria. Runs in the capture phase so Reka's cell handler never sees it.
function onRootClickCapture(event: MouseEvent) {
  const cell = calendarCellFrom(event.target, rootEl.value)
  if (!cell)
    return
  event.stopPropagation()
  if (swallowClick) {
    swallowClick = false
    return
  }
  if (isSelectableCell(cell))
    selectDate(calendarCellDate(cell, placeholderModel.value))
}
function onRootKeyDownCapture(event: KeyboardEvent) {
  const cell = calendarCellFrom(event.target, rootEl.value)
  if (!cell)
    return
  // `useCalendarGrid`: Escape cancels an in-progress selection (and keeps propagating, e.g. to close a popover)
  if (event.key === 'Escape') {
    anchor.value = null
    return
  }
  if ((event.key !== 'Enter' && event.key !== ' ') || event.altKey || event.ctrlKey || event.metaKey)
    return
  event.preventDefault()
  event.stopPropagation()
  if (!isSelectableCell(cell))
    return
  const date = calendarCellDate(cell, placeholderModel.value)
  const wasAnchored = !!anchor.value
  selectDate(date)
  if (!wasAnchored && anchor.value)
    focusNearestAvailableDate(date)
}

const { onKeyDown: onMonthKeyDown, onHeaderClickCapture } = useCalendarMonthKeys({
  placeholder: placeholderModel,
  minValue: () => effectiveMinValue.value,
  maxValue: () => effectiveMaxValue.value,
  rootEl: () => rootEl.value,
  numberOfMonths: () => props.numberOfMonths,
})
const prevButton = ref<HTMLElement | null>(null)
const nextButton = ref<HTMLElement | null>(null)

// Reka re-centred the view on the range start whenever the value changed; keep that for values set from outside
// (e.g. typed into a DateRangePicker's fields), but not for this calendar's own picks.
watch(() => props.modelValue?.start, (start) => {
  if (!start || (lastEmitted?.start && isSameDay(start, lastEmitted.start)) || isSameDay(start, placeholderModel.value))
    return
  placeholderModel.value = start
})

// Week/day views run outside Reka, so they keep the (uncontrolled) selection here
const focusedAccessor = { get value() { return placeholderModel.value }, set value(v: DateValue) { placeholderModel.value = v } }
const durationValue = shallowRef<DateRange | undefined>(props.modelValue ?? props.defaultValue)
const currentValue = computed(() => props.modelValue !== undefined ? props.modelValue : durationValue.value)
function onDurationSelect(value: DateRange) {
  durationValue.value = value
  emit('update:modelValue', value)
}
</script>

<template>
  <CalendarDurationView
    v-if="durationView"
    kind="range"
    :ui="ui as any"
    :ui-overrides="props.ui"
    :root-class="props.class"
    :aria-label="ariaLabel"
    :duration="visibleDuration!"
    :page-behavior="pageBehavior"
    :focused="focusedAccessor"
    :value="currentValue"
    :min-value="minValue"
    :max-value="maxValue"
    :is-date-unavailable="isDateUnavailable"
    :allow-non-contiguous-ranges="allowNonContiguousRanges"
    :disabled="disabled"
    :readonly="readonly"
    :invalid="invalid"
    :locale="locale"
    :first-day-of-week="firstDayOfWeek"
    :indicator="indicator"
    :dir="dir"
    @select="onDurationSelect"
  >
    <template v-if="$slots.navIcon" #navIcon="slotProps">
      <slot name="navIcon" v-bind="slotProps" />
    </template>
    <template v-if="$slots.cell" #cell="slotProps">
      <slot name="cell" v-bind="(slotProps as any)" />
    </template>
  </CalendarDurationView>
  <RangeCalendarRoot
    v-else
    ref="rootInstance"
    v-slot="{ weekDays, grid, locale: resolvedLocale }"
    :model-value="EMPTY_RANGE"
    v-model:placeholder="placeholderModel"
    :min-value="effectiveMinValue"
    :max-value="effectiveMaxValue"
    :is-date-unavailable="wrappedIsDateUnavailable"
    :is-date-disabled="isDateDisabledByMaximumDays"
    :disabled="disabled"
    :readonly="readonly"
    :allow-non-contiguous-ranges="allowNonContiguousRanges"
    :fixed-weeks="fixedWeeks"
    :locale="locale"
    :week-starts-on="weekStartsOn"
    weekday-format="short"
    :paged-navigation="effectivePagedNavigation"
    :number-of-months="numberOfMonths"
    :aria-invalid="invalid || undefined"
    :data-invalid="invalid ? '' : undefined"
    :dir="dir"
    :calendar-label="ariaLabel"
    data-slot="range-calendar"
    :class="ui.base({ class: [props.ui?.base, props.class] })"
    @click.capture="onRootClickCapture"
    @keydown.capture="onRootKeyDownCapture"
    @keydown="onMonthKeyDown"
    @focusin="onRootFocusIn"
  >
    <template v-if="numberOfMonths <= 1">
    <header data-slot="range-calendar-header" :class="ui.header({ class: props.ui?.header })" @click.capture="onHeaderClickCapture($event, prevButton, nextButton)">
      <template v-if="yearPicker">
        <button
          type="button"
          data-slot="calendar-year-picker-trigger"
          :data-open="isYearPickerOpen ? 'true' : undefined"
          :aria-expanded="isYearPickerOpen"
          :aria-label="`${formatPanelHeading(resolvedLocale, grid[0]?.value ?? placeholderModel)}, year selector`"
          :class="ui.yearPickerTrigger({ class: props.ui?.yearPickerTrigger })"
          @click="isYearPickerOpen = !isYearPickerOpen"
        >
          <RangeCalendarHeading as-child>
            <span data-slot="calendar-year-picker-trigger-heading" :class="ui.yearPickerTriggerHeading({ class: props.ui?.yearPickerTriggerHeading })">{{ formatPanelHeading(resolvedLocale, grid[0]?.value ?? placeholderModel) }}</span>
          </RangeCalendarHeading>
          <span data-slot="calendar-year-picker-trigger-indicator" aria-hidden="true" :class="ui.yearPickerTriggerIndicator({ class: props.ui?.yearPickerTriggerIndicator })">
            <svg height="1em" width="1em" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M5.47 2.97a.75.75 0 0 1 1.06 0l4.5 4.5a.75.75 0 0 1 0 1.06l-4.5 4.5a.75.75 0 1 1-1.06-1.06L9.44 8 5.47 4.03a.75.75 0 0 1 0-1.06Z" fill="currentColor" />
            </svg>
          </span>
        </button>
      </template>
      <RangeCalendarHeading v-else data-slot="range-calendar-heading" :class="ui.heading({ class: props.ui?.heading })">{{ formatPanelHeading(resolvedLocale, grid[0]?.value ?? placeholderModel) }}</RangeCalendarHeading>
      <RangeCalendarPrev data-slot="range-calendar-nav-button" as-child>
        <button ref="prevButton" type="button" aria-label="Previous" :class="ui.navButton({ class: props.ui?.navButton })">
          <slot name="navIcon" direction="previous">
            <svg data-slot="range-calendar-nav-button-icon" height="16" width="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" :class="ui.navButtonIcon({ class: props.ui?.navButtonIcon })">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M10.53 2.97a.75.75 0 0 1 0 1.06L6.56 8l3.97 3.97a.75.75 0 1 1-1.06 1.06l-4.5-4.5a.75.75 0 0 1 0-1.06l4.5-4.5a.75.75 0 0 1 1.06 0" fill="currentColor" />
            </svg>
          </slot>
        </button>
      </RangeCalendarPrev>
      <RangeCalendarNext data-slot="range-calendar-nav-button" as-child>
        <button ref="nextButton" type="button" aria-label="Next" :class="ui.navButton({ class: props.ui?.navButton })">
          <slot name="navIcon" direction="next">
            <svg data-slot="range-calendar-nav-button-icon" height="16" width="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" :class="ui.navButtonIcon({ class: props.ui?.navButtonIcon })">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M5.47 2.97a.75.75 0 0 1 1.06 0l4.5 4.5a.75.75 0 0 1 0 1.06l-4.5 4.5a.75.75 0 1 1-1.06-1.06L9.44 8 5.47 4.03a.75.75 0 0 1 0-1.06Z" fill="currentColor" />
            </svg>
          </slot>
        </button>
      </RangeCalendarNext>
    </header>
    <RangeCalendarGrid data-slot="range-calendar-grid" :class="ui.grid({ class: props.ui?.grid })">
      <RangeCalendarGridHead data-slot="range-calendar-grid-header" :class="ui.gridHeader({ class: props.ui?.gridHeader })">
        <RangeCalendarGridRow :class="ui.gridRow({ class: props.ui?.gridRow })">
          <CalendarHeadCell v-for="(day, i) in weekDays" :key="`weekday-${i}`" data-slot="range-calendar-header-cell" :class="ui.headerCell({ class: props.ui?.headerCell })">
            {{ day }}
          </CalendarHeadCell>
        </RangeCalendarGridRow>
      </RangeCalendarGridHead>
      <RangeCalendarGridBody data-slot="range-calendar-grid-body" :class="ui.gridBody({ class: props.ui?.gridBody })">
        <RangeCalendarGridRow v-for="(weekDates, index) in grid[0]?.rows ?? []" :key="`week-${index}`" :class="ui.gridRow({ class: props.ui?.gridRow })">
          <RangeCalendarDay v-for="weekDate in weekDates" :key="weekDate.toString()" :date="weekDate" :month="grid[0]?.value ?? weekDate" />
        </RangeCalendarGridRow>
      </RangeCalendarGridBody>
    </RangeCalendarGrid>
    </template>
    <template v-else>
      <div data-slot="calendar-panels" :class="ui.panels({ class: props.ui?.panels })">
        <div v-for="(month, panelIndex) in grid" :key="panelIndex" data-slot="calendar-panel" :class="ui.panel({ class: props.ui?.panel })">
          <header data-slot="range-calendar-header" :class="ui.header({ class: props.ui?.header })">
            <RangeCalendarPrev v-if="panelIndex === 0" data-slot="range-calendar-nav-button" as-child>
              <button type="button" aria-label="Previous" :class="ui.navButton({ class: props.ui?.navButton })">
                <slot name="navIcon" direction="previous">
                  <svg data-slot="range-calendar-nav-button-icon" height="16" width="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" :class="ui.navButtonIcon({ class: props.ui?.navButtonIcon })">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M10.53 2.97a.75.75 0 0 1 0 1.06L6.56 8l3.97 3.97a.75.75 0 1 1-1.06 1.06l-4.5-4.5a.75.75 0 0 1 0-1.06l4.5-4.5a.75.75 0 0 1 1.06 0" fill="currentColor" />
                  </svg>
                </slot>
              </button>
            </RangeCalendarPrev>
            <div v-else aria-hidden="true" class="size-6" />
            <span data-slot="range-calendar-heading" :class="ui.heading({ class: props.ui?.heading })">{{ formatPanelHeading(resolvedLocale, month.value) }}</span>
            <RangeCalendarNext v-if="panelIndex === grid.length - 1" data-slot="range-calendar-nav-button" as-child>
              <button type="button" aria-label="Next" :class="ui.navButton({ class: props.ui?.navButton })">
                <slot name="navIcon" direction="next">
                  <svg data-slot="range-calendar-nav-button-icon" height="16" width="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" :class="ui.navButtonIcon({ class: props.ui?.navButtonIcon })">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M5.47 2.97a.75.75 0 0 1 1.06 0l4.5 4.5a.75.75 0 0 1 0 1.06l-4.5 4.5a.75.75 0 1 1-1.06-1.06L9.44 8 5.47 4.03a.75.75 0 0 1 0-1.06Z" fill="currentColor" />
                  </svg>
                </slot>
              </button>
            </RangeCalendarNext>
            <div v-else aria-hidden="true" class="size-6" />
          </header>
          <RangeCalendarGrid data-slot="range-calendar-grid" :class="ui.grid({ class: props.ui?.grid })">
            <RangeCalendarGridHead data-slot="range-calendar-grid-header" :class="ui.gridHeader({ class: props.ui?.gridHeader })">
              <RangeCalendarGridRow :class="ui.gridRow({ class: props.ui?.gridRow })">
                <CalendarHeadCell v-for="(day, i) in weekDays" :key="`weekday-${i}`" data-slot="range-calendar-header-cell" :class="ui.headerCell({ class: props.ui?.headerCell })">
                  {{ day }}
                </CalendarHeadCell>
              </RangeCalendarGridRow>
            </RangeCalendarGridHead>
            <RangeCalendarGridBody data-slot="range-calendar-grid-body" :class="ui.gridBody({ class: props.ui?.gridBody })">
              <RangeCalendarGridRow v-for="(weekDates, index) in month.rows" :key="`week-${index}`" :class="ui.gridRow({ class: props.ui?.gridRow })">
                <RangeCalendarDay v-for="weekDate in weekDates" :key="weekDate.toString()" :date="weekDate" :month="month.value" />
              </RangeCalendarGridRow>
            </RangeCalendarGridBody>
          </RangeCalendarGrid>
        </div>
      </div>
    </template>
    <div
      v-if="yearPicker"
      ref="yearPickerGridRef"
      data-slot="calendar-year-picker-grid"
      role="listbox"
      tabindex="-1"
      :aria-hidden="!isYearPickerOpen"
      :data-open="isYearPickerOpen ? 'true' : undefined"
      :class="ui.yearPickerGrid({ class: props.ui?.yearPickerGrid })"
      @keydown="onYearPickerKeyDown"
    >
      <button
        v-for="year in yearPickerYears"
        :key="year"
        type="button"
        data-slot="calendar-year-picker-year-cell"
        :data-year="year"
        :data-selected="year === focusedYear ? true : undefined"
        :aria-selected="year === focusedYear"
        :tabindex="isYearPickerOpen && year === yearPickerActiveYear ? 0 : -1"
        :class="ui.yearPickerYearCell({ class: props.ui?.yearPickerYearCell })"
        @click="selectYearPickerYear(year)"
        @focus="yearPickerActiveYear = year"
      >
        {{ year }}
      </button>
    </div>
  </RangeCalendarRoot>
</template>
