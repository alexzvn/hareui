// Translated from @heroui/styles components/search-field.css
export default {
  slots: {
    base: [
      'flex flex-col gap-1',
      'data-[invalid=true]:[&_[data-slot=description]]:hidden aria-[invalid=true]:[&_[data-slot=description]]:hidden',
      '[&_[data-slot=label]]:w-fit',
      'data-[empty=true]:[&_[data-slot=search-field-clear-button]]:pointer-events-none data-[empty=true]:[&_[data-slot=search-field-clear-button]]:opacity-0',
    ],
    group: [
      'relative inline-flex h-9 items-center overflow-hidden rounded-field border bg-field text-sm text-field-foreground shadow-field outline-none',
      'border-(length:--border-width-field) border-(--field-border)',
      '[transition:background-color_150ms_var(--ease-smooth),border-color_150ms_var(--ease-smooth),box-shadow_150ms_var(--ease-out)] motion-reduce:transition-none',
      'hover:not-focus-within:bg-field-hover hover:not-focus-within:border-(--field-border-hover)',
      'focus-within:status-focused-field',
      'data-[invalid=true]:status-invalid-field data-[invalid=true]:bg-(--field-focus) data-[invalid=true]:border-(--color-field-border-invalid)',
      'data-[disabled=true]:status-disabled aria-disabled:status-disabled',
      // Autofill paints only the inner <input>; lift the highlight onto the group
      'has-[[data-slot=search-field-input]:autofill]:bg-(--field-focus) has-[[data-slot=search-field-input]:autofill]:border-(--field-border-focus)',
    ],
    input: [
      'flex-1 rounded-none border-0 bg-transparent py-2 ps-2 pe-2 text-base shadow-none outline-none sm:text-sm',
      // Hide the browser's default search clear button; ours replaces it
      '[&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none',
      'focus:outline-none focus-visible:outline-none',
      'autofill:shadow-[inset_0_0_0_1000px_transparent] autofill:[-webkit-text-fill-color:var(--field-foreground)] autofill:caret-(--field-foreground) autofill:[transition:background-color_9999s_ease-in-out_0s]',
    ],
    searchIcon: 'pointer-events-none shrink-0 text-field-placeholder ms-3 me-0 size-4 [&>svg]:size-4',
    clearButton: 'me-2 size-5 shrink-0 [&_[data-slot=close-button-icon]]:size-3',
  },
  variants: {
    variant: {
      primary: { base: '' },
      secondary: {
        group: [
          'shadow-none bg-(--search-field-group-bg) [--search-field-group-bg:var(--default)] [--search-field-group-bg-hover:var(--default-hover)] [--search-field-group-bg-focus:var(--default)]',
          'hover:not-focus-within:bg-(--search-field-group-bg-hover)',
          'focus-within:bg-(--search-field-group-bg-focus)',
          'data-[invalid=true]:status-invalid-field data-[invalid=true]:border-(--color-field-border-invalid) data-[invalid=true]:bg-(--search-field-group-bg-focus)',
        ],
      },
    },
    fullWidth: {
      false: { base: '', group: '' },
      true: { base: 'w-full', group: 'w-full' },
    },
  },
  defaultVariants: {
    fullWidth: false,
    variant: 'primary',
  },
}
