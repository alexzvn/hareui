// Translated from @heroui/styles components/range-calendar.css + calendar-year-picker.css.
// HeroUI's React source (range-calendar.tsx) sets `data-slot="range-calendar-cell"` on the
// OUTER element returned by React Aria's CalendarCell — the one carrying ALL of React Aria's
// own state attributes (data-today/data-selected/data-selection-start/data-selection-end/
// data-outside-month/data-unavailable/data-disabled/data-hovered/data-pressed/data-focused).
// `data-slot="range-calendar-cell-button"` is a hand-rolled plain `<span>` *inside* that cell,
// carrying only a narrow hand-duplicated subset. Reka's CalendarRangeCellTrigger mirrors the
// OUTER role (it carries the full attribute set React Aria puts on the outer cell) — so here
// `cell` maps to Reka's RangeCalendarCellTrigger (not the outer `<td>`, which stays bare,
// matching React Aria's plain `<td role="gridcell">`) and `cellButton` is a new, purely
// decorative inner `<span>` added in RangeCalendar.vue to mirror HeroUI's hand-rolled span.
// Reka emits `data-outside-view` where React Aria emits `data-outside-month` (same semantic:
// adjacent-month day shown to fill the grid).
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
      'has-[[data-slot=calendar-year-picker-trigger][data-open=true]]:[&_[data-slot=range-calendar-nav-button]]:pointer-events-none',
      'has-[[data-slot=calendar-year-picker-trigger][data-open=true]]:[&_[data-slot=range-calendar-nav-button]]:opacity-0',
    ],
    heading: 'flex-1 text-sm font-medium',
    navButton: [
      'flex size-6 items-center justify-center rounded-xl text-accent-soft-foreground',
      'transform-gpu motion-reduce:transition-none',
      '[transition:transform_250ms_var(--ease-out),background-color_100ms_var(--ease-out),box-shadow_100ms_var(--ease-out),opacity_150ms_var(--ease-out)]',
      'cursor-(--cursor-interactive)',
      'hover:bg-default hover:text-accent-soft-foreground',
      'active:[transform:scale(0.95)]',
      'focus-visible:status-focused',
      'disabled:status-disabled aria-disabled:status-disabled [&:where([data-disabled])]:status-disabled',
    ],
    navButtonIcon: 'size-4 rtl:rotate-180',
    grid: 'grid w-full grid-cols-7 aria-readonly:[&_[data-slot=range-calendar-cell]]:pointer-events-none',
    gridHeader: 'contents [&>tr]:contents',
    gridBody: 'contents [&>tr]:contents [&>tr:first-child>td]:mt-1',
    gridRow: 'contents',
    headerCell: 'flex items-center justify-center pb-2 text-xs font-medium text-muted',
    cell: [
      'relative z-1 mx-0 my-0.5 rounded-3xl p-0 outline-none',
      'cursor-(--cursor-interactive)',
      'transform-gpu motion-reduce:transition-none [transition:box-shadow_100ms_var(--ease-out),border-color_100ms_var(--ease-out)]',
      // Focus
      '[&:where(:focus-visible:not([data-focused]))]:z-2 [&:where([data-focus-visible=true])]:z-2',
      '[&:where(:focus-visible:not([data-focused]))]:[&_[data-slot=range-calendar-cell-button]]:status-focused',
      '[&:where([data-focus-visible=true])]:[&_[data-slot=range-calendar-cell-button]]:status-focused',
      // Today
      '[&:where([data-today]:not([data-selected]),[data-today]:is([data-disabled],:disabled))]:[&_[data-slot=range-calendar-cell-button]]:bg-accent-soft [&:where([data-today]:not([data-selected]),[data-today]:is([data-disabled],:disabled))]:[&_[data-slot=range-calendar-cell-button]]:text-accent-soft-foreground',
      '[&:where([data-today]:hover:not([data-selected]))]:[&_[data-slot=range-calendar-cell-button]]:bg-accent-soft-hover',
      // Range track (middle segment) background; corner radii below are mutually exclusive
      // per side (selection cap > row boundary > plain track) so cascade order never matters.
      '[&:where([data-selected]:not([data-outside-view]):not(:is([data-disabled],:disabled)))]:bg-accent-soft',
      // Left corners (start side)
      '[&:where([data-selection-start]:not([data-outside-view]))]:rounded-ss-3xl [&:where([data-selection-start]:not([data-outside-view]))]:rounded-es-3xl',
      '[&:where([data-selected]:not([data-selection-start]):is(td:first-child>*,[aria-disabled=true]+td>*))]:rounded-ss-lg [&:where([data-selected]:not([data-selection-start]):is(td:first-child>*,[aria-disabled=true]+td>*))]:rounded-es-lg',
      '[&:where([data-selected]:not([data-outside-view]):not([data-selection-start]):not(:is(td:first-child>*,[aria-disabled=true]+td>*)))]:rounded-ss-none [&:where([data-selected]:not([data-outside-view]):not([data-selection-start]):not(:is(td:first-child>*,[aria-disabled=true]+td>*)))]:rounded-es-none',
      // Right corners (end side)
      '[&:where([data-selection-end]:not([data-outside-view]))]:rounded-se-3xl [&:where([data-selection-end]:not([data-outside-view]))]:rounded-ee-3xl',
      '[&:where([data-selected]:not([data-selection-end]):is(td:last-child>*,td:has(+[aria-disabled=true])>*))]:rounded-se-lg [&:where([data-selected]:not([data-selection-end]):is(td:last-child>*,td:has(+[aria-disabled=true])>*))]:rounded-ee-lg',
      '[&:where([data-selected]:not([data-outside-view]):not([data-selection-end]):not(:is(td:last-child>*,td:has(+[aria-disabled=true])>*)))]:rounded-se-none [&:where([data-selected]:not([data-outside-view]):not([data-selection-end]):not(:is(td:last-child>*,td:has(+[aria-disabled=true])>*)))]:rounded-ee-none',
      // Range caps: raise stacking + color the inner button
      '[&:where([data-selection-start]:not([data-outside-view]))]:z-2 [&:where([data-selection-end]:not([data-outside-view]))]:z-2',
      '[&:where([data-selection-start]:not([data-outside-view]):not(:is([data-disabled],:disabled)))]:[&_[data-slot=range-calendar-cell-button]]:bg-accent [&:where([data-selection-start]:not([data-outside-view]):not(:is([data-disabled],:disabled)))]:[&_[data-slot=range-calendar-cell-button]]:text-accent-foreground',
      '[&:where([data-selection-end]:not([data-outside-view]):not(:is([data-disabled],:disabled)))]:[&_[data-slot=range-calendar-cell-button]]:bg-accent [&:where([data-selection-end]:not([data-outside-view]):not(:is([data-disabled],:disabled)))]:[&_[data-slot=range-calendar-cell-button]]:text-accent-foreground',
      // Pressed
      'active:[&_[data-slot=range-calendar-cell-button]]:[scale:0.9]',
      '[&:where(:active[data-selection-start])]:[&_[data-slot=range-calendar-cell-button]]:bg-accent-hover [&:where(:active[data-selection-end])]:[&_[data-slot=range-calendar-cell-button]]:bg-accent-hover',
      // Hover (non-selected only)
      '[&:where(:hover:not([data-selected]))]:[&_[data-slot=range-calendar-cell-button]]:bg-default',
      // Outside current month
      '[&:where([data-outside-view])]:text-muted [&:where([data-outside-view])]:opacity-50',
      '[&:where([data-selected][data-outside-view]:not([data-selection-start]):not([data-selection-end]))]:bg-default/20',
      // Unavailable / disabled
      '[&:where([data-unavailable])]:status-disabled',
      '[&:where(:disabled:not([data-outside-view]))]:status-disabled [&:where(:disabled:not([data-outside-view]))]:line-through',
      '[&:where([data-disabled]:not([data-outside-view]))]:status-disabled [&:where([data-disabled]:not([data-outside-view]))]:line-through',
    ],
    cellButton: 'flex aspect-square w-full items-center justify-center rounded-3xl text-sm font-medium text-foreground no-highlight transform-gpu motion-reduce:transition-none [transition:scale_200ms_var(--ease-out)]',
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
