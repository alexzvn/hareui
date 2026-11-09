// Maps props to the BEM classes of ./date-range-picker.css (ported from @heroui/styles
// components/date-range-picker.css).
export default {
  slots: {
    base: 'h-date-range-picker',
    trigger: 'h-date-range-picker__trigger',
    triggerIndicator: 'h-date-range-picker__trigger-indicator',
    rangeSeparator: 'h-date-range-picker__range-separator',
    popover: 'h-date-range-picker__popover',
  },
  variants: {
    fullWidth: {
      false: {},
      true: { base: 'h-date-range-picker--full-width' },
    },
  },
  defaultVariants: {
    fullWidth: false,
  },
}
