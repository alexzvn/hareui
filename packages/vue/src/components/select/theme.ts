// Translated from @heroui/styles components/select.css
// Trigger states set a private var instead of `bg-*`, so a plain user `bg-*` wins in every state, as with HeroUI's
// `@layer components` rules. The secondary variant swaps the vars, like HeroUI's `--select-trigger-bg*`.
export default {
  slots: {
    base: 'flex flex-col gap-1 data-[invalid=true]:[&_[data-slot=description]]:hidden aria-[invalid=true]:[&_[data-slot=description]]:hidden [&_[data-slot=label]]:w-fit',
    trigger: [
      'relative isolate inline-flex min-h-9 items-center rounded-field px-3 py-2 text-sm text-field-foreground shadow-field outline-none select-none no-highlight',
      'bg-(--select-trigger-bg-current) [--select-trigger-bg-current:var(--select-trigger-bg)] [--select-trigger-bg:var(--color-field)] [--select-trigger-bg-hover:var(--color-field-hover)] [--select-trigger-bg-focus:var(--field-focus)]',
      'border-(length:--border-width-field) border-(--field-border)',
      '[transition:background-color_150ms_var(--ease-smooth),border-color_150ms_var(--ease-smooth),box-shadow_150ms_var(--ease-out)] motion-reduce:transition-none',
      'cursor-(--cursor-interactive)',
      'has-[[data-slot=select-indicator],[data-slot=select-default-indicator]]:pe-7',
      // Hover, except while the clear button is hovered
      '[@media(hover:hover)]:[&:where(:hover,[data-hovered=true]):not(:has([data-slot=select-clear-button]:hover))]:[--select-trigger-bg-current:var(--select-trigger-bg-hover)] [@media(hover:hover)]:[&:where(:hover,[data-hovered=true]):not(:has([data-slot=select-clear-button]:hover))]:border-(--field-border-hover)',
      'data-[focus-visible=true]:status-focused data-[focus-visible=true]:border-(--field-border-focus) data-[focus-visible=true]:[--select-trigger-bg-current:var(--select-trigger-bg-focus)]',
      '[[data-slot=select][data-invalid=true]_&]:status-invalid-field [[data-slot=select][data-invalid=true]_&]:[--select-trigger-bg-current:var(--select-trigger-bg-focus)]',
      'disabled:status-disabled data-[disabled=true]:status-disabled aria-disabled:status-disabled',
    ],
    value: [
      'flex-1 text-start text-base wrap-break-word text-current sm:text-sm',
      'data-[placeholder=true]:text-field-placeholder',
      '[&_[data-slot=list-box-item-indicator]]:hidden',
    ],
    clearButton: [
      'relative isolate inline-flex size-5 shrink-0 origin-center transform-gpu items-center justify-center self-center rounded-xl bg-transparent p-1 text-muted select-none no-highlight',
      'cursor-(--cursor-interactive)',
      "after:absolute after:-inset-0.5 after:content-['']",
      'not-data-[empty=true]:[transition:opacity_150ms_var(--ease-smooth)] motion-reduce:transition-none',
      'data-[empty=true]:pointer-events-none data-[empty=true]:opacity-0',
      '[&_[data-slot=select-clear-button-icon]]:size-3.5',
      '[@media(hover:hover)]:hover:bg-default-hover [@media(hover:hover)]:data-[hovered=true]:bg-default-hover',
      'active:scale-[0.93] data-[pressed=true]:scale-[0.93]',
    ],
    indicator: [
      'absolute inset-y-0 end-2 my-auto flex shrink-0 items-center justify-center text-field-placeholder transition duration-150',
      'data-[open=true]:rotate-180',
      'data-[slot=select-default-indicator]:size-4',
    ],
    popover: [
      'z-(--z-index-overlay) min-w-(--reka-popover-trigger-width) origin-(--reka-popover-content-transform-origin) max-h-(--reka-popover-content-available-height)',
      'scroll-py-1 scrollbar overflow-y-auto overscroll-contain bg-overlay p-0 text-sm outline-none',
      '[border-radius:min(32px,var(--radius-3xl))] [box-shadow:var(--overlay-shadow)]',
      // Same open/close animations as popover.ts (zero-specificity state selectors so user utilities win)
      '[&:where([data-state=open])]:animate-in [&:where([data-state=open])]:[--tw-animation-duration:150ms] [&:where([data-state=open])]:ease-smooth [&:where([data-state=open])]:fade-in-0 [&:where([data-state=open])]:zoom-in-95',
      '[&:where([data-state=open])]:[&:where([data-side=top])]:slide-in-from-bottom-1 [&:where([data-state=open])]:[&:where([data-side=bottom])]:slide-in-from-top-1 [&:where([data-state=open])]:[&:where([data-side=left])]:slide-in-from-right-1 [&:where([data-state=open])]:[&:where([data-side=right])]:slide-in-from-left-1',
      '[&:where([data-state=closed])]:animate-out [&:where([data-state=closed])]:[--tw-animation-duration:100ms] [&:where([data-state=closed])]:ease-smooth [&:where([data-state=closed])]:zoom-out-95 [&:where([data-state=closed])]:fade-out [&:where([data-state=closed])]:pointer-events-none',
      '[&_[data-slot=list-box]]:p-1.5 [&_[data-slot=list-box]]:outline-none [&_[data-slot=list-box-item]]:px-2.5',
      // The popover closes too fast in single mode for the checkmark transition to show
      '[&_[data-slot=list-box]:not([aria-multiselectable=true])_[data-slot=list-box-item-indicator]]:transition-none [&_[data-slot=list-box]:not([aria-multiselectable=true])_[data-slot=list-box-item-indicator--checkmark]]:transition-none',
    ],
  },
  variants: {
    variant: {
      primary: {},
      secondary: {
        trigger: 'shadow-none [--select-trigger-bg:var(--color-default)] [--select-trigger-bg-hover:var(--color-default-hover)] [--select-trigger-bg-focus:var(--color-default)]',
      },
    },
    fullWidth: {
      true: { base: 'w-full', trigger: 'w-full' },
      false: {},
    },
  },
  defaultVariants: {
    variant: 'primary',
    fullWidth: false,
  },
}
