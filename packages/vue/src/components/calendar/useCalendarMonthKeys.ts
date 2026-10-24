import type { DateValue } from '@internationalized/date'
import type { WritableComputedRef } from 'vue'
import { endOfMonth, startOfMonth } from '@internationalized/date'
import { nextTick } from 'vue'
import { calendarCellDate, calendarCellFrom, compareDay, focusCalendarCell } from './calendarCells'

type UseCalendarMonthKeysOptions = {
  placeholder: WritableComputedRef<DateValue>
  minValue: () => DateValue | undefined
  maxValue: () => DateValue | undefined
  rootEl: () => HTMLElement | undefined
  numberOfMonths: () => number
  prevButton: () => HTMLElement | null
  nextButton: () => HTMLElement | null
}

type MonthKeyMove = (focused: DateValue, isShift: boolean) => DateValue | undefined

// `undefined` leaves the key to Reka (Shift+Home/End)
const MONTH_KEY_MOVES = {
  Home: (focused, isShift) => (isShift ? undefined : startOfMonth(focused)),
  End: (focused, isShift) => (isShift ? undefined : endOfMonth(focused)),
  PageUp: (focused, isShift) => focused.subtract(isShift ? { years: 1 } : { months: 1 }),
  PageDown: (focused, isShift) => focused.add(isShift ? { years: 1 } : { months: 1 }),
} as const satisfies Record<string, MonthKeyMove>

const constrain = (date: DateValue, bounds: { min?: DateValue; max?: DateValue }) => {
  if (bounds.min && compareDay(date, bounds.min) < 0) return date.add({ days: -compareDay(date, bounds.min) })
  if (bounds.max && compareDay(date, bounds.max) > 0) return date.subtract({ days: compareDay(date, bounds.max) })
  return date
}

/**
 * React Aria's month-grid keys that Reka's cell triggers don't handle (`useCalendarGrid`): Home/End focus the first/
 * last day of the focused month, PageUp/PageDown move the focused date by one month (Shift: one year) keeping the day,
 * constrained to min/max. Reka re-pages its grid when the placeholder leaves the visible months.
 * Also returns the nav-button handler: React Aria's prev/next buttons move the focused date by the visible duration
 * keeping its day of month, where Reka resets it to the 1st.
 */
export const useCalendarMonthKeys = (options: UseCalendarMonthKeysOptions) => {
  const moveTo = (date: DateValue, shouldFocus: boolean) => {
    const next = constrain(date, { min: options.minValue(), max: options.maxValue() })
    options.placeholder.value = next
    if (shouldFocus) nextTick(() => focusCalendarCell(options.rootEl(), next))
  }

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.altKey || event.ctrlKey || event.metaKey || !Object.hasOwn(MONTH_KEY_MOVES, event.key)) return
    const cell = calendarCellFrom(event.target, options.rootEl())
    if (!cell) return
    const move: MonthKeyMove = MONTH_KEY_MOVES[event.key as keyof typeof MONTH_KEY_MOVES]
    const next = move(calendarCellDate(cell, options.placeholder.value), event.shiftKey)
    if (!next) return
    event.preventDefault()
    event.stopPropagation()
    moveTo(next, true)
  }

  // +1 for the next button, -1 for the previous one, 0 elsewhere in the header
  const navDirection = (target: Element | null) => {
    if (options.prevButton()?.contains(target)) return -1
    return options.nextButton()?.contains(target) ? 1 : 0
  }

  /**
   * Click handler for the header, in the capture phase so Reka's own nav handler never runs. Single-month view only:
   * with several months Reka's paging (by the visible width) is kept.
   */
  const onHeaderClickCapture = (event: MouseEvent) => {
    if (options.numberOfMonths() > 1) return
    const direction = navDirection(event.target as Element | null)
    const button = direction < 0 ? options.prevButton() : options.nextButton()
    if (!direction || button!.hasAttribute('disabled')) return
    event.stopPropagation()
    moveTo(options.placeholder.value.add({ months: direction }), false)
  }

  return { onKeyDown, onHeaderClickCapture }
}
