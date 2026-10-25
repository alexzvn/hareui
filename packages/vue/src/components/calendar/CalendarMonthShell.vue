<template>
  <CalendarDurationView
    v-if="isWeekOrDayView"
    :kind="kind"
    :ui="ui"
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
    ref="rekaRoot"
    v-slot="{ weekDays, grid, locale: resolvedLocale }"
    v-bind="root.bindings"
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
    :class="ui.base()"
    @keydown="onMonthKeyDown"
  >
    <template v-if="numberOfMonths <= 1">
      <header
        :data-slot="`${prefix}-header`"
        role="presentation"
        :class="ui.header()"
        @click.capture="onHeaderClickCapture"
      >
        <button
          v-if="yearPicker"
          type="button"
          data-slot="calendar-year-picker-trigger"
          :data-open="isYearPickerOpen ? 'true' : undefined"
          :aria-expanded="isYearPickerOpen"
          :aria-label="`${formatPanelHeading(resolvedLocale, resolveDisplayedMonth(grid))}, year selector`"
          :class="ui.yearPickerTrigger()"
          @click="isYearPickerOpen = !isYearPickerOpen"
        >
          <component :is="reka.Heading" as-child>
            <span
              data-slot="calendar-year-picker-trigger-heading"
              :class="ui.yearPickerTriggerHeading()"
              >{{ formatPanelHeading(resolvedLocale, resolveDisplayedMonth(grid)) }}</span
            >
          </component>
          <span
            data-slot="calendar-year-picker-trigger-indicator"
            aria-hidden="true"
            :class="ui.yearPickerTriggerIndicator()"
          >
            <CalendarChevronIcon direction="next" size="1em" />
          </span>
        </button>
        <component
          :is="reka.Heading"
          v-else
          :data-slot="`${prefix}-heading`"
          :class="ui.heading()"
          >{{ formatPanelHeading(resolvedLocale, resolveDisplayedMonth(grid)) }}</component
        >
        <component :is="reka.Prev" :data-slot="`${prefix}-nav-button`" as-child>
          <button ref="prevButton" type="button" aria-label="Previous" :class="ui.navButton()">
            <slot name="navIcon" direction="previous">
              <CalendarChevronIcon
                direction="previous"
                :data-slot="`${prefix}-nav-button-icon`"
                :class="ui.navButtonIcon()"
              />
            </slot>
          </button>
        </component>
        <component :is="reka.Next" :data-slot="`${prefix}-nav-button`" as-child>
          <button ref="nextButton" type="button" aria-label="Next" :class="ui.navButton()">
            <slot name="navIcon" direction="next">
              <CalendarChevronIcon
                direction="next"
                :data-slot="`${prefix}-nav-button-icon`"
                :class="ui.navButtonIcon()"
              />
            </slot>
          </button>
        </component>
      </header>
      <CalendarMonthGrid
        :kind="kind"
        :ui="ui"
        :label="
          formatGridLabel(ariaLabel, { locale: resolvedLocale, month: resolveDisplayedMonth(grid) })
        "
        :multiselectable="isMultiselectable"
        :week-days="weekDays"
        :rows="grid[0]?.rows ?? []"
        :month="resolveDisplayedMonth(grid)"
      >
        <template #cell="cell">
          <slot name="monthCell" v-bind="cell" />
        </template>
      </CalendarMonthGrid>
    </template>
    <div v-else data-slot="calendar-panels" :class="ui.panels()">
      <div
        v-for="(month, panelIndex) in grid"
        :key="panelIndex"
        data-slot="calendar-panel"
        :class="ui.panel()"
      >
        <header :data-slot="`${prefix}-header`" role="presentation" :class="ui.header()">
          <component
            v-if="panelIndex === 0"
            :is="reka.Prev"
            :data-slot="`${prefix}-nav-button`"
            as-child
          >
            <button type="button" aria-label="Previous" :class="ui.navButton()">
              <slot name="navIcon" direction="previous">
                <CalendarChevronIcon
                  direction="previous"
                  :data-slot="`${prefix}-nav-button-icon`"
                  :class="ui.navButtonIcon()"
                />
              </slot>
            </button>
          </component>
          <div v-else aria-hidden="true" class="size-6" />
          <span :data-slot="`${prefix}-heading`" :class="ui.heading()">{{
            formatPanelHeading(resolvedLocale, month.value)
          }}</span>
          <component
            v-if="panelIndex === grid.length - 1"
            :is="reka.Next"
            :data-slot="`${prefix}-nav-button`"
            as-child
          >
            <button type="button" aria-label="Next" :class="ui.navButton()">
              <slot name="navIcon" direction="next">
                <CalendarChevronIcon
                  direction="next"
                  :data-slot="`${prefix}-nav-button-icon`"
                  :class="ui.navButtonIcon()"
                />
              </slot>
            </button>
          </component>
          <div v-else aria-hidden="true" class="size-6" />
        </header>
        <CalendarMonthGrid
          :kind="kind"
          :ui="ui"
          :label="formatGridLabel(ariaLabel, { locale: resolvedLocale, month: month.value })"
          :multiselectable="isMultiselectable"
          :week-days="weekDays"
          :rows="month.rows"
          :month="month.value"
        >
          <template #cell="cell">
            <slot name="monthCell" v-bind="cell" />
          </template>
        </CalendarMonthGrid>
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
      :class="ui.yearPickerGrid()"
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
        :class="ui.yearPickerYearCell()"
        @click="selectYearPickerYear(year)"
        @focus="yearPickerActiveYear = year"
      >
        {{ year }}
      </button>
    </div>
  </component>
</template>

<script setup lang="ts" generic="TValue extends CalendarDurationValue">
import type { DateValue } from '@internationalized/date'
import { computed, ref, shallowRef, useTemplateRef } from 'vue'

import { weekStartsOnFromFirstDay } from './calendarBounds'
import CalendarChevronIcon from './CalendarChevronIcon.vue'
import type { CalendarDurationValue } from './CalendarDurationView.types'
import CalendarDurationView from './CalendarDurationView.vue'
import CalendarMonthGrid from './CalendarMonthGrid.vue'
import type {
  CalendarMonthShellEmits,
  CalendarMonthShellProps,
  CalendarMonthShellSlots,
} from './CalendarMonthShell.types'
import { formatGridLabel, formatPanelHeading } from './calendarPanelHeading'
import { REKA_PARTS, SLOT_PREFIXES } from './calendarRekaParts'
import { isDurationView } from './useCalendarDurationView'
import { useCalendarMonthKeys } from './useCalendarMonthKeys'
import { useCalendarPlaceholder } from './useCalendarPlaceholder'
import { useCalendarYearPicker, yearPickerLabel } from './useCalendarYearPicker'

const props = defineProps<CalendarMonthShellProps<TValue>>()
const emit = defineEmits<CalendarMonthShellEmits<TValue>>()
defineSlots<CalendarMonthShellSlots>()

// A root never changes kind
const reka = REKA_PARTS[props.kind]
const prefix = SLOT_PREFIXES[props.kind]

const isWeekOrDayView = computed(() => isDurationView(props.visibleDuration))
const isPagedNavigation = computed(() => props.numberOfMonths > 1 || props.pagedNavigation)
const weekStartsOn = computed(() => weekStartsOnFromFirstDay(props.firstDayOfWeek))

const isMultiselectable = computed(
  () => props.kind === 'range' || props.selection.mode === 'multiple',
)

const gridBounds = computed(
  () => props.monthBounds ?? { minValue: props.minValue, maxValue: props.maxValue },
)

const rootInstance = useTemplateRef<{ $el: HTMLElement }>('rekaRoot')
const prevButtonEl = useTemplateRef<HTMLElement>('prevButton')
const nextButtonEl = useTemplateRef<HTMLElement>('nextButton')
const yearPickerGridEl = useTemplateRef<HTMLElement>('yearPickerGrid')
const rootEl = computed(() => rootInstance.value?.$el)

const placeholderModel = useCalendarPlaceholder({
  placeholder: () => props.placeholder,
  seed: props.defaultPlaceholder,
  onUpdate: (value) => emit('update:placeholder', value),
})

// The single-month heading and grid show the displayed date until Reka builds the first month
const resolveDisplayedMonth = (months: readonly { value: DateValue }[]) => {
  return months[0]?.value ?? placeholderModel.value
}

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

// `focused` is an accessor object because the template would unwrap the placeholder ref
const durationFocus = {
  get value() {
    return placeholderModel.value
  },
  set value(date: DateValue) {
    placeholderModel.value = date
  },
}

// Week/day views run outside Reka, so their uncontrolled selection is kept here
const durationValue = shallowRef(props.selection.value ?? props.selection.defaultValue)

const durationCurrentValue = computed(() => {
  const isControlled = props.selection.value !== undefined

  return isControlled ? props.selection.value : durationValue.value
})

// The week/day view picks a value of the shape `kind` implies, which is the root's `TValue`
const onDurationSelect = (picked: CalendarDurationValue) => {
  const value = picked as TValue
  durationValue.value = value
  emit('select', value)
}

defineExpose({ rootEl, placeholder: placeholderModel })
</script>
