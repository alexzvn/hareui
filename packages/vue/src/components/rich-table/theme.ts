// RichTable slots, styled as a data grid (built on the HeroUI Table: see components/table/theme.ts).
// Body-row styles live on `tbody` and target `[data-slot=rich-table-row]`, so header, footer and expanded rows (which share the `tr` slot) stay plain.
export default {
  slots: {
    root: 'relative scrollbar overflow-auto outline-none focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-focus',
    base: 'min-w-full overflow-clip border-separate border-spacing-0 text-sm',
    caption: 'sr-only',
    thead: 'relative',
    tbody: [
      'isolate',
      '[&>[data-slot=rich-table-row]]:relative [&>[data-slot=rich-table-row]]:outline-none',
      '[&>[data-slot=rich-table-row]]:data-[selectable=true]:cursor-(--cursor-interactive)',
      // Hover/selected backgrounds go on the cells, like HeroUI's '.table__row:hover .table__cell'
      '[&>[data-slot=rich-table-row]]:hover:*:bg-surface/40 [&>[data-slot=rich-table-row]]:data-[selected=true]:*:bg-surface/10',
      // Pinned cells stay opaque so the cells scrolling underneath never show through: mix the translucent tint into the header colour instead
      '[&>[data-slot=rich-table-row]]:hover:*:data-pinned:bg-[color-mix(in_oklch,var(--surface)_40%,var(--surface-secondary))]',
      '[&>[data-slot=rich-table-row]]:data-[selected=true]:*:data-pinned:bg-[color-mix(in_oklch,var(--surface)_10%,var(--surface-secondary))]',
      // Row focus ring: one continuous inset ring split across the cells
      '[&>[data-slot=rich-table-row]]:focus-visible:*:shadow-[inset_0_2px_0_0_var(--focus),inset_0_-2px_0_0_var(--focus)]',
      '[&>[data-slot=rich-table-row]]:focus-visible:*:first:rounded-s-lg [&>[data-slot=rich-table-row]]:focus-visible:*:first:shadow-[inset_2px_0_0_0_var(--focus),inset_0_2px_0_0_var(--focus),inset_0_-2px_0_0_var(--focus)]',
      '[&>[data-slot=rich-table-row]]:focus-visible:*:last:rounded-e-lg [&>[data-slot=rich-table-row]]:focus-visible:*:last:shadow-[inset_-2px_0_0_0_var(--focus),inset_0_2px_0_0_var(--focus),inset_0_-2px_0_0_var(--focus)]',
      '[&>[data-slot=rich-table-row]]:focus-visible:*:only:rounded-lg [&>[data-slot=rich-table-row]]:focus-visible:*:only:shadow-[inset_0_0_0_2px_var(--focus)]',
      '[&>[data-slot=rich-table-row]]:aria-disabled:status-disabled',
      // The body card ends with its last row, so it carries no separator
      '[&>tr:last-child>td]:border-b-0',
    ],
    tfoot: 'relative',
    tr: '',
    th: [
      'relative px-4 py-2.5 text-start text-xs font-medium whitespace-nowrap text-muted bg-surface-secondary',
      // Pill separator between columns, hidden after the last one, after blank (e.g. expand) and selection columns, on columns with a resize handle
      // (the handle is the separator) and on pinned columns (whose facing edge gets a full-height line once content scrolls under it)
      "not-last:after:pointer-events-none not-last:after:absolute not-last:after:end-0 not-last:after:top-1/2 not-last:after:h-4 not-last:after:w-px not-last:after:-translate-y-1/2 not-last:after:rounded-sm not-last:after:bg-separator not-last:after:content-['']",
      'empty:after:content-none! [&:has([role=checkbox])]:w-10 [&:has([role=checkbox])]:pe-0 [&:has([role=checkbox])]:after:content-none [&:has([role=separator])]:after:content-none data-pinned:after:content-none!',
      // Pinned columns: `data-pinned` is `left` | `right` (TanStack pins to physical sides), `data-edge` marks the edge facing the scrolling columns while content is scrolled under it.
      'data-pinned:sticky data-pinned:z-2 data-[pinned=left]:left-(--rich-table-pin) data-[pinned=right]:right-(--rich-table-pin)',
      'data-[edge=left]:shadow-[inset_-1px_0_0_0_var(--separator)] data-[edge=right]:shadow-[inset_1px_0_0_0_var(--separator)]',
    ],
    td: [
      'border-b border-separator-tertiary/50 bg-surface px-4 py-3 align-middle text-sm whitespace-nowrap text-foreground',
      '[&:has([role=checkbox])]:w-10 [&:has([role=checkbox])]:pe-0',
      'data-pinned:sticky data-pinned:z-2 data-[pinned=left]:left-(--rich-table-pin) data-[pinned=right]:right-(--rich-table-pin)',
      'data-[edge=left]:shadow-[inset_-1px_0_0_0_var(--separator)] data-[edge=right]:shadow-[inset_1px_0_0_0_var(--separator)]',
    ],
    empty: 'py-12 text-center text-sm text-muted',
    loading: 'py-12 text-center',
  },
  variants: {
    variant: {
      primary: {
        // The gutter around the body card is a transparent border rather than padding: it sits outside the scrollport, so
        // rows scrolling under the sticky footer or the pinned columns never show through it, and sticky cells rest on its inner edge.
        root: 'rounded-[min(32px,calc(var(--radius)*2.5))] border-x-4 border-t-0 border-b-4 border-transparent bg-surface-secondary',
        // '.table__body tr:first-child td:first-child' etc.
        tbody: [
          '[&_tr:first-child_td:first-child]:rounded-ss-[min(32px,var(--radius-2xl))] [&_tr:first-child_td:last-child]:rounded-se-[min(32px,var(--radius-2xl))]',
          '[&_tr:last-child_td:first-child]:rounded-es-[min(32px,var(--radius-2xl))] [&_tr:last-child_td:last-child]:rounded-ee-[min(32px,var(--radius-2xl))]',
          // A corner cell that is also the pinned edge goes square while content scrolls under it, so nothing shows through its rounded corner
          '[&_tr:first-child_td:first-child[data-edge=left]]:rounded-none [&_tr:last-child_td:first-child[data-edge=left]]:rounded-none',
          '[&_tr:first-child_td:last-child[data-edge=right]]:rounded-none [&_tr:last-child_td:last-child[data-edge=right]]:rounded-none',
        ],
      },
      secondary: {
        th: 'bg-surface-secondary first:rounded-s-[min(32px,var(--radius-2xl))] last:rounded-e-[min(32px,var(--radius-2xl))]',
        td: 'bg-transparent data-pinned:bg-background',
        tbody: '[&>[data-slot=rich-table-row]]:hover:*:bg-default/50',
      },
    },
    sticky: {
      true: {
        thead: 'sticky top-0 inset-x-0 z-3',
        tfoot: 'sticky bottom-0 inset-x-0 z-3',
      },
      header: {
        thead: 'sticky top-0 inset-x-0 z-3',
      },
      footer: {
        tfoot: 'sticky bottom-0 inset-x-0 z-3',
      },
    },
    loading: {
      true: {
        thead: "after:absolute after:start-0 after:bottom-0 after:z-3 after:h-0.5 after:w-1/2 after:content-[''] motion-reduce:after:inset-x-0 motion-reduce:after:w-full motion-reduce:after:animate-pulse",
      },
    },
    externalScroll: {
      true: {
        root: 'overflow-visible',
      },
    },
    loadingAnimation: {
      'carousel': '',
      'carousel-inverse': '',
      'swing': '',
      'elastic': '',
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
    { loading: true, loadingColor: 'accent', class: { thead: 'after:bg-accent' } },
    { loading: true, loadingColor: 'success', class: { thead: 'after:bg-success' } },
    { loading: true, loadingColor: 'warning', class: { thead: 'after:bg-warning' } },
    { loading: true, loadingColor: 'danger', class: { thead: 'after:bg-danger' } },
    { loading: true, loadingColor: 'neutral', class: { thead: 'after:bg-foreground' } },
    {
      loading: true,
      loadingAnimation: 'carousel',
      class: { thead: 'motion-safe:after:animate-rich-table-carousel motion-safe:rtl:after:animate-rich-table-carousel-rtl' },
    },
    {
      loading: true,
      loadingAnimation: 'carousel-inverse',
      class: { thead: 'motion-safe:after:animate-rich-table-carousel-inverse motion-safe:rtl:after:animate-rich-table-carousel-inverse-rtl' },
    },
    {
      loading: true,
      loadingAnimation: 'swing',
      class: { thead: 'motion-safe:after:animate-rich-table-swing' },
    },
    {
      loading: true,
      loadingAnimation: 'elastic',
      class: { thead: 'motion-safe:after:animate-rich-table-elastic' },
    },
  ],
  defaultVariants: {
    variant: 'primary',
    loadingColor: 'accent',
    loadingAnimation: 'carousel',
  },
}
