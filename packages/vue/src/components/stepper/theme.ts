// Colors and sizes are CSS variables on the root, so a `ui.root` / `class` override like
// `[--stepper-inactive-border:var(--foreground)]` restyles every step.
export default {
  slots: {
    root: [
      'flex gap-4',
      '[--stepper-separator-size:2px] [--stepper-inactive-border:var(--border)] [--stepper-inactive-fg:var(--muted)]',
    ],
    header: 'm-0 flex list-none p-0',
    item: 'relative flex flex-col',
    trigger: [
      'group/trigger relative z-10 flex rounded-lg bg-transparent p-0 outline-none no-highlight',
      'transition-colors duration-100 motion-reduce:transition-none',
      'enabled:cursor-(--cursor-interactive) enabled:active:opacity-80 enabled:data-[pressed=true]:opacity-80 focus-visible:status-focused',
    ],
    indicator: [
      'flex size-(--stepper-indicator-size) shrink-0 items-center justify-center rounded-full border-2 border-solid bg-transparent font-semibold',
      'group-enabled/trigger:group-hover/trigger:opacity-80',
      'data-[state=inactive]:border-(--stepper-inactive-border) data-[state=inactive]:text-(--stepper-inactive-fg)',
      'data-[state=active]:border-(--stepper-active-color) data-[state=active]:text-(--stepper-active-color)',
      'data-[state=completed]:border-(--stepper-complete-color) data-[state=completed]:bg-(--stepper-complete-color) data-[state=completed]:text-(--stepper-complete-fg) data-[state=completed]:shadow-sm',
      'data-[state=completed]:not-data-[settled=true]:animate-stepper-complete motion-reduce:animate-none',
    ],
    icon: 'size-[55%] shrink-0',
    check: [
      'w-[44%] shrink-0 [stroke-dasharray:22]',
      'not-data-[settled=true]:animate-stepper-check motion-reduce:animate-none',
    ],
    separator: 'absolute overflow-hidden bg-separator',
    separatorFill:
      'absolute inset-0 bg-(--stepper-complete-color) transition-[scale] duration-300 ease-[ease] motion-reduce:transition-none',
    wrapper: 'flex flex-col',
    title: [
      'leading-tight font-medium text-foreground transition-colors duration-300 ease-[ease] motion-reduce:transition-none',
      'data-[state=inactive]:text-muted',
    ],
    description: [
      'mt-0.5 leading-snug text-muted transition-colors duration-300 ease-[ease] motion-reduce:transition-none',
      'data-[state=inactive]:opacity-60',
    ],
    content: 'min-w-0 flex-1',
  },
  variants: {
    orientation: {
      horizontal: {
        root: 'flex-col',
        header: 'items-start',
        item: 'flex-1 items-center',
        trigger: 'flex-col items-center gap-1.5',
        separator: [
          'top-[calc(var(--stepper-indicator-size)/2-var(--stepper-separator-size)/2)] h-(--stepper-separator-size)',
          'start-[calc(50%+var(--stepper-indicator-size)/2)] end-[calc(-50%+var(--stepper-indicator-size)/2)]',
        ],
        separatorFill: 'origin-left scale-x-(--stepper-separator-progress) rtl:origin-right',
        wrapper: 'items-center text-center',
      },
      vertical: {
        // The content drops below the steps once it would get narrower than 16rem beside them
        root: 'flex-wrap',
        header: 'flex-col',
        item: 'pb-(--stepper-vertical-gap) last:pb-0',
        trigger: 'flex-row items-start gap-2.5 text-start',
        separator: [
          'top-(--stepper-indicator-size) bottom-0 w-(--stepper-separator-size)',
          'start-[calc(var(--stepper-indicator-size)/2-var(--stepper-separator-size)/2)]',
        ],
        separatorFill: 'origin-top scale-y-(--stepper-separator-progress)',
        wrapper: 'min-h-(--stepper-indicator-size) items-start text-start',
        content: 'basis-64',
      },
    },
    size: {
      sm: {
        root: '[--stepper-indicator-size:22px] [--stepper-vertical-gap:12px]',
        indicator: 'text-[10px]',
        title: 'text-[11px]',
        description: 'text-[10px]',
      },
      md: {
        root: '[--stepper-indicator-size:28px] [--stepper-vertical-gap:16px]',
        indicator: 'text-xs',
        title: 'text-xs',
        description: 'text-xs',
      },
      lg: {
        root: '[--stepper-indicator-size:36px] [--stepper-vertical-gap:24px]',
        indicator: 'text-sm',
        title: 'text-sm',
        description: 'text-xs',
      },
    },
    color: {
      accent: {
        root: '[--stepper-active-color:var(--accent)] [--stepper-complete-color:var(--accent)] [--stepper-complete-fg:var(--accent-foreground)]',
      },
      success: {
        root: '[--stepper-active-color:var(--success)] [--stepper-complete-color:var(--success)] [--stepper-complete-fg:var(--success-foreground)]',
      },
      warning: {
        root: '[--stepper-active-color:var(--warning)] [--stepper-complete-color:var(--warning)] [--stepper-complete-fg:var(--warning-foreground)]',
      },
      danger: {
        root: '[--stepper-active-color:var(--danger)] [--stepper-complete-color:var(--danger)] [--stepper-complete-fg:var(--danger-foreground)]',
      },
      default: {
        root: '[--stepper-active-color:var(--foreground)] [--stepper-complete-color:var(--foreground)] [--stepper-complete-fg:var(--background)]',
      },
    },
  },
  defaultVariants: {
    orientation: 'horizontal',
    size: 'md',
    color: 'accent',
  },
}
