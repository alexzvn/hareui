// A list group is one surface: its ItemCards drop their own surface and are divided by 1px lines (`border-t` on every
// card that follows another card, so a header or a user-placed Separator never gets a second line). A grid group has
// no surface of its own: its cards keep a raised one, 12px apart.
export default {
  slots: {
    base: 'rounded-2xl',
    header: 'px-4 pt-4 pb-2',
    title: 'text-sm font-semibold text-foreground',
    description: 'mt-0.5 text-xs text-muted',
  },
  variants: {
    variant: {
      default: { base: 'bg-surface shadow-surface' },
      // Separators fade to 10% muted on a tinted surface
      secondary: { base: 'bg-surface-secondary [&_[data-slot=separator]]:bg-muted/10' },
      tertiary: { base: 'bg-surface-tertiary [&_[data-slot=separator]]:bg-muted/10' },
      outline: { base: 'border border-border bg-transparent shadow-none' },
      transparent: { base: 'rounded-none bg-transparent shadow-none' },
    },
    layout: {
      list: {
        base: 'flex flex-col [&>[data-slot=item-card]+[data-slot=item-card]]:border-t [&>[data-slot=item-card]+[data-slot=item-card]]:border-separator',
      },
      // The column count comes from `--item-card-group-columns`, set from the `columns` prop
      grid: {
        base: 'grid grid-cols-[repeat(var(--item-card-group-columns),minmax(0,1fr))] gap-3 bg-transparent shadow-none',
        header: 'col-span-full p-0',
      },
    },
  },
  compoundVariants: [
    {
      layout: 'list',
      variant: ['secondary', 'tertiary'],
      class: { base: '[&>[data-slot=item-card]+[data-slot=item-card]]:border-muted/10' },
    },
  ],
  defaultVariants: {
    variant: 'default',
    layout: 'list',
  },
}
