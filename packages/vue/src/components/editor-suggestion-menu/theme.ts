// Floating list of editor commands, opened by a trigger character:
// a 320px overlay panel (24px radius, overlay background and shadow, 4px padding, 14px text) over a list that scrolls
// past 320px. Items are 48px-min rows (24px pill radius, `--radius` x3, 8px padding, 12px gap): a 36px round icon
// well on the default fill, then a medium 14/20 label over a 12/16 muted description, both truncated, and the
// item's `kbd` at the end. The highlighted item (arrow keys or pointer) sits on the default fill and its icon well
// turns overlay with a small shadow; pressing scales it to 98% over 250ms. Section headings are 12px medium muted
// text; groups are split by a 1px separator. With nothing to show, a muted 14px row says so, or shows a spinner while
// loading. In the editor, the trigger character and the text typed after it are highlighted in soft accent while the
// menu is active.
export default {
  slots: {
    base: [
      'z-(--z-index-overlay) flex w-80 max-w-[calc(100vw-16px)] flex-col overflow-hidden rounded-3xl bg-overlay text-overlay-foreground p-1',
      'text-sm text-foreground shadow-overlay outline-none',
    ],
    viewport: 'flex max-h-80 min-h-0 flex-col gap-1 overflow-y-auto overscroll-contain',
    group: 'flex flex-col gap-1',
    label: 'px-2 pt-2 pb-1 text-xs font-medium text-muted',
    separator: 'mx-2 my-1 h-px shrink-0 bg-separator',
    item: [
      'group/editor-menu-item relative flex min-h-12 w-full items-center gap-3 rounded-[calc(var(--radius)*3)] p-2 text-start text-foreground outline-none select-none',
      'cursor-(--cursor-interactive) active:scale-[0.98] data-[highlighted=true]:bg-default',
      '[transition:transform_250ms_var(--ease-out-quart),background-color_150ms_var(--ease-smooth)] motion-reduce:transition-none',
      'aria-disabled:status-disabled',
    ],
    itemIcon: [
      'flex size-9 shrink-0 items-center justify-center rounded-full bg-default text-muted',
      'group-data-[highlighted=true]/editor-menu-item:bg-overlay group-data-[highlighted=true]/editor-menu-item:text-foreground group-data-[highlighted=true]/editor-menu-item:shadow-sm',
    ],
    itemIconSvg: 'size-4',
    itemWrapper: 'flex min-w-0 flex-1 flex-col gap-0.5',
    itemLabel: 'truncate text-sm/5 font-medium',
    itemDescription: 'block truncate text-xs/4 text-muted',
    itemKbd: 'ms-auto shrink-0',
    empty: 'flex items-center px-3 py-2 text-sm text-muted',
    // Inline decoration over the trigger and query in the editor (`suggestion.decorationClass`).
    trigger: 'rounded-[calc(var(--radius)*0.5)] bg-accent-soft text-accent',
  },
}
