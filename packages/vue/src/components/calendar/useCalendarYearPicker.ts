import type { DateValue } from '@internationalized/date'
import type { ComputedRef, Ref, ShallowRef } from 'vue'
import { computed, nextTick, onMounted, onScopeDispose, ref, watch } from 'vue'

export interface UseCalendarYearPickerOptions {
  /** Whether the year grid is open. Mutated directly to close on selection/Escape. */
  open: Ref<boolean>
  /** The year currently shown by the calendar (the placeholder's year). */
  focusedYear: ComputedRef<number>
  minValue: ComputedRef<DateValue>
  maxValue: ComputedRef<DateValue>
  /** The calendar's root DOM element, used to size the overlay to the day grid beneath it. */
  rootEl: ComputedRef<HTMLElement | undefined>
  /** The year grid element (the component's `useTemplateRef`). */
  gridRef: Readonly<ShallowRef<HTMLElement | null>>
  /** `data-slot` of the day grid to measure (`calendar-grid` or `range-calendar-grid`). */
  gridSlot: string
  onSelect: (year: number) => void
}

/**
 * HeroUI's `CalendarYearPickerGrid` is absolutely positioned over the day grid (sized to match it
 * via JS) and supports arrow-key/Home/End navigation across a 3-column grid. Ported behaviourally
 * since Reka has no year-picker primitive (recorded as a reka-limitation).
 */
export function useCalendarYearPicker(options: UseCalendarYearPickerOptions) {
  const { focusedYear, gridRef, gridSlot, maxValue, minValue, onSelect, open, rootEl } = options
  const activeYear = ref(focusedYear.value)
  // The 200 year cells stay out of the mount (so a DatePicker popover opens faster) and are rendered in
  // the first idle period after it, so the year grid's first fade-in doesn't pay for them either.
  // Opening before then renders them synchronously, ahead of the focus-on-open watcher below.
  const everOpened = ref(open.value)
  watch(
    open,
    (isOpen) => {
      if (isOpen) everOpened.value = true
    },
    { flush: 'sync' },
  )
  let cancelIdle: (() => void) | undefined
  onMounted(() => {
    if (everOpened.value) return
    const render = () => (everOpened.value = true)
    if (typeof requestIdleCallback === 'function') {
      const id = requestIdleCallback(render, { timeout: 1000 })
      cancelIdle = () => cancelIdleCallback(id)
    } else {
      const id = setTimeout(render, 200)
      cancelIdle = () => clearTimeout(id)
    }
  })
  onScopeDispose(() => cancelIdle?.())

  const years = computed(() => {
    if (!everOpened.value) return []
    const start = minValue.value.year
    const end = maxValue.value.year
    const list: number[] = []
    for (let y = start; y <= end; y++) list.push(y)
    return list
  })

  function syncPosition() {
    const root = rootEl.value
    const grid = gridRef.value
    if (!root || !grid) return
    const dayGrid = root.querySelector<HTMLElement>(`[data-slot="${gridSlot}"]`)
    if (!dayGrid) return
    grid.style.top = `${dayGrid.offsetTop}px`
    grid.style.height = `${dayGrid.offsetHeight}px`
  }

  function focusYear(year: number) {
    gridRef.value?.querySelector<HTMLElement>(`[data-year="${year}"]`)?.focus()
  }

  watch(open, (isOpen) => {
    if (!isOpen) {
      // The closed grid is aria-hidden and its cells leave the tab order: hand focus back to the trigger
      // (HeroUI leaves it on the hidden year cell)
      if (gridRef.value?.contains(document.activeElement))
        rootEl.value
          ?.querySelector<HTMLElement>('[data-slot="calendar-year-picker-trigger"]')
          ?.focus()
      return
    }
    activeYear.value = years.value.includes(focusedYear.value)
      ? focusedYear.value
      : (years.value[0] ?? focusedYear.value)
    nextTick(() => {
      syncPosition()
      focusYear(activeYear.value)
    })
  })

  // HeroUI sizes the (hidden) year grid on mount and whenever the focused date changes
  onMounted(() => nextTick(syncPosition))
  watch(focusedYear, () => nextTick(syncPosition))

  function selectYear(year: number) {
    activeYear.value = year
    onSelect(year)
  }

  function onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Escape' && open.value) {
      event.preventDefault()
      open.value = false
      return
    }
    if (!open.value || years.value.length === 0) return
    const currentIndex = years.value.indexOf(activeYear.value)
    if (currentIndex === -1) return
    let nextIndex = currentIndex
    switch (event.key) {
      case 'ArrowRight':
        nextIndex = Math.min(currentIndex + 1, years.value.length - 1)
        break
      case 'ArrowLeft':
        nextIndex = Math.max(currentIndex - 1, 0)
        break
      case 'ArrowDown':
        nextIndex = Math.min(currentIndex + 3, years.value.length - 1)
        break
      case 'ArrowUp':
        nextIndex = Math.max(currentIndex - 3, 0)
        break
      case 'Home':
        nextIndex = 0
        break
      case 'End':
        nextIndex = years.value.length - 1
        break
      default:
        return
    }
    if (nextIndex !== currentIndex) {
      event.preventDefault()
      const nextYear = years.value[nextIndex]
      if (nextYear == null) return
      activeYear.value = nextYear
      focusYear(nextYear)
    }
  }

  return { activeYear, onKeyDown, selectYear, years }
}

/** React Aria's `useCalendarYearPicker` label for the year listbox: the locale's name for the year field. */
export function yearPickerLabel(locale: string | undefined): string {
  return new Intl.DisplayNames(locale ?? 'en-US', { type: 'dateTimeField' }).of('year') ?? 'Year'
}
