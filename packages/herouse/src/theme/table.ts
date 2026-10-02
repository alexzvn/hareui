// Translated from @heroui/styles components/table.css (non-virtualized selectors only)
export default {
  slots: {
    base: 'relative grid w-full grid-cols-[minmax(0,1fr)] overflow-clip',
    scrollContainer: 'scrollbar overflow-x-auto [scrollbar-gutter:auto]',
    resizableContainer: 'relative scrollbar overflow-auto [scrollbar-gutter:auto]',
    content: 'w-full border-separate border-spacing-0 text-sm',
    header: 'border-b border-separator/50 bg-surface-secondary',
    column: [
      'relative px-4 py-2.5 text-start text-xs font-medium text-muted',
      // '&::after' separator, hidden on the last column and when a resizer replaces it
      'after:pointer-events-none after:absolute after:end-0 after:top-1/2 after:h-4 after:w-px after:-translate-y-1/2 after:rounded-sm after:bg-separator',
      'last:not-only:after:content-none has-data-[slot=table-column-resizer]:after:content-none',
      'data-[allows-sorting=true]:cursor-(--cursor-interactive) data-[allows-sorting=true]:hover:text-foreground',
      'focus-visible:rounded-lg focus-visible:outline-none focus-visible:shadow-[inset_0_0_0_2px_var(--focus)]',
    ],
    sortableColumnHeader: 'flex items-center justify-between',
    sortableColumnIndicator: 'inline-grid size-3 transform place-content-center transition-transform duration-100 ease-out data-[direction=descending]:rotate-180',
    body: '',
    row: [
      'relative h-full border-b border-separator/50 last:border-b-0',
      // Hover/selected backgrounds go on the cells ('.table__row:hover .table__cell')
      'hover:*:bg-surface/40 data-[selected=true]:*:bg-surface/10',
      'aria-disabled:status-disabled data-[disabled=true]:status-disabled',
      // Row focus ring: one continuous inset ring split across the cells
      'focus-visible:outline-none',
      'focus-visible:*:shadow-[inset_0_2px_0_0_var(--focus),inset_0_-2px_0_0_var(--focus)]',
      'focus-visible:*:first:rounded-s-lg focus-visible:*:first:shadow-[inset_2px_0_0_0_var(--focus),inset_0_2px_0_0_var(--focus),inset_0_-2px_0_0_var(--focus)]',
      'focus-visible:*:last:rounded-e-lg focus-visible:*:last:shadow-[inset_-2px_0_0_0_var(--focus),inset_0_2px_0_0_var(--focus),inset_0_-2px_0_0_var(--focus)]',
      'focus-visible:*:only:rounded-lg focus-visible:*:only:shadow-[inset_0_0_0_2px_var(--focus)]',
    ],
    cell: [
      'h-full border-b border-separator-tertiary/50 bg-surface px-4 py-3 align-middle text-sm text-foreground',
      'focus-visible:rounded-lg focus-visible:outline-none focus-visible:shadow-[inset_0_0_0_2px_var(--focus)]',
      // '.table__cell[data-tree-column]'; the row sets '--table-row-level' (1-based)
      'data-tree-column:ps-[calc(1rem*var(--table-row-level,1))]',
    ],
    footer: 'flex items-center px-4 py-2.5',
    columnResizer: [
      'absolute end-0 top-1/2 h-4 w-px -translate-y-1/2 rounded-sm bg-separator',
      'box-content translate-x-1/2 cursor-col-resize touch-none px-2',
      'border-none bg-clip-content outline-none',
      'hover:h-full hover:w-0.5 hover:bg-accent',
      'data-[resizing=true]:h-full data-[resizing=true]:w-0.5 data-[resizing=true]:bg-accent',
      'focus-visible:h-full focus-visible:w-0.5 focus-visible:bg-focus',
    ],
    loadMore: '[&_td]:py-3 [&_td]:text-center [&_td>*]:mx-auto',
    loadMoreContent: 'flex items-center justify-center gap-2 py-2',
  },
  variants: {
    variant: {
      primary: {
        base: 'rounded-[min(32px,calc(var(--radius)*2.5))] bg-surface-secondary px-1 pb-1',
        content: 'overflow-clip',
        // '.table__body tr:first-child td:first-child' etc. (secondary resets these to none)
        body: [
          '[&_tr:first-child_td:first-child]:rounded-ss-[min(32px,var(--radius-2xl))] [&_tr:first-child_td:last-child]:rounded-se-[min(32px,var(--radius-2xl))]',
          '[&_tr:last-child_td:first-child]:rounded-es-[min(32px,var(--radius-2xl))] [&_tr:last-child_td:last-child]:rounded-ee-[min(32px,var(--radius-2xl))]',
        ],
      },
      secondary: {
        header: 'border-b-0 bg-transparent',
        column: 'bg-surface-secondary first:rounded-s-[min(32px,var(--radius-2xl))] last:rounded-e-[min(32px,var(--radius-2xl))]',
        body: 'shadow-none',
        row: 'hover:*:bg-default/50',
        cell: 'bg-transparent',
      },
    },
  },
  defaultVariants: {
    variant: 'primary',
  },
}
