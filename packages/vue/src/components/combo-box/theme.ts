// Root, input group and trigger map to the BEM classes of ./combo-box.css (ported from
// @heroui/styles components/combo-box.css). Its `[data-slot=input]` rules are nested under the root as in HeroUI, so
// they outrank the Input classes by specificity. The other slots stay utilities.
export default {
  slots: {
    base: 'h-combo-box',
    // Extra classes for the Label (HeroUI renders a `Label` here; its own theme still applies)
    label: '',
    inputGroup: 'h-combo-box__input-group',
    // Extra classes for the `<input>` (HeroUI renders an `Input` here; its own theme still applies)
    input: '',
    value: [
      'text-sm wrap-break-word text-field-foreground empty:hidden',
      'data-[placeholder=true]:text-field-placeholder',
      '[&_[data-slot=list-box-item-indicator]]:hidden',
    ],
    trigger: 'h-combo-box__trigger',
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
      true: { base: 'h-combo-box--full-width', inputGroup: 'h-combo-box__input-group--full-width' },
    },
  },
  defaultVariants: {
    fullWidth: false,
  },
}
