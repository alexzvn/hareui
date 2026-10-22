// Field styling matches select.ts / input.ts. The select's background follows a private var, so a plain user `bg-*`
// wins in every state; the secondary variant swaps the vars.
export default {
  slots: {
    base: 'inline-flex flex-col gap-1 data-[invalid=true]:[&_[data-slot=description]]:hidden [&_[data-slot=description]]:px-1 [&_[data-slot=label]]:w-fit',
    trigger: 'relative flex',
    select: [
      'h-9 w-full min-w-0 cursor-(--cursor-interactive) appearance-none truncate rounded-field py-2 ps-3 pe-8 text-sm text-field-foreground shadow-field outline-none',
      'bg-(--native-select-bg-current) [--native-select-bg-current:var(--native-select-bg)] [--native-select-bg:var(--field-background,var(--default))] [--native-select-bg-hover:var(--field-hover)] [--native-select-bg-focus:var(--field-focus)]',
      'border-(length:--border-width-field) border-(--field-border)',
      '[transition:background-color_150ms_var(--ease-smooth),border-color_150ms_var(--ease-smooth),box-shadow_150ms_var(--ease-out)] motion-reduce:transition-none',
      'data-[placeholder=true]:text-field-placeholder [&_option]:text-foreground',
      '[@media(hover:hover)]:hover:not-focus:[--native-select-bg-current:var(--native-select-bg-hover)] [@media(hover:hover)]:hover:not-focus:border-(--field-border-hover)',
      'focus:border-(--field-border-focus) focus:[--native-select-bg-current:var(--native-select-bg-focus)] focus-visible:status-focused-field',
      '[[data-slot=native-select][data-invalid=true]_&]:status-invalid-field [[data-slot=native-select][data-invalid=true]_&]:border-(--color-field-border-invalid) [[data-slot=native-select][data-invalid=true]_&]:[--native-select-bg-current:var(--native-select-bg-focus)]',
      'disabled:status-disabled aria-disabled:status-disabled',
    ],
    indicator: 'pointer-events-none absolute inset-y-0 end-2 flex items-center justify-center text-field-placeholder [&>svg]:size-4',
  },
  variants: {
    variant: {
      primary: {},
      secondary: {
        select: 'shadow-none [--native-select-bg:var(--default)] [--native-select-bg-hover:var(--default-hover)] [--native-select-bg-focus:var(--default)]',
      },
    },
    fullWidth: {
      true: { base: 'w-full', trigger: 'w-full' },
      false: {},
    },
  },
  defaultVariants: {
    variant: 'primary',
    fullWidth: false,
  },
}
