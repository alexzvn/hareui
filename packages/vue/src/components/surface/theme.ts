// Maps props to the BEM classes of ./surface.css (ported from @heroui/styles components/surface.css).
export default {
  slots: {
    base: 'h-surface',
  },
  variants: {
    variant: {
      transparent: { base: 'h-surface--transparent' },
      default: { base: 'h-surface--default' },
      secondary: { base: 'h-surface--secondary' },
      tertiary: { base: 'h-surface--tertiary' },
    },
  },
  defaultVariants: {
    variant: 'default',
  },
}
