// Translated from @heroui/styles components/spinner.css
export default {
  slots: {
    base: 'pointer-events-none inline-flex size-6 shrink-0 animate-spin-fast motion-reduce:animate-none',
  },
  variants: {
    color: {
      accent: { base: 'text-accent' },
      current: { base: 'text-inherit' },
      danger: { base: 'text-danger' },
      success: { base: 'text-success' },
      warning: { base: 'text-warning' },
    },
    size: {
      sm: { base: 'size-4' },
      md: { base: '' },
      lg: { base: 'size-8' },
      xl: { base: 'size-10' },
    },
  },
  defaultVariants: {
    color: 'accent',
    size: 'md',
  },
}
