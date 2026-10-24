// Cell-style ColorPicker: a settings row with a leading label, the hex value and a swatch at the end.
// The row classes are shared with CellSwitch / CellSlider / CellSelect. `trigger` and `popover` are passed to the
// wrapped ColorPicker's `ui` and merged over its theme (tailwind-merge); `base` is the CellColorPicker root.
export default {
  slots: {
    base: 'flex',
    trigger: [
      'flex h-9 w-full items-center gap-3 rounded-field px-3 text-sm font-medium text-field-foreground shadow-field outline-none select-none no-highlight cursor-(--cursor-interactive)',
      'border-(length:--border-width-field) border-(--field-border)',
      'bg-(--cell-bg-current) [--cell-bg-current:var(--cell-bg)] [--cell-bg:var(--field-background,var(--default))] [--cell-bg-hover:var(--field-hover)] [--cell-bg-focus:var(--field-focus)]',
      '[transition:background-color_150ms_var(--ease-smooth),border-color_150ms_var(--ease-smooth),box-shadow_150ms_var(--ease-out)] motion-reduce:transition-none',
      '[@media(hover:hover)]:hover:[--cell-bg-current:var(--cell-bg-hover)] [@media(hover:hover)]:hover:border-(--field-border-hover)',
      'focus-visible:status-focused focus-visible:border-(--field-border-focus) focus-visible:[--cell-bg-current:var(--cell-bg-focus)]',
      'disabled:status-disabled data-[disabled=true]:status-disabled',
    ],
    label: 'min-w-0 flex-1 truncate text-start text-sm font-medium text-foreground',
    valueDisplay: 'ms-auto shrink-0 truncate text-end text-sm font-normal text-muted',
    swatch: 'size-5 shrink-0 rounded-full',
    popover: '',
    presets: 'justify-center pt-2',
  },
  variants: {
    variant: {
      default: {},
      secondary: {
        trigger: 'shadow-none [--cell-bg:var(--default)] [--cell-bg-hover:var(--default-hover)] [--cell-bg-focus:var(--default)]',
      },
    },
  },
  defaultVariants: {
    variant: 'default',
  },
}
