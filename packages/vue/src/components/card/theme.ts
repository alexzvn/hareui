// Maps props to the BEM classes of ./card.css (ported from @heroui/styles components/card.css).
export default {
  slots: {
    base: 'h-card',
    header: 'h-card__header',
    title: 'h-card__title',
    description: 'h-card__description',
    content: 'h-card__content',
    footer: 'h-card__footer',
  },
  variants: {
    variant: {
      default: { base: 'h-card--default' },
      secondary: { base: 'h-card--secondary' },
      tertiary: { base: 'h-card--tertiary' },
      transparent: { base: 'h-card--transparent' },
    },
  },
  defaultVariants: {
    variant: 'default',
  },
}
