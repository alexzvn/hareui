// Command palette, at every size (`size` only sets the max width: 384 / 512 / 576px): a 44px search row (`px-4`,
// 8px gap, 16px muted icon, 14px text) over a 1px `border/70` rule, a list with 6px padding, 28px group headings
// (`px-3 py-1.5`, 12px medium muted) with 4px between groups, and 36px items (`px-3 py-2`, 10px gap, 8px radius,
// 14px text, 16px muted icons) filled with `bg-default` while highlighted. The footer is a 12px muted bar
// (`px-3 py-1`) on `default/50` with a `border/50` top rule; its Kbds shrink to 20px with 12px text.
// The palette has no surface of its own: inside a Modal or Popover it takes the dialog's (16px radius, `bg-overlay`,
// `shadow-overlay`); see the docs demos for the shell classes.
export default {
  slots: {
    root: 'flex min-h-0 w-full min-w-0 flex-col overflow-hidden text-foreground',
    header: 'flex shrink-0 items-center gap-2 px-2 pt-2 text-sm',
    input: 'flex shrink-0 items-center gap-2 border-b border-border/70 px-4',
    inputIcon: 'size-4 shrink-0 text-muted',
    inputField:
      'h-11 min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted',
    inputTrailingIcon: 'size-4 shrink-0 text-muted',
    loading: 'size-4 shrink-0 text-muted',
    back: [
      '-mx-1 size-8 rounded-lg px-0 text-muted [--button-height:--spacing(8)] md:size-6 md:[--button-height:--spacing(6)]',
      '[:where(&_svg)]:size-4 sm:[:where(&_svg)]:size-4',
    ],
    close: 'shrink-0',
    content: 'relative flex min-h-0 flex-1 flex-col overflow-hidden',
    viewport:
      'relative min-h-0 flex-1 scroll-py-1.5 overflow-y-auto overscroll-contain p-1.5 outline-none',
    group: '[&+&]:mt-1',
    label: 'px-3 py-1.5 text-xs font-medium text-muted',
    empty: 'py-6 text-center text-sm text-muted',
    footer: [
      'flex shrink-0 items-center gap-2 border-t border-border/50 bg-default/50 px-3 py-1 text-xs text-muted',
      '[&_kbd]:h-5 [&_kbd]:text-xs',
    ],
    item: [
      'group/item relative flex min-h-9 w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-start text-foreground outline-none select-none',
      'cursor-(--cursor-interactive) data-highlighted:bg-default active:bg-default-hover',
      // Reka's ListboxItem sets `data-disabled=""` itself, so match on presence
      'data-disabled:status-disabled',
    ],
    itemLeadingIcon: 'size-4 shrink-0 text-muted',
    itemLeadingAvatar: 'size-5 shrink-0 rounded-full [&_[data-slot=avatar-fallback]]:text-[0.5rem]',
    // The badge sits in the row instead of on an anchor's corner.
    itemLeadingChip: 'static mx-1 size-2 min-h-2 min-w-2 shrink-0 border-0 [transform:none]',
    itemWrapper: 'flex min-w-0 flex-1 flex-col text-start',
    itemLabel: 'truncate text-muted [&>*+*]:ms-1',
    itemLabelPrefix: 'text-foreground',
    itemLabelBase:
      'text-foreground [&_mark]:rounded-xs [&_mark]:bg-accent-soft [&_mark]:text-accent-soft-foreground',
    itemLabelSuffix:
      'text-muted [&_mark]:rounded-xs [&_mark]:bg-accent-soft [&_mark]:text-accent-soft-foreground',
    itemDescription: [
      'truncate text-xs text-muted',
      '[&_mark]:rounded-xs [&_mark]:bg-accent-soft [&_mark]:text-accent-soft-foreground',
    ],
    itemTrailing: 'ms-auto inline-flex shrink-0 items-center gap-2',
    itemTrailingIcon: 'size-4 shrink-0 text-muted',
    itemTrailingHighlightedIcon:
      'hidden size-4 shrink-0 text-muted group-data-highlighted/item:inline-flex',
    itemTrailingKbds: 'hidden shrink-0 items-center gap-1 sm:inline-flex',
    itemTrailingKbd: 'text-xs',
  },
  variants: {
    // Width only: every size keeps the same density.
    size: {
      sm: { root: 'max-w-sm' },
      md: { root: 'max-w-lg' },
      lg: { root: 'max-w-xl' },
    },
    // Per item (`item.active`): a resting fill, as if highlighted.
    active: {
      true: {
        item: 'bg-default',
        itemLeadingIcon: 'text-foreground',
      },
      false: {},
    },
  },
  defaultVariants: {
    size: 'md',
  },
}
