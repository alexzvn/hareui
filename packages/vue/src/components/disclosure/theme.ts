// Translated from @heroui/styles components/disclosure.css
export default {
  slots: {
    base: 'relative',
    // `.disclosure__heading` has no rules in HeroUI's CSS: a plain structural wrapper.
    heading: '',
    trigger: [
      'inline-block cursor-(--cursor-interactive) no-highlight',
      'focus-visible:status-focused',
      'disabled:status-disabled aria-disabled:status-disabled',
    ],
    indicator: [
      // Inside a Button, HeroUI's `.button svg` margin (higher specificity) beats `ms-auto`.
      '[:not([data-slot=button])>&]:ms-auto size-4 shrink-0 text-inherit',
      'transition duration-250 motion-reduce:transition-none',
      'data-[expanded=true]:-rotate-180',
    ],
    content: [
      'h-(--disclosure-panel-height) overflow-clip opacity-0',
      // CRITICAL: motion-reduce must be after transition for correct override specificity.
      '[transition:height_200ms_var(--ease-out-quad),opacity_200ms_var(--ease-out)] motion-reduce:transition-none',
      'data-[expanded=true]:opacity-100 data-[expanded=true]:will-change-[height,opacity]',
    ],
    body: 'p-2',
    // `.disclosure__body-inner` has no rules in HeroUI's CSS either: a structural wrapper that
    // carries the consumer's custom classes (HeroUI's `Disclosure.Body className`) without
    // touching `disclosure-body`'s own padding.
    bodyInner: '',
  },
  variants: {},
  defaultVariants: {},
}
