// Map to the BEM classes of ./select.css (ported from @heroui/styles components/select.css)
export default {
  slots: {
    base: 'h-select',
    trigger: 'h-select__trigger',
    value: 'h-select__value',
    clearButton: 'h-select__clear-button',
    indicator: 'h-select__indicator',
    popover: 'h-select__popover',
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
