// Maps props to the BEM classes of ./autocomplete.css (ported from @heroui/styles components/autocomplete.css).
export default {
  slots: {
    base: 'h-autocomplete',
    // Extra classes for the Label (its own theme still applies)
    label: '',
    trigger: 'h-autocomplete__trigger',
    value: 'h-autocomplete__value',
    clearButton: 'h-autocomplete__clear-button',
    indicator: 'h-autocomplete__indicator',
    popover: 'h-autocomplete__popover',
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
      secondary: { base: 'h-autocomplete--secondary' },
    },
    fullWidth: {
      true: { base: 'h-autocomplete--full-width', trigger: 'h-autocomplete__trigger--full-width' },
      false: {},
    },
  },
  defaultVariants: {
    variant: 'primary',
    fullWidth: false,
  },
}
