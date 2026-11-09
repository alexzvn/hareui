// Maps props to the BEM classes of ./toggle-button.css (ported from @heroui/styles components/toggle-button.css).
export default {
  slots: {
    base: 'h-toggle-button',
  },
  variants: {
    variant: {
      default: {},
      ghost: { base: 'h-toggle-button--ghost' },
    },
    size: {
      sm: { base: 'h-toggle-button--sm' },
      md: {},
      lg: { base: 'h-toggle-button--lg' },
    },
    iconOnly: {
      true: { base: 'h-toggle-button--icon-only' },
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'md',
    iconOnly: false,
  },
}
