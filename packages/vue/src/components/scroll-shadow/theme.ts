export default {
  slots: {
    base: 'relative',
  },
  variants: {
    orientation: {
      vertical: { base: 'overflow-y-auto' },
      horizontal: { base: 'overflow-x-auto' },
    },
    hideScrollBar: {
      // Split so `scrollbar` and `scrollbar-none` never meet in one class list.
      false: { base: 'scrollbar' },
      true: { base: 'scrollbar-none [--scroll-shadow-scrollbar-size:0px]' },
    },
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
