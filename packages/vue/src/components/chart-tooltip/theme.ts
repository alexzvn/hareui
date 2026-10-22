// Measured from the chart tooltip styles (.chart-tooltip*)
export default {
  slots: {
    base: 'flex min-w-[140px] flex-col gap-1.5 rounded-(--radius) border border-separator bg-overlay px-3 py-2 tabular-nums shadow-overlay',
    header: 'text-xs font-medium text-muted',
    item: 'flex items-center gap-2',
    indicator: 'shrink-0 rounded-full',
    label: 'flex-1 text-xs text-muted',
    value: 'text-xs font-semibold text-foreground',
  },
  variants: {
    indicator: {
      dot: { indicator: 'size-2' },
      line: { indicator: 'h-3 w-1' },
    },
  },
  defaultVariants: {
    indicator: 'dot',
  },
}
