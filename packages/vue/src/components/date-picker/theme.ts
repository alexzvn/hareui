// Maps props to the BEM classes of ./date-picker.css (ported from @heroui/styles components/date-picker.css).
export default {
  slots: {
    base: 'h-date-picker',
    trigger: 'h-date-picker__trigger',
    triggerIndicator: 'h-date-picker__trigger-indicator',
    popover: 'h-date-picker__popover',
  },
  variants: {
    fullWidth: {
      false: {},
      true: { base: 'h-date-picker--full-width' },
    },
  },
  defaultVariants: {
    fullWidth: false,
  },
}
