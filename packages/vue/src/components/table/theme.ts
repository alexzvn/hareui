// Maps props to the BEM classes of ./table.css (ported from @heroui/styles components/table.css,
// non-virtualized selectors only).
export default {
  slots: {
    base: 'h-table',
    scrollContainer: 'h-table__scroll-container',
    resizableContainer: 'h-table__resizable-container',
    content: 'h-table__content',
    header: 'h-table__header',
    column: 'h-table__column',
    sortableColumnHeader: 'h-table__sortable-column-header',
    sortableColumnIndicator: 'h-table__sortable-column-indicator',
    body: 'h-table__body',
    row: 'h-table__row',
    cell: 'h-table__cell',
    footer: 'h-table__footer',
    columnResizer: 'h-table__column-resizer',
    loadMore: 'h-table__load-more',
    loadMoreContent: 'h-table__load-more-content',
  },
  variants: {
    variant: {
      primary: { base: 'h-table--primary' },
      secondary: { base: 'h-table--secondary' },
    },
  },
  defaultVariants: {
    variant: 'primary',
  },
}
