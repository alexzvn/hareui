// Maps props to the BEM classes of ./skeleton.css (ported from @heroui/styles components/skeleton.css).
export default {
  slots: {
    base: 'h-skeleton',
  },
  variants: {
    animationType: {
      shimmer: { base: 'h-skeleton--shimmer' },
      pulse: { base: 'h-skeleton--pulse' },
      none: {},
    },
  },
  defaultVariants: {
    animationType: 'shimmer',
  },
}
