// Maps props to the BEM classes of ./rich-table.css: a data grid built on the HeroUI Table (see
// ../table/table.css).
// Single elements (thead, tbody, tfoot, corners) take element modifiers; repeated cells follow the root modifier.
export default {
  slots: {
    root: 'h-rich-table',
    base: 'h-rich-table__content',
    caption: '',
    thead: 'h-rich-table__thead',
    tbody: 'h-rich-table__tbody',
    tfoot: 'h-rich-table__tfoot',
    tr: '',
    th: 'h-rich-table__th',
    td: 'h-rich-table__td',
    dragColumn: 'h-rich-table__drag-column',
    dragColumnLabel: '',
    dragCell: 'h-rich-table__drag-cell',
    dragHandle: 'h-rich-table__drag-handle',
    empty: 'h-rich-table__empty',
    loading: 'h-rich-table__loading',
    // Sticky, zero-height box after the table that carries the bottom corner masks (primary only)
    corners: 'h-rich-table__corners',
  },
  variants: {
    variant: {
      primary: {
        root: 'h-rich-table--primary',
        tbody: 'h-rich-table__tbody--primary',
        corners: 'h-rich-table__corners--masked',
      },
      secondary: {
        root: 'h-rich-table--secondary',
        tbody: 'h-rich-table__tbody--secondary',
      },
    },
    sticky: {
      true: {},
      header: {},
      footer: {},
    },
    loading: {
      true: {
        thead: 'h-rich-table__thead--loading',
      },
    },
    externalScroll: {
      true: { root: 'h-rich-table--external-scroll' },
    },
    loadingAnimation: {
      carousel: '',
      'carousel-inverse': '',
      swing: '',
      elastic: '',
    },
    loadingColor: {
      accent: '',
      success: '',
      warning: '',
      danger: '',
      neutral: '',
    },
  },
  compoundVariants: [
    { variant: 'primary', sticky: true, class: { thead: 'h-rich-table__thead--masked' } },
    { variant: 'primary', sticky: 'header', class: { thead: 'h-rich-table__thead--masked' } },
    { variant: 'primary', sticky: true, class: { tfoot: 'h-rich-table__tfoot--masked' } },
    { variant: 'primary', sticky: 'footer', class: { tfoot: 'h-rich-table__tfoot--masked' } },
    { externalScroll: true, class: { corners: 'h-rich-table__corners--hidden' } },
    {
      loading: true,
      loadingColor: 'accent',
      class: { thead: 'h-rich-table__thead--loading-accent' },
    },
    {
      loading: true,
      loadingColor: 'success',
      class: { thead: 'h-rich-table__thead--loading-success' },
    },
    {
      loading: true,
      loadingColor: 'warning',
      class: { thead: 'h-rich-table__thead--loading-warning' },
    },
    {
      loading: true,
      loadingColor: 'danger',
      class: { thead: 'h-rich-table__thead--loading-danger' },
    },
    {
      loading: true,
      loadingColor: 'neutral',
      class: { thead: 'h-rich-table__thead--loading-neutral' },
    },
    {
      loading: true,
      loadingAnimation: 'carousel',
      class: { thead: 'h-rich-table__thead--loading-carousel' },
    },
    {
      loading: true,
      loadingAnimation: 'carousel-inverse',
      class: { thead: 'h-rich-table__thead--loading-carousel-inverse' },
    },
    {
      loading: true,
      loadingAnimation: 'swing',
      class: { thead: 'h-rich-table__thead--loading-swing' },
    },
    {
      loading: true,
      loadingAnimation: 'elastic',
      class: { thead: 'h-rich-table__thead--loading-elastic' },
    },
  ],
  defaultVariants: {
    variant: 'primary',
    loadingColor: 'accent',
    loadingAnimation: 'carousel',
  },
}
