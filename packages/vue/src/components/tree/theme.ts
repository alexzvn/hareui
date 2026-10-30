// Tree: rows are the focusable treeitems. Each row is `rounded-lg` (8px) with a 2px gap between the optional 16px
// checkbox, a 20px chevron slot (14px chevron, `text-muted`, rotating 90° in 150ms), the icon (`text-muted`) and the
// label (2px side padding).
// Hover, pressed and selected rows get `bg-default`; adjacent selected rows merge into one
// block. Nesting indents by `--tree-indent` per level and draws a 1px guide line (`currentColor` at 10%) 10px from the
// start of every ancestor level: through its chevron, or through its checkbox when rows have one. Nested lists animate
// their height and opacity over 200ms `ease-out`.
// Sizes (row padding / font / icon / indent): sm 6×2px, 12px, 14px, 10px · md 8×4px, 14px, 16px, 12px ·
// lg 10×6px, 16px, 20px, 24px; rows are 20, 28 and 36px tall.
export default {
  slots: {
    // The virtualizer's rows are absolutely positioned, so as a flex item it would shrink to the viewport and cut
    // the scroll range short
    root: 'group/tree relative isolate flex flex-col overflow-auto p-1 scrollbar outline-none [&>[data-reka-virtualizer]]:shrink-0',
    item: [
      'w-full',
      // Adjacent selected rows share their inner corners. Rows sit one per `li`, so siblings are matched on the `li`.
      '[&:has(+*>[data-selected])>[data-selected]]:rounded-b-none',
      '[*:has(>[data-selected])+&>[data-selected]]:rounded-t-none',
    ],
    listWithChildren:
      'flex flex-col transition-[height,opacity] duration-200 ease-out motion-reduce:transition-none',
    link: [
      'group/row relative flex w-full items-center gap-0.5 rounded-lg text-start text-foreground select-none',
      'ps-[calc(var(--tree-px)+(var(--tree-level)-1)*var(--tree-indent))] pe-(--tree-px)',
      'cursor-(--cursor-interactive) outline-none no-highlight',
      'hover:bg-default active:bg-default data-selected:bg-default',
      'focus-visible:status-focused data-disabled:status-disabled',
    ],
    guideLine:
      'pointer-events-none absolute inset-y-0 start-[calc(var(--tree-px)+10px+var(--tree-guide)*var(--tree-indent))] w-px bg-current/10 select-none',
    linkCheckbox: 'shrink-0',
    linkChevron: 'flex size-5 shrink-0 items-center justify-center rounded-md data-leaf:invisible',
    linkIndicator: [
      'size-3.5 shrink-0 text-muted',
      'transition-[rotate] duration-150 motion-reduce:transition-none',
      'rtl:rotate-180 group-data-expanded/row:rotate-90',
    ],
    linkLeadingIcon: 'shrink-0 text-muted',
    linkLabel: 'min-w-0 flex-1 truncate px-0.5',
    linkTrailing: 'inline-flex shrink-0 items-center gap-1.5 text-muted',
    linkTrailingIcon: 'shrink-0',
    empty: 'px-(--tree-px) text-muted',
  },
  variants: {
    color: {
      default: {},
      accent: {
        link: 'data-selected:bg-accent-soft data-selected:text-accent-soft-foreground',
        linkIndicator: 'group-data-selected/row:text-accent-soft-foreground',
        linkLeadingIcon: 'group-data-selected/row:text-accent-soft-foreground',
        linkTrailing: 'group-data-selected/row:text-accent-soft-foreground',
      },
    },
    size: {
      sm: {
        root: '[--tree-indent:10px] [--tree-px:6px]',
        link: 'py-0.5 text-xs',
        empty: 'py-0.5 text-xs',
        linkLeadingIcon: 'size-3.5',
        linkTrailingIcon: 'size-3.5',
      },
      md: {
        root: '[--tree-indent:12px] [--tree-px:8px]',
        link: 'py-1 text-sm',
        empty: 'py-1 text-sm',
        linkLeadingIcon: 'size-4',
        linkTrailingIcon: 'size-4',
      },
      lg: {
        root: '[--tree-indent:24px] [--tree-px:10px]',
        link: 'py-1.5 text-base',
        empty: 'py-1.5 text-base',
        linkLeadingIcon: 'size-5',
        linkTrailingIcon: 'size-5',
      },
    },
    showGuideLines: {
      true: {},
      false: { guideLine: 'hidden' },
      hover: {
        guideLine:
          'opacity-0 transition-opacity duration-150 group-hover/tree:opacity-100 motion-reduce:transition-none',
      },
    },
  },
  defaultVariants: {
    color: 'default',
    size: 'md',
    showGuideLines: true,
  },
}
