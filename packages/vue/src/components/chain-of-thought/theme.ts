// A 32px muted text trigger over a timeline of steps, 12px apart, behind a start border; muted 14px step text
export default {
  slots: {
    base: 'w-full text-sm',
    heading: '',
    trigger: [
      'inline-flex h-8 w-fit cursor-(--cursor-interactive) items-center justify-start gap-2 rounded-3xl text-sm font-normal text-muted no-highlight',
      'transition-colors duration-150 motion-reduce:transition-none',
      'hover:text-foreground',
      'focus-visible:status-focused',
      'disabled:cursor-default disabled:hover:text-muted',
    ],
    indicator: 'size-3.5 text-muted',
    content: '',
    body: 'p-2',
    steps: 'flex flex-col gap-3 border-s border-default ps-3',
    step: 'flex flex-col gap-1',
    stepHeader: 'flex items-center gap-2',
    stepIndicator: 'mx-1 size-1.5 shrink-0 rounded-full bg-muted/40',
    stepIcon: 'size-3.5 shrink-0 text-muted',
    stepLabel: 'font-normal tracking-wide text-muted',
    stepContent: 'text-sm leading-relaxed whitespace-pre-wrap text-muted',
  },
  variants: {
    streaming: {
      true: { trigger: 'text-foreground' },
    },
    status: {
      pending: { step: 'opacity-50' },
      active: { stepLabel: 'text-foreground' },
      done: {},
    },
  },
  defaultVariants: {
    streaming: false,
    status: 'done',
  },
}
