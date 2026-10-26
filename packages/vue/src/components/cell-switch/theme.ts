// A settings-cell row around Switch. The slots are merged into Switch's own slots (base → base, trigger → content,
// control → control, thumb → thumb), so they only carry what differs from the plain switch.
// The root is `data-slot="cell-switch"`, so the Switch and FieldError rules keyed on `[data-slot=switch]` are repeated here.
// The row background follows `--cell-bg-current`, so a plain `bg-*` class in `ui.trigger` wins in every state.
export default {
  slots: {
    base: [
      'w-full items-stretch',
      // FieldError's toggle-field reset; the error sits below the row, aligned with the label text
      '[&>[data-slot=field-error]]:m-0 [&>[data-slot=field-error]]:h-auto [&>[data-slot=field-error]]:min-h-0 [&>[data-slot=field-error]]:p-0 [&>[data-slot=field-error]]:opacity-100 [&>[data-slot=field-error]]:[transition:none] [&&>[data-slot=field-error]]:ps-3',
    ],
    trigger: [
      'flex h-9 w-full items-center gap-3 rounded-field px-3 text-sm font-medium text-field-foreground shadow-field outline-none select-none no-highlight cursor-(--cursor-interactive)',
      'border-(length:--border-width-field) border-(--field-border)',
      'bg-(--cell-bg-current) [--cell-bg-current:var(--cell-bg)] [--cell-bg:var(--field-background,var(--default))] [--cell-bg-hover:var(--field-hover)] [--cell-bg-focus:var(--field-focus)]',
      '[transition:background-color_150ms_var(--ease-smooth),border-color_150ms_var(--ease-smooth),box-shadow_150ms_var(--ease-out)] motion-reduce:transition-none',
      '[@media(hover:hover)]:hover:[--cell-bg-current:var(--cell-bg-hover)] [@media(hover:hover)]:hover:border-(--field-border-hover)',
      'focus-visible:status-focused focus-visible:border-(--field-border-focus) focus-visible:[--cell-bg-current:var(--cell-bg-focus)]',
      // The row fades again inside the faded root, so a disabled row's text ends at 0.25
      'in-data-disabled:status-disabled',
    ],
    label: 'min-w-0 flex-1 truncate text-start text-sm font-medium text-foreground',
    // Switch renders the control before the label; `order-last` puts it at the end of the row.
    // The focus ring belongs to the row, so the switch's own control ring is cancelled.
    control: [
      'order-last shrink-0 group-has-focus-visible/switch:[box-shadow:none]!',
      '[[data-slot=cell-switch]:hover_&]:[--switch-control-bg-current:var(--switch-control-bg-hover)]',
      '[[data-slot=cell-switch]:active_&]:[--switch-control-bg-current:var(--switch-control-bg-pressed)]',
      '[[data-slot=cell-switch][data-selected=true]:hover_&]:[--switch-control-bg-current:var(--switch-control-bg-checked-hover)]',
      '[[data-slot=cell-switch][data-selected=true]:active_&]:[--switch-control-bg-current:var(--switch-control-bg-checked-hover)]',
    ],
    thumb: '[[data-slot=cell-switch][data-disabled=true][data-selected=true]_&]:opacity-40',
  },
  variants: {
    variant: {
      default: {},
      secondary: {
        // Unchecked control: muted at 20% (30% while pressed); checked keeps the accent.
        base: '[--switch-control-bg:color-mix(in_oklab,var(--muted)_20%,transparent)] [--switch-control-bg-hover:var(--switch-control-bg)] [--switch-control-bg-pressed:color-mix(in_oklab,var(--muted)_30%,transparent)]',
        trigger:
          'shadow-none [--cell-bg:var(--default)] [--cell-bg-hover:var(--default-hover)] [--cell-bg-focus:var(--default)]',
      },
    },
  },
  defaultVariants: {
    variant: 'default',
  },
}
