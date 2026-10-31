// Rows are 12px × 16px padded with a 12px gap and 14px text; the label is 14px/20px medium, the description 12px/16px
// `text-muted` 2px below it, and icons are 16px `text-muted`. Rows are divided by `separator-tertiary` at 50%, except
// the last. Keyboard focus draws a 2px inset `focus` ring; disabled rows are faded and ignore the pointer.
// - primary: a `surface-secondary` wrapper (4px padding, radius × 2.5 = 20px) around `surface` rows, the first and last
//   rounded 16px. Hover: `surface` at 40%; selected: `surface` at 10%, so the wrapper shows through.
// - secondary: no wrapper, transparent rows. Hover: `default` at 50%; selected: `accent-soft` (`accent-soft-hover`
//   while hovered).
export default {
  slots: {
    base: 'relative min-h-0 w-full outline-none data-[virtualized=true]:overflow-y-auto',
    item: [
      'relative flex w-full items-center gap-3 px-4 py-3 text-start text-sm text-foreground outline-none select-none no-highlight',
      'cursor-(--cursor-interactive)',
      'border-b border-separator-tertiary/50 data-[last=true]:border-b-0',
      'focus-visible:shadow-[inset_0_0_0_2px_var(--color-focus)]',
      'aria-disabled:status-disabled',
    ],
    selectionCell: 'flex shrink-0 items-center',
    content: 'flex min-w-0 flex-1 items-center gap-3',
    icon: 'size-4 shrink-0 text-muted',
    text: 'flex min-w-0 flex-col',
    label: 'truncate text-sm font-medium text-foreground',
    description: 'mt-0.5 truncate text-xs text-muted',
    action: 'ms-auto shrink-0 ps-2',
    emptyState: 'flex items-center justify-center px-4 py-8 text-sm text-muted',
  },
  variants: {
    variant: {
      primary: {
        base: 'rounded-[calc(var(--radius)*2.5)] bg-surface-secondary p-1',
        item: [
          'bg-surface data-[first=true]:rounded-t-2xl data-[last=true]:rounded-b-2xl',
          'hover:bg-surface/40 data-[selected=true]:bg-surface/10',
        ],
      },
      secondary: {
        item: [
          'bg-transparent hover:bg-default/50',
          'data-[selected=true]:bg-accent-soft data-[selected=true]:hover:bg-accent-soft-hover',
        ],
      },
    },
  },
  defaultVariants: {
    variant: 'primary',
  },
}
