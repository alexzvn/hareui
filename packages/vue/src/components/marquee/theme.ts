// Marquee: the default slot is repeated in a row (or column) of copies. Each copy slides by its own length plus the gap
// and starts over, so the strip loops without a seam.
// - 64px between items and between copies (`--marquee-gap`), one loop every 20s (`--marquee-duration`). Set either
//   variable on the root to change them.
// - The edge fade covers a third of each end, from `--background` to transparent, above the content.
// - Copies hold still when reduced motion is requested (system setting or `data-reduce-motion="true"`).
// - Right-to-left pages slide the other way, so the strip still runs from the end towards the start.
// - Horizontal: the root takes its container's full width and never widens it, whatever the copies' combined length
//   (`contain: inline-size` leaves them out of its intrinsic width). Vertical: the root needs a height.
// - Only the scrolling axis is clipped, so items' shadows and borders show in full across it.
export default {
  slots: {
    root: 'group/marquee relative flex items-center gap-(--marquee-gap) [--marquee-duration:20s] [--marquee-gap:--spacing(16)]',
    content:
      'flex min-w-max shrink-0 items-center justify-around gap-(--marquee-gap) backface-hidden motion-reduce:[animation-play-state:paused]',
  },
  variants: {
    orientation: {
      horizontal: {
        root: 'w-full flex-row overflow-x-clip contain-inline-size',
        content: 'w-full flex-row animate-marquee rtl:animate-marquee-rtl',
      },
      vertical: {
        root: 'flex-col overflow-y-clip',
        content: 'h-fit flex-col animate-marquee-vertical',
      },
    },
    pauseOnHover: {
      true: {
        content: 'group-hover/marquee:[animation-play-state:paused]',
      },
    },
    reverse: {
      true: {
        content: '![animation-direction:reverse]',
      },
    },
    overlay: {
      true: {
        root: "before:pointer-events-none before:absolute before:z-2 before:from-background before:to-transparent before:content-[''] after:pointer-events-none after:absolute after:z-2 after:from-background after:to-transparent after:content-['']",
      },
    },
  },
  compoundVariants: [
    {
      orientation: 'horizontal',
      overlay: true,
      class: {
        root: 'before:inset-y-0 before:start-0 before:h-full before:w-1/3 before:bg-linear-to-r after:inset-y-0 after:end-0 after:h-full after:w-1/3 after:bg-linear-to-l rtl:before:bg-linear-to-l rtl:after:bg-linear-to-r',
      },
    },
    {
      orientation: 'vertical',
      overlay: true,
      class: {
        root: 'before:inset-x-0 before:top-0 before:h-1/3 before:w-full before:bg-linear-to-b after:inset-x-0 after:bottom-0 after:h-1/3 after:w-full after:bg-linear-to-t',
      },
    },
  ],
  defaultVariants: {
    orientation: 'horizontal',
    overlay: true,
  },
}
