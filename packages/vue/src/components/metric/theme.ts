// Measured: 16px radius; 16px from the title row to the value row and 20px from the value row to the chart (the
// card content gap is 12px); the value is 24px semibold with -0.6px tracking and never shrinks below its own width.
// An inline chart takes the second of two equal columns, 70px high, with the value and the trend stacked in the first
// and aligned to its bottom.
export default {
  slots: {
    base: 'rounded-2xl [&>[data-slot=card-content]]:gap-3',
    list: 'contents',
    header: 'mb-1 flex min-h-5 items-center gap-2',
    icon: 'flex size-8 shrink-0 items-center justify-center rounded-lg bg-default text-foreground [&>svg]:size-4 [&>span]:size-4',
    title: 'min-w-0 truncate text-sm leading-5 font-medium text-muted',
    actions: 'absolute end-2.5 top-2.5',
    actionsIcon: 'size-4',
    content: 'grid grid-cols-[1fr_auto] items-center gap-x-2',
    value:
      'text-2xl leading-8 font-semibold tracking-tight whitespace-nowrap text-foreground tabular-nums',
    trend: '',
    progress: 'col-span-full mt-1',
    // The edge fade masks the chart surface only, so a hover tooltip stays opaque and may overflow the chart area.
    chart:
      'overflow-hidden has-[[data-slot=chart-tooltip-wrapper]]:overflow-visible [&_[data-slot=chart-surface]]:[mask-image:linear-gradient(to_right,transparent_0%,black_var(--metric-chart-fade,10%),black_calc(100%_-_var(--metric-chart-fade,10%)),transparent_100%)]',
    separator: '-mx-4 w-auto',
    footer: '-mb-1 flex min-h-6 items-center gap-2 text-sm',
  },
  variants: {
    chartPlacement: {
      bottom: {
        chart: '-mx-4 mt-2 h-20 last:-mb-4 last:rounded-b-[inherit]',
      },
      inline: {
        content: 'grid-cols-2 items-end gap-y-1',
        value: 'col-start-1',
        trend: 'col-start-1 justify-self-start',
        chart: 'col-start-2 row-span-2 row-start-1 h-[70px] min-w-0',
      },
    },
    status: {
      success: { icon: 'bg-success/10 text-success' },
      warning: { icon: 'bg-warning/10 text-warning' },
      danger: { icon: 'bg-danger/10 text-danger' },
    },
  },
  defaultVariants: {
    chartPlacement: 'bottom',
  },
}
