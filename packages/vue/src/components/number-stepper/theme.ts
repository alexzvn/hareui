// Maps props to the BEM classes of ./number-stepper.css.
export default {
  slots: {
    base: 'h-number-stepper',
    group: 'h-number-stepper__group',
    decrementButton: 'h-number-stepper__button',
    value: 'h-number-stepper__value',
    incrementButton: 'h-number-stepper__button',
    input: '',
  },
  variants: {
    size: {
      sm: { base: 'h-number-stepper--sm' },
      md: {},
      lg: { base: 'h-number-stepper--lg' },
    },
    reversed: {
      false: {},
      true: { group: 'h-number-stepper__group--reversed' },
    },
  },
  defaultVariants: {
    size: 'md',
    reversed: false,
  },
}
