// Translated from @heroui/styles components/calendar.css + calendar-year-picker.css.
// Reka's CalendarCellTrigger emits `data-outside-view`/`data-outside-visible-view` where React
// Aria emits `data-outside-month`; selectors below use Reka's attribute names directly (same
// semantic: a day belonging to an adjacent month shown to fill the grid).
// State variants use `[&:where([data-…])]:` (zero added specificity) so a consumer's plain
// `data-[selected]:…` override always wins over the theme regardless of class order.
export default {
  slots: {
    base: '[container-type:inline-size] w-63 max-w-63',
    // Multi-month layout (`numberOfMonths > 1`), translated from the HeroUI docs'
    // multiple-months demo markup (free composition in React, baked in here for Option A).
    panels: 'mx-auto flex w-max gap-8',
    panel: 'w-64',
    header: [
      'flex items-center justify-between px-0.5 pb-4',
      'has-[[data-slot=calendar-year-picker-trigger][data-open=true]]:[&_[data-slot=calendar-nav-button]]:pointer-events-none',
      'has-[[data-slot=calendar-year-picker-trigger][data-open=true]]:[&_[data-slot=calendar-nav-button]]:opacity-0',
    ],
    heading: 'flex-1 text-sm font-medium',
    navButton: [
      'flex size-6 items-center justify-center rounded-2xl text-accent-soft-foreground',
      'transform-gpu motion-reduce:transition-none',
      '[transition:transform_250ms_var(--ease-out),background-color_100ms_var(--ease-out),box-shadow_100ms_var(--ease-out),opacity_150ms_var(--ease-out)]',
      'cursor-(--cursor-interactive)',
      'hover:bg-default hover:text-accent-soft-foreground',
      'active:[transform:scale(0.95)]',
      'focus-visible:status-focused',
      'disabled:status-disabled aria-disabled:status-disabled [&:where([data-disabled])]:status-disabled',
    ],
    navButtonIcon: 'size-4 rtl:rotate-180',
    grid: 'grid w-full grid-cols-7 aria-readonly:[&_[data-slot=calendar-cell]]:pointer-events-none',
    gridHeader: 'contents [&>tr]:contents',
    gridBody: 'contents [&>tr]:contents [&>tr:first-child>td]:mt-1',
    gridRow: 'contents',
    headerCell: 'flex items-center justify-center pb-2 text-xs font-medium text-muted',
    cell: [
      'relative flex aspect-square size-full items-center justify-center rounded-3xl text-center text-sm font-medium outline-none no-highlight',
      'transform-gpu motion-reduce:transition-none [transition:transform_250ms_var(--ease-out),box-shadow_100ms_var(--ease-out)]',
      'cursor-(--cursor-interactive)',
      '[&:where(:focus-visible:not([data-selected]))]:status-focused',
      '[&:where([data-today]:not([data-selected]),[data-today]:is([data-disabled],:disabled))]:bg-accent-soft [&:where([data-today]:not([data-selected]),[data-today]:is([data-disabled],:disabled))]:text-accent-soft-foreground',
      '[&:where([data-today]:hover:not([data-selected]))]:bg-accent-soft-hover',
      '[&:where([data-selected]:not(:is([data-disabled],:disabled)))]:bg-accent [&:where([data-selected]:not(:is([data-disabled],:disabled)))]:text-accent-foreground',
      'active:bg-default active:[transform:scale(0.95)] [&:where([data-selected]:active)]:bg-accent-hover',
      '[&:where(:hover:not([data-selected]))]:bg-default',
      '[&:where([data-outside-view])]:text-muted [&:where([data-outside-view])]:opacity-50',
      '[&:where([data-selected][data-outside-view])]:bg-default',
      '[&:where([data-unavailable])]:status-disabled',
      '[&:where(:disabled:not([data-outside-view]))]:status-disabled [&:where(:disabled:not([data-outside-view]))]:line-through',
      '[&:where([data-disabled]:not([data-outside-view]))]:status-disabled [&:where([data-disabled]:not([data-outside-view]))]:line-through',
    ],
    cellIndicator: 'absolute bottom-1 left-1/2 size-[3px] -translate-x-1/2 rounded-xs bg-muted in-data-selected:bg-accent-foreground',

    // Internal year-picker part (calendar-year-picker__*), swapped in for the plain heading.
    yearPickerTrigger: [
      'flex flex-1 items-center justify-start gap-1 rounded-lg outline-none',
      'cursor-(--cursor-interactive) touch-manipulation',
      'focus-visible:status-focused',
    ],
    yearPickerTriggerHeading: [
      'text-sm font-medium',
      '[transition:color_150ms_var(--ease-out)] motion-reduce:transition-none',
      'in-data-[open=true]:text-accent-soft-foreground',
    ],
    yearPickerTriggerIndicator: [
      'text-xs text-accent-soft-foreground rtl:[transform:rotate(180deg)]',
      '[transition:transform_150ms_var(--ease-out)] motion-reduce:transition-none',
      'in-data-[open=true]:[transform:rotate(90deg)]',
    ],
    yearPickerGrid: [
      'pointer-events-none absolute start-0 end-0 grid scrollbar content-start gap-1 overflow-y-auto p-1 opacity-0',
      '[grid-template-columns:repeat(3,1fr)]',
      '[&:where([data-open=true])]:pointer-events-auto [&:where([data-open=true])]:opacity-100',
      '[&:where([data-open=true])]:[transition:opacity_200ms_var(--ease-out)_50ms] motion-reduce:[&:where([data-open=true])]:transition-none',
    ],
    yearPickerYearCell: [
      'relative inline-flex h-8 items-center justify-center rounded-3xl px-2.5 text-sm font-medium outline-none select-none no-highlight touch-manipulation',
      'origin-center transform-gpu motion-reduce:transition-none',
      '[transition:color_100ms_var(--ease-smooth),scale_100ms_var(--ease-smooth),opacity_100ms_var(--ease-smooth),background-color_100ms_var(--ease-smooth),box-shadow_100ms_var(--ease-out)]',
      'cursor-(--cursor-interactive)',
      '[&:where(:hover:not([data-selected]))]:bg-default [&:where(:hover:not([data-selected]))]:text-default-foreground',
      '[&:where([data-selected])]:bg-accent [&:where([data-selected])]:text-accent-foreground [&:where([data-selected]:hover)]:bg-accent-hover',
      'focus-visible:status-focused',
    ],
  },
}
