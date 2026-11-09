// Maps props to the BEM classes of ./kbd.css (ported from @heroui/styles components/kbd.css).
export default {
  slots: {
    base: 'h-kbd',
    abbr: 'h-kbd__abbr',
    content: 'h-kbd__content',
  },
  variants: {
    variant: {
      default: {},
      light: { base: 'h-kbd--light' },
    },
  },
}
