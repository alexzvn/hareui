// Maps props to the BEM classes of ./scroll-shadow.css (ported from @heroui/styles components/scroll-shadow.css).
export default {
  slots: {
    base: 'h-scroll-shadow',
  },
  variants: {
    orientation: {
      vertical: { base: 'h-scroll-shadow--vertical' },
      horizontal: { base: 'h-scroll-shadow--horizontal' },
    },
    hideScrollBar: {
      true: { base: 'h-scroll-shadow--hide-scrollbar' },
      false: {},
    },
    // The only variant: the fade masks are the root's own styles
    variant: {
      fade: {},
    },
  },
  defaultVariants: {
    orientation: 'vertical',
    hideScrollBar: false,
    variant: 'fade',
  },
}
