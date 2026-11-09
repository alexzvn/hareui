// Maps props to the BEM classes of ./spinner.css (ported from @heroui/styles components/spinner.css).
export default {
  slots: {
    base: 'h-spinner',
  },
  variants: {
    color: {
      accent: { base: 'h-spinner--accent' },
      current: { base: 'h-spinner--current' },
      danger: { base: 'h-spinner--danger' },
      success: { base: 'h-spinner--success' },
      warning: { base: 'h-spinner--warning' },
    },
    size: {
      sm: { base: 'h-spinner--sm' },
      md: {},
      lg: { base: 'h-spinner--lg' },
      xl: { base: 'h-spinner--xl' },
    },
  },
  defaultVariants: {
    color: 'accent',
    size: 'md',
  },
}
