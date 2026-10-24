// Card-style radio buttons. The default indicator reuses the `radioGroup` theme's `control` / `indicator`
// classes: the card carries `group/radio` and the radio state attributes, so it renders the same dot as a
// plain `RadioGroup`. That theme keys hover / press / secondary colors on its own row markup, so `control`
// and `controlIndicator` repeat those states keyed on the card.
export default {
  slots: {
    base: [
      'flex flex-col gap-3 [--radio-button-group-item-radius:var(--radius-2xl)]',
    ],
    item: [
      'group/radio relative flex flex-col items-stretch gap-4 px-5 py-4 text-start text-sm font-medium text-foreground',
      'rounded-(--radio-button-group-item-radius) border border-border bg-surface',
      'cursor-(--cursor-interactive) outline-none no-highlight',
      'data-[selected=true]:border-transparent data-[selected=true]:ring-2 data-[selected=true]:not-focus-visible:ring-accent',
      'focus-visible:status-focused',
      // Reka sets `data-disabled=""` on the radio (group or item disabled)
      'data-disabled:status-disabled',
    ],
    icon: 'shrink-0 [:where(&_svg)]:size-6',
    content: 'flex min-w-0 flex-col',
    itemText: 'flex min-w-0 flex-col',
    itemLabel: 'text-sm font-medium text-foreground',
    itemDescription: 'text-xs text-wrap wrap-break-word text-muted',
    indicator: 'absolute end-4 top-3',
    control: [
      'group-focus-visible/radio:status-focused',
      '[[data-slot=radio-button-group-item]:not([data-readonly=true]):hover_&]:border-field-border-hover',
      'group-active/radio:scale-95',
      '[[data-slot=radio-button-group-item][data-selected=true]:active_&]:bg-accent-hover',
    ],
    controlIndicator: [
      '[[data-slot=radio-button-group-item]:not([data-readonly=true]):not([data-selected=true]):hover_&]:empty:before:bg-field-hover',
      '[[data-slot=radio-button-group-item][data-selected=true]:active_&]:empty:before:[scale:0.5714]',
    ],
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
      secondary: {
        controlIndicator: [
          '[[data-slot=radio-button-group-item]:not([data-selected=true])_&]:empty:before:bg-(--radio-control-bg)',
          '[[data-slot=radio-button-group-item]:not([data-readonly=true]):not([data-selected=true]):hover_&]:empty:before:bg-(--radio-control-bg-hover)',
        ],
      },
    },
    withIcon: {
      false: { content: '' },
      true: { content: 'flex-row items-center gap-4', itemText: 'gap-0.5' },
    },
    customIndicator: {
      false: { indicator: '' },
      // Custom icon: accent colored, fades in while selected.
      true: {
        indicator: [
          'text-accent opacity-0 [transition:opacity_150ms_ease-out] motion-reduce:transition-none [:where(&_svg)]:size-5',
          'group-data-[selected=true]/radio:opacity-100',
        ],
      },
    },
  },
  defaultVariants: {
    layout: 'flex',
    variant: 'primary',
    withIcon: false,
    customIndicator: false,
  },
}
