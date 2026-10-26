// Translated from @heroui/styles components/avatar-group.css
// `&>*` stands for `> .avatar` / `> .avatar-group__count`: every rendered child is an Avatar.
const STACKED_CHILD = '[&>*+*]:ms-[calc(-1*var(--avatar-group-overlap,0.5rem))]'

export default {
  slots: {
    base: 'inline-flex items-center [--avatar-group-overlap:0.5rem] [--avatar-group-seam:2px]',
    count: 'shrink-0',
  },
  variants: {
    grid: {
      true: { base: 'flex-wrap gap-3' },
      false: { base: STACKED_CHILD },
    },
    overlap: {
      clip: {},
      ring: {},
    },
  },
  compoundVariants: [
    {
      grid: false,
      overlap: 'ring',
      class: {
        base: '*:relative *:[box-shadow:0_0_0_var(--avatar-group-seam,2px)_var(--background)]',
      },
    },
    {
      // Crescent cut on the inline-end edge of every avatar but the last; fallback glyphs get an optical nudge.
      grid: false,
      overlap: 'clip',
      class: {
        base: [
          '[&>*:not(:last-child)]:[--avatar-group-cut-center:calc(100%_+_(var(--avatar-size,2.5rem)/2)_-_var(--avatar-group-overlap,0.5rem))]',
          'rtl:[&>*:not(:last-child)]:[--avatar-group-cut-center:calc(0%_-_(var(--avatar-size,2.5rem)/2)_+_var(--avatar-group-overlap,0.5rem))]',
          '[&>*:not(:last-child)]:[--avatar-group-cut-radius:calc((var(--avatar-size,2.5rem)/2)_+_var(--avatar-group-seam,2px))]',
          '[&>*:not(:last-child)]:[mask-image:radial-gradient(circle_at_var(--avatar-group-cut-center)_50%,transparent_var(--avatar-group-cut-radius),#000_var(--avatar-group-cut-radius))]',
          '[&>*:not(:last-child)_[data-slot=avatar-fallback]]:box-border',
          '[&>*:not(:last-child)_[data-slot=avatar-fallback]]:pe-[calc(var(--avatar-group-overlap,0.5rem)*0.35)]',
        ],
      },
    },
  ],
  defaultVariants: {
    grid: false,
    overlap: 'clip',
  },
}
