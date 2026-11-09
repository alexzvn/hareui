// Maps props to the BEM classes of ./chip.css (ported from @heroui/styles components/chip.css).
export default {
  slots: {
    base: 'h-chip',
    label: 'h-chip__label',
  },
  variants: {
    color: {
      accent: { base: 'h-chip--accent' },
      danger: { base: 'h-chip--danger' },
      default: { base: 'h-chip--default' },
      success: { base: 'h-chip--success' },
      warning: { base: 'h-chip--warning' },
    },
    // `primary` and `soft` pick the background per color in ./chip.css; `secondary` keeps the default one
    variant: {
      primary: { base: 'h-chip--primary' },
      secondary: {},
      soft: { base: 'h-chip--soft' },
      tertiary: { base: 'h-chip--tertiary' },
    },
    size: {
      sm: { base: 'h-chip--sm' },
      md: {},
      lg: { base: 'h-chip--lg' },
    },
  },
  defaultVariants: {
    color: 'default',
    variant: 'secondary',
    size: 'md',
  },
}
