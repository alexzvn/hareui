// Maps props to the BEM classes of ./radio-group.css (ported from @heroui/styles components/radio-group.css
// and components/radio.css).
export default {
  slots: {
    base: 'h-radio-group',
    // `group/radio` stays as a hook for user `group-*/radio` utilities
    item: 'group/radio h-radio',
    content: 'h-radio__content',
    control: 'h-radio__control',
    indicator: 'h-radio__indicator',
  },
  variants: {
    variant: {
      primary: {},
      // On the control and dot: RadioButtonGroup renders them without the radio item
      secondary: {
        control: 'h-radio__control--secondary',
        indicator: 'h-radio__indicator--secondary',
      },
    },
    orientation: {
      vertical: { base: 'h-radio-group--vertical' },
      horizontal: { base: 'h-radio-group--horizontal' },
    },
  },
  defaultVariants: {
    variant: 'primary',
    orientation: 'vertical',
  },
}
