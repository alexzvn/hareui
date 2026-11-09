// Maps props to the BEM classes of ./separator.css (ported from @heroui/styles components/separator.css).
export default {
  slots: {
    base: 'h-separator',
  },
  variants: {
    orientation: {
      horizontal: { base: 'h-separator--horizontal' },
      vertical: { base: 'h-separator--vertical' },
    },
    variant: {
      default: { base: 'h-separator--default' },
      secondary: { base: 'h-separator--secondary' },
      tertiary: { base: 'h-separator--tertiary' },
    },
  },
  defaultVariants: {
    orientation: 'horizontal',
    variant: 'default',
  },
}
