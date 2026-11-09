// Maps props to the BEM classes of ./badge.css (ported from @heroui/styles components/badge.css).
export default {
  slots: {
    anchor: 'h-badge-anchor',
    base: 'h-badge',
    label: 'h-badge__label',
  },
  variants: {
    color: {
      accent: { base: 'h-badge--accent' },
      default: { base: 'h-badge--default' },
      success: { base: 'h-badge--success' },
      warning: { base: 'h-badge--warning' },
      danger: { base: 'h-badge--danger' },
    },
    placement: {
      'top-right': { base: 'h-badge--top-right' },
      'top-left': { base: 'h-badge--top-left' },
      'bottom-right': { base: 'h-badge--bottom-right' },
      'bottom-left': { base: 'h-badge--bottom-left' },
    },
    size: {
      lg: { base: 'h-badge--lg' },
      md: {},
      sm: { base: 'h-badge--sm' },
    },
    // `primary` and `soft` pick the background per color in ./badge.css; `secondary` keeps the default one
    variant: {
      primary: { base: 'h-badge--primary' },
      secondary: {},
      soft: { base: 'h-badge--soft' },
    },
  },
  defaultVariants: {
    color: 'default',
    placement: 'top-right',
    size: 'md',
    variant: 'primary',
  },
}
