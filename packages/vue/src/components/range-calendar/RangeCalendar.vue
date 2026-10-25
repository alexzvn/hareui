<template>
  <CalendarMonthShell
    ref="shell"
    kind="range"
    :ui="ui"
    :ui-overrides="props.ui"
    :root="shellRoot"
    :aria-label="ariaLabel"
    :placeholder="placeholder"
    :default-placeholder="placeholderSeed"
    :min-value="minValue"
    :max-value="maxValue"
    :month-bounds="monthBounds"
    :selection="shellSelection"
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

<script setup lang="ts">
import { isSameDay, isSameMonth } from '@internationalized/date'
import type { DateValue } from '@internationalized/date'
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

import { defaultMaxValue, defaultMinValue } from '@/components/calendar/calendarBounds'
import {
  calendarCellDate,
  calendarCellFrom,
  compareDay,
  focusCalendarCell,
} from '@/components/calendar/calendarCells'
import type { CalendarMonthShellExposed } from '@/components/calendar/CalendarMonthShell.types'
import CalendarMonthShell from '@/components/calendar/CalendarMonthShell.vue'
import {
  exceedsMaximumDays,
  isDaySelectedInRange,
  makeRange,
  useRangeSelection,
} from '@/components/calendar/useRangeSelection'
import { useComponentUI } from '@/composables/useComponentUI'
import { useSlotOutlet } from '@/composables/useSlotOutlet'

import { rangeCalendarDayKey } from './context'
import type {
  DateRange,
  RangeCalendarCellSlotProps,
  RangeCalendarEmits,
  RangeCalendarProps,
  RangeCalendarSlots,
} from './RangeCalendar.types'
import RangeCalendarDay from './RangeCalendarDay.vue'
import theme from './theme'

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

const ui = useComponentUI('rangeCalendar', {
  theme,
  variantProps: () => ({ view: viewKind.value }),
})

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
  return exceedsMaximumDays(date, { anchor: anchor.value, maximumDays: props.maximumDays })
}

const highlightedRange = computed(() => {
  if (anchor.value) return makeRange(anchor.value, focusedDate.value ?? anchor.value)

  const value = committed.value

  return value?.start && value.end ? makeRange(value.start, value.end) : null
})

const isUnavailableDate = (date: DateValue) => !!wrappedIsDateUnavailable.value?.(date)

const isOutOfBounds = (date: DateValue) =>
  compareDay(date, minValue.value) < 0 || compareDay(date, maxValue.value) > 0

// react-stately's `isInvalidSelection` (+ the `invalid` prop): a committed range whose ends are unavailable or out of
// bounds. Its cells are flagged `data-invalid` and stay selected even where unavailable.
const isValueInvalid = computed(() => {
  if (props.invalid) return true

  const value = committed.value
  if (anchor.value || !value?.start || !value.end) return false

  return (
    isUnavailableDate(value.start) ||
    isUnavailableDate(value.end) ||
    isOutOfBounds(value.start) ||
    isOutOfBounds(value.end)
  )
})

// `useCalendarCell`: outside-month and disabled days are never selected, unavailable ones only inside an invalid range
const cellState = (date: DateValue, month: DateValue) => {
  const range = highlightedRange.value
  const isInRange =
    !!range && compareDay(date, range.start) >= 0 && compareDay(date, range.end) <= 0

  const disabled = !isSameMonth(date, month) || selection.isOutsideWindow(date)
  const invalid = isInRange && !disabled && isValueInvalid.value

  const selected = isDaySelectedInRange({
    inRange: isInRange,
    disabled,
    unavailable: isUnavailableDate(date),
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

const isOutsideEffectiveBounds = (date: DateValue) =>
  compareDay(date, effectiveMinValue.value) < 0 || compareDay(date, effectiveMaxValue.value) > 0

// `focusNearestAvailableDate`: anchoring with the keyboard advances focus one day (back one at the end of the
// available run) so the preview shows a range immediately.
const focusNearestAvailableDate = (from: DateValue) => {
  let next = from.add({ days: 1 })
  if (isOutsideEffectiveBounds(next)) next = from.subtract({ days: 1 })
  if (isOutsideEffectiveBounds(next)) return

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
let isDragging = false

// A mouse press is handled on pointerdown/pointerup, so the click that follows it is swallowed
let shouldSwallowClick = false

// Chrome drops `:active` once Reka re-renders the pressed cell, so mirror RAC's `data-pressed` (which HeroUI's
// CSS styles alongside `:active`) until the press ends.
const markPressed = (el: HTMLElement) => {
  el.setAttribute('data-pressed', 'true')

  const release = () => el.removeAttribute('data-pressed')
  window.addEventListener('pointerup', release, { once: true })
  window.addEventListener('pointercancel', release, { once: true })
}

const onCellPointerDown = (event: PointerEvent, date: DateValue) => {
  if (event.button !== 0) return

  const el = event.currentTarget as HTMLElement
  if (!isSelectableCell(el)) return

  event.preventDefault()
  pointerFocus(el)
  markPressed(el)
  if (event.pointerType === 'touch' || props.disabled || props.readonly) return

  shouldSwallowClick = true
  press = { el, anchor: false, boundary: false }

  // A second press (anchor already set) commits on release
  if (anchor.value) return

  isDragging = true

  // Pressing an end of the committed range re-anchors on the opposite end, so dragging adjusts that end
  const range = highlightedRange.value
  const isRangeEnd = !!range && (isSameDay(date, range.start) || isSameDay(date, range.end))
  if (range && !isValueInvalid.value && isRangeEnd) {
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
  isDragging = false
  if (props.disabled || props.readonly || !isSelectableCell(el)) return

  // Releasing on a grabbed range end without dragging starts a new selection there
  if (pressedHere?.boundary) {
    anchor.value = date
    focusedDate.value = date

    return
  }

  // Releasing a drag, or the second press of a selection, commits
  if (anchor.value && !pressedHere?.anchor) selectDate(date)
}

// `useRangeCalendar`'s `endDragging`: releasing a drag outside the cells commits the focused date
const onWindowPointerUp = (event: PointerEvent) => {
  setTimeout(() => {
    shouldSwallowClick = false
  })

  const hasDragged = isDragging
  isDragging = false
  press = null

  const root = rootEl()
  if (!hasDragged || !anchor.value || !root?.contains(document.activeElement)) return

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

  const hasCalendarFocus = rootEl()?.contains(document.activeElement)
  if (hasCalendarFocus && document.activeElement !== el) pointerFocus(el)
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
  if (!cell || cell.hasAttribute('data-disabled') || cell.hasAttribute('data-outside-view')) return

  focusedDate.value = calendarCellDate(cell, monthShell.value!.placeholder)
}

// Clicks without a handled mouse press (keyboard-less screen readers, touch taps, scripted clicks) select directly.
// Outside-month cells are inert, as in React Aria. Runs in the capture phase so Reka's cell handler never sees it.
const onRootClickCapture = (event: MouseEvent) => {
  const cell = calendarCellFrom(event.target, rootEl())
  if (!cell) return

  event.stopPropagation()

  if (shouldSwallowClick) {
    shouldSwallowClick = false
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

  const isPressKey = event.key === 'Enter' || event.key === ' '
  const hasModifier = event.altKey || event.ctrlKey || event.metaKey
  if (!isPressKey || hasModifier) return

  event.preventDefault()
  event.stopPropagation()
  if (!isSelectableCell(cell)) return

  const date = calendarCellDate(cell, monthShell.value!.placeholder)
  const isFirstPick = !anchor.value
  selectDate(date)
  if (isFirstPick && anchor.value) focusNearestAvailableDate(date)
}

// Reka re-centred the view on the range start whenever the value changed; keep that for values set from outside
// (e.g. typed into a DateRangePicker's fields), but not for this calendar's own picks.
watch(
  () => props.modelValue?.start,
  (start) => {
    const shell = monthShell.value
    if (!start || !shell) return

    const isOwnPick = !!lastEmitted?.start && isSameDay(start, lastEmitted.start)
    if (isOwnPick || isSameDay(start, shell.placeholder)) return

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

const shellRoot = computed(() => ({ class: props.class, bindings: rootBindings.value }))

// The week/day view selects with the configured matcher; the month view's anchor-bound one is in `rootBindings`
const shellSelection = computed(() => ({
  value: props.modelValue,
  defaultValue: props.defaultValue,
  isDateUnavailable: props.isDateUnavailable,
  allowNonContiguousRanges: props.allowNonContiguousRanges,
}))
</script>
