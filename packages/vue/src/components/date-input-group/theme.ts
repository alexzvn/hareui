// Maps props to the BEM classes of ./date-input-group.css (ported from @heroui/styles
// components/date-input-group.css). Internal part shared by DateField, TimeField, DatePicker and DateRangePicker.
export default {
  slots: {
    base: 'h-date-input-group',
    inputContainer: 'h-date-input-group__input-container',
    input: 'h-date-input-group__input',
    segment: 'h-date-input-group__segment',
    prefix: 'h-date-input-group__prefix',
    suffix: 'h-date-input-group__suffix',
  },
  variants: {
    variant: {
      primary: { base: '' },
      secondary: { base: 'h-date-input-group--secondary' },
    },
    fullWidth: {
      false: { base: '' },
      true: { base: 'h-date-input-group--full-width' },
    },
  },
  defaultVariants: {
    fullWidth: false,
    variant: 'primary',
  },
}
