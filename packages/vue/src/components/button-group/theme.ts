// Maps props to the BEM classes of ./button-group.css (ported from @heroui/styles components/button-group.css).
export default {
  slots: {
    base: 'h-button-group',
    // Added to each of the group's own Buttons; the group's css restyles them through it.
    button: 'h-button-group__button',
    // Added to grouped Buttons with `variant="outline"`; their border collapse keys on `.h-button--outline`.
    buttonOutline: '',
    separator: 'h-button-group__separator',
  },
  variants: {
    orientation: {
      horizontal: { base: 'h-button-group--horizontal' },
      vertical: { base: 'h-button-group--vertical' },
    },
    fullWidth: {
      true: { base: 'h-button-group--full-width' },
      false: {},
    },
  },
  defaultVariants: {
    orientation: 'horizontal',
    fullWidth: false,
  },
}
