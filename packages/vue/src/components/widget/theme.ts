export default {
  slots: {
    base: 'flex flex-col overflow-hidden rounded-2xl bg-surface-secondary',
    header: 'mt-0.5 flex min-h-8 items-center justify-between gap-3 px-4',
    title: 'text-sm font-semibold text-foreground',
    description: 'text-xs text-muted',
    legend: 'flex items-center gap-3',
    legendItem: 'flex items-center gap-1.5',
    legendItemDot: 'size-2.5 shrink-0 rounded-full',
    legendItemLabel: 'text-xs text-muted',
    content:
      'mx-1.5 mb-1.5 flex-1 overflow-hidden rounded-xl bg-surface p-4 shadow-surface first:mt-1.5',
    footer: 'flex items-center gap-3 px-4 pt-3 pb-4',
  },
}
