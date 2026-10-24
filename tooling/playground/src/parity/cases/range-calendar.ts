import type { DateValue } from '@internationalized/date'
import type { VNode } from 'vue'
import { isWeekend, parseDate } from '@internationalized/date'
import { RangeCalendar } from '@hareui/vue'
import { defineComponent, h, nextTick, onMounted, ref } from 'vue'

export const cases: Record<string, () => VNode> = {}

// January 2025 never contains "today", so the grid is deterministic.
const focused = parseDate('2025-01-15')
const base = { ariaLabel: 'Event dates', defaultPlaceholder: focused }

cases['range-calendar-basic'] = () => h(RangeCalendar, base)
cases['range-calendar-selected'] = () => h(RangeCalendar, { ...base, defaultValue: { start: parseDate('2025-01-10'), end: parseDate('2025-01-15') } })
cases['range-calendar-disabled'] = () => h(RangeCalendar, { ...base, disabled: true })
cases['range-calendar-read-only'] = () => h(RangeCalendar, { ...base, readonly: true, defaultValue: { start: parseDate('2025-01-10'), end: parseDate('2025-01-15') } })
cases['range-calendar-unavailable'] = () => h(RangeCalendar, { ...base, isDateUnavailable: (date: DateValue) => isWeekend(date, 'en-US') })
cases['range-calendar-min-max'] = () => h(RangeCalendar, { ...base, minValue: parseDate('2025-01-10'), maxValue: parseDate('2025-01-20') })
cases['range-calendar-indicator'] = () => h(RangeCalendar, { ...base, defaultValue: { start: parseDate('2025-01-10'), end: parseDate('2025-01-15') }, indicator: (date: DateValue) => [3, 15, 22].includes(date.day) })
cases['range-calendar-non-contiguous'] = () => h(RangeCalendar, { ...base, defaultValue: { start: parseDate('2025-01-10'), end: parseDate('2025-01-18') }, isDateUnavailable: (date: DateValue) => isWeekend(date, 'en-US'), allowNonContiguousRanges: true })

// Week view / day view (visibleDuration). Jan 2025 never contains "today".
cases['range-calendar-week-view'] = () => h(RangeCalendar, { ...base, visibleDuration: { weeks: 2 }, defaultValue: { start: parseDate('2025-01-14'), end: parseDate('2025-01-21') } })
cases['range-calendar-day-view'] = () => h(RangeCalendar, { ...base, visibleDuration: { days: 5 }, defaultValue: { start: parseDate('2025-01-14'), end: parseDate('2025-01-16') } })
cases['range-calendar-day-view-long'] = () => h(RangeCalendar, { ...base, visibleDuration: { days: 10 }, defaultValue: { start: parseDate('2025-01-14'), end: parseDate('2025-01-17') } })

// Anchor-dependent unavailable dates (decision #12): the case clicks Jan 10 on mount to anchor a range
// (compare.ts has no click action); dates more than 7 days from the anchor become unavailable.
cases['range-calendar-anchor-unavailable'] = () => h(defineComponent({
  setup() {
    const root = ref<{ $el: HTMLElement }>()
    onMounted(() => nextTick(() => {
      const cell = root.value?.$el.querySelector<HTMLElement>('[data-value="2025-01-10"]')
      cell?.click()
      // RAC focuses the pressed cell (focus-visible after a virtual click); Reka doesn't move focus on click
      cell?.focus()
    }))
    return () => h(RangeCalendar, {
      ref: root,
      ...base,
      minValue: parseDate('2025-01-01'),
      isDateUnavailable: (date: DateValue, anchor: DateValue | null) => anchor != null && Math.abs(date.compare(anchor)) > 7,
    })
  },
}))
