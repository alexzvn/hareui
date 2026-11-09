// Maps props to the BEM classes of ./close-button.css (ported from @heroui/styles components/close-button.css).
export default {
  slots: {
    base: 'h-close-button',
    icon: '',
  },
  variants: {
    variant: {
      default: { base: 'h-close-button--default' },
    },
  },
  defaultVariants: {
    variant: 'default',
  },
}
