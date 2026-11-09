// Maps props to the BEM classes of ./checkbox-button-group.css: card-style checkbox buttons.
// The default indicator reuses the `checkbox` theme's `control` / `indicator` classes; the card CSS restates
// their states keyed on the card.
export default {
  slots: {
    base: 'h-checkbox-button-group',
    // `group/checkbox` stays as a hook for user `group-*/checkbox` utilities
    item: 'group/checkbox h-checkbox-button-group__item',
    icon: 'h-checkbox-button-group__icon',
    content: 'h-checkbox-button-group__content',
    itemText: 'h-checkbox-button-group__text',
    itemLabel: 'h-checkbox-button-group__label',
    itemDescription: 'h-checkbox-button-group__description',
    indicator: 'h-checkbox-button-group__indicator',
  },
  variants: {
    layout: {
      flex: {},
      grid: { base: 'h-checkbox-button-group--grid' },
    },
    variant: {
      primary: {},
      secondary: {},
    },
    customIndicator: {
      false: {},
      true: { indicator: 'h-checkbox-button-group__indicator--custom' },
    },
    withIcon: {
      false: {},
      true: {
        content: 'h-checkbox-button-group__content--with-icon',
        itemText: 'h-checkbox-button-group__text--with-icon',
      },
    },
  },
  defaultVariants: {
    layout: 'flex',
    variant: 'primary',
    customIndicator: false,
    withIcon: false,
  },
}
