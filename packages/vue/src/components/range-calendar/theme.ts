// Calendar's shell (../calendar/calendar.css) with range day cells. HeroUI's React source (range-calendar.tsx)
// sets `data-slot="range-calendar-cell"` on the OUTER element returned by React Aria's CalendarCell, the one carrying
// ALL of React Aria's state attributes; `data-slot="range-calendar-cell-button"` is a hand-rolled plain `<span>` inside
// it. Reka's RangeCalendarCellTrigger carries that full attribute set, so `cell` maps to it (the outer `<td>` stays
// bare, matching React Aria's plain `<td role="gridcell">`) and `cellButton` is the decorative inner `<span>` added in
// RangeCalendarDay.vue.
import calendarTheme from '@/components/calendar/theme'

export default {
  ...calendarTheme,
  slots: {
    ...calendarTheme.slots,
    base: 'h-calendar h-calendar--range',
    cell: 'h-calendar__range-cell',
    cellButton: 'h-calendar__range-cell-button',
  },
}
