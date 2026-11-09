// Maps props to the BEM classes of ./number-field.css (ported from @heroui/styles
// components/number-field.css).
export default {
  slots: {
    base: 'h-number-field',
    group: 'h-number-field__group',
    input: 'h-number-field__input',
    incrementButton: 'h-number-field__increment-button',
    decrementButton: 'h-number-field__decrement-button',
  },
  variants: {
    variant: {
      primary: { base: '' },
      secondary: { group: 'h-number-field__group--secondary' },
    },
    fullWidth: {
      false: { base: '' },
      true: { base: 'h-number-field--full-width', group: 'h-number-field__group--full-width' },
    },
  },
  defaultVariants: {
    fullWidth: false,
    variant: 'primary',
  },
}
