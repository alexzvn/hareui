import type { DateValue } from '@internationalized/date'
import type { WritableComputedRef } from 'vue'
import { endOfMonth, parseDate, startOfMonth, toCalendarDate } from '@internationalized/date'
import { nextTick } from 'vue'

/** Day-level comparison that tolerates mixed `CalendarDate`/`CalendarDateTime`/`ZonedDateTime` values. */
export function compareDay(a: DateValue, b: DateValue): number {
  return toCalendarDate(a).compare(toCalendarDate(b))
}

/** The Reka cell trigger an event happened on, when it belongs to this calendar's month grid. */
export function calendarCellFrom(target: EventTarget | null, root: HTMLElement | undefined): HTMLElement | null {
  const el = (target as Element | null)?.closest?.('[data-reka-calendar-cell-trigger]') as HTMLElement | null
  return el && root?.contains(el) ? el : null
}

/** A cell's date (from its ISO `data-value`) in the calendar system and value type of `like`. */
export function calendarCellDate(el: HTMLElement, like: DateValue): DateValue {
  const iso = el.getAttribute('data-value')!.slice(0, 10)
  return like.add({ days: parseDate(iso).compare(toCalendarDate(like)) })
}

export function focusCalendarCell(root: HTMLElement | undefined, date: DateValue) {
  root?.querySelector<HTMLElement>(`[data-reka-calendar-cell-trigger][data-value='${date.toString()}']:not([data-outside-view])`)?.focus()
}

function constrain(date: DateValue, min: DateValue | undefined, max: DateValue | undefined) {
  if (min && compareDay(date, min) < 0)
    return date.add({ days: -compareDay(date, min) })
  if (max && compareDay(date, max) > 0)
    return date.subtract({ days: compareDay(date, max) })
  return date
}

interface UseCalendarMonthKeysOptions {
  placeholder: WritableComputedRef<DateValue>
  minValue: () => DateValue | undefined
  maxValue: () => DateValue | undefined
  rootEl: () => HTMLElement | undefined
  numberOfMonths: () => number
}

/**
 * React Aria's month-grid keys that Reka's cell triggers don't handle (`useCalendarGrid`): Home/End focus the first/
 * last day of the focused month, PageUp/PageDown move the focused date by one month (Shift: one year) keeping the day,
 * constrained to min/max. Reka re-pages its grid when the placeholder leaves the visible months.
 * Also returns the nav-button handler: React Aria's prev/next buttons move the focused date by the visible duration
 * keeping its day of month, where Reka resets it to the 1st.
 */
export function useCalendarMonthKeys(options: UseCalendarMonthKeysOptions) {
  function moveTo(date: DateValue, focus: boolean) {
    const next = constrain(date, options.minValue(), options.maxValue())
    options.placeholder.value = next
    if (focus)
      nextTick(() => focusCalendarCell(options.rootEl(), next))
  }

  function onKeyDown(event: KeyboardEvent) {
    if (event.altKey || event.ctrlKey || event.metaKey)
      return
    const cell = calendarCellFrom(event.target, options.rootEl())
    if (!cell)
      return
    const focused = calendarCellDate(cell, options.placeholder.value)
    let next: DateValue
    switch (event.key) {
      case 'Home':
      case 'End':
        if (event.shiftKey)
          return
        next = event.key === 'Home' ? startOfMonth(focused) : endOfMonth(focused)
        break
      case 'PageUp':
        next = focused.subtract(event.shiftKey ? { years: 1 } : { months: 1 })
        break
      case 'PageDown':
        next = focused.add(event.shiftKey ? { years: 1 } : { months: 1 })
        break
      default:
        return
    }
    event.preventDefault()
    event.stopPropagation()
    moveTo(next, true)
  }

  /**
   * Click handler for the header, in the capture phase so Reka's own nav handler never runs. Single-month view only:
   * with several months Reka's paging (by the visible width) is kept.
   */
  function onHeaderClickCapture(event: MouseEvent, prev: HTMLElement | null | undefined, next: HTMLElement | null | undefined) {
    if (options.numberOfMonths() > 1)
      return
    const target = event.target as Element | null
    const dir = prev?.contains(target) ? -1 : next?.contains(target) ? 1 : 0
    if (!dir || (dir < 0 ? prev : next)!.hasAttribute('disabled'))
      return
    event.stopPropagation()
    moveTo(options.placeholder.value.add({ months: dir }), false)
  }

  return { onKeyDown, onHeaderClickCapture }
}
