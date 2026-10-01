// Translated from @heroui/styles components/skeleton.css
export default {
  slots: {
    base: 'pointer-events-none relative overflow-hidden rounded-sm bg-surface-tertiary/70',
  },
  variants: {
    animationType: {
      shimmer: {
        base: 'after:absolute after:inset-0 after:-translate-x-full after:animate-skeleton after:bg-linear-to-r after:from-transparent after:via-surface-tertiary after:to-transparent after:content-[\'\']',
      },
      pulse: { base: 'animate-pulse' },
      none: { base: '' },
    },
  },
  defaultVariants: {
    animationType: 'shimmer',
  },
}
