// Maps props to the BEM classes of ./color-area.css (ported from @heroui/styles components/color-area.css).
export default {
  slots: {
    base: 'h-color-area',
    thumb: 'h-color-area__thumb',
  },
  variants: {
    showDots: {
      false: {},
      true: { base: 'h-color-area--show-dots' },
    },
  },
  defaultVariants: {
    showDots: false,
  },
}
