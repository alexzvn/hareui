<template>
  <CalendarDurationView
    v-if="isWeekOrDayView"
    :kind="kind"
    :ui="ui"
    :ui-overrides="uiOverrides"
    :root-class="rootClass"
    :aria-label="ariaLabel"
    :duration="visibleDuration!"
    :page-behavior="pageBehavior"
    :focused="durationFocus"
    :value="durationCurrentValue"
    :selection-mode="selection.mode"
    :min-value="minValue"
    :max-value="maxValue"
    :is-date-unavailable="selection.isDateUnavailable"
    :allow-non-contiguous-ranges="selection.allowNonContiguousRanges"
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
      <slot name="cell" v-bind="slotProps" />
    </template>
  </CalendarDurationView>
  <component
    :is="reka.Root"
    v-else
    ref="root"
    v-slot="{ weekDays, grid, locale: resolvedLocale }"
    v-bind="rootBindings"
    v-model:placeholder="placeholderModel"
    :min-value="gridBounds.minValue"
    :max-value="gridBounds.maxValue"
    :disabled="disabled"
    :readonly="readonly"
    :locale="locale"
    :week-starts-on="weekStartsOn"
    weekday-format="short"
    :fixed-weeks="fixedWeeks"
    :paged-navigation="isPagedNavigation"
    :number-of-months="numberOfMonths"
    :aria-invalid="invalid || undefined"
    :data-invalid="invalid ? '' : undefined"
    :dir="dir"
    :calendar-label="ariaLabel"
    :data-slot="prefix"
    role="application"
    :class="ui.base({ class: [uiOverrides?.base, rootClass] })"
    @keydown="onMonthKeyDown"
  >
    <template v-if="numberOfMonths <= 1">
      <header
        :data-slot="`${prefix}-header`"
        role="presentation"
        :class="ui.header({ class: uiOverrides?.header })"
        @click.capture="onHeaderClickCapture"
      >
        <button
          v-if="yearPicker"
          type="button"
          data-slot="calendar-year-picker-trigger"
          :data-open="isYearPickerOpen ? 'true' : undefined"
          :aria-expanded="isYearPickerOpen"
          :aria-label="`${formatPanelHeading(resolvedLocale, grid[0]?.value ?? placeholderModel)}, year selector`"
          :class="ui.yearPickerTrigger({ class: uiOverrides?.yearPickerTrigger })"
          @click="isYearPickerOpen = !isYearPickerOpen"
        >
          <component :is="reka.Heading" as-child>
            <span
              data-slot="calendar-year-picker-trigger-heading"
              :class="ui.yearPickerTriggerHeading({ class: uiOverrides?.yearPickerTriggerHeading })"
              >{{ formatPanelHeading(resolvedLocale, grid[0]?.value ?? placeholderModel) }}</span
            >
          </component>
          <span
            data-slot="calendar-year-picker-trigger-indicator"
            aria-hidden="true"
            :class="
              ui.yearPickerTriggerIndicator({ class: uiOverrides?.yearPickerTriggerIndicator })
            "
          >
            <svg
              height="1em"
              width="1em"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                :d="CHEVRON_PATHS.next"
                fill="currentColor"
              />
            </svg>
          </span>
        </button>
        <component
          :is="reka.Heading"
          v-else
          :data-slot="`${prefix}-heading`"
          :class="ui.heading({ class: uiOverrides?.heading })"
          >{{ formatPanelHeading(resolvedLocale, grid[0]?.value ?? placeholderModel) }}</component
        >
        <component :is="reka.Prev" :data-slot="`${prefix}-nav-button`" as-child>
          <button
            ref="prevButton"
            type="button"
            aria-label="Previous"
            :class="ui.navButton({ class: uiOverrides?.navButton })"
          >
            <slot name="navIcon" direction="previous">
              <svg
                :data-slot="`${prefix}-nav-button-icon`"
                height="16"
                width="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                :class="ui.navButtonIcon({ class: uiOverrides?.navButtonIcon })"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  :d="CHEVRON_PATHS.previous"
                  fill="currentColor"
                />
              </svg>
            </slot>
          </button>
        </component>
        <component :is="reka.Next" :data-slot="`${prefix}-nav-button`" as-child>
          <button
            ref="nextButton"
            type="button"
            aria-label="Next"
            :class="ui.navButton({ class: uiOverrides?.navButton })"
          >
            <slot name="navIcon" direction="next">
              <svg
                :data-slot="`${prefix}-nav-button-icon`"
                height="16"
                width="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                :class="ui.navButtonIcon({ class: uiOverrides?.navButtonIcon })"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  :d="CHEVRON_PATHS.next"
                  fill="currentColor"
                />
              </svg>
            </slot>
          </button>
        </component>
      </header>
      <component
        :is="reka.Grid"
        :data-slot="`${prefix}-grid`"
        role="grid"
        :aria-label="formatGridLabel(ariaLabel, resolvedLocale, grid[0]?.value ?? placeholderModel)"
        :aria-multiselectable="isMultiselectable || undefined"
        :class="ui.grid({ class: uiOverrides?.grid })"
      >
        <component
          :is="reka.GridHead"
          :data-slot="`${prefix}-grid-header`"
          :class="ui.gridHeader({ class: uiOverrides?.gridHeader })"
        >
          <component :is="reka.GridRow" :class="ui.gridRow({ class: uiOverrides?.gridRow })">
            <CalendarHeadCell
              v-for="(day, i) in weekDays"
              :key="`weekday-${i}`"
              :data-slot="`${prefix}-header-cell`"
              :class="ui.headerCell({ class: uiOverrides?.headerCell })"
            >
              {{ day }}
            </CalendarHeadCell>
          </component>
        </component>
        <component
          :is="reka.GridBody"
          :data-slot="`${prefix}-grid-body`"
          :class="ui.gridBody({ class: uiOverrides?.gridBody })"
        >
          <component
            :is="reka.GridRow"
            v-for="(weekDates, index) in grid[0]?.rows ?? []"
            :key="`week-${index}`"
            :class="ui.gridRow({ class: uiOverrides?.gridRow })"
          >
            <template v-for="weekDate in weekDates" :key="weekDate.toString()">
              <slot name="monthCell" :date="weekDate" :month="grid[0]?.value ?? weekDate" />
            </template>
          </component>
        </component>
      </component>
    </template>
    <div v-else data-slot="calendar-panels" :class="ui.panels({ class: uiOverrides?.panels })">
      <div
        v-for="(month, panelIndex) in grid"
        :key="panelIndex"
        data-slot="calendar-panel"
        :class="ui.panel({ class: uiOverrides?.panel })"
      >
        <header
          :data-slot="`${prefix}-header`"
          role="presentation"
          :class="ui.header({ class: uiOverrides?.header })"
        >
          <component
            v-if="panelIndex === 0"
            :is="reka.Prev"
            :data-slot="`${prefix}-nav-button`"
            as-child
          >
            <button
              type="button"
              aria-label="Previous"
              :class="ui.navButton({ class: uiOverrides?.navButton })"
            >
              <slot name="navIcon" direction="previous">
                <svg
                  :data-slot="`${prefix}-nav-button-icon`"
                  height="16"
                  width="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  :class="ui.navButtonIcon({ class: uiOverrides?.navButtonIcon })"
                >
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    :d="CHEVRON_PATHS.previous"
                    fill="currentColor"
                  />
                </svg>
              </slot>
            </button>
          </component>
          <div v-else aria-hidden="true" class="size-6" />
          <span
            :data-slot="`${prefix}-heading`"
            :class="ui.heading({ class: uiOverrides?.heading })"
            >{{ formatPanelHeading(resolvedLocale, month.value) }}</span
          >
          <component
            v-if="panelIndex === grid.length - 1"
            :is="reka.Next"
            :data-slot="`${prefix}-nav-button`"
            as-child
          >
            <button
              type="button"
              aria-label="Next"
              :class="ui.navButton({ class: uiOverrides?.navButton })"
            >
              <slot name="navIcon" direction="next">
                <svg
                  :data-slot="`${prefix}-nav-button-icon`"
                  height="16"
                  width="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  :class="ui.navButtonIcon({ class: uiOverrides?.navButtonIcon })"
                >
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    :d="CHEVRON_PATHS.next"
                    fill="currentColor"
                  />
                </svg>
              </slot>
            </button>
          </component>
          <div v-else aria-hidden="true" class="size-6" />
        </header>
        <component
          :is="reka.Grid"
          :data-slot="`${prefix}-grid`"
          role="grid"
          :aria-label="formatGridLabel(ariaLabel, resolvedLocale, month.value)"
          :aria-multiselectable="isMultiselectable || undefined"
          :class="ui.grid({ class: uiOverrides?.grid })"
        >
          <component
            :is="reka.GridHead"
            :data-slot="`${prefix}-grid-header`"
            :class="ui.gridHeader({ class: uiOverrides?.gridHeader })"
          >
            <component :is="reka.GridRow" :class="ui.gridRow({ class: uiOverrides?.gridRow })">
              <CalendarHeadCell
                v-for="(day, i) in weekDays"
                :key="`weekday-${i}`"
                :data-slot="`${prefix}-header-cell`"
                :class="ui.headerCell({ class: uiOverrides?.headerCell })"
              >
                {{ day }}
              </CalendarHeadCell>
            </component>
          </component>
          <component
            :is="reka.GridBody"
            :data-slot="`${prefix}-grid-body`"
            :class="ui.gridBody({ class: uiOverrides?.gridBody })"
          >
            <component
              :is="reka.GridRow"
              v-for="(weekDates, index) in month.rows"
              :key="`week-${index}`"
              :class="ui.gridRow({ class: uiOverrides?.gridRow })"
            >
              <template v-for="weekDate in weekDates" :key="weekDate.toString()">
                <slot name="monthCell" :date="weekDate" :month="month.value" />
              </template>
            </component>
          </component>
        </component>
      </div>
    </div>
    <div
      v-if="yearPicker"
      ref="yearPickerGrid"
      data-slot="calendar-year-picker-grid"
      role="listbox"
      :aria-label="yearPickerLabel(resolvedLocale)"
      tabindex="-1"
      :aria-hidden="!isYearPickerOpen"
      :data-open="isYearPickerOpen ? 'true' : undefined"
      :class="ui.yearPickerGrid({ class: uiOverrides?.yearPickerGrid })"
      @keydown="onYearPickerKeyDown"
    >
      <button
        v-for="year in yearPickerYears"
        :key="year"
        type="button"
        role="option"
        data-slot="calendar-year-picker-year-cell"
        :data-year="year"
        :data-selected="year === focusedYear ? true : undefined"
        :aria-selected="year === focusedYear"
        :tabindex="isYearPickerOpen && year === yearPickerActiveYear ? 0 : -1"
        :class="ui.yearPickerYearCell({ class: uiOverrides?.yearPickerYearCell })"
        @click="selectYearPickerYear(year)"
        @focus="yearPickerActiveYear = year"
      >
        {{ year }}
      </button>
    </div>
  </component>
</template>

<script lang="ts">
import type { DateValue } from '@internationalized/date'
import type { ClassValue } from 'tailwind-variants'

import type { PageBehavior, VisibleDuration } from './useCalendarDurationView'

type CalendarKind = 'calendar' | 'range'

type CalendarShellSlot =
  | 'base'
  | 'panels'
  | 'panel'
  | 'header'
  | 'heading'
  | 'navButton'
  | 'navButtonIcon'
  | 'grid'
  | 'gridHeader'
  | 'gridBody'
  | 'gridRow'
  | 'headerCell'
  | 'yearPickerTrigger'
  | 'yearPickerTriggerHeading'
  | 'yearPickerTriggerIndicator'
  | 'yearPickerGrid'
  | 'yearPickerYearCell'

/** How the calendar selects. The week/day view runs outside Reka, so it selects with these directly. */
type CalendarShellSelection<TValue> = {
  /** The controlled value; `undefined` leaves the week/day view's selection uncontrolled. */
  value?: TValue | null
  /** The week/day view's initial uncontrolled value. */
  defaultValue?: TValue
  mode?: 'single' | 'multiple'
  isDateUnavailable?: (date: DateValue, anchorDate: DateValue | null) => boolean
  allowNonContiguousRanges?: boolean
}

type CalendarMonthShellProps<TValue> = {
  kind: CalendarKind
  /** The root's resolved slot class functions (already resolved for the `view` variant). */
  ui: Record<CalendarShellSlot, (props?: { class?: ClassValue }) => string>
  /** The root's `:ui` overrides. */
  uiOverrides?: Partial<Record<string, ClassValue>>
  rootClass?: ClassValue
  ariaLabel?: string
  /** The controlled displayed date. */
  placeholder?: DateValue
  /** The initially displayed date when `placeholder` isn't controlled; read once. */
  defaultPlaceholder?: DateValue
  /** The resolved bounds: the year picker's range, the week/day view's bounds and the month grid's by default. */
  minValue: DateValue
  maxValue: DateValue
  /** Narrower bounds for the month grid and its keys (RangeCalendar while a range is anchored). */
  monthBounds?: { minValue: DateValue; maxValue: DateValue }
  selection: CalendarShellSelection<TValue>
  /** Props and listeners for the Reka root that differ between Calendar and RangeCalendar. */
  rootBindings: Record<string, unknown>
  disabled: boolean
  readonly: boolean
  invalid: boolean
  locale?: string
  firstDayOfWeek?: 'sun' | 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat'
  fixedWeeks: boolean
  yearPicker: boolean
  pagedNavigation: boolean
  numberOfMonths: number
  dir?: 'ltr' | 'rtl'
  visibleDuration?: VisibleDuration
  pageBehavior: PageBehavior
  indicator?: (date: DateValue) => boolean
}

/** What a root reads back from its shell: cell event handlers resolve dates against the displayed month. */
export type CalendarMonthShellExposed = {
  /** The Reka root's element; `undefined` in the week/day view. */
  readonly rootEl: HTMLElement | undefined
  /** The displayed (focused) date; assigning it moves the view. */
  placeholder: DateValue
}
</script>

<script setup lang="ts" generic="TValue">
import {
  CalendarGrid,
  CalendarGridBody,
  CalendarGridHead,
  CalendarGridRow,
  CalendarHeadCell,
  CalendarHeading,
  CalendarNext,
  CalendarPrev,
  CalendarRoot,
  RangeCalendarGrid,
  RangeCalendarGridBody,
  RangeCalendarGridHead,
  RangeCalendarGridRow,
  RangeCalendarHeading,
  RangeCalendarNext,
  RangeCalendarPrev,
  RangeCalendarRoot,
} from 'reka-ui'
import { computed, ref, shallowRef, useTemplateRef } from 'vue'

import CalendarDurationView from './CalendarDurationView.vue'
import { weekStartsOnFromFirstDay } from './useCalendarBounds'
import { isDurationView } from './useCalendarDurationView'
import { useCalendarMonthKeys } from './useCalendarMonthKeys'
import { formatGridLabel, formatPanelHeading } from './useCalendarPanelHeading'
import { useCalendarPlaceholder } from './useCalendarPlaceholder'
import { useCalendarYearPicker, yearPickerLabel } from './useCalendarYearPicker'

const props = defineProps<CalendarMonthShellProps<TValue>>()
const emit = defineEmits<{
  'update:placeholder': [value: DateValue]
  /** A week/day view pick. */
  select: [value: TValue]
}>()
defineSlots<{
  navIcon?: (props: { direction: 'previous' | 'next' }) => unknown
  /** The root's public `#cell`, rendered by the week/day view. */
  cell?: (props: Record<string, unknown>) => unknown
  /** One day of a month grid, inside the grid row. */
  monthCell: (props: { date: DateValue; month: DateValue }) => unknown
}>()

// Reka's parts read their root's context, so each kind renders its own family
const REKA_PARTS = {
  calendar: {
    Root: CalendarRoot,
    Heading: CalendarHeading,
    Prev: CalendarPrev,
    Next: CalendarNext,
    Grid: CalendarGrid,
    GridHead: CalendarGridHead,
    GridBody: CalendarGridBody,
    GridRow: CalendarGridRow,
  },
  range: {
    Root: RangeCalendarRoot,
    Heading: RangeCalendarHeading,
    Prev: RangeCalendarPrev,
    Next: RangeCalendarNext,
    Grid: RangeCalendarGrid,
    GridHead: RangeCalendarGridHead,
    GridBody: RangeCalendarGridBody,
    GridRow: RangeCalendarGridRow,
  },
} as const
const SLOT_PREFIXES = { calendar: 'calendar', range: 'range-calendar' } as const satisfies Record<
  CalendarKind,
  string
>
const CHEVRON_PATHS = {
  previous:
    'M10.53 2.97a.75.75 0 0 1 0 1.06L6.56 8l3.97 3.97a.75.75 0 1 1-1.06 1.06l-4.5-4.5a.75.75 0 0 1 0-1.06l4.5-4.5a.75.75 0 0 1 1.06 0',
  next: 'M5.47 2.97a.75.75 0 0 1 1.06 0l4.5 4.5a.75.75 0 0 1 0 1.06l-4.5 4.5a.75.75 0 1 1-1.06-1.06L9.44 8 5.47 4.03a.75.75 0 0 1 0-1.06Z',
} as const

// A root never changes kind
const reka = REKA_PARTS[props.kind]
const prefix = SLOT_PREFIXES[props.kind]

const isWeekOrDayView = computed(() => isDurationView(props.visibleDuration))
const isPagedNavigation = computed(() => props.numberOfMonths > 1 || props.pagedNavigation)
const isMultiselectable = computed(
  () => props.kind === 'range' || props.selection.mode === 'multiple',
)
const weekStartsOn = computed(() => weekStartsOnFromFirstDay(props.firstDayOfWeek))

const rootInstance = useTemplateRef<{ $el: HTMLElement }>('root')
const prevButtonEl = useTemplateRef<HTMLElement>('prevButton')
const nextButtonEl = useTemplateRef<HTMLElement>('nextButton')
const yearPickerGridEl = useTemplateRef<HTMLElement>('yearPickerGrid')
const rootEl = computed(() => rootInstance.value?.$el)
const gridBounds = computed(
  () => props.monthBounds ?? { minValue: props.minValue, maxValue: props.maxValue },
)

const placeholderModel = useCalendarPlaceholder(
  () => props.placeholder,
  props.defaultPlaceholder,
  (value) => emit('update:placeholder', value),
)

const isYearPickerOpen = ref(false)
const focusedYear = computed(() => placeholderModel.value.year)
// React Aria's year picker keeps the focused month/day and only swaps the year
const onSelectYear = (year: number) => {
  placeholderModel.value = placeholderModel.value.set({ year })
  isYearPickerOpen.value = false
}
const {
  activeYear: yearPickerActiveYear,
  onKeyDown: onYearPickerKeyDown,
  selectYear: selectYearPickerYear,
  years: yearPickerYears,
} = useCalendarYearPicker({
  open: isYearPickerOpen,
  focusedYear,
  minValue: computed(() => props.minValue),
  maxValue: computed(() => props.maxValue),
  rootEl,
  gridRef: yearPickerGridEl,
  gridSlot: `${prefix}-grid`,
  onSelect: onSelectYear,
})

const { onKeyDown: onMonthKeyDown, onHeaderClickCapture } = useCalendarMonthKeys({
  placeholder: placeholderModel,
  minValue: () => gridBounds.value.minValue,
  maxValue: () => gridBounds.value.maxValue,
  rootEl: () => rootEl.value,
  numberOfMonths: () => props.numberOfMonths,
  prevButton: () => prevButtonEl.value,
  nextButton: () => nextButtonEl.value,
})

// Week/day views run outside Reka, so the uncontrolled selection is kept here. `focused` is passed as an accessor
// object because the template would unwrap the placeholder ref.
const durationFocus = {
  get value() {
    return placeholderModel.value
  },
  set value(date: DateValue) {
    placeholderModel.value = date
  },
}
const durationValue = shallowRef(props.selection.value ?? props.selection.defaultValue)
const durationCurrentValue = computed(() =>
  props.selection.value !== undefined ? props.selection.value : durationValue.value,
)
const onDurationSelect = (value: TValue) => {
  durationValue.value = value
  emit('select', value)
}

defineExpose({ rootEl, placeholder: placeholderModel })
</script>
