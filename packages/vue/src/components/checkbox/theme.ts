// Maps props to the BEM classes of ./checkbox.css (ported from @heroui/styles components/checkbox.css).
export default {
  slots: {
    // `group/checkbox` stays as a hook for user `group-*/checkbox` utilities
    base: 'group/checkbox h-checkbox',
    content: 'h-checkbox__content',
    control: 'h-checkbox__control',
    indicator: 'h-checkbox__indicator',
  },
  variants: {
    variant: {
      primary: {},
      // On the control: CheckboxButtonGroup renders it without the Checkbox root
      secondary: { control: 'h-checkbox__control--secondary' },
    },
  },
  defaultVariants: {
    variant: 'primary',
  },
}
