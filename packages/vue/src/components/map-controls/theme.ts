// MapControls: a column of control groups 6px apart, 8px from the map's edges. In the bottom right corner they sit
// above the attribution. Buttons are 32px tertiary icon buttons with 16px icons, in vertical groups with an overlay
// shadow; the compass needle follows the map's bearing and pitch.
export default {
  slots: {
    base: 'pointer-events-none absolute z-10 flex flex-col gap-1.5 *:pointer-events-auto',
    group: 'rounded-2xl bg-overlay shadow-overlay',
    button: 'size-8 min-w-8 p-0 text-foreground data-active:text-accent',
    icon: 'size-4',
    spinner: 'size-4',
    compassIcon:
      'size-5 transition-transform duration-200 [transform-style:preserve-3d] motion-reduce:transition-none',
  },
  variants: {
    position: {
      'top-left': { base: 'top-2 left-2' },
      'top-right': { base: 'top-2 right-2' },
      'bottom-left': { base: 'bottom-2 left-2' },
      'bottom-right': { base: 'right-2 bottom-9' },
    },
  },
  defaultVariants: {
    position: 'bottom-right',
  },
}
