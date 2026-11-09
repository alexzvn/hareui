// Translated from @heroui/styles 3.2.7 components/sheet.css + sheet.styles.ts.
// The sheet moves by native scrolling (scroll snap), never by transforms on the panel: the backdrop fade and the
// stacked-sheet scale are scroll-driven animations bound to the dialog's view timeline (inline styles in
// `sheetGeometry.ts`, keyframes in styles/keyframes.css), so no slot here animates on its own.
// HeroUI's `[data-detached]` / `[data-snap-points]` selectors are the `detached` / `snap` variants, so tailwind-merge
// resolves the overrides instead of selector specificity.
export default {
  slots: {
    overlay: 'z-50 data-[closed]:pointer-events-none',
    // Only the bottom-most sheet of a stack dims the page (`variant` below).
    backdrop: 'bg-transparent motion-reduce:[animation-duration:1ms]',
    // The scroll container the sheet moves in. A handle drag scrolls it directly, so snapping pauses meanwhile.
    scroller: 'data-[handle-dragging]:snap-none!',
    content: [
      // Overscroll padding sits outside the height, so a 100% dialog fills the sheet.
      'z-1 box-content overflow-clip outline-none',
      // Promote only stacked sheets: Chrome rounds fractional bounds on promoted layers.
      'data-[has-descendants]:[transform:perspective(1000px)] data-[has-descendants]:will-change-transform',
      'motion-reduce:[animation-duration:1ms]',
    ],
    dialog:
      'relative flex min-h-0 flex-col overflow-hidden bg-overlay text-overlay-foreground shadow-overlay outline-none',
    header: 'flex shrink-0 flex-col gap-1 px-5 pt-4 pb-2',
    heading: 'text-lg font-semibold',
    body: [
      'min-h-0 flex-auto scrollbar overflow-hidden px-5 py-2',
      // The body scrolls only once the sheet is fully expanded, so a swipe at a snap point moves the sheet instead.
      '[[data-slot=sheet-content][data-expanded]_&]:overflow-y-auto [[data-slot=sheet-content][data-expanded]_&]:[-webkit-overflow-scrolling:touch]',
    ],
    footer: 'flex shrink-0 items-center justify-end gap-2 px-5 pt-2 pb-4',
    handle:
      'relative flex shrink-0 cursor-grab items-center justify-center py-3 data-[dragging]:cursor-grabbing',
    handleBar: 'block h-[0.3rem] w-8 rounded-full bg-default',
    closeTrigger: [
      'absolute top-3 right-3 z-10 cursor-(--cursor-interactive) text-muted outline-none no-highlight',
      'focus-visible:not-data-focused:status-focused data-[focus-visible=true]:status-focused',
      'disabled:status-disabled aria-disabled:status-disabled',
      'hover:text-foreground',
    ],
  },
  variants: {
    placement: {
      bottom: {
        content: 'max-h-[calc(100%-2rem)] w-full rounded-t-2xl',
        dialog: 'rounded-t-2xl',
      },
      top: {
        content: 'max-h-[calc(100%-2rem)] w-full rounded-b-2xl',
        dialog: 'rounded-b-2xl',
      },
      left: {
        content: 'h-full max-h-none w-[min(24rem,96vw)] rounded-r-2xl',
        dialog: 'rounded-r-2xl',
      },
      right: {
        content: 'h-full max-h-none w-[min(24rem,96vw)] rounded-l-2xl',
        dialog: 'rounded-l-2xl',
      },
    },
    variant: {
      opaque: { backdrop: 'data-[stack-index=0]:bg-backdrop' },
      blur: {
        backdrop: 'data-[stack-index=0]:bg-background/[0.01] data-[stack-index=0]:backdrop-blur-sm',
      },
      transparent: { backdrop: 'bg-transparent' },
    },
    detached: {
      true: {
        content: 'm-2 max-h-[calc(100%-1rem)] rounded-2xl',
        dialog: 'rounded-2xl',
      },
    },
    // Snap points need a definite size so flex children (a virtualized list) can fill it; the first snap point
    // reveals only part of that size.
    snap: {
      true: {},
    },
  },
  compoundVariants: [
    {
      placement: ['bottom', 'top'],
      detached: true,
      class: { content: 'w-[calc(100%-1rem)]' },
    },
    {
      placement: ['left', 'right'],
      detached: true,
      class: { content: 'h-[calc(100%-1rem)]' },
    },
    {
      placement: ['bottom', 'top'],
      snap: true,
      class: { content: 'h-full max-h-none' },
    },
    {
      placement: ['left', 'right'],
      snap: true,
      class: { content: 'w-full max-w-none' },
    },
    // The full snap position includes the detached margins inside the viewport.
    {
      placement: ['bottom', 'top'],
      detached: true,
      snap: true,
      class: { content: 'h-[calc(100%-1rem)]' },
    },
    {
      placement: ['left', 'right'],
      detached: true,
      snap: true,
      class: { content: 'w-[calc(100%-1rem)]' },
    },
  ],
  defaultVariants: {
    placement: 'bottom',
    variant: 'opaque',
  },
}
