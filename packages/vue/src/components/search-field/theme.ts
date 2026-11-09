// Maps props to the BEM classes of ./search-field.css (ported from @heroui/styles
// components/search-field.css).
export default {
  slots: {
    base: [
      'h-search-field',
      // Utilities, not CSS: they style CloseButton, whose own utilities (e.g. its disabled opacity) would beat CSS. The
      // markup makes the hidden button non-interactive, so that survives `unstyled`
      'data-[empty=true]:[&_[data-slot=search-field-clear-button]]:opacity-0',
    ],
    group: 'h-search-field__group',
    input: 'h-search-field__input',
    searchIcon: 'h-search-field__search-icon',
    // Utilities, not CSS: they go to CloseButton's `class`, where tailwind-merge must evict its own size
    clearButton: 'me-2 size-5 shrink-0 [&_[data-slot=close-button-icon]]:size-3',
  },
  variants: {
    variant: {
      primary: { base: '' },
      secondary: { group: 'h-search-field__group--secondary' },
    },
    fullWidth: {
      false: { base: '', group: '' },
      true: { base: 'h-search-field--full-width', group: 'h-search-field__group--full-width' },
    },
  },
  defaultVariants: {
    fullWidth: false,
    variant: 'primary',
  },
}
