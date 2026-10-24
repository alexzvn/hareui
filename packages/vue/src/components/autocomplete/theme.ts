// Translated from @heroui/styles components/autocomplete.css
// Trigger states set a private var instead of `bg-*`, so a plain user `bg-*` wins in every state (HeroUI's
// `@layer components`); the secondary variant swaps the vars, like HeroUI's `--autocomplete-trigger-bg*`.
export default {
  slots: {
    base: 'flex flex-col gap-1',
    // Extra classes for the Label (its own theme still applies)
    label: '',
    trigger: [
      'relative isolate inline-flex min-h-9 rounded-field px-3 py-2 text-sm text-field-foreground shadow-field outline-none select-none no-highlight',
      'bg-(--autocomplete-trigger-bg-current) [--autocomplete-trigger-bg-current:var(--autocomplete-trigger-bg)] [--autocomplete-trigger-bg:var(--field-background,var(--default))] [--autocomplete-trigger-bg-hover:var(--field-hover)] [--autocomplete-trigger-bg-focus:var(--field-focus)]',
      'border-(length:--border-width-field) border-(--field-border)',
      '[transition:background-color_150ms_var(--ease-smooth),border-color_150ms_var(--ease-smooth),box-shadow_150ms_var(--ease-out)] motion-reduce:transition-none',
      'cursor-(--cursor-interactive)',
      'has-[[data-slot=autocomplete-indicator],[data-slot=autocomplete-default-indicator]]:pe-7',
      // Hover, except while the clear button is hovered
      '[@media(hover:hover)]:[&:where(:hover,[data-hovered=true]):not(:has([data-slot=autocomplete-clear-button]:hover))]:[--autocomplete-trigger-bg-current:var(--autocomplete-trigger-bg-hover)] [@media(hover:hover)]:[&:where(:hover,[data-hovered=true]):not(:has([data-slot=autocomplete-clear-button]:hover))]:border-(--field-border-hover)',
      'data-[focus-visible=true]:status-focused data-[focus-visible=true]:border-(--field-border-focus) data-[focus-visible=true]:[--autocomplete-trigger-bg-current:var(--autocomplete-trigger-bg-focus)]',
      '[[data-slot=autocomplete][data-invalid=true]_&]:status-invalid-field [[data-slot=autocomplete][data-invalid=true]_&]:[--autocomplete-trigger-bg-current:var(--autocomplete-trigger-bg-focus)]',
      'data-[disabled=true]:status-disabled aria-disabled:status-disabled',
    ],
    value: [
      'flex-1 text-start text-base wrap-break-word text-current sm:text-sm',
      'data-[placeholder=true]:text-field-placeholder',
      '[&_[data-slot=list-box-item-indicator]]:hidden',
    ],
    clearButton: [
      'relative isolate inline-flex size-5 shrink-0 origin-center transform-gpu items-center justify-center self-center me-0 rounded-xl bg-transparent p-1 text-muted select-none no-highlight',
      'cursor-(--cursor-interactive)',
      'not-data-[empty=true]:[transition:opacity_150ms_var(--ease-smooth)] motion-reduce:transition-none',
      'data-[empty=true]:pointer-events-none data-[empty=true]:opacity-0',
      '[&_[data-slot=autocomplete-clear-button-icon]]:size-3.5',
      '[@media(hover:hover)]:hover:bg-default-hover [@media(hover:hover)]:data-[hovered=true]:bg-default-hover',
      'active:[transform:scale(0.93)] data-[pressed=true]:[transform:scale(0.93)]',
    ],
    indicator: [
      'absolute inset-y-0 end-2 my-auto flex shrink-0 items-center justify-center text-field-placeholder transition duration-150',
      'cursor-(--cursor-interactive)',
      'data-[open=true]:rotate-180',
      'data-[slot=autocomplete-default-indicator]:size-4',
    ],
    popover: [
      'z-(--z-index-overlay) flex w-(--reka-popover-trigger-width) max-w-(--reka-popover-trigger-width) origin-(--reka-popover-content-transform-origin) max-h-(--reka-popover-content-available-height)',
      'scroll-py-1 flex-col overflow-hidden overscroll-contain bg-overlay p-0 pt-2 text-sm outline-none',
      '[border-radius:min(32px,var(--radius-3xl))] [box-shadow:var(--overlay-shadow)]',
      // Zero-specificity state selectors so user utilities win
      '[&:where([data-state=open])]:animate-in [&:where([data-state=open])]:[--tw-animation-duration:250ms] [&:where([data-state=open])]:ease-out-fluid [&:where([data-state=open])]:fade-in-0 [&:where([data-state=open])]:zoom-in-95',
      '[&:where([data-state=open])]:[&:where([data-side=top])]:slide-in-from-bottom-1 [&:where([data-state=open])]:[&:where([data-side=bottom])]:slide-in-from-top-1 [&:where([data-state=open])]:[&:where([data-side=left])]:slide-in-from-right-1 [&:where([data-state=open])]:[&:where([data-side=right])]:slide-in-from-left-1',
      '[&:where([data-state=closed])]:animate-out [&:where([data-state=closed])]:[--tw-animation-duration:100ms] [&:where([data-state=closed])]:ease-out-quad [&:where([data-state=closed])]:zoom-out-95 [&:where([data-state=closed])]:fade-out [&:where([data-state=closed])]:pointer-events-none',
      '[&_[data-slot=list-box]]:max-h-[320px] [&_[data-slot=list-box]]:min-h-0 [&_[data-slot=list-box]]:scrollbar [&_[data-slot=list-box]]:overflow-y-auto [&_[data-slot=list-box]]:p-1.5 [&_[data-slot=list-box]]:outline-none',
      '[&_[data-slot=list-box-item]]:px-2.5',
      // Single-select closes on selection, so the checkmark isn't animated
      '[&_[data-slot=list-box]:not([aria-multiselectable=true])_[data-slot=list-box-item-indicator]]:transition-none [&_[data-slot=list-box]:not([aria-multiselectable=true])_[data-slot=list-box-item-indicator--checkmark]]:transition-none',
      '[&_[data-slot=search-field]]:shrink-0 [&_[data-slot=search-field]]:px-3 [&_[data-slot=search-field]]:py-1 [&_[data-slot=search-field]]:outline-none',
      '[&_[data-slot=empty-state]]:text-center [&_[data-slot=empty-state]]:text-sm [&_[data-slot=empty-state]]:text-overlay-foreground/60',
    ],
    // Extra classes for the search field parts and the list (their own themes still apply)
    searchField: '',
    searchGroup: '',
    searchIcon: '',
    searchInput: '',
    listBox: '',
  },
  variants: {
    variant: {
      primary: {},
      secondary: {
        trigger:
          'shadow-none [--autocomplete-trigger-bg:var(--default)] [--autocomplete-trigger-bg-hover:var(--default-hover)] [--autocomplete-trigger-bg-focus:var(--default)]',
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
