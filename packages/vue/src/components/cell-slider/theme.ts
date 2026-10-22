// A settings-cell row around Slider: the whole row is the track, the fill tints it up to the value, and the thumb is
// a transparent hit area whose visible part is a thin `::after` pill. The track spans the root's single grid row, and
// the label and output sit on top of it in their own columns, so a long value pushes the label to truncate.
// The slots are merged into Slider's slots of the same name, so they override its horizontal styling.
// The root is `data-slot="cell-slider"`, so Slider's RTL thumb rule keyed on `[data-slot=slider]` is repeated here.
// The row background follows `--cell-bg-current`, so a plain `bg-*` class in `ui.track` wins in every state.
export default {
  slots: {
    // Slider resets its label to full opacity under a disabled root; a disabled row fades the label a second time
    base: [
      'isolate grid w-full grid-cols-[minmax(0,1fr)_auto] [grid-template-areas:"label_output"] items-center gap-3',
      '[&_[data-slot=label]]:w-auto data-disabled:[&_[data-slot=label]]:opacity-(--disabled-opacity)',
    ],
    track: [
      // `overflow-hidden` clips the fill and the thumb's pill to the rounded row
      'block overflow-hidden rounded-field text-field-foreground shadow-field outline-none no-highlight cursor-(--cursor-interactive) [grid-area:1/1/2/3]',
      'data-[orientation=horizontal]:h-9 data-[orientation=horizontal]:border-x-0',
      'border-(length:--border-width-field) border-(--field-border)',
      'bg-(--cell-bg-current) [--cell-bg-current:var(--cell-bg)] [--cell-bg:var(--field-background,var(--default))] [--cell-bg-hover:var(--field-hover)]',
      '[transition:background-color_150ms_var(--ease-smooth),border-color_150ms_var(--ease-smooth),box-shadow_150ms_var(--ease-out)] motion-reduce:transition-none',
      '[@media(hover:hover)]:hover:[--cell-bg-current:var(--cell-bg-hover)] [@media(hover:hover)]:hover:border-(--field-border-hover)',
      // Fade the row again inside the faded root
      'in-data-disabled:status-disabled',
    ],
    fill: 'inset-y-0 rounded-none bg-default',
    thumb: [
      'z-2 cursor-(--cursor-interactive) rounded-none bg-transparent',
      'data-[orientation=horizontal]:w-5 data-[orientation=horizontal]:after:h-4 data-[orientation=horizontal]:after:w-0.5',
      'after:rounded-md after:bg-foreground after:opacity-0 after:shadow-none',
      'after:transition-none after:[transition:opacity_150ms_var(--ease-smooth),transform_120ms_var(--ease-smooth)] motion-reduce:after:transition-none',
      '[@media(hover:hover)]:[[data-slot=slider-track]:hover_&:not([data-dragging=true])]:after:opacity-40',
      'data-[dragging=true]:cursor-(--cursor-interactive) data-[dragging=true]:after:scale-100 data-[dragging=true]:after:opacity-70 data-[dragging=true]:after:[transform:scaleY(1.5)]',
      // The focus ring goes on the pill, not on the hit area
      'data-[focus-visible=true]:[box-shadow:none]! data-[focus-visible=true]:after:status-focused data-[focus-visible=true]:after:opacity-70 data-[focus-visible=true]:after:[transform:scaleY(1.2)]',
      '[[data-slot=cell-slider][dir=rtl]_&]:data-[orientation=horizontal]:[--reka-slider-thumb-transform:translate(50%,-50%)]',
    ],
    label: 'pointer-events-none z-1 ms-3 min-w-0 truncate text-start text-sm font-medium text-foreground',
    output: 'pointer-events-none z-1 me-3 text-end text-sm font-normal text-muted tabular-nums in-data-disabled:opacity-(--disabled-opacity)',
  },
  variants: {
    variant: {
      default: {},
      secondary: {
        track: 'shadow-none [--cell-bg:var(--default)] [--cell-bg-hover:var(--surface-tertiary)]',
        fill: 'bg-muted/20',
      },
    },
  },
  defaultVariants: {
    variant: 'default',
  },
}
