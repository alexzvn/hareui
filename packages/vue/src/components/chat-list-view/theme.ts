// A ListView of chat threads, on the `secondary` (cardless, transparent) rows by default, so the list shows the
// background behind it. A row is a 16px `text-muted` icon, the title (14px medium, one line) over a 12px `text-muted`
// preview (one line, 2px below the title), and 11px `text-muted` meta pushed to the end, 8px clear of the preview. Rows
// are 63px comfortable and 45px compact. `compact` drops the preview and the meta for narrow sidebars. A single
// selection (the open thread) shows as the row tint only; the checkbox appears with `multiple`. On `secondary` rows the
// open thread is neutral grey (`default`), not ListView's blue `accent-soft`, so a sidebar reads like a chat app.
export default {
  slots: {
    base: 'w-full',
    item: '',
    selectionCell: '',
    icon: 'size-4 shrink-0 text-muted',
    text: 'flex min-w-0 flex-1 flex-col',
    title: 'truncate text-sm font-medium text-foreground',
    preview: 'mt-0.5 truncate text-xs text-muted',
    meta: 'ms-auto shrink-0 ps-2 text-[11px] text-muted',
  },
  variants: {
    density: {
      comfortable: {},
      compact: {},
    },
    multiple: {
      true: {},
      false: {
        selectionCell: 'hidden',
      },
    },
    variant: {
      primary: {},
      secondary: {
        item: 'data-[selected=true]:bg-default data-[selected=true]:hover:bg-default-hover',
      },
    },
  },
  defaultVariants: {
    density: 'comfortable',
    multiple: false,
    variant: 'secondary',
  },
}
