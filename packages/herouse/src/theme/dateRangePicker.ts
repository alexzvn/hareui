// Translated from @heroui/styles components/date-range-picker.css (plus the range-picker-only
// `.date-input-group:has(.date-range-picker__range-separator)` rules from date-input-group.css, which
// live on the start/end inputs: see DateRangePicker.vue).
// Same Reka PopoverContent adaptation as `theme/datePicker.ts`: Reka keeps `data-state="open"` for the
// whole visible lifetime (no transient `data-entering`/`data-exiting`), so `--tw-animation-duration`
// feeds only the one-shot `animate-in`/`animate-out` keyframes and the steady-state transition
// properties are dropped.
// `.date-range-picker .date-input-group__suffix/__prefix { pointer-events-auto }` is applied as a direct
// `ui.suffix`/`ui.prefix` override on the embedded group in DateRangePicker.vue (twMerge drops the group's
// `pointer-events-none` cleanly).
export default {
  slots: {
    base: 'inline-flex flex-col gap-1',
    trigger: [
      'inline-flex w-full items-center rounded-field p-1 text-sm no-highlight cursor-(--cursor-interactive)',
      '[transition:box-shadow_150ms_var(--ease-out)] motion-reduce:transition-none',
      '[&:where(:focus-visible):not([data-focused])]:status-focused [&:where([data-focus-visible=true])]:status-focused',
      '[&:where(:disabled)]:status-disabled [&:where([data-disabled=true])]:status-disabled [&:where([aria-disabled=true])]:status-disabled',
    ],
    triggerIndicator: 'inline-flex size-4 items-center justify-center text-field-placeholder',
    rangeSeparator: 'px-1 text-field-placeholder select-none',
    popover: [
      'w-fit origin-(--reka-popover-content-transform-origin) scrollbar-none overflow-y-auto overscroll-contain bg-overlay p-3',
      'motion-reduce:transition-none',
      'z-(--z-index-overlay) [border-radius:min(32px,calc(var(--radius)*2.5))] [box-shadow:var(--overlay-shadow)]',
      '[&_[data-slot=range-calendar-nav-button-icon]]:rotate-0 [&_[data-slot=calendar-nav-button-icon]]:rotate-0',
      '[&:where(:focus-visible):not([data-focused])]:outline-none [&:where([data-focus-visible=true])]:outline-none',
      '[&:where([data-state=open])]:animate-in [&:where([data-state=open])]:[--tw-animation-duration:150ms] [&:where([data-state=open])]:ease-smooth [&:where([data-state=open])]:fade-in-0 [&:where([data-state=open])]:zoom-in-95',
      '[&:where([data-state=open])]:[&:where([data-side=top])]:slide-in-from-bottom-1 [&:where([data-state=open])]:[&:where([data-side=bottom])]:slide-in-from-top-1 [&:where([data-state=open])]:[&:where([data-side=left])]:slide-in-from-right-1 [&:where([data-state=open])]:[&:where([data-side=right])]:slide-in-from-left-1',
      '[&:where([data-state=closed])]:animate-out [&:where([data-state=closed])]:[--tw-animation-duration:100ms] [&:where([data-state=closed])]:ease-smooth [&:where([data-state=closed])]:zoom-out-95 [&:where([data-state=closed])]:fade-out [&:where([data-state=closed])]:pointer-events-none',
    ],
  },
  variants: {
    fullWidth: {
      false: { base: '' },
      true: { base: 'w-full' },
    },
  },
  defaultVariants: {
    fullWidth: false,
  },
}
