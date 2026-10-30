// Each item holds one icon that crossfades from the inactive to the active color once the item is fully rated, an
// overlay (fractional items only) showing the filled icon clipped to the rated fraction at a static width, and one
// transparent radio per step, narrowest on top, so a press on the left half of an icon picks the half value.
export default {
  slots: {
    // The error drops its field inset so it lines up with the label, description and icons
    base: 'inline-flex flex-col items-start gap-1.5 [&>[data-slot=field-error]]:px-0',
    items: 'flex items-center',
    item: [
      'relative flex shrink-0 items-center justify-center no-highlight',
      '[transition:scale_150ms_ease] motion-reduce:transition-none',
    ],
    icon: [
      'flex shrink-0 items-center justify-center text-surface-tertiary [&>svg]:size-full',
      '[transition:color_100ms_ease-out] motion-reduce:transition-none',
    ],
    fill: 'pointer-events-none absolute inset-y-0 start-0 flex items-center overflow-hidden',
    step: [
      'absolute inset-y-0 start-0 cursor-[inherit] rounded-[calc(var(--radius)*0.5)] outline-none',
      'focus-visible:status-focused',
    ],
  },
  variants: {
    color: {
      warning: { icon: 'data-[active=true]:text-warning' },
      accent: { icon: 'data-[active=true]:text-accent' },
      success: { icon: 'data-[active=true]:text-success' },
      danger: { icon: 'data-[active=true]:text-danger' },
      default: { icon: 'data-[active=true]:text-foreground' },
    },
    // Icons are 16px / 20px / 28px with 4px / 5px / 8px between them
    size: {
      sm: { items: 'gap-1', icon: 'size-4' },
      md: { items: 'gap-[5px]', icon: 'size-5' },
      lg: { items: 'gap-2', icon: 'size-7' },
    },
    orientation: {
      horizontal: { items: 'flex-row' },
      vertical: { items: 'flex-col' },
    },
    readonly: {
      true: { item: 'cursor-default' },
      // A pressed item shrinks to 80%
      false: { item: 'cursor-(--cursor-interactive) active:scale-80' },
    },
    disabled: {
      true: { items: 'status-disabled' },
      false: { items: '' },
    },
  },
  defaultVariants: {
    color: 'warning',
    size: 'md',
    orientation: 'horizontal',
    readonly: false,
    disabled: false,
  },
}
