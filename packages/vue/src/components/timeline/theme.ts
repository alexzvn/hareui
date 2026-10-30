// Timeline: an `ol` of events, each a marker on a rail with a 2px `bg-separator` connector down (or across) to the
// next one.
// - Sizes set the marker and rail width (sm 22px, md 28px, lg 36px) and the rail-to-content gap (10/14/18px). Density
//   sets the space between events (compact 12px, comfortable 16px); the connector bridges it.
// - Markers are round with a 1px `border` (2px at lg), `text-muted` icons at 55% of the marker, semibold text (10px,
//   12px, 14px). Tones: `current` is `bg-accent-soft` with an accent border; success/warning/danger are a 12% tint with
//   a border mixed 55% into `border`; `muted` is the default at 70% opacity.
// - An avatar fills the marker without a border; fallback initials take the marker's text size.
// - The first line of the content is centred on the marker (1px/4px/6px top padding for 20/20/24px lines).
// - `axis: 'center'` puts the rail in the middle: the content takes one side and the date the other.
export default {
  slots: {
    root: 'm-0 flex list-none p-0',
    item: 'relative min-w-0',
    container: 'relative flex shrink-0',
    indicator: [
      'relative z-10 flex size-(--timeline-marker-size) shrink-0 items-center justify-center rounded-full border border-border bg-transparent font-semibold text-muted',
      '[&>svg]:size-[55%]',
    ],
    avatar: 'size-full rounded-full [&>[data-slot=avatar-fallback]]:text-[length:inherit]',
    separator: 'absolute bg-separator',
    wrapper: 'flex min-w-0 flex-col gap-0.5',
    date: 'text-xs leading-5 text-muted',
    title: 'leading-5 font-medium text-foreground',
    description: 'leading-5 text-pretty text-muted',
  },
  variants: {
    orientation: {
      vertical: {
        root: 'flex-col',
        item: 'grid gap-x-(--timeline-gap) pb-(--timeline-item-gap) last:pb-0',
        container: 'row-start-1 min-h-(--timeline-marker-size) justify-center',
        separator:
          'top-(--timeline-marker-size) bottom-[calc(var(--timeline-item-gap)*-1)] left-1/2 w-0.5 -translate-x-1/2',
        wrapper: 'min-h-(--timeline-marker-size)',
      },
      horizontal: {
        root: 'w-full flex-row',
        item: 'flex flex-1 flex-col gap-(--timeline-gap) pe-(--timeline-item-gap) last:pe-0',
        container: 'items-center',
        separator:
          'start-(--timeline-marker-size) end-[calc(var(--timeline-item-gap)*-1)] top-1/2 h-0.5 -translate-y-1/2',
      },
    },
    axis: {
      start: {},
      center: {},
    },
    side: {
      start: {},
      end: {},
    },
    size: {
      sm: {
        root: '[--timeline-gap:--spacing(2.5)] [--timeline-marker-size:--spacing(5.5)]',
        indicator: 'text-[10px]',
        title: 'text-xs',
        description: 'text-xs',
      },
      md: {
        root: '[--timeline-gap:--spacing(3.5)] [--timeline-marker-size:--spacing(7)]',
        indicator: 'text-xs',
        title: 'text-sm',
        description: 'text-xs',
      },
      lg: {
        root: '[--timeline-gap:--spacing(4.5)] [--timeline-marker-size:--spacing(9)]',
        indicator: 'border-2 text-sm',
        title: 'text-base leading-6',
        description: 'text-sm',
      },
    },
    density: {
      compact: { root: '[--timeline-item-gap:--spacing(3)]' },
      comfortable: { root: '[--timeline-item-gap:--spacing(4)]' },
    },
    color: {
      accent: {},
      success: {},
      warning: {},
      danger: {},
    },
    status: {
      default: {},
      current: { indicator: 'border-accent bg-accent-soft text-accent' },
      success: {
        indicator:
          'border-[color-mix(in_srgb,var(--color-success)_55%,var(--color-border))] bg-success/12 text-success',
      },
      warning: {
        indicator:
          'border-[color-mix(in_srgb,var(--color-warning)_55%,var(--color-border))] bg-warning/12 text-warning',
      },
      danger: {
        indicator:
          'border-[color-mix(in_srgb,var(--color-danger)_55%,var(--color-border))] bg-danger/12 text-danger',
      },
      muted: { indicator: 'opacity-70' },
    },
    hasAvatar: {
      true: { indicator: 'overflow-hidden border-0' },
    },
    filled: {
      true: {},
    },
  },
  compoundVariants: [
    {
      orientation: 'vertical',
      axis: 'start',
      class: {
        item: 'grid-cols-[var(--timeline-marker-size)_minmax(0,1fr)]',
        container: 'col-start-1',
        wrapper: 'col-start-2',
      },
    },
    {
      orientation: 'vertical',
      axis: 'center',
      class: {
        item: 'grid-cols-[minmax(0,1fr)_var(--timeline-marker-size)_minmax(0,1fr)]',
        container: 'col-start-2',
        wrapper: 'row-start-1',
        date: 'row-start-1',
      },
    },
    {
      orientation: 'vertical',
      axis: 'center',
      side: 'end',
      class: {
        wrapper: 'col-start-3 items-start text-start',
        date: 'col-start-1 justify-self-end text-end',
      },
    },
    {
      orientation: 'vertical',
      axis: 'center',
      side: 'start',
      class: {
        wrapper: 'col-start-1 items-end text-end',
        date: 'col-start-3 justify-self-start text-start',
      },
    },
    { orientation: 'vertical', size: 'sm', class: { wrapper: 'pt-px' } },
    { orientation: 'vertical', size: 'md', class: { wrapper: 'pt-1' } },
    { orientation: 'vertical', size: 'lg', class: { wrapper: 'pt-1.5' } },
    { orientation: 'vertical', axis: 'center', size: 'sm', class: { date: 'pt-px' } },
    { orientation: 'vertical', axis: 'center', size: 'md', class: { date: 'pt-1' } },
    { orientation: 'vertical', axis: 'center', size: 'lg', class: { date: 'pt-2' } },
    { filled: true, color: 'accent', class: { separator: 'bg-accent' } },
    { filled: true, color: 'success', class: { separator: 'bg-success' } },
    { filled: true, color: 'warning', class: { separator: 'bg-warning' } },
    { filled: true, color: 'danger', class: { separator: 'bg-danger' } },
  ],
  defaultVariants: {
    orientation: 'vertical',
    axis: 'start',
    side: 'end',
    size: 'md',
    density: 'comfortable',
    color: 'accent',
    status: 'default',
  },
}
