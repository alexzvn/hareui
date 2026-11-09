// Maps props to the BEM classes of ./color-field.css (ported from @heroui/styles components/color-field.css and
// color-input-group.css).
export default {
  slots: {
    base: 'h-color-field',
    group: 'h-color-input-group',
    input: 'h-color-input-group__input',
    prefix: 'h-color-input-group__prefix',
    suffix: 'h-color-input-group__suffix',
  },
  variants: {
    variant: {
      primary: {},
      secondary: { group: 'h-color-input-group--secondary' },
    },
    fullWidth: {
      false: {},
      true: { base: 'h-color-field--full-width', group: 'h-color-input-group--full-width' },
    },
  },
  defaultVariants: {
    fullWidth: false,
    variant: 'primary',
  },
}
