// Maps props to the BEM classes of ./text-area.css (ported from @heroui/styles components/textarea.css).
export default {
  slots: {
    base: 'h-text-area',
  },
  variants: {
    variant: {
      primary: { base: '' },
      secondary: { base: 'h-text-area--secondary' },
    },
    fullWidth: {
      false: { base: '' },
      true: { base: 'h-text-area--full-width' },
    },
  },
  defaultVariants: {
    fullWidth: false,
    variant: 'primary',
  },
}
