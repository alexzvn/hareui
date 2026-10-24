// Ghost styling layered over the Select theme: InlineSelect passes these classes as Select's `ui`, so they merge
// with (and win over) the Select slot classes, like `.inline-select__*` over `.select__*`.
export default {
  slots: {
    // `inline-flex` keeps the select in the text flow; its baseline is the trigger's text baseline
    base: 'inline-flex shrink-0 [--inline-select-value-max-width:12rem] [--inline-select-indicator-size:0.75rem]',
    // Transparent at rest and on focus; Select's hover var (`--field-hover`) still paints a rounded pill on hover
    trigger: [
      'min-h-0 gap-2 rounded-md border-0 px-1 py-0.5 text-sm text-muted shadow-none [--select-trigger-bg:transparent] [--select-trigger-bg-focus:transparent]',
      // Same variant as Select's `pe-7` (room for its absolute chevron) so tailwind-merge replaces it; the indicator here is in the flow
      'has-[[data-slot=select-indicator],[data-slot=select-default-indicator]]:pe-1',
      'transition-colors duration-100 motion-reduce:transition-none',
      '[@media(hover:hover)]:hover:text-foreground [@media(hover:hover)]:data-[hovered=true]:text-foreground',
      '[[data-slot=inline-select][data-invalid=true]_&]:status-invalid-field',
    ],
    value: 'max-w-(--inline-select-value-max-width) truncate',
    indicator: [
      'static my-0 size-(--inline-select-indicator-size) text-muted',
      'data-[open=true]:rotate-0',
      '[&>svg]:size-full',
    ],
    popover: '',
  },
}
