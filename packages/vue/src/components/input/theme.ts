// Maps props to the BEM classes of ./input.css (ported from @heroui/styles components/input.css).
export default {
  slots: {
    base: 'h-input',
  },
  variants: {
    variant: {
      primary: {},
      secondary: { base: 'h-input--secondary' },
    },
    fullWidth: {
      false: {},
      true: { base: 'h-input--full-width' },
    },
  },
  defaultVariants: {
    fullWidth: false,
    variant: 'primary',
  },
}
