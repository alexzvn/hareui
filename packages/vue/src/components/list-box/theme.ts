// Maps props to the BEM classes of ./list-box.css (ported from @heroui/styles
// components/{list-box,list-box-item,list-box-section,header,empty-state,separator}.css).
export default {
  slots: {
    base: 'h-list-box',
    item: 'h-list-box__item',
    // Utilities, not CSS: an icon's own classes (an iconify class string) must not outrank them.
    itemIcon: 'size-4 shrink-0',
    indicator: 'h-list-box__indicator',
    section: 'h-list-box__section',
    header: 'h-list-box__header',
    separator: 'h-list-box__separator',
    emptyState: 'h-list-box__empty-state',
  },
  variants: {
    // Per item (`item.variant`)
    variant: {
      default: {},
      danger: {
        // Utilities, not CSS: they must outrank the Label's own `text-foreground`.
        item: '[&_[data-slot=label]]:text-danger',
        indicator: 'h-list-box__indicator--danger',
      },
    },
  },
  defaultVariants: {
    variant: 'default',
  },
}
