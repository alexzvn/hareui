import type { DateValue } from '@internationalized/date'
import { DateFormatter, getLocalTimeZone } from '@internationalized/date'

/**
 * Reka's `CalendarHeading`/`RangeCalendarHeading` only expose one combined heading string for
 * every visible month (e.g. "January - February 2025"), unlike React Aria's `Heading` which
 * accepts a per-panel `offset` prop. When `numberOfMonths > 1` each panel needs its own
 * "<Month> <Year>" label, so this formats it directly from that panel's `Grid.value`, using the
 * resolved `locale` exposed on `CalendarRoot`/`RangeCalendarRoot`'s default slot.
 */
export function formatPanelHeading(locale: string | undefined, panelValue: DateValue): string {
  return new DateFormatter(locale ?? 'en-US', { month: 'long', year: 'numeric' }).format(
    panelValue.toDate(getLocalTimeZone()),
  )
}

/** React Aria's `useCalendarGrid` label: the calendar's own `aria-label` followed by the month the grid shows. */
export function formatGridLabel(
  ariaLabel: string | undefined,
  locale: string | undefined,
  panelValue: DateValue,
): string {
  return [ariaLabel, formatPanelHeading(locale, panelValue)].filter(Boolean).join(', ')
}
