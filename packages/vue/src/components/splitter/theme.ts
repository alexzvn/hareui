// Splitter:
// - Handle: a 1px line (`bg-separator`, or the `-secondary` / `-tertiary` separator for the other variants) that turns
//   `separator-secondary` while a pointer is within its hit area and `accent-soft` while dragged, with a 120ms `ease`
//   color transition (none with reduced motion). The line itself is the only element in the flow; the grab area
//   around it (5px each side for a mouse, 15px for touch) is tracked by pointer position, not by a wider box.
// - Grips sit centred over the line: a 6×32px `pill` (`bg-default`, `default-hover` when hovered or dragged), or a
//   13×20px `drag` chip (4px radius, `bg-default`, `text-muted` 10px dots that turn `foreground` on hover). Vertical
//   splitters swap the axes. The `handle` type keeps the pill and drops the line, so it floats between the panels.
// - The handle stacks above both panels, so grips and custom handle content are never covered by the next panel.
// - Focus is the 2px focus ring with a 2px background-colored offset, drawn under the grip on a pseudo-element 4px
//   short of each end so a container that clips the splitter doesn't cut its caps. Disabled handles fade to the
//   disabled opacity.
export default {
  slots: {
    root: 'min-h-0 min-w-0',
    panel: 'relative flex min-h-0 min-w-0 overflow-hidden',
    handle: [
      'group/handle relative z-1 flex shrink-0 grow-0 items-center justify-center outline-none no-highlight',
      'transition-colors duration-120 ease-[ease] motion-reduce:transition-none',
      'data-[state=hover]:bg-separator-secondary data-[state=drag]:bg-accent-soft',
      'after:pointer-events-none after:absolute after:-z-1 after:rounded-full focus-visible:after:status-focused',
      'data-disabled:status-disabled',
    ],
    indicator: [
      'pointer-events-none absolute top-1/2 left-1/2 z-1 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center bg-default',
      'transition-colors duration-120 ease-[ease] motion-reduce:transition-none',
      'group-data-[state=drag]/handle:bg-default-hover group-data-[state=hover]/handle:bg-default-hover',
    ],
    icon: 'block size-2.5 shrink-0',
  },
  variants: {
    orientation: {
      horizontal: {
        handle: 'w-px cursor-col-resize after:inset-x-0 after:inset-y-1',
      },
      vertical: {
        handle: 'h-px cursor-row-resize after:inset-x-1 after:inset-y-0',
      },
    },
    variant: {
      primary: {
        handle: 'bg-separator',
      },
      secondary: {
        handle: 'bg-separator-secondary',
      },
      tertiary: {
        handle: 'bg-separator-tertiary',
      },
    },
    type: {
      line: {
        indicator: 'rounded-full',
      },
      drag: {
        indicator: [
          'rounded-sm text-muted',
          'group-data-[state=drag]/handle:text-foreground group-data-[state=hover]/handle:text-foreground',
        ],
      },
      pill: {
        indicator: 'rounded-full',
      },
      handle: {
        handle: 'bg-transparent data-[state=drag]:bg-transparent data-[state=hover]:bg-transparent',
        indicator: 'rounded-full',
      },
    },
  },
  compoundVariants: [
    {
      orientation: 'horizontal',
      type: ['line', 'pill', 'handle'],
      class: { indicator: 'h-8 w-1.5' },
    },
    {
      orientation: 'vertical',
      type: ['line', 'pill', 'handle'],
      class: { indicator: 'h-1.5 w-8' },
    },
    {
      orientation: 'horizontal',
      type: 'drag',
      class: { indicator: 'h-5 w-3.25' },
    },
    {
      orientation: 'vertical',
      type: 'drag',
      class: { indicator: 'h-3.25 w-5' },
    },
  ],
  defaultVariants: {
    orientation: 'horizontal',
    variant: 'primary',
    type: 'line',
  },
}
