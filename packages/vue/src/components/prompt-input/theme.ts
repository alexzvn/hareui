// Square 32px actions, as single-row layouts need.
const ROW_ACTION = 'shrink-0 [--button-height:--spacing(8)] md:[--button-height:--spacing(8)]'

// Single-row grid: attach on the start, the field in the middle, send on the end; header and attachments span the
// rows above it.
const ROW = {
  shell:
    'grid min-h-12 grid-cols-[auto_minmax(0,1fr)_auto] grid-rows-[auto_auto_minmax(3rem,auto)] py-0',
  content: 'contents',
  header: 'col-span-full row-start-1',
  attachments: 'col-span-full row-start-2',
  textarea:
    'col-start-2 row-start-3 mb-0 min-h-12 px-2 py-3.5 [transition:height_100ms_var(--ease-out),min-height_200ms_var(--ease-out)] motion-reduce:transition-none',
  toolbar: 'contents',
  toolbarStart: 'col-start-1 row-start-3 h-8 ps-2',
  toolbarEnd: 'col-start-3 row-start-3 h-8 pe-2',
}

export default {
  slots: {
    base: 'group/prompt-input relative flex w-full flex-col',
    queue: [
      'mb-2 w-full shrink-0 overflow-hidden rounded-[calc(var(--radius)*2)] border-(length:--border-width-field) border-(--field-border)',
      '[transition:background-color_150ms_var(--ease-smooth),border-color_150ms_var(--ease-smooth)] motion-reduce:transition-none',
      'group-focus-within/prompt-input:border-(--field-border-focus)',
    ],
    queueList: 'm-0 max-h-40 w-full list-none overflow-x-hidden overflow-y-auto p-0',
    // The leading icon lines up with the composer's text
    queueItem:
      'group/queue-item flex min-w-0 items-center gap-2 px-3 py-1 not-first:border-t not-first:border-border/50',
    queueItemIcon: 'size-3.5 shrink-0 text-muted',
    queueItemBody: 'flex min-w-0 flex-1 flex-col gap-0.5 self-center',
    queueItemContent: 'line-clamp-2 text-xs/tight [overflow-wrap:anywhere] text-muted',
    queueItemFiles: 'flex min-w-0 items-center gap-1 text-xs/tight text-muted',
    queueItemActions:
      'flex shrink-0 items-center gap-0.5 transition-opacity motion-reduce:transition-none',
    shell: [
      'relative flex w-full flex-col overflow-hidden rounded-[calc(var(--radius)*2)] border-(length:--border-width-field) border-(--field-border)',
      '[transition:background-color_150ms_var(--ease-smooth),border-color_150ms_var(--ease-smooth),box-shadow_150ms_var(--ease-out),border-radius_200ms_var(--ease-out)] motion-reduce:transition-none',
      'data-[dragging=true]:border-dotted data-[dragging=true]:border-accent data-[dragging=true]:bg-accent-soft data-[dragging=true]:ring-1 data-[dragging=true]:ring-accent',
    ],
    content: 'flex min-h-0 flex-1 flex-col gap-1',
    header: 'flex flex-wrap items-center gap-2 px-3 pt-3',
    attachments: 'flex flex-wrap gap-2 px-3 pt-3 pb-1',
    textarea: [
      'block scrollbar max-h-(--prompt-input-max-height) w-full resize-none appearance-none overflow-y-auto border-0 bg-transparent px-3 pt-3 pb-2 text-field-foreground shadow-none outline-none placeholder:text-field-placeholder disabled:cursor-not-allowed',
      // Attachments above already leave a gap
      '[[data-slot=prompt-input-attachments]+&]:pt-1',
      // Responsive font size lives in variables so a plain `text-*` from the user wins at every breakpoint.
      'text-(length:--prompt-input-font-size)/(--prompt-input-line-height) [--prompt-input-font-size:var(--text-base)] [--prompt-input-line-height:var(--text-base--line-height)] sm:[--prompt-input-font-size:var(--text-sm)] sm:[--prompt-input-line-height:var(--text-sm--line-height)]',
      '[transition:height_100ms_var(--ease-out)] motion-reduce:transition-none',
    ],
    toolbar: 'absolute inset-x-3 bottom-3 flex items-center justify-between gap-2',
    toolbarStart: 'flex shrink-0 items-center gap-2',
    toolbarEnd: 'ms-auto flex shrink-0 items-center gap-2',
    action: '',
    send: 'shrink-0',
    footer: 'mt-1 text-center text-xs text-muted',
  },
  variants: {
    variant: {
      primary: {
        shell:
          'bg-field [@media(hover:hover)]:hover:not-focus-within:border-(--field-border-hover) focus-within:border-(--field-border-focus) focus-within:bg-(--field-focus)',
        queue: 'bg-field [@media(hover:hover)]:hover:border-(--field-border-hover)',
      },
      secondary: {
        shell:
          'bg-default shadow-none [@media(hover:hover)]:hover:not-focus-within:bg-default-hover focus-within:border-(--field-border-focus)',
        queue: 'bg-default',
      },
    },
    size: {
      sm: { textarea: 'mb-10 min-h-12' },
      md: { textarea: 'mb-14 min-h-14' },
      lg: { textarea: 'mb-14 min-h-18' },
    },
    layout: {
      stacked: {},
      compact: { shell: 'rounded-2xl', action: ROW_ACTION, send: ROW_ACTION },
      inline: { shell: 'rounded-2xl', action: ROW_ACTION, send: ROW_ACTION },
    },
    queueActions: {
      // Shown on hover or focus where the device can hover, always on touch screens
      hover: {
        queueItemActions:
          '[@media(hover:hover)]:opacity-0 group-hover/queue-item:opacity-100 group-focus-within/queue-item:opacity-100',
      },
      always: {},
    },
    expanded: {
      true: {},
      false: {},
    },
    disabled: {
      true: { base: 'opacity-60', shell: 'cursor-not-allowed' },
      false: { shell: 'cursor-text', toolbar: 'cursor-default' },
    },
  },
  compoundVariants: [
    {
      layout: ['compact', 'inline'],
      expanded: false,
      class: { shell: 'rounded-[calc(var(--radius)*3)]' },
    },
    {
      layout: 'inline',
      class: {
        ...ROW,
        toolbarStart: [ROW.toolbarStart, 'mt-2 self-start'],
        toolbarEnd: [ROW.toolbarEnd, 'mt-2 self-start'],
        // The first line stays level with the buttons, under attachments too
        textarea: [ROW.textarea, 'self-start [[data-slot=prompt-input-attachments]+&]:pt-3.5'],
      },
    },
    {
      layout: 'compact',
      expanded: false,
      class: {
        ...ROW,
        toolbarStart: [ROW.toolbarStart, 'self-center'],
        toolbarEnd: [ROW.toolbarEnd, 'self-center'],
        // A long placeholder stays on the single row instead of wrapping out of it
        textarea: [ROW.textarea, 'max-h-12 self-center overflow-y-hidden placeholder:truncate'],
      },
    },
    {
      layout: 'compact',
      expanded: true,
      class: { shell: 'min-h-28', textarea: 'mb-12 min-h-18' },
    },
  ],
  defaultVariants: {
    variant: 'primary',
    size: 'md',
    layout: 'stacked',
    expanded: false,
    disabled: false,
  } as const,
}
