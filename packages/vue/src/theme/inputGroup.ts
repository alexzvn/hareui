// Translated from @heroui/styles components/input-group.css
export default {
  slots: {
    base: [
      'group/input-group inline-flex min-h-9 items-center rounded-field bg-field text-sm text-field-foreground shadow-field outline-none',
      'border-(length:--border-width-field) border-(--field-border)',
      // When a textarea is present (consumer-supplied, data-slot="input-group-textarea"), align items to the
      // start and let the height grow instead of the fixed `min-h-9` row
      'has-[[data-slot=input-group-textarea]]:items-start has-[[data-slot=input-group-textarea]]:h-auto',
      '[transition:background-color_150ms_var(--ease-smooth),border-color_150ms_var(--ease-smooth),box-shadow_150ms_var(--ease-out)] motion-reduce:transition-none',
      'hover:not-focus-within:bg-field-hover hover:not-focus-within:border-(--field-border-hover)',
      // Focus ring only follows the input/textarea itself, not any interactive prefix/suffix button
      'has-[[data-slot=input-group-input]:focus]:status-focused-field has-[[data-slot=input-group-input]:focus]:border-(--field-border-focus) has-[[data-slot=input-group-input]:focus]:bg-(--field-focus)',
      'has-[[data-slot=input-group-textarea]:focus]:status-focused-field has-[[data-slot=input-group-textarea]:focus]:border-(--field-border-focus) has-[[data-slot=input-group-textarea]:focus]:bg-(--field-focus)',
      'data-[invalid=true]:status-invalid-field data-[invalid=true]:bg-(--field-focus) data-[invalid=true]:border-(--color-field-border-invalid)',
      'data-[disabled=true]:status-disabled aria-disabled:status-disabled',
      // Autofill paints only the inner <input>; lift the highlight onto the group so the rounded shell + prefix/suffix share it
      'has-[[data-slot=input-group-input]:autofill]:bg-(--field-focus) has-[[data-slot=input-group-input]:autofill]:border-(--field-border-focus)',
    ],
    input: [
      'min-w-0 flex-1 rounded-none border-0 bg-transparent px-3 py-2 shadow-none outline-none placeholder:text-field-placeholder',
      // Responsive font size lives in variables so a plain `text-*` from the user wins at every breakpoint
      'text-(length:--input-group-input-font-size)/(--input-group-input-line-height) [--input-group-input-font-size:var(--text-base)] [--input-group-input-line-height:var(--text-base--line-height)] sm:[--input-group-input-font-size:var(--text-sm)] sm:[--input-group-input-line-height:var(--text-sm--line-height)]',
      // Remove border radius on the side touching a prefix / suffix
      'group-has-[[data-slot=input-group-prefix]]/input-group:rounded-s-none group-has-[[data-slot=input-group-prefix]]/input-group:ps-0',
      'group-has-[[data-slot=input-group-suffix]]/input-group:rounded-e-none group-has-[[data-slot=input-group-suffix]]/input-group:pe-0',
      'focus:outline-none focus-visible:outline-none',
      'autofill:shadow-[inset_0_0_0_1000px_transparent] autofill:[-webkit-text-fill-color:var(--field-foreground)] autofill:caret-(--field-foreground) autofill:[transition:background-color_9999s_ease-in-out_0s]',
      // Textarea variant of this slot (consumer-supplied `data-slot="input-group-textarea"`)
      'data-[slot=input-group-textarea]:min-h-[38px] data-[slot=input-group-textarea]:resize-y',
    ],
    prefix: [
      'flex h-full items-center justify-center rounded-s-field rounded-e-none bg-transparent px-3 text-field-placeholder',
      // HeroUI's `border-top/bottom/inline-start: none` shorthands reset those sides to style none + currentColor
      'border-e-(length:--border-width-field) border-e-(--field-border) border-t-current border-b-current border-s-current [border-top-style:none] [border-bottom-style:none] [border-inline-start-style:none]',
      'group-has-[[data-slot=input-group-textarea]]/input-group:items-start group-has-[[data-slot=input-group-textarea]]/input-group:pt-2',
      '[transition:background-color_150ms_var(--ease-smooth),border-color_150ms_var(--ease-smooth)] motion-reduce:transition-none',
    ],
    suffix: [
      'flex h-full items-center justify-center rounded-s-none rounded-e-field bg-transparent px-3 text-field-placeholder',
      'border-s-(length:--border-width-field) border-s-(--field-border) border-t-current border-b-current border-e-current [border-top-style:none] [border-bottom-style:none] [border-inline-end-style:none]',
      'group-has-[[data-slot=input-group-textarea]]/input-group:items-start group-has-[[data-slot=input-group-textarea]]/input-group:pt-2',
      '[transition:background-color_150ms_var(--ease-smooth),border-color_150ms_var(--ease-smooth)] motion-reduce:transition-none',
    ],
  },
  variants: {
    variant: {
      primary: { base: '' },
      secondary: {
        base: [
          'shadow-none bg-(--input-group-bg) [--input-group-bg:var(--default)] [--input-group-bg-hover:var(--default-hover)] [--input-group-bg-focus:var(--default)]',
          'hover:not-focus-within:bg-(--input-group-bg-hover)',
          'has-[[data-slot=input-group-input]:focus]:bg-(--input-group-bg-focus) has-[[data-slot=input-group-textarea]:focus]:bg-(--input-group-bg-focus)',
          'data-[invalid=true]:border-(--color-field-border-invalid) data-[invalid=true]:bg-(--input-group-bg-focus)',
        ],
        input: 'bg-transparent',
      },
    },
    fullWidth: {
      false: { base: '' },
      true: { base: 'w-full' },
    },
  },
  defaultVariants: {
    fullWidth: false,
    variant: 'primary',
  },
}
