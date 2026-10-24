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
    <header :data-slot="`${p}-header`" role="presentation" :class="cls('header')">
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
          <svg
            :data-slot="`${p}-nav-button-icon`"
            height="16"
            width="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            :class="cls('navButtonIcon')"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M10.53 2.97a.75.75 0 0 1 0 1.06L6.56 8l3.97 3.97a.75.75 0 1 1-1.06 1.06l-4.5-4.5a.75.75 0 0 1 0-1.06l4.5-4.5a.75.75 0 0 1 1.06 0"
              fill="currentColor"
            />
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
          <svg
            :data-slot="`${p}-nav-button-icon`"
            height="16"
            width="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            :class="cls('navButtonIcon')"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M5.47 2.97a.75.75 0 0 1 1.06 0l4.5 4.5a.75.75 0 0 1 0 1.06l-4.5 4.5a.75.75 0 1 1-1.06-1.06L9.44 8 5.47 4.03a.75.75 0 0 1 0-1.06Z"
              fill="currentColor"
            />
          </svg>
        </slot>
      </button>
    </header>
    <table
      :ref="
        (el) => {
          view.gridRef.value = el as HTMLElement
        }
      "
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
          <th
            v-for="(day, i) in view.weekDays.value"
            :key="i"
            :data-slot="`${p}-header-cell`"
            :class="cls('headerCell')"
          >
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
                :tabindex="cellState(date).disabled ? undefined : cellState(date).focused ? 0 : -1"
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
                <span
                  v-if="kind === 'range'"
                  data-slot="range-calendar-cell-button"
                  :class="cls('cellButton')"
                >
                  <slot
                    name="cell"
                    :date="date"
                    :today="cellState(date).today"
                    :selected="cellState(date).selected"
                    :disabled="cellState(date).disabled"
                    :unavailable="cellState(date).unavailable"
                    :outside-view="false"
                    :selection-start="cellState(date).selectionStart"
                    :selection-end="cellState(date).selectionEnd"
                  >
                    {{ view.formatDay(date) }}
                  </slot>
                  <span
                    v-if="indicator?.(date)"
                    data-slot="range-calendar-cell-indicator"
                    aria-hidden="true"
                    :class="cls('cellIndicator')"
                  />
                </span>
                <template v-else>
                  <slot
                    name="cell"
                    :date="date"
                    :today="cellState(date).today"
                    :selected="cellState(date).selected"
                    :disabled="cellState(date).disabled"
                    :unavailable="cellState(date).unavailable"
                    :outside-view="false"
                  >
                    {{ view.formatDay(date) }}
                  </slot>
                  <span
                    v-if="indicator?.(date)"
                    data-slot="calendar-cell-indicator"
                    aria-hidden="true"
                    :class="cls('cellIndicator')"
                  />
                </template>
              </div>
            </td>
          </template>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import type { CalendarDate, DateValue } from '@internationalized/date'
import type { VNode } from 'vue'

import type { ClassValue } from '@/utils/tv'

import type { PageBehavior, VisibleDuration } from './useCalendarDurationView'

type DurationRange = { start: DateValue | undefined; end: DateValue | undefined }

/** Single: a date; multiple: an array; range: `{ start, end }`. */
export type CalendarDurationValue = DateValue | DateValue[] | DurationRange

type CalendarDurationCellSlotProps = {
  date: CalendarDate
  today: boolean
  selected: boolean
  disabled: boolean
  unavailable: boolean
  outsideView: boolean
  /** Range kind only. */
  selectionStart?: boolean
  /** Range kind only. */
  selectionEnd?: boolean
}

/**
 * Internal: the `visibleDuration={{ weeks }}` / `{{ days }}` grid shared by `Calendar` and `RangeCalendar`
 * (decision #11). Reka's calendar roots always build full month grids, so these views use their own state
 * (`useCalendarDurationView`, a port of react-stately's `useCalendarState`) and mirror the month view's DOM,
 * `data-slot`s and Reka-style data attributes so the same theme applies.
 */
export type CalendarDurationViewProps = {
  kind: 'calendar' | 'range'
  /** Resolved slot class functions of the parent's theme (already resolved for the `view` variant). */
  ui: Record<string, (opts?: { class?: ClassValue }) => string>
  /** The parent's `:ui` overrides. */
  uiOverrides?: Partial<Record<string, ClassValue>>
  rootClass?: ClassValue
  ariaLabel?: string
  duration: VisibleDuration
  pageBehavior: PageBehavior
  focused: { value: DateValue }
  value: CalendarDurationValue | null | undefined
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
import { GregorianCalendar, isSameDay, toCalendar } from '@internationalized/date'
import { useDirection, useLocale } from 'reka-ui'
import { computed, toRef } from 'vue'

import { useCalendarDurationView } from './useCalendarDurationView'
import { makeRange, useRangeSelection } from './useRangeSelection'

const props = defineProps<CalendarDurationViewProps>()
const emit = defineEmits<{ select: [value: CalendarDurationValue] }>()

defineSlots<{
  navIcon?: (props: { direction: 'previous' | 'next' }) => VNode[]
  cell?: (props: CalendarDurationCellSlotProps) => VNode[]
}>()

const locale = useLocale(toRef(() => props.locale))
const direction = useDirection(toRef(() => props.dir))
const p = computed(() => (props.kind === 'range' ? 'range-calendar' : 'calendar'))
const cls = (slot: string) => props.ui[slot]?.({ class: props.uiOverrides?.[slot] })

const isRange = (value: CalendarDurationValue): value is DurationRange =>
  !Array.isArray(value) && 'start' in value

const isCompleteRange = (
  value: CalendarDurationValue | null | undefined,
): value is { start: DateValue; end: DateValue } =>
  !!value && isRange(value) && !!value.start && !!value.end

// ---- Range selection state (react-stately `useRangeCalendarState`, shared core in `useRangeSelection`) ----
const range = computed<{ start: DateValue; end: DateValue } | null>(() =>
  props.kind === 'range' && isCompleteRange(props.value) ? props.value : null,
)

// No `onAnchor`: unlike the month view, the first pick emits nothing until the range commits.
const selection = useRangeSelection<CalendarDate>({
  isDateUnavailable: () => props.isDateUnavailable,
  allowNonContiguousRanges: () => props.allowNonContiguousRanges,
  minValue: () => props.minValue,
  maxValue: () => props.maxValue,
  // The available run is searched one visible duration each way
  span: () => ({ days: view.endDate.value.compare(view.startDate.value) + 1 }),
  enabled: () => props.kind === 'range',
  onCommit: (r) =>
    emit('select', {
      start: convert(r.start, range.value?.start),
      end: convert(r.end, range.value?.end),
    }),
})

const anchor = selection.anchor
const unavailable = (date: DateValue) => selection.isUnavailable.value?.(date) ?? false

// react-stately aligns a range that doesn't fit the centered window to its start
const alignment = () => {
  if (!range.value) return 'center' as const

  return range.value.end.compare(range.value.start) >=
    (props.duration.days ?? (props.duration.weeks ?? 1) * 7) / 2
    ? ('start' as const)
    : ('center' as const)
}

const view = useCalendarDurationView({
  duration: () => props.duration,
  locale: () => locale.value,
  firstDayOfWeek: () => props.firstDayOfWeek,
  minValue: () => selection.effectiveMin.value,
  maxValue: () => selection.effectiveMax.value,
  pageBehavior: () => props.pageBehavior,
  disabled: () => props.disabled,
  focused: props.focused,
  alignment,
})

const highlighted = computed(() => {
  if (props.kind !== 'range') return null
  if (anchor.value) return makeRange(anchor.value, view.focusedDate.value)

  return range.value
    ? makeRange(view.toDisplay(range.value.start), view.toDisplay(range.value.end))
    : null
})

const isSelected = (date: CalendarDate) => {
  if (props.kind === 'range')
    return (
      !!highlighted.value &&
      date.compare(highlighted.value.start) >= 0 &&
      date.compare(highlighted.value.end) <= 0
    )

  if (Array.isArray(props.value)) return props.value.some((v: DateValue) => isSameDay(v, date))
  const single = singleValue()

  return !!single && isSameDay(single, date)
}

// The calendar kind's one selected date: not an array (multiple) nor a `{ start, end }` (range)
const singleValue = (): DateValue | undefined => {
  const value = props.value
  return value && !Array.isArray(value) && !isRange(value) ? value : undefined
}

// The emitted value keeps the original value's calendar system (Gregorian by default) and time of day
const convert = (date: CalendarDate, old: DateValue | undefined): DateValue => {
  const converted = toCalendar(date, old?.calendar ?? new GregorianCalendar())
  return old && 'hour' in old ? old.set(converted) : converted
}

const select = (date: CalendarDate) => {
  if (props.disabled || props.readonly || view.isCellDisabled(date) || unavailable(date)) return
  view.focusedDate.value = date

  if (props.kind === 'range') {
    selection.select(date)
    return
  }

  if (props.selectionMode === 'multiple') {
    const single = singleValue()
    const current: DateValue[] = Array.isArray(props.value) ? props.value : single ? [single] : []
    const index = current.findIndex((v) => isSameDay(v, date))
    emit(
      'select',
      index >= 0 ? current.filter((_, i) => i !== index) : [...current, convert(date, current[0])],
    )

    return
  }

  emit('select', convert(date, singleValue()))
}

const onPointerEnter = (date: CalendarDate) => {
  // `highlightDate`: while a range is anchored, hovering moves the focused date (and the preview)
  if (anchor.value && !view.isCellDisabled(date) && !unavailable(date))
    view.focusedDate.value = date
}

const onKeyDown = (event: KeyboardEvent) => {
  view.onKeyDown(
    event,
    {
      select: (date) => select(date),
      escape: anchor.value
        ? () => {
            selection.cancel()
          }
        : undefined,
    },
    direction.value,
  )
}

const cellState = (date: CalendarDate) => {
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
    selectionStart:
      props.kind === 'range' &&
      !!highlighted.value &&
      isSameDay(date, highlighted.value.start) &&
      selectable,
    selectionEnd:
      props.kind === 'range' &&
      !!highlighted.value &&
      isSameDay(date, highlighted.value.end) &&
      selectable,
  }
}

const label = computed(() => [props.ariaLabel, view.rangeLabel.value].filter(Boolean).join(', '))
</script>
