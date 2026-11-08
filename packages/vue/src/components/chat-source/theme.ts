// A 20px pill chip with a 14px favicon on a white disc, so dark favicons stay visible on a dark chip; the hover preview is a 320px card
export default {
  slots: {
    base: 'inline-flex h-5 max-w-full items-center align-middle',
    trigger: [
      'inline-flex h-5 max-w-40 items-center gap-1 rounded-full bg-default px-1.5 py-0 text-xs text-muted no-underline no-highlight',
      'transition-colors duration-100 ease-out motion-reduce:transition-none',
      'focus-visible:status-focused',
    ],
    icon: 'size-3.5 shrink-0 rounded-full object-cover',
    favicon: 'size-3.5 shrink-0 rounded-full bg-white object-cover p-px',
    iconFallback:
      'inline-flex size-3.5 shrink-0 items-center justify-center rounded-full bg-muted/20 text-[10px] font-medium text-muted',
    title: 'min-w-0 truncate text-start font-normal',
    preview: 'w-80',
    previewDialog: 'p-1',
    previewLink:
      'flex flex-col gap-1.5 rounded-2xl p-2 no-underline outline-none focus-visible:status-focused',
    previewHeader: 'flex items-center gap-1.5 text-xs text-muted',
    previewDomain: 'truncate',
    previewTitle: 'line-clamp-2 text-sm font-medium text-foreground',
    previewDescription: 'line-clamp-2 text-sm text-muted',
  },
  variants: {
    link: {
      true: {
        trigger: 'cursor-(--cursor-interactive) hover:bg-default-hover hover:text-foreground',
      },
    },
  },
  defaultVariants: {
    link: false,
  },
}
