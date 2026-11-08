// The header stacks a 24px semibold title over 14px `text-muted` text (at most 640px wide), 8px apart; groups sit 32px
// apart with an 18px semibold label. Prompts fill a grid: pills one column, two from `sm`, 8px apart; cards one, two
// from `sm`, three from `lg`, 12px apart.
// - pill: a transparent button with a `border` outline, radius × 2 (12px), 12px × 16px padding and 14px snug text.
//   Hover tints it `default` at 40% and fades in a muted chevron at the end; keyboard focus draws a 2px inset `focus`
//   ring.
// - card: a `surface` card with the surface shadow, radius × 2 and 16px padding, a 14px medium title over 12px muted
//   text clamped to three lines, and a footer row for meta text and tags.
export default {
  slots: {
    base: 'flex w-full flex-col gap-8',
    header: 'flex flex-col gap-2',
    title: 'text-2xl font-semibold tracking-tight text-foreground',
    description: 'max-w-[640px] text-sm text-muted',
    group: 'flex flex-col gap-3',
    groupHeader: 'flex flex-col gap-1',
    groupLabel: 'text-lg font-semibold text-foreground',
    groupDescription: 'text-sm text-muted',
    items: 'grid w-full auto-rows-auto grid-cols-1',
    item: [
      'group/prompt-suggestion relative w-full rounded-[calc(var(--radius)*2)] text-start text-sm text-foreground outline-none select-none no-highlight',
      'cursor-(--cursor-interactive)',
      'disabled:status-disabled aria-disabled:status-disabled',
    ],
    itemText: 'flex min-w-0 flex-col gap-0.5',
    itemLabel: 'flex min-w-0 items-center gap-2 text-pretty',
    itemIcon: 'size-4 shrink-0',
    itemDescription: 'text-sm leading-5 text-muted',
    itemTrailing: [
      'mt-0.5 size-4 shrink-0 text-muted opacity-0 transition-opacity rtl:-scale-x-100 motion-reduce:transition-none',
      'group-hover/prompt-suggestion:opacity-100 group-focus-visible/prompt-suggestion:opacity-100',
    ],
    itemFooter: 'mt-auto flex items-center justify-between gap-3',
    itemMeta: 'text-xs text-muted',
    itemTags: 'flex flex-wrap gap-1.5',
  },
  variants: {
    variant: {
      pill: {
        items: 'gap-2 sm:grid-cols-2',
        item: [
          'flex items-start justify-between gap-3 border border-border bg-transparent px-4 py-3 leading-snug whitespace-normal',
          'transition-colors motion-reduce:transition-none hover:bg-default/40',
          'focus-visible:shadow-[inset_0_0_0_2px_var(--color-focus)]',
        ],
      },
      card: {
        items: 'gap-3 sm:grid-cols-2 lg:grid-cols-3',
        item: [
          'flex h-full flex-col gap-3 bg-surface p-4 shadow-surface',
          'transition-colors motion-reduce:transition-none hover:bg-surface-hover',
          'focus-visible:status-focused',
        ],
        itemLabel: 'leading-6 font-medium',
        itemDescription: 'line-clamp-3 text-xs leading-4',
      },
    },
  },
  defaultVariants: {
    variant: 'pill',
  },
}
