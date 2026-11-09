// Maps props to the BEM classes of ./radio-button-group.css: card-style radio buttons.
// The default indicator reuses the `radioGroup` theme's `control` / `indicator` classes; the card CSS restates
// their states keyed on the card.
export default {
  slots: {
    base: 'h-radio-button-group',
    // `group/radio` stays as a hook for user `group-*/radio` utilities
    item: 'group/radio h-radio-button-group__item',
    icon: 'h-radio-button-group__icon',
    content: 'h-radio-button-group__content',
    itemText: 'h-radio-button-group__text',
    itemLabel: 'h-radio-button-group__label',
    itemDescription: 'h-radio-button-group__description',
    indicator: 'h-radio-button-group__indicator',
    // Extra classes for the default indicator's radio control and dot
    control: '',
    controlIndicator: '',
  },
  variants: {
    layout: {
      flex: {},
      grid: { base: 'h-radio-button-group--grid' },
    },
    variant: {
      primary: {},
      secondary: {},
    },
    withIcon: {
      false: {},
      true: {
        content: 'h-radio-button-group__content--with-icon',
        itemText: 'h-radio-button-group__text--with-icon',
      },
    },
    customIndicator: {
      false: {},
      true: { indicator: 'h-radio-button-group__indicator--custom' },
    },
  },
  defaultVariants: {
    layout: 'flex',
    variant: 'primary',
    withIcon: false,
    customIndicator: false,
  },
}
