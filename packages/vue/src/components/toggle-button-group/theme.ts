// Maps props to the BEM classes of ./toggle-button-group.css (ported from @heroui/styles components/toggle-button-group.css).
export default {
  slots: {
    base: 'h-toggle-button-group',
    // Added to each of the group's own ToggleButtons; the group's css restyles them through it.
    button: 'h-toggle-button-group__button',
    separator: 'h-toggle-button-group__separator',
  },
  variants: {
    orientation: {
      horizontal: { base: 'h-toggle-button-group--horizontal' },
      vertical: { base: 'h-toggle-button-group--vertical' },
    },
    fullWidth: {
      true: { base: 'h-toggle-button-group--full-width' },
      false: {},
    },
    detached: {
      true: { base: 'h-toggle-button-group--detached' },
      false: {},
    },
  },
  defaultVariants: {
    orientation: 'horizontal',
    fullWidth: false,
    detached: false,
  },
}
