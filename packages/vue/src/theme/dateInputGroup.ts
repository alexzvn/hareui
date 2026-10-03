// Translated from @heroui/styles components/date-input-group.css
// Internal part shared by DateField, TimeField, DatePicker and DateRangePicker.
// Self-referencing data-attribute states use `[&:where([data-…])]:` (zero added specificity): HeroUI keeps
// these in @layer components, so a user `data-[invalid=true]:` / `:ui` override must still win. Ancestor-scoped
// `group-data-*` / `group-has-*` variants don't need it: Tailwind already wraps the group target in `:where()`.
export default {
  slots: {
    base: [
      'group/date-input-group inline-flex h-9 items-center overflow-hidden rounded-field text-sm text-field-foreground shadow-field outline-none',
      'border-(length:--border-width-field) border-(--field-border)',
      // State sets a private var instead of `bg-*`, so a plain user `bg-*` (twMerge drops ours) wins in every state,
      // as with HeroUI's `@layer components` rules
      'bg-(--date-input-group-bg-current) [--date-input-group-bg-current:var(--color-field)]',
      '[transition:background-color_150ms_var(--ease-smooth),border-color_150ms_var(--ease-smooth),box-shadow_150ms_var(--ease-out)] motion-reduce:transition-none',
      'hover:not-focus-within:[--date-input-group-bg-current:var(--color-field-hover)] hover:not-focus-within:border-(--field-border-hover)',
      // HeroUI skips the field ring while the (Date|DateRange)Picker trigger button itself holds focus (it draws its own ring); `:where` keeps the specificity of a plain `focus-within:`
      '[&:focus-within:where(:not(:has([data-slot=date-picker-trigger]:focus,[data-slot=date-range-picker-trigger]:focus)))]:status-focused-field focus-within:[--date-input-group-bg-current:var(--field-focus)]',
      '[&:where([data-invalid=true])]:status-invalid-field [&:where([data-invalid=true])]:[--date-input-group-bg-current:var(--field-focus)] [&:where([data-invalid=true])]:border-(--color-field-border-invalid)',
      '[&:where([data-disabled])]:status-disabled [&:where([aria-disabled=true])]:status-disabled',
    ],
    inputContainer: 'flex flex-1 scrollbar-none items-center w-fit overflow-x-auto overflow-y-clip',
    input: [
      'flex flex-1 cursor-text items-center gap-px rounded-none border-0 bg-transparent px-3 py-2 text-base shadow-none outline-none focus:outline-none focus-visible:outline-none sm:text-sm',
      'group-has-[[data-slot=date-input-group-prefix]]/date-input-group:rounded-s-none group-has-[[data-slot=date-input-group-prefix]]/date-input-group:ps-2',
      'group-has-[[data-slot=date-input-group-suffix]]/date-input-group:rounded-e-none group-has-[[data-slot=date-input-group-suffix]]/date-input-group:pe-2',
      // DateRangePicker: start/end inputs hug the range separator (the extra `[slot=…]` attribute out-specifies the suffix rule above, as in HeroUI)
      'group-has-[[data-slot=date-range-picker-range-separator]]/date-input-group:[&[slot=start]]:flex-none group-has-[[data-slot=date-range-picker-range-separator]]/date-input-group:[&[slot=start]]:pe-0',
      'group-has-[[data-slot=date-range-picker-range-separator]]/date-input-group:[&[slot=end]]:ps-0',
    ],
    segment: [
      'inline-block rounded-md px-0.5 text-end text-nowrap outline-none',
      // Color set via a private var instead of a plain `text-*`: a `[&:where(…)]:text-muted` utility and a
      // bare `text-foreground` override share identical (zero-specificity) selectors, so twMerge's eviction
      // is the only reliable way to let a plain user `text-*` (twMerge drops ours) win, as with HeroUI's
      // `@layer components` rules
      'text-(--date-input-group-segment-color-current) [--date-input-group-segment-color-current:var(--color-field-foreground)]',
      // HeroUI/React Aria's `[data-type="literal"]`; Reka's segment attribute is named `data-segment`
      '[&:where([data-segment=literal])]:p-0 [&:where([data-segment=literal])]:[--date-input-group-segment-color-current:var(--color-muted)]',
      '[&:where([data-placeholder])]:[--date-input-group-segment-color-current:var(--color-field-placeholder)]',
      'focus:bg-accent-soft focus:text-accent-soft-foreground',
      '[&:where([data-disabled])]:opacity-50',
      // Invalid styling reads the group's own `data-invalid` (set from validation), not Reka's per-segment attribute:
      // see reka-limitations in dateField.ts / timeField.ts for why.
      'group-data-[invalid=true]/date-input-group:[--date-input-group-segment-color-current:var(--color-danger)] group-data-[invalid=true]/date-input-group:focus:bg-danger-soft group-data-[invalid=true]/date-input-group:focus:text-danger-soft-foreground',
    ],
    prefix: 'pointer-events-none shrink-0 text-field-placeholder ms-3 me-0 flex items-center',
    suffix: 'pointer-events-none shrink-0 text-field-placeholder me-3 flex items-center',
  },
  variants: {
    variant: {
      primary: { base: '' },
      secondary: {
        base: [
          'shadow-none [--date-input-group-bg:var(--default)] [--date-input-group-bg-hover:var(--default-hover)] [--date-input-group-bg-focus:var(--default)]',
          '[--date-input-group-bg-current:var(--date-input-group-bg)]',
          'hover:not-focus-within:[--date-input-group-bg-current:var(--date-input-group-bg-hover)]',
          'focus-within:[--date-input-group-bg-current:var(--date-input-group-bg-focus)]',
          '[&:where([data-invalid=true])]:[--date-input-group-bg-current:var(--date-input-group-bg-focus)]',
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
