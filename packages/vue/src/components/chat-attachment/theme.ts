// `media` is a 64px square thumbnail; `file` is a 64px-high card, at most 256px wide, with an icon, the name and the size.
// While uploading, a thumbnail dims behind a spinner; a card swaps its icon for the spinner and shimmers its name.
export default {
  slots: {
    base: 'group/attachment relative shrink-0 rounded-[calc(var(--radius)*1.5)] border border-border bg-transparent',
    preview: 'flex items-center justify-center overflow-hidden',
    image: 'size-full object-cover',
    icon: 'inline-flex items-center justify-center [&>*]:size-5',
    spinner: '',
    info: '',
    name: 'block min-w-0 truncate text-sm',
    shimmer: 'block max-w-full',
    size: 'block text-xs text-muted tabular-nums',
    remove: [
      'inline-flex shrink-0 cursor-(--cursor-interactive) items-center justify-center rounded-full bg-default text-muted no-highlight',
      'transition-[opacity,background-color,color] duration-150 ease-out motion-reduce:transition-none',
      'hover:bg-default-hover hover:text-foreground',
      'focus-visible:status-focused',
    ],
    removeIcon: '',
    overlay: 'absolute inset-0 flex items-center justify-center bg-background/60',
    live: '',
  },
  variants: {
    variant: {
      media: {
        base: 'size-16 overflow-hidden',
        preview: 'size-full',
        info: [
          'pointer-events-none absolute inset-x-0 bottom-0 bg-linear-to-t from-black/60 to-transparent px-1.5 pt-5 pb-1 opacity-0',
          'transition-opacity duration-150 group-hover/attachment:opacity-100 motion-reduce:transition-none',
        ],
        name: 'text-xs font-medium text-white',
        size: 'hidden',
        remove: [
          'absolute end-1.5 top-1.5 size-3 opacity-0 shadow-sm backdrop-blur',
          'group-focus-within/attachment:opacity-100 group-hover/attachment:opacity-100',
        ],
        removeIcon: 'size-2',
      },
      file: {
        base: 'flex h-16 max-w-64 items-center gap-2.5 px-3',
        preview: 'min-w-5 shrink-0 text-muted',
        info: 'flex min-w-0 flex-1 flex-col justify-center gap-0.5',
        name: 'font-medium text-foreground',
        remove: 'size-5 bg-transparent',
        removeIcon: 'size-3',
      },
    },
    status: {
      idle: {},
      uploading: {},
      error: { base: 'border-danger', preview: 'text-danger', size: 'text-danger' },
    },
  },
  defaultVariants: {
    variant: 'file',
    status: 'idle',
  },
}
