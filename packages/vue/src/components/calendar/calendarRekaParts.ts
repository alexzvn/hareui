import {
  CalendarGrid,
  CalendarGridBody,
  CalendarGridHead,
  CalendarGridRow,
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
import type { Component } from 'vue'

import type { CalendarKind } from './CalendarMonthShell.types'

type RekaPart = 'Root' | 'Heading' | 'Prev' | 'Next' | 'Grid' | 'GridHead' | 'GridBody' | 'GridRow'

/** Each kind's Reka part family. Reka's parts read their root's context, so a kind never mixes families. */
export const REKA_PARTS: Record<CalendarKind, Record<RekaPart, Component>> = {
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
}

/** Each kind's `data-slot` prefix. */
export const SLOT_PREFIXES = {
  calendar: 'calendar',
  range: 'range-calendar',
} as const satisfies Record<CalendarKind, string>
