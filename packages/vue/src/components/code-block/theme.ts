export default {
  slots: {
    base: 'relative flex w-full min-w-0 flex-col overflow-clip rounded-2xl bg-surface-secondary text-surface-secondary-foreground',
    header: 'flex h-8 min-w-0 items-center gap-2 px-3 pt-2',
    label: 'flex min-w-0 items-center gap-1.5 text-xs text-muted uppercase',
    labelText: 'truncate',
    icon: 'size-3.5 shrink-0',
    actions: 'absolute end-3 top-2 flex items-center gap-1',
    copy: [
      '[--button-height:--spacing(6)] md:[--button-height:--spacing(6)]',
      '[--button-fg:var(--muted)] hover:[--button-fg:var(--foreground)]',
    ],
    copyIcons: 'grid size-3.5 place-items-center *:col-start-1 *:row-start-1',
    // The 14px copy and check icons swap with a 250ms scale (to 25%), blur and fade.
    copyIcon:
      'm-0 size-3.5 transition-[opacity,scale,filter] duration-250 ease-out motion-reduce:transition-none',
    checkIcon:
      'm-0 size-3.5 transition-[opacity,scale,filter] duration-250 ease-out motion-reduce:transition-none',
    code: 'w-full text-[13px] leading-relaxed',
    pre: 'm-0 py-2 font-mono whitespace-pre',
    // `w-max min-w-full`: every line spans the widest one, so highlighted rows fill the scrolled width.
    content: 'block w-max min-w-full font-mono',
    line: 'block min-h-[1lh] px-3 data-[highlighted=true]:bg-accent-soft data-[highlighted=true]:shadow-[inset_2px_0_0_var(--accent)]',
    lineNumber: 'me-4 inline-block w-(--code-block-gutter) text-end text-muted select-none',
    // Highlighted tokens carry both color schemes as variables; plain tokens have none and inherit.
    token: [
      'text-(color:--shiki-light) [font-style:var(--shiki-light-font-style)] [font-weight:var(--shiki-light-font-weight)]',
      'dark:text-(color:--shiki-dark) dark:[font-style:var(--shiki-dark-font-style)] dark:[font-weight:var(--shiki-dark-font-weight)]',
    ],
  },
  variants: {
    copied: {
      true: { copyIcon: 'scale-25 opacity-0 blur-[4px]' },
      false: { checkIcon: 'scale-25 opacity-0 blur-[4px]' },
    },
    filename: {
      true: { label: 'text-surface-secondary-foreground normal-case' },
    },
    // Keeps header content clear of the absolutely positioned copy button (24px + 8px gap).
    copy: {
      true: { header: 'pe-11' },
    },
  },
  defaultVariants: {
    copied: false,
  },
}
