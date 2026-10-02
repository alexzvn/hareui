// Translated from @heroui/styles components/surface.css
export default {
  slots: {
    base: 'relative text-foreground',
  },
  variants: {
    variant: {
      transparent: { base: 'bg-transparent' },
      default: { base: 'bg-surface text-surface-foreground' },
      secondary: { base: 'bg-surface-secondary text-surface-secondary-foreground' },
      tertiary: { base: 'bg-surface-tertiary text-surface-tertiary-foreground' },
    },
  },
  defaultVariants: {
    variant: 'default',
  },
}
