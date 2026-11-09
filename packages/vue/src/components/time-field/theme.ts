// Maps props to the BEM classes of ./time-field.css (ported from @heroui/styles components/time-field.css).
export default {
  slots: {
    base: 'h-time-field',
  },
  variants: {
    fullWidth: {
      false: {},
      true: { base: 'h-time-field--full-width' },
    },
  },
  defaultVariants: {
    fullWidth: false,
  },
}
