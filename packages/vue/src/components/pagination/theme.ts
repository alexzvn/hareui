// Maps props to the BEM classes of ./pagination.css (ported from @heroui/styles components/pagination.css).
export default {
  slots: {
    base: 'h-pagination',
    summary: 'h-pagination__summary',
    content: 'h-pagination__content',
    item: 'h-pagination__item',
    link: 'h-pagination__link',
    // Added to `link` on Previous / Next (HeroUI's `.pagination__link--nav`).
    nav: 'h-pagination__link--nav',
    // Icon wrappers: HeroUI flips them in RTL.
    icon: 'h-pagination__icon',
    ellipsis: 'h-pagination__ellipsis',
  },
  variants: {
    size: {
      sm: { base: 'h-pagination--sm' },
      md: {},
      lg: { base: 'h-pagination--lg' },
    },
  },
  defaultVariants: {
    size: 'md',
  },
}
