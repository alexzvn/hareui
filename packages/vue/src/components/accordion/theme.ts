// Maps props to the BEM classes of ./accordion.css (ported from @heroui/styles components/accordion.css).
export default {
  slots: {
    base: 'h-accordion',
    body: 'h-accordion__body',
    bodyInner: 'h-accordion__body-inner',
    heading: 'h-accordion__heading',
    icon: 'h-accordion__icon',
    indicator: 'h-accordion__indicator',
    item: 'h-accordion__item',
    panel: 'h-accordion__panel',
    trigger: 'h-accordion__trigger',
  },
  variants: {
    variant: {
      default: {},
      surface: { base: 'h-accordion--surface' },
    },
  },
  defaultVariants: {
    variant: 'default',
  },
}
