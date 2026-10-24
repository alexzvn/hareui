<template>
  <CalendarMonthShell
    ref="shell"
    kind="range"
    :ui="ui"
    :ui-overrides="props.ui"
    :root-class="props.class"
    :aria-label="ariaLabel"
    :placeholder="placeholder"
    :default-placeholder="placeholderSeed"
    :min-value="minValue"
    :max-value="maxValue"
    :month-bounds="monthBounds"
    :selection="shellSelection"
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
      <slot name="cell" v-bind="slotProps as RangeCalendarCellSlotProps" />
    </template>
    <template #monthCell="{ date, month }">
      <RangeCalendarDay :date="date" :month="month" />
    </template>
  </CalendarMonthShell>
</template>

<script lang="ts">
import type { DateValue } from '@internationalized/date'
import type { VNode } from 'vue'

import type { PageBehavior, VisibleDuration } from '@/components/calendar/useCalendarDurationView'
import type { ComponentSlots } from '@/types/tv'
import type { ClassValue } from '@/utils/tv'

import theme from './theme'

type RangeCalendar = typeof theme

export type DateRange = {
  start: DateValue | undefined
  end: DateValue | undefined
}

export type RangeCalendarProps = {
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
  class?: ClassValue
  /** Per-slot class overrides. */
  ui?: ComponentSlots<RangeCalendar>
}

export type RangeCalendarSlots = {
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
    selectionStart: boolean
    selectionEnd: boolean
  }) => VNode[]
}

export type RangeCalendarEmits = {
  /** Emitted when the selected date range changes. */
  'update:modelValue': [value: DateRange | undefined]
  /** Emitted when the displayed month/year changes. */
  'update:placeholder': [value: DateValue]
}

type RangeCalendarCellSlotProps = Parameters<NonNullable<RangeCalendarSlots['cell']>>[0]
</script>

<script setup lang="ts">
import { isSameDay, isSameMonth } from '@internationalized/date'
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  provide,
  shallowRef,
  useTemplateRef,
  watch,
} from 'vue'

import {
  calendarCellDate,
  calendarCellFrom,
  compareDay,
  focusCalendarCell,
} from '@/components/calendar/calendarCells'
import type { CalendarMonthShellExposed } from '@/components/calendar/CalendarMonthShell.vue'
import CalendarMonthShell from '@/components/calendar/CalendarMonthShell.vue'
import { defaultMaxValue, defaultMinValue } from '@/components/calendar/useCalendarBounds'
import {
  exceedsMaximumDays,
  isDaySelectedInRange,
  makeRange,
  useRangeSelection,
} from '@/components/calendar/useRangeSelection'
import { useComponentUI } from '@/composables/useComponentUI'
import { useSlotOutlet } from '@/composables/useSlotOutlet'

import RangeCalendarDay, { rangeCalendarDayKey } from './RangeCalendarDay.vue'

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

const emit = defineEmits<RangeCalendarEmits>()
const slots = defineSlots<RangeCalendarSlots>()

const viewKind = computed(() => {
  if (props.visibleDuration?.days != null) return 'day' as const
  return props.visibleDuration?.weeks != null ? ('week' as const) : ('month' as const)
})

const ui = useComponentUI('rangeCalendar', theme, () => ({ view: viewKind.value }))

const monthShell = useTemplateRef<CalendarMonthShellExposed>('shell')
const rootEl = () => monthShell.value?.rootEl
const minValue = computed(() => props.minValue ?? defaultMinValue())
const maxValue = computed(() => props.maxValue ?? defaultMaxValue())

const placeholderSeed =
  props.defaultPlaceholder ?? (props.modelValue ?? props.defaultValue)?.start ?? undefined

// The month view runs React Aria's range state machine (`useRangeCalendarState` + `useCalendarCell`) here and uses
// Reka only for the grid, focus movement and paging. Reka's own selection is never fed (its model stays empty) and its
// cell click/Enter/Space handlers are pre-empted in the capture phase: Reka has no live range preview with the
// selected styling, no press-drag selection, re-anchors its placeholder on every start change and marks unavailable
// days inside a non-contiguous range as selected. The cell attributes (`data-selected`/`data-selection-start`/
// `data-selection-end`) are bound from this state and override Reka's.
const EMPTY_RANGE: DateRange = { start: undefined, end: undefined }
const internalValue = shallowRef<DateRange | undefined>(props.defaultValue)
const committed = computed(() =>
  props.modelValue !== undefined ? props.modelValue : internalValue.value,
)

// react-stately's `focusedDate` (keyboard focus, or the hovered day while anchored): the preview's moving end
const focusedDate = shallowRef<DateValue | null>(null)
let lastEmitted: DateRange | undefined

// React Aria's `isDateUnavailable(date, anchorDate)` lets the matcher depend on the in-progress range's start date
// (see HeroUI's anchor-unavailable-dates demo). Reka's `Matcher` type is single-argument only (reka-limitation), so
// the core's anchor-bound 1-arg matcher is what Reka gets.
// react-stately's `selectDate`: the first pick anchors, the second commits the ordered range. The anchor is also
// emitted as a half-open range (`end: undefined`), as Reka did, so v-model consumers see the selection start.
const selection = useRangeSelection({
  isDateUnavailable: () => props.isDateUnavailable,
  allowNonContiguousRanges: () => props.allowNonContiguousRanges,
  minValue: () => minValue.value,
  maxValue: () => maxValue.value,
  span: () => ({ months: Math.max(1, props.numberOfMonths) }),
  maximumDays: () => props.maximumDays,
  onAnchor: (date) => {
    focusedDate.value = date
    emitValue({ start: date, end: undefined })
  },
  onCommit: (range) => {
    internalValue.value = range
    emitValue(range)
  },
})

const {
  anchor,
  isUnavailable: wrappedIsDateUnavailable,
  effectiveMin: effectiveMinValue,
  effectiveMax: effectiveMaxValue,
} = selection

// Reka only applies `maximumDays` to its own start value, which isn't fed, so it is passed back in as
// `is-date-disabled`.
const isDateDisabledByMaximumDays = (date: DateValue) => {
  return exceedsMaximumDays(date, anchor.value, props.maximumDays)
}

const highlightedRange = computed(() => {
  if (anchor.value) return makeRange(anchor.value, focusedDate.value ?? anchor.value)
  const value = committed.value

  return value?.start && value.end ? makeRange(value.start, value.end) : null
})

// react-stately's `isInvalidSelection` (+ the `invalid` prop): a committed range whose ends are unavailable or out of
// bounds. Its cells are flagged `data-invalid` and stay selected even where unavailable.
const isValueInvalid = computed(() => {
  if (props.invalid) return true
  const value = committed.value
  if (anchor.value || !value?.start || !value.end) return false

  const outOfBounds = (date: DateValue) =>
    compareDay(date, minValue.value) < 0 || compareDay(date, maxValue.value) > 0

  return (
    !!wrappedIsDateUnavailable.value?.(value.start) ||
    !!wrappedIsDateUnavailable.value?.(value.end) ||
    outOfBounds(value.start) ||
    outOfBounds(value.end)
  )
})

// `useCalendarCell`: outside-month and disabled days are never selected, unavailable ones only inside an invalid range
const cellState = (date: DateValue, month: DateValue) => {
  const range = highlightedRange.value
  const inRange = !!range && compareDay(date, range.start) >= 0 && compareDay(date, range.end) <= 0
  const disabled = !isSameMonth(date, month) || selection.isOutsideWindow(date)
  const invalid = inRange && !disabled && isValueInvalid.value
  const selected = isDaySelectedInRange({
    inRange,
    disabled,
    unavailable: !!wrappedIsDateUnavailable.value?.(date),
    invalid,
  })

  return {
    selected,
    selectionStart: !!range && isSameDay(date, range.start),
    selectionEnd: !!range && isSameDay(date, range.end),
    invalid,
  }
}

const emitValue = (value: DateRange) => {
  lastEmitted = value
  emit('update:modelValue', value)
}

const selectDate = (date: DateValue) => {
  if (props.readonly || props.disabled) return
  selection.select(date)
}

// A cell React Aria would let you press: not outside the month, disabled or unavailable
const isSelectableCell = (el: HTMLElement) => {
  return (
    !el.hasAttribute('data-disabled') &&
    !el.hasAttribute('data-unavailable') &&
    !el.hasAttribute('data-outside-view')
  )
}

// `focusNearestAvailableDate`: anchoring with the keyboard advances focus one day (back one at the end of the
// available run) so the preview shows a range immediately.
const focusNearestAvailableDate = (from: DateValue) => {
  const outside = (date: DateValue) =>
    compareDay(date, effectiveMinValue.value) < 0 || compareDay(date, effectiveMaxValue.value) > 0

  let next = from.add({ days: 1 })
  if (outside(next)) next = from.subtract({ days: 1 })
  if (outside(next)) return
  focusedDate.value = next
  monthShell.value!.placeholder = next
  nextTick(() => focusCalendarCell(rootEl(), next))
}

// RAC's `usePress` focuses the pressed cell from script and flags pointer focus with `data-focused` (no
// `data-focus-visible`), which keeps HeroUI's focus ring off. Reka's `data-focused` means "focused date" instead, so
// pointer focus is flagged with `data-pointer-focus` until blur.
const pointerFocus = (el: HTMLElement) => {
  el.setAttribute('data-pointer-focus', '')
  el.addEventListener('blur', () => el.removeAttribute('data-pointer-focus'), { once: true })
  el.focus()
}

// The current mouse press (`useCalendarCell`'s per-cell refs): `anchor` when the press started the selection,
// `boundary` when it grabbed an end of the committed range. Leaving the pressed cell cancels it, as RAC's
// `shouldCancelOnPointerExit` does while anchored.
let press: { el: HTMLElement; anchor: boolean; boundary: boolean } | null = null
let dragging = false

// A mouse press is handled on pointerdown/pointerup, so the click that follows it is swallowed
let swallowClick = false

const onCellPointerDown = (event: PointerEvent, date: DateValue) => {
  if (event.button !== 0) return
  const el = event.currentTarget as HTMLElement
  if (!isSelectableCell(el)) return
  event.preventDefault()
  pointerFocus(el)

  // Chrome drops `:active` once Reka re-renders the pressed cell, so mirror RAC's `data-pressed` (which HeroUI's
  // CSS styles alongside `:active`) until the press ends.
  el.setAttribute('data-pressed', 'true')
  const release = () => el.removeAttribute('data-pressed')
  window.addEventListener('pointerup', release, { once: true })
  window.addEventListener('pointercancel', release, { once: true })
  if (event.pointerType === 'touch' || props.disabled || props.readonly) return
  swallowClick = true
  press = { el, anchor: false, boundary: false }

  // A second press (anchor already set) commits on release
  if (anchor.value) return
  dragging = true

  // Pressing an end of the committed range re-anchors on the opposite end, so dragging adjusts that end
  const range = highlightedRange.value
  if (
    range &&
    !isValueInvalid.value &&
    (isSameDay(date, range.start) || isSameDay(date, range.end))
  ) {
    anchor.value = isSameDay(date, range.start) ? range.end : range.start
    focusedDate.value = date
    press.boundary = true

    return
  }

  // React Aria anchors on press start so the user can drag out the range
  selectDate(date)
  press.anchor = true
}

const onCellPointerUp = (event: PointerEvent, date: DateValue) => {
  if (event.button !== 0 || event.pointerType === 'touch') return
  const el = event.currentTarget as HTMLElement
  const pressedHere = press?.el === el ? press : null
  press = null
  dragging = false
  if (props.disabled || props.readonly || !isSelectableCell(el)) return

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
const onWindowPointerUp = (event: PointerEvent) => {
  setTimeout(() => {
    swallowClick = false
  })

  const wasDragging = dragging
  dragging = false
  press = null
  const root = rootEl()
  if (!wasDragging || !anchor.value || !root?.contains(document.activeElement)) return
  const target = event.target as Element | null
  if (target && root.contains(target) && target.closest('button, [role="button"]')) return
  selectDate(focusedDate.value ?? anchor.value)
}

onMounted(() => window.addEventListener('pointerup', onWindowPointerUp))
onBeforeUnmount(() => window.removeEventListener('pointerup', onWindowPointerUp))

// `highlightDate`: while anchored, hovering (or dragging over) a day moves the preview's end there, and keyboard
// focus follows when the calendar has it
const onCellMouseEnter = (event: MouseEvent, date: DateValue) => {
  const el = event.currentTarget as HTMLElement
  if (press && press.el !== el) press = null
  if (!anchor.value || !isSelectableCell(el)) return
  focusedDate.value = date
  if (rootEl()?.contains(document.activeElement) && document.activeElement !== el) pointerFocus(el)
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

const onRootFocusIn = (event: FocusEvent) => {
  const cell = calendarCellFrom(event.target, rootEl())
  if (cell && !cell.hasAttribute('data-disabled') && !cell.hasAttribute('data-outside-view'))
    focusedDate.value = calendarCellDate(cell, monthShell.value!.placeholder)
}

// Clicks without a handled mouse press (keyboard-less screen readers, touch taps, scripted clicks) select directly.
// Outside-month cells are inert, as in React Aria. Runs in the capture phase so Reka's cell handler never sees it.
const onRootClickCapture = (event: MouseEvent) => {
  const cell = calendarCellFrom(event.target, rootEl())
  if (!cell) return
  event.stopPropagation()

  if (swallowClick) {
    swallowClick = false
    return
  }

  if (isSelectableCell(cell)) selectDate(calendarCellDate(cell, monthShell.value!.placeholder))
}

const onRootKeyDownCapture = (event: KeyboardEvent) => {
  const cell = calendarCellFrom(event.target, rootEl())
  if (!cell) return

  // `useCalendarGrid`: Escape cancels an in-progress selection (and keeps propagating, e.g. to close a popover)
  if (event.key === 'Escape') {
    selection.cancel()
    return
  }

  if (
    (event.key !== 'Enter' && event.key !== ' ') ||
    event.altKey ||
    event.ctrlKey ||
    event.metaKey
  )
    return

  event.preventDefault()
  event.stopPropagation()
  if (!isSelectableCell(cell)) return
  const date = calendarCellDate(cell, monthShell.value!.placeholder)
  const wasAnchored = !!anchor.value
  selectDate(date)
  if (!wasAnchored && anchor.value) focusNearestAvailableDate(date)
}

// Reka re-centred the view on the range start whenever the value changed; keep that for values set from outside
// (e.g. typed into a DateRangePicker's fields), but not for this calendar's own picks.
watch(
  () => props.modelValue?.start,
  (start) => {
    const shell = monthShell.value
    if (
      !start ||
      !shell ||
      (lastEmitted?.start && isSameDay(start, lastEmitted.start)) ||
      isSameDay(start, shell.placeholder)
    )
      return

    shell.placeholder = start
  },
)

const monthBounds = computed(() => ({
  minValue: effectiveMinValue.value,
  maxValue: effectiveMaxValue.value,
}))

const rootBindings = computed(() => ({
  modelValue: EMPTY_RANGE,
  isDateUnavailable: wrappedIsDateUnavailable.value,
  isDateDisabled: isDateDisabledByMaximumDays,
  allowNonContiguousRanges: props.allowNonContiguousRanges,
  onClickCapture: onRootClickCapture,
  onKeydownCapture: onRootKeyDownCapture,
  onFocusin: onRootFocusIn,
}))

// The week/day view selects with the configured matcher; the month view's anchor-bound one is in `rootBindings`
const shellSelection = computed(() => ({
  value: props.modelValue,
  defaultValue: props.defaultValue,
  isDateUnavailable: props.isDateUnavailable,
  allowNonContiguousRanges: props.allowNonContiguousRanges,
}))
</script>
