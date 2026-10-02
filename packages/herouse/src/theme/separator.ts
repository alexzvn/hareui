// Translated from @heroui/styles components/separator.css
export default {
  slots: {
    base: 'shrink-0 rounded-sm border-t-0 border-b-0 bg-separator h-px w-full',
  },
  variants: {
    orientation: {
      horizontal: { base: 'h-px w-full' },
      vertical: { base: 'h-auto min-h-2 w-px self-stretch' },
    },
    variant: {
      default: { base: 'bg-separator' },
      secondary: { base: 'bg-separator-secondary' },
      tertiary: { base: 'bg-separator-tertiary' },
    },
  },
  defaultVariants: {
    orientation: 'horizontal',
    variant: 'default',
  },
}
