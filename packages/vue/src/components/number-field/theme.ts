// Translated from @heroui/styles components/number-field.css
const button = [
  'flex h-full w-10 items-center justify-center rounded-none bg-transparent text-field-foreground outline-none',
  'border-solid border-(length:--border-width-field) border-(--field-border)',
  '[transition:background-color_150ms_var(--ease-smooth),border-color_150ms_var(--ease-smooth)] motion-reduce:transition-none',
  'cursor-(--cursor-interactive)',
  'active:bg-field-foreground/10 active:[transform:scale(0.97)] data-[pressed=true]:bg-field-foreground/10 data-[pressed=true]:[transform:scale(0.97)]',
  'disabled:status-disabled data-disabled:status-disabled aria-disabled:status-disabled',
]

export default {
  slots: {
    base: 'flex flex-col gap-1 data-[invalid=true]:[&_[data-slot=description]]:hidden aria-[invalid=true]:[&_[data-slot=description]]:hidden [&_[data-slot=label]]:w-fit',
    group: [
      'grid h-9 items-center overflow-hidden rounded-field text-sm text-field-foreground shadow-field outline-none',
      // States set a private var instead of `bg-*`, so a plain user `bg-*` (twMerge drops ours) wins in every state,
      // as with HeroUI's `@layer components` rules
      'bg-(--number-field-group-bg-current) [--number-field-group-bg-current:var(--color-field)]',
      'border-(length:--border-width-field) border-(--field-border)',
      'grid-cols-[1fr] has-[[slot=decrement]]:grid-cols-[40px_1fr] has-[[slot=increment]]:grid-cols-[1fr_40px] has-[[slot=decrement]]:has-[[slot=increment]]:grid-cols-[40px_1fr_40px]',
      '[transition:background-color_150ms_var(--ease-smooth),border-color_150ms_var(--ease-smooth),box-shadow_150ms_var(--ease-out)] motion-reduce:transition-none',
      'hover:not-focus-within:[--number-field-group-bg-current:var(--color-field-hover)] hover:not-focus-within:border-(--field-border-hover)',
      'focus-within:status-focused-field focus-within:border-(--field-border-focus) focus-within:[--number-field-group-bg-current:var(--field-focus)]',
      'data-[invalid=true]:status-invalid-field data-[invalid=true]:[--number-field-group-bg-current:var(--field-focus)] data-[invalid=true]:border-(--color-field-border-invalid)',
      'data-disabled:status-disabled aria-disabled:status-disabled',
      // Autofill paints only the inner <input>; lift the highlight onto the group
      'has-[[data-slot=number-field-input]:autofill]:[--number-field-group-bg-current:var(--field-focus)] has-[[data-slot=number-field-input]:autofill]:border-(--field-border-focus)',
    ],
    input: [
      'min-w-0 rounded-none border-0 bg-transparent px-3 py-2 tabular-nums shadow-none outline-none focus:outline-none focus-visible:outline-none',
      // Responsive font size in variables so a plain `text-*` from the user wins at every breakpoint
      'text-(length:--number-field-input-font-size)/(--number-field-input-line-height) [--number-field-input-font-size:var(--text-base)] [--number-field-input-line-height:var(--text-base--line-height)] sm:[--number-field-input-font-size:var(--text-sm)] sm:[--number-field-input-line-height:var(--text-sm--line-height)]',
      'autofill:shadow-[inset_0_0_0_1000px_transparent] autofill:[-webkit-text-fill-color:var(--field-foreground)] autofill:caret-(--field-foreground) autofill:[transition:background-color_9999s_ease-in-out_0s]',
    ],
    incrementButton: [
      ...button,
      'rounded-s-none rounded-e-field border-s border-field-placeholder/15',
      '[&_[data-slot=number-field-increment-button-icon]]:size-4',
    ],
    decrementButton: [
      ...button,
      'rounded-s-field rounded-e-none border-e border-field-placeholder/15',
      '[&_[data-slot=number-field-decrement-button-icon]]:size-4',
    ],
  },
  variants: {
    variant: {
      primary: { base: '' },
      secondary: {
        group: [
          'shadow-none [--number-field-group-bg:var(--default)] [--number-field-group-bg-hover:var(--default-hover)] [--number-field-group-bg-focus:var(--default)]',
          '[--number-field-group-bg-current:var(--number-field-group-bg)]',
          'hover:not-focus-within:[--number-field-group-bg-current:var(--number-field-group-bg-hover)]',
          'focus-within:[--number-field-group-bg-current:var(--number-field-group-bg-focus)]',
          'data-[invalid=true]:[--number-field-group-bg-current:var(--number-field-group-bg-focus)]',
        ],
      },
    },
    fullWidth: {
      false: { base: '' },
      true: { base: 'w-full', group: 'w-full' },
    },
  },
  defaultVariants: {
    fullWidth: false,
    variant: 'primary',
  },
}
