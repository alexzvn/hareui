// Carousel:
// Slides fill the viewport (`basis-full`) with no gap; set `basis-1/3` (or padding inside the slide) on `ui.item` for
// several per view. Arrows are tertiary `sm` icon-only buttons (36px, `bg-default`), centred on the slide edge and
// inset 20px (`in-place`) or set 60px outside it (`modal`). Dots are 8px `bg-default` circles 8px apart,
// `bg-accent` when selected, with a 200ms `ease` colour transition, 16px below the slides. Thumbnails are 64px
// `rounded-2xl` buttons 12px apart in a horizontal scroll shadow, 16px below; the selected one gets a 2px accent ring
// (a box shadow, so the row doesn't shift), hover dims to 85% and press scales to 95% over 150ms `ease`. The scroll
// shadow lines up with the slides; its 4px padding keeps the selection and focus rings inside the clipped area. An
// arrow that can't move further stays disabled but keeps its full opacity.
export default {
  slots: {
    root: 'relative focus-visible:outline-none',
    wrapper: 'relative',
    viewport: 'overflow-hidden',
    container: 'flex',
    item: 'relative min-w-0 shrink-0 grow-0 basis-full',
    prev: 'absolute disabled:opacity-100!',
    next: 'absolute disabled:opacity-100!',
    controls: 'mt-4 flex flex-col gap-4',
    dots: 'flex flex-wrap items-center justify-center gap-2',
    dot: [
      'size-2 cursor-(--cursor-interactive) rounded-full bg-default outline-none',
      'transition-[background-color] duration-200 ease-[ease] motion-reduce:transition-none',
      'focus-visible:status-focused data-[selected=true]:bg-accent',
    ],
    thumbnails: 'flex scroll-px-1 items-center justify-center-safe gap-3 p-1',
    thumbnail: [
      'relative size-16 shrink-0 cursor-(--cursor-interactive) overflow-hidden rounded-2xl outline-none',
      'transition-[box-shadow,opacity,scale] duration-150 ease-[ease] motion-reduce:transition-none',
      '[@media(hover:hover)]:hover:opacity-85 active:scale-95 focus-visible:status-focused',
      'data-[selected=true]:shadow-[0_0_0_2px_var(--accent)]',
      '[&>img]:size-full [&>img]:object-cover [&>img]:select-none',
    ],
  },
  variants: {
    orientation: {
      horizontal: {
        container: 'flex-row',
        prev: 'rtl:[&_svg]:-scale-x-100',
        next: 'rtl:[&_svg]:-scale-x-100',
      },
      vertical: {
        container: 'flex-col',
        prev: '[&_svg]:rotate-90',
        next: '[&_svg]:rotate-90',
      },
    },
    type: {
      'in-place': {},
      modal: {
        controls: 'mt-8',
      },
      miniatures: {
        prev: 'relative shrink-0',
        next: 'relative shrink-0',
        controls: 'flex-row items-center justify-center gap-2',
        thumbnails: 'min-w-0',
      },
    },
  },
  compoundVariants: [
    {
      orientation: 'horizontal',
      type: 'in-place',
      class: {
        prev: 'start-5 top-1/2 -translate-y-1/2',
        next: 'end-5 top-1/2 -translate-y-1/2',
      },
    },
    {
      orientation: 'horizontal',
      type: 'modal',
      class: {
        prev: '-start-15 top-1/2 -translate-y-1/2',
        next: '-end-15 top-1/2 -translate-y-1/2',
      },
    },
    {
      orientation: 'vertical',
      type: 'in-place',
      class: {
        prev: 'top-5 left-1/2 -translate-x-1/2',
        next: 'bottom-5 left-1/2 -translate-x-1/2',
      },
    },
    {
      orientation: 'vertical',
      type: 'modal',
      class: {
        prev: '-top-15 left-1/2 -translate-x-1/2',
        next: '-bottom-15 left-1/2 -translate-x-1/2',
      },
    },
  ],
  defaultVariants: {
    orientation: 'horizontal',
    type: 'in-place',
  },
}
