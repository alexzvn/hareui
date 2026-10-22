// Matches the hand-built legends of the chart demos: a row of dots in card headers, a list with values beside pies.
export default {
  slots: {
    base: 'm-0 flex list-none p-0',
    item: 'flex min-w-0 data-[hidden=true]:opacity-40',
    trigger: 'flex min-w-0 flex-1 items-center rounded-sm text-start',
    indicator: 'shrink-0 rounded-full',
    label: 'min-w-0 truncate',
    value: 'font-semibold text-foreground tabular-nums',
    percent: 'text-xs text-muted tabular-nums',
  },
  variants: {
    orientation: {
      horizontal: {
        base: 'flex-row flex-wrap items-center gap-3',
        trigger: 'gap-1.5',
        label: 'text-xs text-muted',
        value: 'text-xs',
      },
      vertical: {
        base: 'flex-col gap-3',
        trigger: 'gap-3',
        label: 'flex-1 text-sm text-foreground',
        value: 'text-sm',
      },
    },
    indicator: {
      dot: { indicator: 'size-3' },
      line: { indicator: 'h-3 w-1' },
    },
    toggleable: {
      true: { trigger: 'cursor-pointer outline-none focus-visible:status-focused' },
    },
  },
  defaultVariants: {
    orientation: 'horizontal',
    indicator: 'dot',
  },
}
