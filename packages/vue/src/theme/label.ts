// Translated from @heroui/styles components/label.css
export default {
  slots: {
    base: [
      'text-sm font-medium text-foreground',
      // `[data-required="true"]:not([role=group|radiogroup|checkboxgroup]) > .label` and `[data-required="true"]:not([data-slot=radio|checkbox]) > .label`
      "[[data-required=true]:not([role=group]):not([role=radiogroup]):not([role=checkboxgroup])>&]:after:ms-0.5 [[data-required=true]:not([role=group]):not([role=radiogroup]):not([role=checkboxgroup])>&]:after:text-danger [[data-required=true]:not([role=group]):not([role=radiogroup]):not([role=checkboxgroup])>&]:after:content-['*']",
      "[[data-required=true]:not([data-slot=radio]):not([data-slot=checkbox])>&]:after:ms-0.5 [[data-required=true]:not([data-slot=radio]):not([data-slot=checkbox])>&]:after:text-danger [[data-required=true]:not([data-slot=radio]):not([data-slot=checkbox])>&]:after:content-['*']",
      // `[data-disabled="true"] .label`
      'in-data-[disabled=true]:status-disabled',
      // `[data-invalid="true"] .label`, `[aria-invalid="true"] .label`
      'in-data-[invalid=true]:text-danger in-aria-[invalid=true]:text-danger',
    ],
  },
  variants: {
    disabled: {
      true: { base: 'status-disabled' },
    },
    invalid: {
      true: { base: 'text-danger' },
    },
    required: {
      true: { base: "after:ms-0.5 after:text-danger after:content-['*']" },
    },
  },
  defaultVariants: {
    disabled: false,
    invalid: false,
    required: false,
  },
}
