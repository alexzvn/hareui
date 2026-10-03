// Translated from @heroui/styles components/field-error.css
export default {
  slots: {
    base: [
      'h-0 px-1 text-xs wrap-break-word text-danger opacity-0 data-visible:h-auto data-visible:opacity-100',
      '[transition:opacity_150ms_var(--ease-out),height_350ms_var(--ease-smooth)] motion-reduce:transition-none',
      // Toggle fields: `.checkbox > .field-error`, `.switch > .field-error`, `.radio > .field-error`
      '[:is([data-slot=checkbox],[data-slot=switch],[data-slot=radio])>&]:m-0 [:is([data-slot=checkbox],[data-slot=switch],[data-slot=radio])>&]:h-auto [:is([data-slot=checkbox],[data-slot=switch],[data-slot=radio])>&]:min-h-0 [:is([data-slot=checkbox],[data-slot=switch],[data-slot=radio])>&]:p-0 [:is([data-slot=checkbox],[data-slot=switch],[data-slot=radio])>&]:text-muted [:is([data-slot=checkbox],[data-slot=switch],[data-slot=radio])>&]:opacity-100 [:is([data-slot=checkbox],[data-slot=switch],[data-slot=radio])>&]:[transition:none]',
    ],
  },
}
