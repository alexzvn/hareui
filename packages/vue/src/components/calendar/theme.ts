// Maps slots to the BEM classes of ./calendar.css (ported from @heroui/styles components/calendar.css
// and calendar-year-picker.css).
// RangeCalendar's theme reuses this shell.
export default {
  slots: {
    base: 'h-calendar',
    // Multi-month layout (`numberOfMonths > 1`)
    panels: 'h-calendar__panels',
    panel: 'h-calendar__panel',
    header: 'h-calendar__header',
    heading: 'h-calendar__heading',
    navButton: 'h-calendar__nav-button',
    navButtonIcon: 'h-calendar__nav-button-icon',
    grid: 'h-calendar__grid',
    gridHeader: 'h-calendar__grid-header',
    gridBody: 'h-calendar__grid-body',
    gridRow: 'h-calendar__grid-row',
    headerCell: 'h-calendar__header-cell',
    cell: 'h-calendar__cell',
    cellIndicator: 'h-calendar__cell-indicator',
    // Internal year-picker part, swapped in for the plain heading
    yearPickerTrigger: 'h-calendar-year-picker__trigger',
    yearPickerTriggerHeading: 'h-calendar-year-picker__trigger-heading',
    yearPickerTriggerIndicator: 'h-calendar-year-picker__trigger-indicator',
    yearPickerGrid: 'h-calendar-year-picker__grid',
    yearPickerYearCell: 'h-calendar-year-picker__year-cell',
  },
  // `visibleDuration` week/day views, rendered by the custom grid in the component (Reka only builds month grids)
  variants: {
    view: {
      month: {},
      week: { base: 'h-calendar--week-view' },
      day: { base: 'h-calendar--day-view' },
    },
  },
  defaultVariants: {
    view: 'month',
  },
}
