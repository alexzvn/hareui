// Maps props to the BEM classes of ./alert.css (ported from @heroui/styles components/alert.css).
export default {
  slots: {
    base: 'h-alert',
    indicator: 'h-alert__indicator',
    content: 'h-alert__content',
    title: 'h-alert__title',
    description: 'h-alert__description',
    // CloseButton is already `shrink-0`
    close: '',
  },
  variants: {
    status: {
      default: { base: 'h-alert--default' },
      accent: { base: 'h-alert--accent' },
      success: { base: 'h-alert--success' },
      warning: { base: 'h-alert--warning' },
      danger: { base: 'h-alert--danger' },
    },
  },
  defaultVariants: {
    status: 'default',
  },
}
