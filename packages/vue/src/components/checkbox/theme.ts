// Translated from @heroui/styles components/checkbox.css
// The root mirrors HeroUI's state attributes (`data-selected`, `data-indeterminate`, `data-disabled`, `data-invalid` = "true").
export default {
  slots: {
    base: [
      'group/checkbox flex flex-col items-start gap-1 outline-none no-highlight cursor-(--cursor-interactive)',
      // `& > [data-slot=description]`, `& > [data-slot=field-error]`
      '[&>[data-slot=description]]:w-full [&>[data-slot=description]]:min-w-0 [&>[data-slot=description]]:cursor-default [&>[data-slot=description]]:ps-7 [&>[data-slot=description]]:text-xs [&>[data-slot=description]]:text-wrap [&>[data-slot=description]]:wrap-break-word [&>[data-slot=description]]:text-muted [&>[data-slot=description]]:select-none',
      // `&&` doubles the root class so it beats FieldError's own toggle-field reset (`p-0`), as HeroUI's later-loaded checkbox.css does
      '[&>[data-slot=field-error]]:w-full [&>[data-slot=field-error]]:min-w-0 [&>[data-slot=field-error]]:cursor-default [&&>[data-slot=field-error]]:ps-7 [&>[data-slot=field-error]]:text-xs [&>[data-slot=field-error]]:text-wrap [&>[data-slot=field-error]]:wrap-break-word [&>[data-slot=field-error]]:text-muted [&>[data-slot=field-error]]:select-none',
      '[&_[data-slot=label]]:select-none',
      'data-[disabled=true]:status-disabled data-[disabled=true]:[&_[data-slot=description]]:status-disabled data-[disabled=true]:[&_[data-slot=field-error]]:status-disabled',
      // Default checkmark / indeterminate icons
      '[&_[data-slot=checkbox-default-indicator--checkmark]]:size-2.5 [&_[data-slot=checkbox-default-indicator--checkmark]]:stroke-[2.5px] [&_[data-slot=checkbox-default-indicator--checkmark]]:text-accent-foreground [&_[data-slot=checkbox-default-indicator--checkmark]]:transition-all [&_[data-slot=checkbox-default-indicator--checkmark]]:duration-200 motion-reduce:[&_[data-slot=checkbox-default-indicator--checkmark]]:transition-none',
      'data-[selected=true]:[&_[data-slot=checkbox-default-indicator--checkmark]]:[transition:stroke-dashoffset_150ms_linear_15ms]',
      'data-[invalid=true]:data-[selected=true]:[&_[data-slot=checkbox-default-indicator--checkmark]]:text-danger-foreground',
      'data-[indeterminate=true]:[&_[data-slot=checkbox-default-indicator--indeterminate]]:size-3',
      'data-[indeterminate=true]:data-[invalid=true]:[&_[data-slot=checkbox-default-indicator--indeterminate]]:text-danger-foreground',
    ],
    content: [
      'relative inline-flex cursor-[inherit] items-center gap-3 text-start text-sm font-medium text-foreground outline-none focus-visible:[outline:none] select-none no-highlight',
      '[&_[data-slot=label]]:cursor-(--cursor-interactive)',
    ],
    control: [
      'relative inline-flex size-4 shrink-0 items-center justify-center overflow-hidden rounded-md border [border-width:var(--border-width-field)] border-field-border bg-field shadow-field outline-none no-highlight',
      '[transition:background-color_200ms_var(--ease-out),border-color_200ms_var(--ease-out),transform_100ms_var(--ease-out)] motion-reduce:transition-none',
      'cursor-(--cursor-interactive)',
      "before:pointer-events-none before:absolute before:inset-0 before:z-0 before:origin-center before:scale-70 before:rounded-md before:bg-accent before:opacity-0 before:content-['']",
      'before:[transition:scale_100ms_var(--ease-linear),opacity_200ms_var(--ease-linear),background-color_200ms_var(--ease-out)] motion-reduce:before:transition-none',
      'group-has-focus-visible/checkbox:status-focused',
      // HeroUI's hover selector list includes `:has(… [data-hovered])`, so it out-ranks the selected rules. RAC never sets
      // `data-hovered` on a read-only field, leaving only the `:hover` branch, which ties with (and loses to) the selected rule.
      '[[data-slot=checkbox]:not([data-readonly=true][data-selected=true]):hover_&]:border-field-border-hover [[data-slot=checkbox]:hover_&]:before:bg-accent-hover',
      'group-data-[selected=true]/checkbox:border-transparent group-data-[selected=true]/checkbox:text-accent-foreground group-data-[selected=true]/checkbox:before:scale-100 group-data-[selected=true]/checkbox:before:opacity-100',
      'group-data-[indeterminate=true]/checkbox:bg-accent group-data-[indeterminate=true]/checkbox:text-accent-foreground',
      'group-active/checkbox:group-data-[indeterminate=true]/checkbox:bg-accent-hover',
      '[[data-slot=checkbox][data-invalid=true]:not([data-selected=true]):not([data-indeterminate=true])_&]:status-invalid-field',
      '[[data-slot=checkbox][data-invalid=true][data-selected=true]_&]:border-transparent [[data-slot=checkbox][data-invalid=true][data-selected=true]_&]:bg-danger [[data-slot=checkbox][data-invalid=true][data-selected=true]_&]:text-danger-foreground [[data-slot=checkbox][data-invalid=true][data-selected=true]_&]:before:scale-100 [[data-slot=checkbox][data-invalid=true][data-selected=true]_&]:before:bg-danger [[data-slot=checkbox][data-invalid=true][data-selected=true]_&]:before:opacity-100',
      '[[data-slot=checkbox][data-invalid=true][data-indeterminate=true]_&]:bg-danger [[data-slot=checkbox][data-invalid=true][data-indeterminate=true]_&]:text-danger-foreground',
    ],
    indicator: [
      // :where(): HeroUI's `.checkbox__indicator svg` sits in @layer components, so an icon's own utilities win.
      'relative z-10 flex size-3 items-center justify-center [:where(&_svg)]:size-full [:where(&_svg)]:transform-gpu',
      'group-data-[selected=true]/checkbox:border-accent-foreground group-data-[indeterminate=true]/checkbox:border-accent-foreground',
    ],
  },
  variants: {
    variant: {
      primary: { base: '' },
      secondary: {
        control: [
          'shadow-none bg-(--checkbox-control-bg) [--checkbox-control-bg:var(--default)]',
          'group-data-[selected=true]/checkbox:before:bg-accent',
          'group-data-[indeterminate=true]/checkbox:bg-accent group-data-[indeterminate=true]/checkbox:before:bg-accent',
        ],
      },
    },
  },
  defaultVariants: {
    variant: 'primary',
  },
}
