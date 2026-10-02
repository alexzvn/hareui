// Translated from @heroui/styles components/scroll-shadow.css. The fade masks themselves live in
// styles/scroll-shadow.css, keyed on `data-slot="scroll-shadow"` + `data-orientation` (and the
// `data-*-scroll` flags) so the same rules serve every scroller, e.g. Tabs' list.
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
