<script lang="ts">
import type { CalendarDate, DateValue } from '@internationalized/date'
import type { PageBehavior, VisibleDuration } from '../composables/useCalendarDurationView'

/**
 * Internal: the `visibleDuration={{ weeks }}` / `{{ days }}` grid shared by `Calendar` and `RangeCalendar`
 * (decision #11). Reka's calendar roots always build full month grids, so these views use their own state
 * (`useCalendarDurationView`, a port of react-stately's `useCalendarState`) and mirror the month view's DOM,
 * `data-slot`s and Reka-style data attributes so the same theme applies.
 */
export interface CalendarDurationViewProps {
  kind: 'calendar' | 'range'
  /** Resolved slot class functions of the parent's theme (already resolved for the `view` variant). */
  ui: Record<string, (opts?: { class?: any }) => string>
  /** The parent's `:ui` overrides. */
  uiOverrides?: Record<string, any>
  rootClass?: any
  ariaLabel?: string
  duration: VisibleDuration
  pageBehavior: PageBehavior
  focused: { value: DateValue }
  /** Single: a date; multiple: an array; range: `{ start, end }`. */
  value: any
  selectionMode?: 'single' | 'multiple'
  minValue: DateValue
  maxValue: DateValue
  isDateUnavailable?: (date: DateValue, anchorDate: DateValue | null) => boolean
  allowNonContiguousRanges?: boolean
  disabled: boolean
  readonly: boolean
  invalid: boolean
  locale?: string
  firstDayOfWeek?: 'sun' | 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat'
  indicator?: (date: DateValue) => boolean
  dir?: 'ltr' | 'rtl'
}
</script>

<script setup lang="ts">
import { GregorianCalendar, isSameDay, maxDate, minDate, toCalendar, toCalendarDate } from '@internationalized/date'
import { useDirection, useLocale } from 'reka-ui'
import { computed, shallowRef, toRef } from 'vue'
import { useCalendarDurationView } from '../composables/useCalendarDurationView'

const props = defineProps<CalendarDurationViewProps>()
const emit = defineEmits<{ select: [value: any] }>()
defineSlots<{
  navIcon?: (props: { direction: 'previous' | 'next' }) => any
  cell?: (props: Record<string, any>) => any
}>()

const locale = useLocale(toRef(() => props.locale))
const direction = useDirection(toRef(() => props.dir))
const p = computed(() => props.kind === 'range' ? 'range-calendar' : 'calendar')
const cls = (slot: string) => props.ui[slot]?.({ class: props.uiOverrides?.[slot] })

// ---- Range selection state (react-stately `useRangeCalendarState`) ----
const anchor = shallowRef<CalendarDate | null>(null)
const range = computed<{ start: DateValue, end: DateValue } | null>(() => props.kind === 'range' && props.value?.start && props.value?.end ? props.value : null)
const unavailable = (date: DateValue) => props.isDateUnavailable?.(date, anchor.value) ?? false
function nextUnavailable(from: CalendarDate, dir: 1 | -1): CalendarDate | undefined {
  const span = view.endDate.value.compare(view.startDate.value) + 1
  let next = from.add({ days: dir })
  const limit = dir < 0 ? from.subtract({ days: span }) : from.add({ days: span })
  while ((dir < 0 ? next.compare(limit) >= 0 : next.compare(limit) <= 0) && !unavailable(next))
    next = next.add({ days: dir })
  return unavailable(next) ? next.add({ days: -dir }) : undefined
}
const availableRange = computed(() => {
  if (props.kind !== 'range' || !anchor.value || !props.isDateUnavailable || props.allowNonContiguousRanges)
    return null
  return { start: nextUnavailable(anchor.value, -1), end: nextUnavailable(anchor.value, 1) }
})
const effectiveMin = computed(() => (availableRange.value?.start ? maxDate(props.minValue, availableRange.value.start) : null) ?? props.minValue)
const effectiveMax = computed(() => (availableRange.value?.end ? minDate(props.maxValue, availableRange.value.end) : null) ?? props.maxValue)

// react-stately aligns a range that doesn't fit the centered window to its start
const alignment = () => {
  if (!range.value)
    return 'center' as const
  return range.value.end.compare(range.value.start) >= (props.duration.days ?? (props.duration.weeks ?? 1) * 7) / 2 ? 'start' as const : 'center' as const
}

const view = useCalendarDurationView({
  duration: () => props.duration,
  locale: () => locale.value,
  firstDayOfWeek: () => props.firstDayOfWeek,
  minValue: () => effectiveMin.value,
  maxValue: () => effectiveMax.value,
  pageBehavior: () => props.pageBehavior,
  disabled: () => props.disabled,
  focused: props.focused,
  alignment,
})

function makeRange(a: CalendarDate, b: CalendarDate) {
  return b.compare(a) < 0 ? { start: b, end: a } : { start: a, end: b }
}
const highlighted = computed(() => {
  if (props.kind !== 'range')
    return null
  if (anchor.value)
    return makeRange(anchor.value, view.focusedDate.value)
  return range.value ? makeRange(view.toDisplay(range.value.start), view.toDisplay(range.value.end)) : null
})

function isSelected(date: CalendarDate) {
  if (props.kind === 'range')
    return !!highlighted.value && date.compare(highlighted.value.start) >= 0 && date.compare(highlighted.value.end) <= 0
  if (Array.isArray(props.value))
    return props.value.some((v: DateValue) => isSameDay(v, date))
  return !!props.value && isSameDay(props.value, date)
}

// The emitted value keeps the original value's calendar system (Gregorian by default) and time of day
function convert(date: CalendarDate, old: DateValue | undefined): DateValue {
  const converted = toCalendar(date, old?.calendar ?? new GregorianCalendar())
  return old && 'hour' in old ? (old as any).set(converted) : converted
}
function select(date: CalendarDate) {
  if (props.disabled || props.readonly || view.isCellDisabled(date) || unavailable(date))
    return
  view.focusedDate.value = date
  if (props.kind === 'range') {
    if (!anchor.value) {
      anchor.value = date
      return
    }
    const r = makeRange(anchor.value, date)
    anchor.value = null
    emit('select', { start: convert(r.start, range.value?.start), end: convert(r.end, range.value?.end) })
    return
  }
  if (props.selectionMode === 'multiple') {
    const current: DateValue[] = Array.isArray(props.value) ? props.value : props.value ? [props.value] : []
    const index = current.findIndex(v => isSameDay(v, date))
    emit('select', index >= 0 ? current.filter((_, i) => i !== index) : [...current, convert(date, current[0])])
    return
  }
  emit('select', convert(date, props.value ?? undefined))
}
function onPointerEnter(date: CalendarDate) {
  // `highlightDate`: while a range is anchored, hovering moves the focused date (and the preview)
  if (anchor.value && !view.isCellDisabled(date) && !unavailable(date))
    view.focusedDate.value = date
}
function onKeyDown(event: KeyboardEvent) {
  view.onKeyDown(event, {
    select: date => select(date),
    escape: anchor.value ? () => { anchor.value = null } : undefined,
  }, direction.value)
}

function cellState(date: CalendarDate) {
  const disabled = view.isCellDisabled(date)
  const isUnavailable = unavailable(date)
  const selectable = !disabled && !isUnavailable
  const selected = isSelected(date) && selectable
  return {
    date,
    disabled,
    unavailable: isUnavailable,
    selectable,
    selected,
    today: view.isToday(date),
    focused: isSameDay(date, view.focusedDate.value),
    selectionStart: props.kind === 'range' && !!highlighted.value && isSameDay(date, highlighted.value.start) && selectable,
    selectionEnd: props.kind === 'range' && !!highlighted.value && isSameDay(date, highlighted.value.end) && selectable,
  }
}
const label = computed(() => [props.ariaLabel, view.rangeLabel.value].filter(Boolean).join(', '))
</script>

<template>
  <div
    :data-slot="p"
    role="application"
    :aria-label="label"
    :dir="direction"
    :aria-invalid="invalid || undefined"
    :data-invalid="invalid ? '' : undefined"
    :data-disabled="disabled ? '' : undefined"
    :data-readonly="readonly ? '' : undefined"
    :class="ui.base({ class: [uiOverrides?.base, rootClass] })"
  >
    <header :data-slot="`${p}-header`" :class="cls('header')">
      <div :data-slot="`${p}-heading`" aria-hidden="true" :class="cls('heading')">
        {{ view.heading.value }}
      </div>
      <button
        type="button"
        :data-slot="`${p}-nav-button`"
        aria-label="Previous"
        :disabled="view.isPrevDisabled.value || undefined"
        :data-disabled="view.isPrevDisabled.value ? '' : undefined"
        :class="cls('navButton')"
        @click="view.prevPage()"
      >
        <slot name="navIcon" direction="previous">
          <svg :data-slot="`${p}-nav-button-icon`" height="16" width="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" :class="cls('navButtonIcon')">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M10.53 2.97a.75.75 0 0 1 0 1.06L6.56 8l3.97 3.97a.75.75 0 1 1-1.06 1.06l-4.5-4.5a.75.75 0 0 1 0-1.06l4.5-4.5a.75.75 0 0 1 1.06 0" fill="currentColor" />
          </svg>
        </slot>
      </button>
      <button
        type="button"
        :data-slot="`${p}-nav-button`"
        aria-label="Next"
        :disabled="view.isNextDisabled.value || undefined"
        :data-disabled="view.isNextDisabled.value ? '' : undefined"
        :class="cls('navButton')"
        @click="view.nextPage()"
      >
        <slot name="navIcon" direction="next">
          <svg :data-slot="`${p}-nav-button-icon`" height="16" width="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" :class="cls('navButtonIcon')">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M5.47 2.97a.75.75 0 0 1 1.06 0l4.5 4.5a.75.75 0 0 1 0 1.06l-4.5 4.5a.75.75 0 1 1-1.06-1.06L9.44 8 5.47 4.03a.75.75 0 0 1 0-1.06Z" fill="currentColor" />
          </svg>
        </slot>
      </button>
    </header>
    <table
      :ref="(el) => { view.gridRef.value = el as HTMLElement }"
      :data-slot="`${p}-grid`"
      role="grid"
      :aria-label="label"
      :aria-readonly="readonly || undefined"
      :aria-disabled="disabled || undefined"
      :aria-multiselectable="kind === 'range' || selectionMode === 'multiple' || undefined"
      :class="cls('grid')"
      @keydown="onKeyDown"
    >
      <thead :data-slot="`${p}-grid-header`" aria-hidden="true" :class="cls('gridHeader')">
        <tr :class="cls('gridRow')">
          <th v-for="(day, i) in view.weekDays.value" :key="i" :data-slot="`${p}-header-cell`" :class="cls('headerCell')">
            {{ day }}
          </th>
        </tr>
      </thead>
      <tbody :data-slot="`${p}-grid-body`" :class="cls('gridBody')">
        <tr v-for="(row, r) in view.rows.value" :key="r" :class="cls('gridRow')">
          <template v-for="(date, c) in row" :key="c">
            <td v-if="!date" />
            <td
              v-else
              role="gridcell"
              :aria-disabled="!cellState(date).selectable || undefined"
              :aria-selected="cellState(date).selected || undefined"
            >
              <div
                :data-slot="`${p}-cell`"
                role="button"
                :data-value="date.toString()"
                :tabindex="cellState(date).disabled ? undefined : (cellState(date).focused ? 0 : -1)"
                :aria-disabled="!cellState(date).selectable || undefined"
                :aria-label="view.cellLabel(date)"
                :data-today="cellState(date).today ? '' : undefined"
                :data-selected="cellState(date).selected ? true : undefined"
                :data-selection-start="cellState(date).selectionStart ? true : undefined"
                :data-selection-end="cellState(date).selectionEnd ? true : undefined"
                :data-disabled="cellState(date).disabled ? '' : undefined"
                :data-unavailable="cellState(date).unavailable ? '' : undefined"
                :data-focused="cellState(date).focused ? '' : undefined"
                :class="cls('cell')"
                @click="select(date)"
                @focus="view.focusedDate.value = date"
                @pointerenter="onPointerEnter(date)"
              >
                <span v-if="kind === 'range'" data-slot="range-calendar-cell-button" :class="cls('cellButton')">
                  <slot name="cell" :date="date" :today="cellState(date).today" :selected="cellState(date).selected" :disabled="cellState(date).disabled" :unavailable="cellState(date).unavailable" :outside-view="false" :selection-start="cellState(date).selectionStart" :selection-end="cellState(date).selectionEnd">
                    {{ view.formatDay(date) }}
                  </slot>
                  <span v-if="indicator?.(date)" data-slot="range-calendar-cell-indicator" aria-hidden="true" :class="cls('cellIndicator')" />
                </span>
                <template v-else>
                  <slot name="cell" :date="date" :today="cellState(date).today" :selected="cellState(date).selected" :disabled="cellState(date).disabled" :unavailable="cellState(date).unavailable" :outside-view="false">
                    {{ view.formatDay(date) }}
                  </slot>
                  <span v-if="indicator?.(date)" data-slot="calendar-cell-indicator" aria-hidden="true" :class="cls('cellIndicator')" />
                </template>
              </div>
            </td>
          </template>
        </tr>
      </tbody>
    </table>
  </div>
</template>
