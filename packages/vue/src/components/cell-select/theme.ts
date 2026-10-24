// Cell-style Select: a settings row with a leading label, the value and a chevrons indicator at the end.
// The row classes are shared with CellSwitch / CellSlider / CellColorPicker. CellSelect passes these slots to the
// wrapped Select's `ui`, where they are merged over the Select theme (tailwind-merge), so the overrides below
// (`min-h-0`, `py-0`, `flex-none`, `static`, …) neutralise the Select trigger/value/indicator layout.
export default {
  slots: {
    base: '',
    trigger: [
      'flex h-9 w-full items-center gap-3 rounded-field px-3 text-sm font-medium text-field-foreground shadow-field outline-none select-none no-highlight cursor-(--cursor-interactive)',
      'min-h-0 py-0 has-[[data-slot=select-indicator],[data-slot=select-default-indicator]]:pe-3',
      'border-(length:--border-width-field) border-(--field-border)',
      'bg-(--cell-bg-current) [--cell-bg-current:var(--cell-bg)] [--cell-bg:var(--field-background,var(--default))] [--cell-bg-hover:var(--field-hover)] [--cell-bg-focus:var(--field-focus)]',
      '[transition:background-color_150ms_var(--ease-smooth),border-color_150ms_var(--ease-smooth),box-shadow_150ms_var(--ease-out)] motion-reduce:transition-none',
      '[@media(hover:hover)]:hover:not-data-[pressed=true]:[--cell-bg-current:var(--cell-bg-hover)] [@media(hover:hover)]:hover:not-data-[pressed=true]:border-(--field-border-hover)',
      'data-[focus-visible=true]:status-focused data-[focus-visible=true]:border-(--field-border-focus) data-[focus-visible=true]:[--cell-bg-current:var(--cell-bg-focus)]',
      'disabled:status-disabled data-[disabled=true]:status-disabled',
      // Select's invalid ring is keyed on `[data-slot=select]`, which is renamed to `cell-select` here
      '[[data-slot=cell-select][data-invalid=true]_&]:status-invalid-field',
    ],
    label: 'min-w-0 flex-1 truncate text-start text-sm font-medium text-foreground',
    value: 'ms-auto min-w-0 flex-1 truncate text-end text-sm font-normal text-muted sm:text-sm',
    indicator: 'static inset-auto my-0 size-3 shrink-0 text-muted data-[open=true]:rotate-0 [&>svg]:size-full',
    popover: 'min-w-(--reka-popover-trigger-width)',
  },
  variants: {
    variant: {
      default: {},
      secondary: {
        trigger: 'shadow-none [--cell-bg:var(--default)] [--cell-bg-focus:var(--default)]',
      },
    },
  },
  defaultVariants: {
    variant: 'default',
  },
}
