// A 12px-radius bordered card: a 36px trigger row (12px text) over 11px JSON blocks on the secondary surface
export default {
  slots: {
    base: 'w-full overflow-hidden rounded-xl border border-default',
    heading: 'w-full',
    trigger: [
      'flex min-h-9 w-full cursor-(--cursor-interactive) items-center justify-between gap-2 px-3 py-2 text-start text-xs font-normal text-foreground no-highlight',
      'hover:bg-default active:bg-default',
      'outline-none focus-visible:rounded-xl focus-visible:shadow-[inset_0_0_0_2px_var(--color-focus)]',
      'data-[expandable=false]:cursor-default data-[expandable=false]:hover:bg-transparent data-[expandable=false]:active:bg-transparent',
    ],
    label: 'flex min-w-0 items-center gap-2',
    // The shimmer wraps the status icon and the text while the call runs
    shimmer: 'inline-flex min-w-0 items-center gap-2',
    status: 'inline-flex size-3.5 shrink-0 items-center justify-center text-muted',
    statusIcon: 'size-3.5 shrink-0',
    text: 'flex min-w-0 items-center gap-2',
    prefix: 'shrink-0 whitespace-nowrap',
    name: 'truncate font-medium',
    // A zero basis gives the name priority: the suffix only fills the room left over
    suffix: 'min-w-0 flex-1 basis-0 truncate text-muted',
    indicator: 'size-3.5 text-muted',
    content: '',
    body: 'flex flex-col gap-1 p-3',
    input: 'text-xs',
    output: 'text-xs',
    code: 'my-1 rounded-xl bg-surface-secondary text-surface-secondary-foreground',
    // Long lines wrap so a narrow card never scrolls sideways; indentation stays
    pre: 'm-0 px-2.5 py-1.5 font-mono text-[11px] leading-5 wrap-anywhere whitespace-pre-wrap',
    // JSON colours mix with the foreground, so they keep their contrast on the code surface in both themes
    jsonKey: 'text-accent',
    jsonString: 'text-[color-mix(in_oklab,var(--color-success),var(--color-foreground)_40%)]',
    jsonNumber: 'text-[color-mix(in_oklab,var(--color-warning),var(--color-foreground)_40%)]',
    jsonPunctuation: 'text-muted',
    error: 'px-1 text-xs text-danger',
    approval: 'flex flex-col gap-2 pt-3',
    actions: 'flex items-center justify-end gap-2',
  },
  variants: {
    state: {
      'input-streaming': {},
      'input-available': {},
      'approval-requested': { base: 'border-warning/40', statusIcon: 'text-warning' },
      'approval-responded': {},
      'output-available': { statusIcon: 'text-success' },
      'output-error': { base: 'border-danger/30', statusIcon: 'text-danger' },
      'output-denied': { statusIcon: 'text-muted' },
    },
  },
  defaultVariants: {
    state: 'output-available',
  },
}
