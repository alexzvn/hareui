<script lang="ts">
import type { DateValue } from '@internationalized/date'
import type { PageBehavior, VisibleDuration } from '../composables/useCalendarDurationView'
import type { ComponentSlots } from '../types/tv'
import theme from '../theme/rangeCalendar'

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
  RangeCalendarCell,
  RangeCalendarCellTrigger,
  RangeCalendarGrid,
  RangeCalendarGridBody,
  RangeCalendarGridHead,
  RangeCalendarGridRow,
  RangeCalendarHeading,
  RangeCalendarNext,
  RangeCalendarPrev,
  RangeCalendarRoot,
} from 'reka-ui'
import { computed, ref, shallowRef } from 'vue'
import { isDurationView } from '../composables/useCalendarDurationView'
import { useComponentUI } from '../composables/useComponentUI'
import CalendarDurationView from './CalendarDurationView.vue'
import { defaultMaxValue, defaultMinValue, weekStartsOnFromFirstDay } from '../composables/useCalendarBounds'
import { formatPanelHeading } from '../composables/useCalendarPanelHeading'
import { useCalendarPlaceholder } from '../composables/useCalendarPlaceholder'
import { useCalendarYearPicker } from '../composables/useCalendarYearPicker'

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
defineSlots<RangeCalendarSlots>()

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

// React Aria's `isDateUnavailable(date, anchorDate)` lets the matcher depend on the
// in-progress range's start date (see HeroUI's anchor-unavailable-dates demo). Reka's
// `Matcher` type is single-argument only (reka-limitation), so we wrap the consumer's
// 2-arg callback into the 1-arg shape Reka expects, deriving `anchorValue` the same way
// react-stately's `useRangeCalendarState` does: the anchor is the in-progress start while
// `end` is still unset, and resets to `null` the instant both are committed (react-stately
// calls `setAnchorDate(null)` right after `setValue(range)` completes a selection — see
// `useRangeCalendarState.mjs`'s `selectDate`). Reka's own `startValue` has no such reset
// (it doubles as the persisted range start), so we derive the anchor from our own
// `modelValue` flow instead of Reka's `update:startValue` emit to match React's semantics.
const anchorValue = shallowRef<DateValue | undefined>(undefined)
const wrappedIsDateUnavailable = computed(() => {
  if (!props.isDateUnavailable)
    return undefined
  return (date: DateValue) => props.isDateUnavailable!(date, anchorValue.value ?? null)
})
// react-stately's `getAvailableRange`: while a range is anchored (and non-contiguous ranges are off), the selectable
// window shrinks to the run of available days around the anchor, which also disables paging past it.
function edgeOfAvailableRun(anchor: DateValue, dir: 1 | -1) {
  const span = { months: Math.max(1, props.numberOfMonths) }
  const limit = dir < 0 ? anchor.subtract(span) : anchor.add(span)
  let next = anchor.add({ days: dir })
  while ((dir < 0 ? next.compare(limit) >= 0 : next.compare(limit) <= 0) && !wrappedIsDateUnavailable.value!(next))
    next = next.add({ days: dir })
  return wrappedIsDateUnavailable.value!(next) ? next.add({ days: -dir }) : undefined
}
const availableRun = computed(() => {
  const anchor = anchorValue.value
  if (!anchor || !wrappedIsDateUnavailable.value || props.allowNonContiguousRanges)
    return null
  return { start: edgeOfAvailableRun(anchor, -1), end: edgeOfAvailableRun(anchor, 1) }
})
const effectiveMinValue = computed(() => {
  const start = availableRun.value?.start
  return start && start.compare(minValue.value) > 0 ? start : minValue.value
})
const effectiveMaxValue = computed(() => {
  const end = availableRun.value?.end
  return end && end.compare(maxValue.value) < 0 ? end : maxValue.value
})
// React Aria highlights `anchor..focused`, so a freshly anchored day is both the selection start and end (a full
// cap); Reka only marks it as the start.
function isLoneAnchor(date: DateValue) {
  return !!anchorValue.value && date.compare(anchorValue.value) === 0
}

// Week/day views run outside Reka, so they keep the (uncontrolled) selection here
const focusedAccessor = { get value() { return placeholderModel.value }, set value(v: DateValue) { placeholderModel.value = v } }
const durationValue = shallowRef<DateRange | undefined>(props.modelValue ?? props.defaultValue)
const currentValue = computed(() => props.modelValue !== undefined ? props.modelValue : durationValue.value)
function onDurationSelect(value: DateRange) {
  durationValue.value = value
  emit('update:modelValue', value)
}
function onModelValueUpdate(value: DateRange | undefined) {
  emit('update:modelValue', value)
  anchorValue.value = value?.end === undefined ? value?.start : undefined
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
    :model-value="modelValue"
    :default-value="defaultValue"
    v-model:placeholder="placeholderModel"
    :min-value="effectiveMinValue"
    :max-value="effectiveMaxValue"
    :is-date-unavailable="wrappedIsDateUnavailable"
    :disabled="disabled"
    :readonly="readonly"
    :allow-non-contiguous-ranges="allowNonContiguousRanges"
    :maximum-days="maximumDays"
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
    @update:model-value="onModelValueUpdate"
  >
    <template v-if="numberOfMonths <= 1">
    <header data-slot="range-calendar-header" :class="ui.header({ class: props.ui?.header })">
      <template v-if="yearPicker">
        <button
          type="button"
          data-slot="calendar-year-picker-trigger"
          :data-open="isYearPickerOpen ? 'true' : undefined"
          :aria-expanded="isYearPickerOpen"
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
        <button type="button" :class="ui.navButton({ class: props.ui?.navButton })">
          <slot name="navIcon" direction="previous">
            <svg data-slot="range-calendar-nav-button-icon" height="16" width="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" :class="ui.navButtonIcon({ class: props.ui?.navButtonIcon })">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M10.53 2.97a.75.75 0 0 1 0 1.06L6.56 8l3.97 3.97a.75.75 0 1 1-1.06 1.06l-4.5-4.5a.75.75 0 0 1 0-1.06l4.5-4.5a.75.75 0 0 1 1.06 0" fill="currentColor" />
            </svg>
          </slot>
        </button>
      </RangeCalendarPrev>
      <RangeCalendarNext data-slot="range-calendar-nav-button" as-child>
        <button type="button" :class="ui.navButton({ class: props.ui?.navButton })">
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
          <RangeCalendarCell
            v-for="weekDate in weekDates"
            :key="weekDate.toString()"
            :date="weekDate"
          >
            <RangeCalendarCellTrigger
              :day="weekDate"
              :month="grid[0]?.value ?? weekDate"
              v-bind="isLoneAnchor(weekDate) ? { 'data-selection-end': true } : {}"
              data-slot="range-calendar-cell"
              :class="ui.cell({ class: props.ui?.cell })"
              v-slot="{ dayValue, today, selected, disabled: cellDisabled, unavailable, outsideView, selectionStart, selectionEnd }"
            >
              <span data-slot="range-calendar-cell-button" :class="ui.cellButton({ class: props.ui?.cellButton })">
                <slot
                  name="cell"
                  :date="weekDate"
                  :today="today"
                  :selected="selected"
                  :disabled="cellDisabled"
                  :unavailable="unavailable"
                  :outside-view="outsideView"
                  :selection-start="selectionStart"
                  :selection-end="selectionEnd"
                >
                  {{ dayValue }}
                </slot>
                <span v-if="indicator?.(weekDate)" data-slot="range-calendar-cell-indicator" aria-hidden="true" :class="ui.cellIndicator({ class: props.ui?.cellIndicator })" />
              </span>
            </RangeCalendarCellTrigger>
          </RangeCalendarCell>
        </RangeCalendarGridRow>
      </RangeCalendarGridBody>
    </RangeCalendarGrid>
    </template>
    <template v-else>
      <div data-slot="calendar-panels" :class="ui.panels({ class: props.ui?.panels })">
        <div v-for="(month, panelIndex) in grid" :key="panelIndex" data-slot="calendar-panel" :class="ui.panel({ class: props.ui?.panel })">
          <header data-slot="range-calendar-header" :class="ui.header({ class: props.ui?.header })">
            <RangeCalendarPrev v-if="panelIndex === 0" data-slot="range-calendar-nav-button" as-child>
              <button type="button" :class="ui.navButton({ class: props.ui?.navButton })">
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
              <button type="button" :class="ui.navButton({ class: props.ui?.navButton })">
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
                <RangeCalendarCell
                  v-for="weekDate in weekDates"
                  :key="weekDate.toString()"
                  :date="weekDate"
                >
                  <RangeCalendarCellTrigger
                    :day="weekDate"
                    :month="month.value"
                    v-bind="isLoneAnchor(weekDate) ? { 'data-selection-end': true } : {}"
                    data-slot="range-calendar-cell"
                    :class="ui.cell({ class: props.ui?.cell })"
                    v-slot="{ dayValue, today, selected, disabled: cellDisabled, unavailable, outsideView, selectionStart, selectionEnd }"
                  >
                    <span data-slot="range-calendar-cell-button" :class="ui.cellButton({ class: props.ui?.cellButton })">
                      <slot
                        name="cell"
                        :date="weekDate"
                        :today="today"
                        :selected="selected"
                        :disabled="cellDisabled"
                        :unavailable="unavailable"
                        :outside-view="outsideView"
                        :selection-start="selectionStart"
                        :selection-end="selectionEnd"
                      >
                        {{ dayValue }}
                      </slot>
                      <span v-if="indicator?.(weekDate)" data-slot="range-calendar-cell-indicator" aria-hidden="true" :class="ui.cellIndicator({ class: props.ui?.cellIndicator })" />
                    </span>
                  </RangeCalendarCellTrigger>
                </RangeCalendarCell>
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
