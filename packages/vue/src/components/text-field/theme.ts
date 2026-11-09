// Maps props to the BEM classes of ./text-field.css (ported from @heroui/styles components/textfield.css).
export default {
  slots: {
    base: 'h-textfield',
  },
  variants: {
    fullWidth: {
      false: {},
      true: { base: 'h-textfield--full-width' },
    },
  },
  defaultVariants: {
    fullWidth: false,
  },
}
