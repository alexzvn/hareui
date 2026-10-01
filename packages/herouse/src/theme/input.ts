// Translated from @heroui/styles components/input.css
export default {
  slots: {
    base: [
      'rounded-field bg-field px-3 py-2 text-base text-field-foreground shadow-field outline-none placeholder:text-field-placeholder sm:text-sm',
      'border-(length:--border-width-field) border-(--field-border)',
      '[transition:background-color_150ms_var(--ease-smooth),border-color_150ms_var(--ease-smooth),box-shadow_150ms_var(--ease-out)] motion-reduce:transition-none',
      'hover:not-focus:not-focus-visible:bg-field-hover hover:not-focus:not-focus-visible:border-(--field-border-hover)',
      'focus:status-focused-field focus:border-(--field-border-focus) focus:bg-(--field-focus)',
      'data-[invalid=true]:status-invalid-field data-[invalid=true]:bg-(--field-focus)',
      'disabled:status-disabled data-[disabled=true]:status-disabled aria-disabled:status-disabled',
    ],
  },
  variants: {
    variant: {
      primary: { base: '' },
      secondary: {
        base: [
          'shadow-none bg-(--input-bg) [--input-bg:var(--default)] [--input-bg-hover:var(--default-hover)] [--input-bg-focus:var(--default)]',
          'hover:not-focus:not-focus-visible:bg-(--input-bg-hover)',
          'focus:bg-(--input-bg-focus)',
          'data-[invalid=true]:bg-(--input-bg-focus)',
        ],
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
