// A row: a 36px icon box, a title (14px) over a description (12px), both truncated, and a trailing action.
// `group` is set by a parent ItemCardGroup: in a list the group draws the surface, so the card drops its own; in a grid
// every card keeps a raised surface whatever the variant. `group` comes after `variant`, so it wins the conflicts.
export default {
  slots: {
    base: 'flex items-center gap-3 rounded-2xl px-4 py-3',
    icon: 'flex size-9 shrink-0 items-center justify-center rounded-lg bg-default text-foreground [&_svg]:size-4',
    content: 'flex min-w-0 flex-1 flex-col',

    // `w-fit` sizes to the text in a column flexbox, so `max-w-full` is what makes it truncate
    title: 'w-fit max-w-full truncate text-sm font-medium text-foreground',
    description: 'mt-0.5 w-fit max-w-full truncate text-xs text-muted',
    action: 'ms-auto shrink-0 ps-2',
  },
  variants: {
    variant: {
      default: { base: 'bg-surface shadow-surface' },
      secondary: { base: 'bg-surface-secondary', icon: 'bg-surface/50' },
      tertiary: { base: 'bg-surface-tertiary', icon: 'bg-surface/50' },
      outline: { base: 'border border-border bg-transparent' },
      transparent: { base: 'bg-transparent shadow-none' },
    },
    group: {
      none: {},
      // The first and last cards follow the group's corners, so their hover highlight stays inside it
      list: {
        base: 'rounded-none border-0 bg-transparent shadow-none first:rounded-t-[inherit] last:rounded-b-[inherit]',
      },
      grid: { base: 'rounded-2xl border-0 bg-surface shadow-surface' },
    },
    // A link or a card with a click listener: a `currentColor` overlay at 8% on hover and 12% while pressed (150ms)
    pressable: {
      true: {
        base: [
          'relative w-full text-start outline-none no-highlight cursor-(--cursor-interactive)',
          'before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:bg-current before:opacity-0 before:transition-opacity before:duration-150 motion-reduce:before:transition-none',
          'hover:before:opacity-8 active:before:opacity-12',
          'focus-visible:status-focused',
        ],
      },
    },
    disabled: {
      true: { base: 'status-disabled' },
    },
  },
  defaultVariants: {
    variant: 'default',
    group: 'none',
  },
}
