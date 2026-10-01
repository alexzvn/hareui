// Translated from @heroui/styles components/radio-group.css (base) and components/radio.css (item, content, control, indicator).
// Each item mirrors HeroUI's state attributes (`data-selected`, `data-disabled`, `data-invalid` = "true").
export default {
  slots: {
    base: 'flex flex-col',
    item: [
      'group/radio flex flex-col items-start gap-1 outline-none no-highlight cursor-(--cursor-interactive)',
      '[&_[data-slot=label]]:select-none',
      // `& > [data-slot=description]`, `& > [data-slot=field-error]`; `&&` beats FieldError's own toggle-field reset (`p-0`)
      '[&>[data-slot=description]]:w-full [&>[data-slot=description]]:min-w-0 [&>[data-slot=description]]:cursor-default [&>[data-slot=description]]:ps-7 [&>[data-slot=description]]:text-xs [&>[data-slot=description]]:text-wrap [&>[data-slot=description]]:wrap-break-word [&>[data-slot=description]]:text-muted [&>[data-slot=description]]:select-none',
      '[&>[data-slot=field-error]]:w-full [&>[data-slot=field-error]]:min-w-0 [&>[data-slot=field-error]]:cursor-default [&&>[data-slot=field-error]]:ps-7 [&>[data-slot=field-error]]:text-xs [&>[data-slot=field-error]]:text-wrap [&>[data-slot=field-error]]:wrap-break-word [&>[data-slot=field-error]]:text-muted [&>[data-slot=field-error]]:select-none',
      'data-[disabled=true]:status-disabled data-[disabled=true]:[&_[data-slot=description]]:status-disabled data-[disabled=true]:[&_[data-slot=field-error]]:status-disabled',
    ],
    content: [
      'group/radio-content relative inline-flex cursor-[inherit] items-center gap-3 text-start text-sm font-medium text-foreground outline-none focus-visible:[outline:none] select-none no-highlight',
      '[&_[data-slot=label]]:cursor-(--cursor-interactive)',
    ],
    control: [
      'relative inline-flex size-4 shrink-0 items-center justify-center rounded-lg border [border-width:var(--border-width-field)] border-field-border bg-field shadow-field outline-none no-highlight',
      '[transition:background-color_200ms_var(--ease-out),border-color_200ms_var(--ease-out),transform_100ms_var(--ease-out)] motion-reduce:transition-none',
      'cursor-(--cursor-interactive)',
      'group-focus-visible/radio-content:status-focused',
      // HeroUI keys radio hover on RAC's `data-hovered` only, which a read-only group never sets
      '[[data-slot=radio-group]:not([data-readonly=true])_[data-slot=radio-content]:hover_&]:border-field-border-hover',
      '[[data-slot=radio-content]:active_&]:scale-95',
      'group-data-[selected=true]/radio:border-transparent group-data-[selected=true]/radio:bg-accent',
      '[[data-slot=radio][data-selected=true]_[data-slot=radio-content]:active_&]:bg-accent-hover',
      '[[data-slot=radio][data-invalid=true]_&]:status-invalid-field',
    ],
    indicator: [
      'pointer-events-none absolute inset-0 flex items-center justify-center',
      'empty:before:h-full empty:before:w-full empty:before:rounded-lg empty:before:bg-field empty:before:[scale:1] empty:before:content-[\'\']',
      'empty:before:[transition:scale_200ms_var(--ease-out),background-color_200ms_var(--ease-out)] motion-reduce:empty:before:transition-none',
      '[[data-slot=radio-group]:not([data-readonly=true])_[data-slot=radio]:not([data-selected=true])_[data-slot=radio-content]:hover_&]:empty:before:bg-field-hover',
      'group-data-[selected=true]/radio:empty:before:bg-accent-foreground group-data-[selected=true]/radio:empty:before:[scale:0.4286]',
      '[[data-slot=radio][data-selected=true]_[data-slot=radio-content]:active_&]:empty:before:[scale:0.5714]',
    ],
  },
  variants: {
    variant: {
      primary: { base: '' },
      secondary: {
        control: [
          'shadow-none bg-(--radio-control-bg) [--radio-control-bg:var(--default)] [--radio-control-bg-hover:var(--default-hover)]',
        ],
        indicator: [
          '[[data-slot=radio]:not([data-selected=true])_&]:empty:before:bg-(--radio-control-bg)',
          '[[data-slot=radio-group]:not([data-readonly=true])_[data-slot=radio]:not([data-selected=true])_[data-slot=radio-content]:hover_&]:empty:before:bg-(--radio-control-bg-hover)',
        ],
      },
    },
    orientation: {
      // `:where()` mirrors HeroUI's `@layer components` rule: any user utility (e.g. `**:data-[slot=radio]:mt-0`) wins
      vertical: { base: '[:where(&)_[data-slot=radio]]:mt-4' },
      horizontal: { base: 'flex-row flex-wrap gap-4' },
    },
  },
  defaultVariants: {
    variant: 'primary',
    orientation: 'vertical',
  },
}
