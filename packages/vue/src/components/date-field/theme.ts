// Maps props to the BEM classes of ./date-field.css (ported from @heroui/styles components/date-field.css).
export default {
  slots: {
    base: 'h-date-field',
  },
  variants: {
    fullWidth: {
      false: {},
      true: { base: 'h-date-field--full-width' },
    },
  },
  defaultVariants: {
    fullWidth: false,
  },
}
