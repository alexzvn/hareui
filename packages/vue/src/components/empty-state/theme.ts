// Maps props to the BEM classes of ./empty-state.css (ported from @heroui/styles components/empty-state.css).
// Without media, a title, a description or actions, the empty state is a plain line (as in lists and tables); with
// any of them (`structured`) it becomes a centred column.
export default {
  slots: {
    base: 'h-empty-state',
    header: 'h-empty-state__header',
    media: 'h-empty-state__media',
    title: 'h-empty-state__title',
    description: 'h-empty-state__description',
    actions: 'h-empty-state__actions',
  },
  variants: {
    size: {
      sm: { base: 'h-empty-state--sm' },
      md: {},
      lg: { base: 'h-empty-state--lg' },
    },
    variant: {
      default: {},
      outline: { base: 'h-empty-state--outline' },
      secondary: { base: 'h-empty-state--secondary' },
    },
    media: {
      icon: { media: 'h-empty-state__media--icon' },
      avatar: {},
      custom: {},
      none: {},
    },
    structured: {
      true: { base: 'h-empty-state--structured' },
      false: {},
    },
  },
  defaultVariants: {
    size: 'md',
    variant: 'default',
    structured: false,
  },
}
