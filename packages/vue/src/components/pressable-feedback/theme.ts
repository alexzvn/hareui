// Press feedback layers sit absolutely over the root's content and never take pointer events. Hover and press
// read the root's `data-hovered` / `data-pressed`; a disabled root hides every layer.
export default {
  slots: {
    base: [
      'relative isolate inline-flex overflow-hidden outline-none select-none no-highlight [-webkit-touch-callout:none]',
      'cursor-(--cursor-interactive)',
      'focus-visible:status-focused',
      'disabled:status-disabled aria-disabled:status-disabled',
    ],
    // Hover 8 % and press 12 % of the current colour (`--pressable-feedback-hover-opacity`,
    // `--pressable-feedback-pressed-opacity`), fading in 150 ms.
    highlight: [
      'pointer-events-none absolute inset-0 rounded-[inherit] bg-current opacity-0',
      'transition-opacity duration-150 ease-out motion-reduce:transition-none',
      '[[data-hovered=true]:not([data-pressed=true])>&]:opacity-(--pressable-feedback-hover-opacity)',
      '[[data-pressed=true]>&]:opacity-(--pressable-feedback-pressed-opacity)',
      '[:disabled>&]:hidden [[aria-disabled=true]>&]:hidden',
    ],
    // The `::before` layer is the hover tint; waves are its children. Hidden in forced-colours mode.
    ripple: [
      'pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit] forced-colors:hidden',
      'before:absolute before:inset-0 before:bg-current before:opacity-0 before:transition-opacity before:duration-(--pressable-feedback-ripple-duration) motion-reduce:before:transition-none',
      '[[data-hovered=true]>&]:before:opacity-(--pressable-feedback-hover-opacity)',
      '[:disabled>&]:hidden [[aria-disabled=true]>&]:hidden',
    ],
    // A soft-edged circle: solid up to 70px (or 35 %) from its edge, fading out over 375 ms once released.
    rippleWave: [
      'pointer-events-none absolute top-0 left-0 origin-center rounded-full',
      'bg-[radial-gradient(closest-side,currentColor_max(100%_-_70px,65%),transparent_100%)]',
      'opacity-(--pressable-feedback-pressed-opacity) transition-opacity duration-[375ms] data-[released=true]:opacity-0',
    ],
    // Hold and progress overlays reveal with a linear clip-path sweep over `--pressable-feedback-duration` and snap
    // back over `--pressable-feedback-release-duration`. Under reduced motion they fade instead of sweeping.
    hold: [
      'pointer-events-none absolute inset-0 flex items-center justify-center gap-[inherit] rounded-[inherit] bg-accent text-accent-foreground',
      'transition-[clip-path,opacity] duration-(--pressable-feedback-release-duration) ease-out',
      'data-[state=holding]:[clip-path:inset(0)] data-[state=holding]:duration-(--pressable-feedback-duration) data-[state=holding]:ease-linear',
      'data-[state=complete]:[clip-path:inset(0)] data-[state=complete]:transition-none',
      'motion-reduce:[clip-path:inset(0)] motion-reduce:opacity-0 motion-reduce:data-[state=holding]:opacity-100 motion-reduce:data-[state=complete]:opacity-100',
      '[:disabled>&]:hidden [[aria-disabled=true]>&]:hidden',
    ],
    progress: [
      'pointer-events-none absolute inset-0 flex items-center justify-center gap-[inherit] rounded-[inherit] bg-accent text-accent-foreground',
      'transition-[clip-path,opacity] duration-(--pressable-feedback-release-duration) ease-out',
      'data-[state=progressing]:[clip-path:inset(0)] data-[state=progressing]:duration-(--pressable-feedback-duration) data-[state=progressing]:ease-linear',
      'data-[state=complete]:[clip-path:inset(0)] data-[state=complete]:transition-none',
      'motion-reduce:[clip-path:inset(0)] motion-reduce:opacity-0 motion-reduce:data-[state=progressing]:opacity-100 motion-reduce:data-[state=complete]:opacity-100',
      '[:disabled>&]:hidden [[aria-disabled=true]>&]:hidden',
    ],
  },
  variants: {
    holdSweep: {
      right: { hold: '[clip-path:inset(0_100%_0_0)]' },
      left: { hold: '[clip-path:inset(0_0_0_100%)]' },
      down: { hold: '[clip-path:inset(0_0_100%_0)]' },
      up: { hold: '[clip-path:inset(100%_0_0_0)]' },
    },
    progressSweep: {
      right: { progress: '[clip-path:inset(0_100%_0_0)]' },
      left: { progress: '[clip-path:inset(0_0_0_100%)]' },
      down: { progress: '[clip-path:inset(0_0_100%_0)]' },
      up: { progress: '[clip-path:inset(100%_0_0_0)]' },
    },
  },
  defaultVariants: {
    holdSweep: 'right',
    progressSweep: 'right',
  } as const,
}
