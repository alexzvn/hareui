// Translated from @heroui/styles components/combo-box.css
// The `[data-slot=input]` rules are nested under the root as in HeroUI, so they outrank the Input theme by specificity
// (`.combo-box [data-slot=input]:focus`) instead of fighting it in tailwind-merge.
export default {
  slots: {
    base: [
      'flex flex-col gap-1',
      'data-[invalid=true]:[&_[data-slot=description]]:hidden aria-[invalid=true]:[&_[data-slot=description]]:hidden',
      '[&_[data-slot=label]]:w-fit',
      '[&_[data-slot=input]]:min-w-0 [&_[data-slot=input]]:flex-1',
      '[&_[data-slot=input]:has(+[data-slot=combo-box-trigger])]:pe-7',
      '[&_[data-slot=input]:focus]:status-focused-field [&_[data-slot=input]:focus]:border-(--field-border-focus) [&_[data-slot=input]:focus]:bg-(--field-focus)',
      '[&_[data-slot=input]:disabled]:status-disabled [&_[data-slot=input][aria-disabled=true]]:status-disabled',
    ],
    // Extra classes for the Label (HeroUI renders a `Label` here; its own theme still applies)
    label: '',
    inputGroup: 'relative isolate inline-flex items-center',
    // Extra classes for the `<input>` (HeroUI renders an `Input` here; its own theme still applies)
    input: '',
    value: [
      'text-sm wrap-break-word text-field-foreground empty:hidden',
      'data-[placeholder=true]:text-field-placeholder',
      '[&_[data-slot=list-box-item-indicator]]:hidden',
    ],
    trigger: [
      'absolute end-0 top-1/2 flex h-full shrink-0 -translate-y-1/2 cursor-pointer items-center justify-center pe-2 text-field-placeholder transition duration-150 no-highlight',
      'border-none bg-transparent outline-none',
      'hover:text-field-foreground [@media(hover:hover)]:data-[hovered=true]:text-field-foreground',
      'focus-visible:not-data-focused:rounded focus-visible:not-data-focused:ring-2 focus-visible:not-data-focused:ring-focus focus-visible:not-data-focused:ring-offset-2 focus-visible:not-data-focused:ring-offset-background',
      'data-[focus-visible=true]:rounded data-[focus-visible=true]:ring-2 data-[focus-visible=true]:ring-focus data-[focus-visible=true]:ring-offset-2 data-[focus-visible=true]:ring-offset-background',
      'data-[pressed=true]:opacity-70',
      'disabled:cursor-not-allowed disabled:opacity-50 data-disabled:cursor-not-allowed data-disabled:opacity-50 aria-disabled:cursor-not-allowed aria-disabled:opacity-50',
      '[&_[data-slot=combo-box-trigger-default-icon]]:size-4 [&_[data-slot=combo-box-trigger-default-icon]]:transition-transform [&_[data-slot=combo-box-trigger-default-icon]]:duration-150 motion-reduce:[&_[data-slot=combo-box-trigger-default-icon]]:transition-none',
      'data-[open=true]:[&_[data-slot=combo-box-trigger-default-icon]]:rotate-180',
    ],
    popover: [
      // Reka's combobox content sets an inline `display: flex`; RAC's popover is a block
      'block!',
      'z-(--z-index-overlay) min-w-(--reka-combobox-trigger-width) origin-(--reka-combobox-content-transform-origin) max-h-(--reka-combobox-content-available-height)',
      'scroll-py-1 scrollbar overflow-y-auto overscroll-contain bg-overlay p-0 text-sm outline-none',
      '[border-radius:min(32px,var(--radius-3xl))] [box-shadow:var(--overlay-shadow)]',
      // Same open/close animations as popover.ts (zero-specificity state selectors so user utilities win)
      '[&:where([data-state=open])]:animate-in [&:where([data-state=open])]:[--tw-animation-duration:150ms] [&:where([data-state=open])]:ease-smooth [&:where([data-state=open])]:fade-in-0 [&:where([data-state=open])]:zoom-in-95',
      '[&:where([data-state=open])]:[&:where([data-side=top])]:slide-in-from-bottom-1 [&:where([data-state=open])]:[&:where([data-side=bottom])]:slide-in-from-top-1 [&:where([data-state=open])]:[&:where([data-side=left])]:slide-in-from-right-1 [&:where([data-state=open])]:[&:where([data-side=right])]:slide-in-from-left-1',
      '[&:where([data-state=closed])]:animate-out [&:where([data-state=closed])]:[--tw-animation-duration:100ms] [&:where([data-state=closed])]:ease-smooth [&:where([data-state=closed])]:zoom-out-95 [&:where([data-state=closed])]:fade-out [&:where([data-state=closed])]:pointer-events-none',
      '[&_[data-slot=list-box]]:p-1.5 [&_[data-slot=list-box]]:outline-none [&_[data-slot=list-box-item]]:px-2.5',
      // Single-select closes on selection, so the checkmark isn't animated
      '[&_[data-slot=list-box-item]_[data-slot=list-box-item-indicator--checkmark]]:transition-none',
    ],
  },
  variants: {
    fullWidth: {
      false: {},
      true: { base: 'w-full', inputGroup: 'w-full' },
    },
  },
  defaultVariants: {
    fullWidth: false,
  },
}
