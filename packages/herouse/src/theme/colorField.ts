// Translated from @heroui/styles components/color-field.css and color-input-group.css
export default {
  slots: {
    base: 'flex flex-col gap-1 data-[invalid=true]:[&_[data-slot=description]]:hidden aria-[invalid=true]:[&_[data-slot=description]]:hidden [&_[data-slot=label]]:w-fit',
    group: [
      'group inline-flex h-9 items-center overflow-hidden rounded-field border text-sm text-field-foreground shadow-field outline-none',
      // States set a private var instead of `bg-*`, so a plain user `bg-*` (twMerge drops ours) wins in every state,
      // as with HeroUI's `@layer components` rules (same pattern as theme/numberField.ts)
      'bg-(--color-input-group-bg-current) [--color-input-group-bg-current:var(--color-field)]',
      'border-(length:--border-width-field) border-(--field-border)',
      '[transition:background-color_150ms_var(--ease-smooth),border-color_150ms_var(--ease-smooth),box-shadow_150ms_var(--ease-out)] motion-reduce:transition-none',
      'hover:not-focus-within:[--color-input-group-bg-current:var(--color-field-hover)] hover:not-focus-within:border-(--field-border-hover)',
      'focus-within:status-focused-field',
      'data-[invalid=true]:status-invalid-field data-[invalid=true]:[--color-input-group-bg-current:var(--field-focus)] data-[invalid=true]:border-(--color-field-border-invalid)',
      'data-disabled:status-disabled aria-disabled:status-disabled',
    ],
    input: [
      'flex h-full flex-1 cursor-text items-center rounded-none border-0 bg-transparent px-3 py-2 text-base shadow-none outline-none focus:outline-none focus-visible:outline-none sm:text-sm',
      'placeholder:text-field-placeholder',
      'group-has-[[data-slot=color-input-group-prefix]]:rounded-s-none group-has-[[data-slot=color-input-group-prefix]]:ps-2',
      'group-has-[[data-slot=color-input-group-suffix]]:rounded-e-none group-has-[[data-slot=color-input-group-suffix]]:pe-2',
    ],
    prefix: 'ms-3 me-0 flex shrink-0 items-center text-field-placeholder',
    suffix: 'me-3 flex shrink-0 items-center text-field-placeholder',
  },
  variants: {
    variant: {
      primary: { base: '' },
      secondary: {
        group: [
          'shadow-none [--color-input-group-bg:var(--default)] [--color-input-group-bg-hover:var(--default-hover)] [--color-input-group-bg-focus:var(--default)]',
          '[--color-input-group-bg-current:var(--color-input-group-bg)]',
          'hover:not-focus-within:[--color-input-group-bg-current:var(--color-input-group-bg-hover)]',
          'focus-within:[--color-input-group-bg-current:var(--color-input-group-bg-focus)]',
          'data-[invalid=true]:[--color-input-group-bg-current:var(--color-input-group-bg-focus)]',
        ],
        input: 'bg-transparent',
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
