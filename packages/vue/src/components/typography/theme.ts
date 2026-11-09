// Maps props to the BEM classes of ./typography.css (ported from @heroui/styles components/typography.css).
export default {
  slots: {
    base: 'h-typography',
    prose: 'h-typography-prose',
  },
  variants: {
    type: {
      h1: { base: 'h-typography--h1' },
      h2: { base: 'h-typography--h2' },
      h3: { base: 'h-typography--h3' },
      h4: { base: 'h-typography--h4' },
      h5: { base: 'h-typography--h5' },
      h6: { base: 'h-typography--h6' },
      body: { base: 'h-typography--body' },
      'body-sm': { base: 'h-typography--body-sm' },
      'body-xs': { base: 'h-typography--body-xs' },
      code: { base: 'h-typography--code' },
    },
    // `start` still emits its class: it overrides an inherited alignment
    align: {
      start: { base: 'h-typography--align-start' },
      center: { base: 'h-typography--align-center' },
      end: { base: 'h-typography--align-end' },
      justify: { base: 'h-typography--align-justify' },
    },
    // `.h-typography` is already the default color
    color: {
      default: {},
      muted: { base: 'h-typography--color-muted' },
    },
    weight: {
      normal: { base: 'h-typography--weight-normal' },
      medium: { base: 'h-typography--weight-medium' },
      semibold: { base: 'h-typography--weight-semibold' },
      bold: { base: 'h-typography--weight-bold' },
    },
    truncate: {
      true: { base: 'h-typography--truncate' },
    },
  },
  defaultVariants: {
    type: 'body',
    align: 'start',
    color: 'default',
  },
}
