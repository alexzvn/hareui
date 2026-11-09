// Root and trigger map to the BEM classes of ./select.css (ported from @heroui/styles
// components/select.css). The other slots stay utilities.
export default {
  slots: {
    base: 'h-select',
    trigger: 'h-select__trigger',
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
      // The markup makes the hidden button non-interactive, so that survives `unstyled`
      'data-[empty=true]:opacity-0',
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
      secondary: { trigger: 'h-select__trigger--secondary' },
    },
    fullWidth: {
      true: { base: 'h-select--full-width', trigger: 'h-select__trigger--full-width' },
      false: {},
    },
  },
  defaultVariants: {
    variant: 'primary',
    fullWidth: false,
  },
}
