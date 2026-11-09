// Maps props to the BEM classes of ./label.css (ported from @heroui/styles components/label.css).
export default {
  slots: {
    base: 'h-label',
  },
  variants: {
    disabled: {
      true: { base: 'h-label--disabled' },
    },
    invalid: {
      true: { base: 'h-label--invalid' },
    },
    required: {
      true: { base: 'h-label--required' },
    },
  },
  defaultVariants: {
    disabled: false,
    invalid: false,
    required: false,
  },
}
