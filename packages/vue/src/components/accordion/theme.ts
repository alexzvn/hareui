// Translated from @heroui/styles components/accordion.css
export default {
  slots: {
    base: 'w-full [contain:layout_style]',
    // `.accordion__body` carries only typography; the padding lives on `bodyInner` (HeroUI's
    // `Accordion.Body` className target), same split as Disclosure.
    body: 'text-sm',
    bodyInner: 'px-4 pt-0 pb-4 text-muted',
    heading: 'flex',
    icon: 'me-2 size-4 shrink-0',
    indicator: [
      'ms-auto size-4 shrink-0 text-muted',
      'transition duration-250 motion-reduce:transition-none',
      'data-[expanded=true]:-rotate-180',
    ],
    item: [
      'relative border-none',
      // `::after` separator, hidden on the last item or when `hideSeparator` is set.
      'after:absolute after:start-0 after:bottom-0 after:h-px after:w-full after:rounded-xs after:bg-separator after:content-[""]',
      'last:after:content-none',
      'data-[hide-separator=true]:after:hidden',
    ],
    panel: [
      'h-(--disclosure-panel-height) overflow-clip opacity-0',
      // CRITICAL: motion-reduce must be after transition for correct override specificity.
      '[transition:height_200ms_var(--ease-out-quad),opacity_200ms_var(--ease-out)] motion-reduce:transition-none',
      'data-[expanded=true]:opacity-100 data-[expanded=true]:will-change-[height,opacity]',
    ],
    trigger: [
      'flex flex-1 cursor-(--cursor-interactive) items-center justify-between px-4 py-4 text-start text-sm font-medium no-highlight',
      '[transition:opacity_150ms_var(--ease-out),box-shadow_150ms_var(--ease-out)] motion-reduce:transition-none',
      // `@media (hover:hover){&:hover:not([aria-expanded="true"])}`, see Disclosure/Tabs for the pattern.
      '[@media(hover:hover){&:hover:not([aria-expanded=true])}]:bg-[color-mix(in_oklab,var(--foreground)_3%,transparent_90%)]',
      'focus-visible:status-focused',
      'disabled:status-disabled aria-disabled:status-disabled',
    ],
  },
  variants: {
    variant: {
      default: {},
      surface: {
        base: 'rounded-[min(32px,var(--radius-3xl))] bg-surface',
        trigger: '[@media(hover:hover){&:hover:not([aria-expanded=true])}]:bg-default',
        item: [
          'after:start-[3%] after:w-[94%] after:bg-surface-foreground/6',
          // Round the first item's trigger at the top, and the last item's trigger at the
          // bottom unless it is the currently-expanded one (kept square while open).
          '[&:first-child_[data-slot=accordion-trigger]]:rounded-t-[min(32px,var(--radius-3xl))]',
          '[&:last-child:not(:has([data-slot=accordion-trigger][aria-expanded=true]))_[data-slot=accordion-trigger]]:rounded-b-[min(32px,var(--radius-3xl))]',
        ],
      },
    },
  },
  defaultVariants: {
    variant: 'default',
  },
}
