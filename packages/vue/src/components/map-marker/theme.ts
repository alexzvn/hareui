// MapMarker: a 16px accent dot with a 2px surface ring, growing 125% while its popup is open. Labels are 12px medium
// text 4px from the dot, haloed in the surface color so they read on any tile. Tooltips are 12px overlay cards 8px
// from the marker, shown while it's hovered or focused.
export default {
  slots: {
    base: [
      'relative flex cursor-pointer items-center justify-center rounded-full outline-none',
      'focus-visible:status-focused data-draggable:cursor-move',
    ],
    dot: [
      'relative block size-4 rounded-full border-2 border-(--map-marker-ring-color) bg-(--map-marker-color) shadow-overlay',
      'transition-transform duration-200 in-data-open:scale-125 motion-reduce:transition-none',
    ],
    label: [
      'pointer-events-none absolute left-1/2 -translate-x-1/2 whitespace-nowrap',
      'text-xs font-medium text-foreground [text-shadow:0_0_2px_var(--surface),0_0_2px_var(--surface),0_0_3px_var(--surface)]',
    ],
    tooltip: [
      'pointer-events-none absolute z-10 w-max max-w-60 rounded-xl bg-overlay px-2.5 py-1.5 text-xs text-foreground',
      'shadow-overlay',
    ],
  },
  variants: {
    labelPosition: {
      top: { label: 'bottom-full mb-1' },
      bottom: { label: 'top-full mt-1' },
    },
    side: {
      top: { tooltip: 'bottom-full left-1/2 mb-2 -translate-x-1/2' },
      bottom: { tooltip: 'top-full left-1/2 mt-2 -translate-x-1/2' },
      left: { tooltip: 'top-1/2 right-full mr-2 -translate-y-1/2' },
      right: { tooltip: 'top-1/2 left-full ml-2 -translate-y-1/2' },
    },
  },
  defaultVariants: {
    labelPosition: 'top',
    side: 'top',
  },
}
