// Maps props to the BEM classes of ./avatar.css (ported from @heroui/styles components/avatar.css).
export default {
  slots: {
    base: 'h-avatar',
    image: 'h-avatar__image',
    fallback: 'h-avatar__fallback',
  },
  variants: {
    color: {
      accent: { fallback: 'h-avatar__fallback--accent' },
      danger: { fallback: 'h-avatar__fallback--danger' },
      default: { fallback: 'h-avatar__fallback--default' },
      success: { fallback: 'h-avatar__fallback--success' },
      warning: { fallback: 'h-avatar__fallback--warning' },
    },
    size: {
      sm: { base: 'h-avatar--sm' },
      md: {},
      lg: { base: 'h-avatar--lg' },
    },
    variant: {
      default: {},
      soft: { base: 'h-avatar--soft' },
    },
  },
  defaultVariants: {
    color: 'default',
    size: 'md',
    variant: 'default',
  },
}
