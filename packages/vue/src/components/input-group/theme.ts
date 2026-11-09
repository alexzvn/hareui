// Maps props to the BEM classes of ./input-group.css (ported from @heroui/styles
// components/input-group.css).
export default {
  slots: {
    base: 'h-input-group',
    // Also the consumer-supplied textarea (`data-slot="input-group-textarea"`)
    input: 'h-input-group__input',
    prefix: 'h-input-group__prefix',
    suffix: 'h-input-group__suffix',
  },
  variants: {
    variant: {
      primary: { base: '' },
      secondary: { base: 'h-input-group--secondary' },
    },
    fullWidth: {
      false: { base: '' },
      true: { base: 'h-input-group--full-width' },
    },
  },
  defaultVariants: {
    fullWidth: false,
    variant: 'primary',
  },
}
