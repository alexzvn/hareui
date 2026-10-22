// Card-style checkbox buttons. The default indicator reuses the `checkbox` theme's `control` / `indicator`
// classes: the card carries `group/checkbox` and the checkbox state attributes, so it renders the same
// control as a plain `Checkbox`.
export default {
  slots: {
    base: [
      'flex flex-col gap-3 [--checkbox-button-group-item-radius:var(--radius-2xl)]',
    ],
    item: [
      'group/checkbox relative flex flex-col items-stretch gap-4 px-5 py-4 text-start text-sm font-medium text-foreground',
      'rounded-(--checkbox-button-group-item-radius) border border-border bg-surface',
      'cursor-(--cursor-interactive) outline-none no-highlight',
      'data-[selected=true]:border-transparent data-[selected=true]:ring-2 data-[selected=true]:not-focus-visible:ring-accent',
      'focus-visible:status-focused',
      // Reka sets `data-disabled=""` on the control (group or item disabled)
      'data-disabled:status-disabled',
      // Default checkmark, as the `checkbox` theme's root sizes it
      '[&_[data-slot=checkbox-default-indicator--checkmark]]:size-2.5 [&_[data-slot=checkbox-default-indicator--checkmark]]:stroke-[2.5px] [&_[data-slot=checkbox-default-indicator--checkmark]]:text-accent-foreground [&_[data-slot=checkbox-default-indicator--checkmark]]:transition-all [&_[data-slot=checkbox-default-indicator--checkmark]]:duration-200 motion-reduce:[&_[data-slot=checkbox-default-indicator--checkmark]]:transition-none',
      'data-[selected=true]:[&_[data-slot=checkbox-default-indicator--checkmark]]:[transition:stroke-dashoffset_150ms_linear_15ms]',
    ],
    icon: 'shrink-0 [:where(&_svg)]:size-6',
    content: 'flex min-w-0 flex-col',
    // Wraps the title and description next to an icon.
    itemText: 'flex min-w-0 flex-col gap-0.5',
    itemLabel: 'text-sm font-medium text-foreground',
    itemDescription: 'text-xs text-wrap wrap-break-word text-muted',
    indicator: 'absolute end-4 top-3',
  },
  variants: {
    layout: {
      flex: { base: '' },
      grid: {
        base: [
          'grid',
          '[&>[data-slot=label]]:col-span-full [&>[data-slot=description]]:col-span-full [&>[data-slot=field-error]]:col-span-full',
        ],
      },
    },
    variant: {
      primary: { base: '' },
      secondary: { base: '' },
    },
    customIndicator: {
      // Default checkbox control. The `checkbox` theme rings it through `:has(:focus-visible)` and keys its hover
      // on `[data-slot=checkbox]`, neither of which matches the card, so both are restated against the card.
      false: {
        indicator: [
          'group-focus-visible/checkbox:status-focused',
          '[[data-slot=checkbox-button-group-item]:not([data-readonly=true][data-selected=true]):hover_&]:border-field-border-hover [[data-slot=checkbox-button-group-item]:hover_&]:before:bg-accent-hover',
        ],
      },
      // Custom icon: accent colored, fades in while selected.
      true: {
        indicator: [
          'text-accent opacity-0 [transition:opacity_150ms_ease-out] motion-reduce:transition-none [:where(&_svg)]:size-5',
          'group-data-[selected=true]/checkbox:opacity-100',
        ],
      },
    },
    withIcon: {
      // Without an icon the title and description sit directly in the content column.
      false: { itemText: 'contents' },
      // Icon on the left, title and description stacked on the right.
      true: { content: 'flex-row items-center gap-4' },
    },
  },
  defaultVariants: {
    layout: 'flex',
    variant: 'primary',
    customIndicator: false,
    withIcon: false,
  },
}
