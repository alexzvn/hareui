<script lang="ts">
import type { DateValue } from '@internationalized/date'
import type { PageBehavior, VisibleDuration } from './useCalendarDurationView'
import type { ComponentSlots } from '../../types/tv'
import theme from './theme'

type Calendar = typeof theme

export interface CalendarProps {
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
  class?: any
  /** Per-slot class overrides. */
  ui?: ComponentSlots<Calendar>
}

export interface CalendarSlots {
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
  }) => any
}

export interface CalendarEmits {
  /** Emitted when the selected date(s) change. */
  'update:modelValue': [value: DateValue | DateValue[] | undefined]
  /** Emitted when the displayed month/year changes. */
  'update:placeholder': [value: DateValue]
}
</script>

<script setup lang="ts">
import {
  CalendarCell,
  CalendarCellTrigger,
  CalendarGrid,
  CalendarGridBody,
  CalendarGridHead,
  CalendarGridRow,
  CalendarHeadCell,
  CalendarHeading,
  CalendarNext,
  CalendarPrev,
  CalendarRoot,
} from 'reka-ui'
import { computed, ref, shallowRef } from 'vue'
import { isDurationView } from './useCalendarDurationView'
import { useComponentUI } from '../../composables/useComponentUI'
import CalendarDurationView from './CalendarDurationView.vue'
import { defaultMaxValue, defaultMinValue, weekStartsOnFromFirstDay } from './useCalendarBounds'
import { formatPanelHeading } from './useCalendarPanelHeading'
import { useCalendarPlaceholder } from './useCalendarPlaceholder'
import { useCalendarYearPicker } from './useCalendarYearPicker'

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
const effectivePagedNavigation = computed(() => props.numberOfMonths > 1 ? true : props.pagedNavigation)
const emit = defineEmits<CalendarEmits>()
defineSlots<CalendarSlots>()

const viewKind = computed(() => props.visibleDuration?.days != null ? 'day' as const : props.visibleDuration?.weeks != null ? 'week' as const : 'month' as const)
const durationView = computed(() => isDurationView(props.visibleDuration))
const ui = useComponentUI('calendar', theme, () => ({ view: viewKind.value }))

const rootInstance = ref<{ $el: HTMLElement } | null>(null)
const rootEl = computed(() => rootInstance.value?.$el)
const minValue = computed(() => props.minValue ?? defaultMinValue())
const maxValue = computed(() => props.maxValue ?? defaultMaxValue())
const weekStartsOn = computed(() => weekStartsOnFromFirstDay(props.firstDayOfWeek))

const initial = props.modelValue ?? props.defaultValue
// React Aria's useCalendarState resolves the initial focused date via
// `constrainValue(Array.isArray(value) ? value[0] : value, minValue, maxValue)` whenever a
// value/defaultValue was passed at all (even an empty array, which is truthy). constrainValue's
// min-clamp treats an `undefined` date as below range, so `value[0]` on an empty array resolves to
// `minValue` instead of today. Replicate that exactly so multiple-selection with `[]` matches HeroUI.
const arraySeedFallback = Array.isArray(initial) ? minValue.value : undefined
const placeholderModel = useCalendarPlaceholder(
  () => props.placeholder,
  props.defaultPlaceholder ?? (Array.isArray(initial) ? (initial[0] ?? arraySeedFallback) : initial ?? undefined),
  value => emit('update:placeholder', value),
)

// Week/day views run outside Reka, so they keep the (uncontrolled) selection here
const focusedAccessor = { get value() { return placeholderModel.value }, set value(v: DateValue) { placeholderModel.value = v } }
const durationValue = shallowRef<DateValue | DateValue[] | null | undefined>(props.modelValue ?? props.defaultValue)
const currentValue = computed(() => props.modelValue !== undefined ? props.modelValue : durationValue.value)
function onDurationSelect(value: DateValue | DateValue[]) {
  durationValue.value = value
  emit('update:modelValue', value)
}

const isYearPickerOpen = ref(false)
const focusedYear = computed(() => placeholderModel.value.year)

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
  gridSlot: 'calendar-grid',
  onSelect: onSelectYear,
})
const { activeYear: yearPickerActiveYear, gridRef: yearPickerGridRef, onKeyDown: onYearPickerKeyDown, selectYear: selectYearPickerYear, years: yearPickerYears } = yearPickerState
</script>

<template>
  <CalendarDurationView
    v-if="durationView"
    kind="calendar"
    :ui="ui as any"
    :ui-overrides="props.ui"
    :root-class="props.class"
    :aria-label="ariaLabel"
    :duration="visibleDuration!"
    :page-behavior="pageBehavior"
    :focused="focusedAccessor"
    :value="currentValue"
    :selection-mode="selectionMode"
    :min-value="minValue"
    :max-value="maxValue"
    :is-date-unavailable="isDateUnavailable"
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
  <CalendarRoot
    v-else
    ref="rootInstance"
    v-slot="{ weekDays, grid, locale: resolvedLocale }"
    :model-value="modelValue"
    :default-value="(defaultValue as DateValue | undefined)"
    v-model:placeholder="placeholderModel"
    :min-value="minValue"
    :max-value="maxValue"
    :is-date-unavailable="isDateUnavailable"
    :disabled="disabled"
    :readonly="readonly"
    :locale="locale"
    :week-starts-on="weekStartsOn"
    weekday-format="short"
    :fixed-weeks="fixedWeeks"
    :multiple="selectionMode === 'multiple'"
    :paged-navigation="effectivePagedNavigation"
    :number-of-months="numberOfMonths"
    :aria-invalid="invalid || undefined"
    :data-invalid="invalid ? '' : undefined"
    :dir="dir"
    :calendar-label="ariaLabel"
    data-slot="calendar"
    :class="ui.base({ class: [props.ui?.base, props.class] })"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <template v-if="numberOfMonths <= 1">
    <header data-slot="calendar-header" :class="ui.header({ class: props.ui?.header })">
      <template v-if="yearPicker">
        <button
          type="button"
          data-slot="calendar-year-picker-trigger"
          :data-open="isYearPickerOpen ? 'true' : undefined"
          :aria-expanded="isYearPickerOpen"
          :class="ui.yearPickerTrigger({ class: props.ui?.yearPickerTrigger })"
          @click="isYearPickerOpen = !isYearPickerOpen"
        >
          <CalendarHeading as-child>
            <span data-slot="calendar-year-picker-trigger-heading" :class="ui.yearPickerTriggerHeading({ class: props.ui?.yearPickerTriggerHeading })">{{ formatPanelHeading(resolvedLocale, grid[0]?.value ?? placeholderModel) }}</span>
          </CalendarHeading>
          <span data-slot="calendar-year-picker-trigger-indicator" aria-hidden="true" :class="ui.yearPickerTriggerIndicator({ class: props.ui?.yearPickerTriggerIndicator })">
            <svg height="1em" width="1em" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M5.47 2.97a.75.75 0 0 1 1.06 0l4.5 4.5a.75.75 0 0 1 0 1.06l-4.5 4.5a.75.75 0 1 1-1.06-1.06L9.44 8 5.47 4.03a.75.75 0 0 1 0-1.06Z" fill="currentColor" />
            </svg>
          </span>
        </button>
      </template>
      <CalendarHeading v-else data-slot="calendar-heading" :class="ui.heading({ class: props.ui?.heading })">{{ formatPanelHeading(resolvedLocale, grid[0]?.value ?? placeholderModel) }}</CalendarHeading>
      <CalendarPrev data-slot="calendar-nav-button" as-child>
        <button type="button" :class="ui.navButton({ class: props.ui?.navButton })">
          <slot name="navIcon" direction="previous">
            <svg data-slot="calendar-nav-button-icon" height="16" width="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" :class="ui.navButtonIcon({ class: props.ui?.navButtonIcon })">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M10.53 2.97a.75.75 0 0 1 0 1.06L6.56 8l3.97 3.97a.75.75 0 1 1-1.06 1.06l-4.5-4.5a.75.75 0 0 1 0-1.06l4.5-4.5a.75.75 0 0 1 1.06 0" fill="currentColor" />
            </svg>
          </slot>
        </button>
      </CalendarPrev>
      <CalendarNext data-slot="calendar-nav-button" as-child>
        <button type="button" :class="ui.navButton({ class: props.ui?.navButton })">
          <slot name="navIcon" direction="next">
            <svg data-slot="calendar-nav-button-icon" height="16" width="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" :class="ui.navButtonIcon({ class: props.ui?.navButtonIcon })">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M5.47 2.97a.75.75 0 0 1 1.06 0l4.5 4.5a.75.75 0 0 1 0 1.06l-4.5 4.5a.75.75 0 1 1-1.06-1.06L9.44 8 5.47 4.03a.75.75 0 0 1 0-1.06Z" fill="currentColor" />
            </svg>
          </slot>
        </button>
      </CalendarNext>
    </header>
    <CalendarGrid data-slot="calendar-grid" :class="ui.grid({ class: props.ui?.grid })">
      <CalendarGridHead data-slot="calendar-grid-header" :class="ui.gridHeader({ class: props.ui?.gridHeader })">
        <CalendarGridRow :class="ui.gridRow({ class: props.ui?.gridRow })">
          <CalendarHeadCell v-for="(day, i) in weekDays" :key="`weekday-${i}`" data-slot="calendar-header-cell" :class="ui.headerCell({ class: props.ui?.headerCell })">
            {{ day }}
          </CalendarHeadCell>
        </CalendarGridRow>
      </CalendarGridHead>
      <CalendarGridBody data-slot="calendar-grid-body" :class="ui.gridBody({ class: props.ui?.gridBody })">
        <CalendarGridRow v-for="(weekDates, index) in grid[0]?.rows ?? []" :key="`week-${index}`" :class="ui.gridRow({ class: props.ui?.gridRow })">
          <CalendarCell v-for="weekDate in weekDates" :key="weekDate.toString()" :date="weekDate">
            <CalendarCellTrigger
              :day="weekDate"
              :month="grid[0]?.value ?? weekDate"
              data-slot="calendar-cell"
              :class="ui.cell({ class: props.ui?.cell })"
              v-slot="{ dayValue, today, selected, disabled: cellDisabled, unavailable, outsideView }"
            >
              <slot name="cell" :date="weekDate" :today="today" :selected="selected" :disabled="cellDisabled" :unavailable="unavailable" :outside-view="outsideView">
                {{ dayValue }}
              </slot>
              <span v-if="indicator?.(weekDate)" data-slot="calendar-cell-indicator" aria-hidden="true" :class="ui.cellIndicator({ class: props.ui?.cellIndicator })" />
            </CalendarCellTrigger>
          </CalendarCell>
        </CalendarGridRow>
      </CalendarGridBody>
    </CalendarGrid>
    </template>
    <template v-else>
      <div data-slot="calendar-panels" :class="ui.panels({ class: props.ui?.panels })">
        <div v-for="(month, panelIndex) in grid" :key="panelIndex" data-slot="calendar-panel" :class="ui.panel({ class: props.ui?.panel })">
          <header data-slot="calendar-header" :class="ui.header({ class: props.ui?.header })">
            <CalendarPrev v-if="panelIndex === 0" data-slot="calendar-nav-button" as-child>
              <button type="button" :class="ui.navButton({ class: props.ui?.navButton })">
                <slot name="navIcon" direction="previous">
                  <svg data-slot="calendar-nav-button-icon" height="16" width="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" :class="ui.navButtonIcon({ class: props.ui?.navButtonIcon })">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M10.53 2.97a.75.75 0 0 1 0 1.06L6.56 8l3.97 3.97a.75.75 0 1 1-1.06 1.06l-4.5-4.5a.75.75 0 0 1 0-1.06l4.5-4.5a.75.75 0 0 1 1.06 0" fill="currentColor" />
                  </svg>
                </slot>
              </button>
            </CalendarPrev>
            <div v-else aria-hidden="true" class="size-6" />
            <span data-slot="calendar-heading" :class="ui.heading({ class: props.ui?.heading })">{{ formatPanelHeading(resolvedLocale, month.value) }}</span>
            <CalendarNext v-if="panelIndex === grid.length - 1" data-slot="calendar-nav-button" as-child>
              <button type="button" :class="ui.navButton({ class: props.ui?.navButton })">
                <slot name="navIcon" direction="next">
                  <svg data-slot="calendar-nav-button-icon" height="16" width="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" :class="ui.navButtonIcon({ class: props.ui?.navButtonIcon })">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M5.47 2.97a.75.75 0 0 1 1.06 0l4.5 4.5a.75.75 0 0 1 0 1.06l-4.5 4.5a.75.75 0 1 1-1.06-1.06L9.44 8 5.47 4.03a.75.75 0 0 1 0-1.06Z" fill="currentColor" />
                  </svg>
                </slot>
              </button>
            </CalendarNext>
            <div v-else aria-hidden="true" class="size-6" />
          </header>
          <CalendarGrid data-slot="calendar-grid" :class="ui.grid({ class: props.ui?.grid })">
            <CalendarGridHead data-slot="calendar-grid-header" :class="ui.gridHeader({ class: props.ui?.gridHeader })">
              <CalendarGridRow :class="ui.gridRow({ class: props.ui?.gridRow })">
                <CalendarHeadCell v-for="(day, i) in weekDays" :key="`weekday-${i}`" data-slot="calendar-header-cell" :class="ui.headerCell({ class: props.ui?.headerCell })">
                  {{ day }}
                </CalendarHeadCell>
              </CalendarGridRow>
            </CalendarGridHead>
            <CalendarGridBody data-slot="calendar-grid-body" :class="ui.gridBody({ class: props.ui?.gridBody })">
              <CalendarGridRow v-for="(weekDates, index) in month.rows" :key="`week-${index}`" :class="ui.gridRow({ class: props.ui?.gridRow })">
                <CalendarCell v-for="weekDate in weekDates" :key="weekDate.toString()" :date="weekDate">
                  <CalendarCellTrigger
                    :day="weekDate"
                    :month="month.value"
                    data-slot="calendar-cell"
                    :class="ui.cell({ class: props.ui?.cell })"
                    v-slot="{ dayValue, today, selected, disabled: cellDisabled, unavailable, outsideView }"
                  >
                    <slot name="cell" :date="weekDate" :today="today" :selected="selected" :disabled="cellDisabled" :unavailable="unavailable" :outside-view="outsideView">
                      {{ dayValue }}
                    </slot>
                    <span v-if="indicator?.(weekDate)" data-slot="calendar-cell-indicator" aria-hidden="true" :class="ui.cellIndicator({ class: props.ui?.cellIndicator })" />
                  </CalendarCellTrigger>
                </CalendarCell>
              </CalendarGridRow>
            </CalendarGridBody>
          </CalendarGrid>
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
  </CalendarRoot>
</template>
