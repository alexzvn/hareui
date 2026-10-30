// Translated from @heroui/styles components/drawer.css + drawer.styles.ts
// HeroUI slides the dialog with a `translate` transition toggled by `[data-entering]`/`[data-exiting]`.
// Reka's Presence only waits for CSS animations, so the same slide (same distance, durations and
// easing) is expressed as keyframes on `data-state`: `animate-drawer-in/out` (styles/keyframes.css), tw-animate's
// enter/exit without the `filter` channel so they stay on the compositor like HeroUI's transitions. State variants use
// `[&:where([data-state=…])]:` (zero added specificity) as in theme/modal.ts, so user utilities win.
export default {
  slots: {
    backdrop: [
      'fixed inset-x-0 top-(--visual-viewport-top) z-(--z-index-overlay)',
      'h-(--visual-viewport-height) w-full',
      '[&:where([data-state=open])]:animate-drawer-in [&:where([data-state=open])]:[--tw-duration:250ms] [&:where([data-state=open])]:ease-[cubic-bezier(0.32,0.72,0,1)] [&:where([data-state=open])]:fade-in-0',
      '[&:where([data-state=closed])]:animate-drawer-out [&:where([data-state=closed])]:[--tw-duration:200ms] [&:where([data-state=closed])]:ease-[cubic-bezier(0.32,0.72,0,1)] [&:where([data-state=closed])]:fade-out-0',
      '[&:where([data-state=closed])]:will-change-[opacity]',
      // HeroUI's resting transition. Enter/exit run on the keyframes above (animated opacity doesn't transition).
      '[transition:opacity_250ms_cubic-bezier(0.32,0.72,0,1)] motion-reduce:transition-none',
      'motion-reduce:[&:where([data-state=open])]:animate-none motion-reduce:[&:where([data-state=closed])]:animate-none',
    ],
    // Absolute, not HeroUI's second `fixed inset-0` box: it fills the backdrop, so it follows the
    // backdrop's visual-viewport `top` and height.
    content: ['pointer-events-none', 'absolute inset-0 flex min-w-0'],
    dialog: [
      'relative',
      'flex flex-col',
      'bg-overlay shadow-overlay outline-none',
      'p-6',
      'pointer-events-auto',
      // Exit only: a resting `will-change` keeps Chrome's layer rastered at the last fractional frame of the
      // enter keyframes (blurred edges/text that vary per open). HeroUI animates `translate` itself, so it
      // can keep `will-change: translate` at rest; our keyframes animate `transform`.
      '[&:where([data-state=closed])]:will-change-transform',
      // HeroUI's resting transition (`transform`-based keyframes above don't trigger it); drag snap-back sets its own inline.
      '[transition:translate_250ms_cubic-bezier(0.32,0.72,0,1)] motion-reduce:transition-none',
      '[&:where([data-state=open])]:animate-drawer-in [&:where([data-state=open])]:[--tw-duration:250ms] [&:where([data-state=open])]:ease-[cubic-bezier(0.32,0.72,0,1)]',
      '[&:where([data-state=closed])]:animate-drawer-out [&:where([data-state=closed])]:[--tw-duration:200ms] [&:where([data-state=closed])]:ease-[cubic-bezier(0.32,0.72,0,1)]',
      'motion-reduce:[&:where([data-state=open])]:animate-none motion-reduce:[&:where([data-state=closed])]:animate-none',
    ],
    header: 'flex flex-col gap-3 mb-0 [[data-slot=drawer-handle]+&]:mt-0',
    heading: 'align-middle text-base font-medium text-foreground',
    body: [
      'min-h-0 flex-1 scrollbar',
      'text-sm leading-[1.43] text-muted',
      '-m-[3px] my-0 p-[3px]',
      'overflow-y-auto overscroll-contain [-webkit-overflow-scrolling:touch]',
      'touch-pan-y',
      '[[data-slot=drawer-header]+&]:mt-2',
      '[[data-slot=drawer-handle]+&]:mt-0',
    ],
    footer: [
      'flex flex-row items-center justify-end gap-2 mt-0',
      '[[data-slot=drawer-header]+&]:mt-5',
      '[[data-slot=drawer-body]+&]:mt-5',
    ],
    handle: [
      'flex items-center justify-center pb-2',
      '[&>[data-slot=drawer-handle-bar]]:h-1 [&>[data-slot=drawer-handle-bar]]:w-9 [&>[data-slot=drawer-handle-bar]]:rounded-xs [&>[data-slot=drawer-handle-bar]]:bg-separator',
    ],
    closeTrigger: 'absolute end-4 top-4',
  },
  variants: {
    placement: {
      // 85% of the visible area, not HeroUI's `85vh`: with the iOS keyboard open `85vh` is taller than the visible
      // area, so the panel's header ends up off screen.
      bottom: {
        content: 'items-end',
        dialog: [
          'w-full max-h-[calc(var(--visual-viewport-height)*0.85)]',
          '[border-start-start-radius:min(32px,var(--radius-2xl))] [border-start-end-radius:min(32px,var(--radius-2xl))]',
          '[&:where([data-state=open])]:slide-in-from-bottom [&:where([data-state=closed])]:slide-out-to-bottom',
        ],
      },
      top: {
        content: 'items-start',
        dialog: [
          'w-full max-h-[calc(var(--visual-viewport-height)*0.85)]',
          '[border-end-start-radius:min(32px,var(--radius-2xl))] [border-end-end-radius:min(32px,var(--radius-2xl))]',
          'pb-2',
          '[&:where([data-state=open])]:slide-in-from-top [&:where([data-state=closed])]:slide-out-to-top',
        ],
        handle: 'pb-0',
      },
      left: {
        content: 'justify-start',
        dialog: [
          'h-full rounded-none w-80 max-w-[85vw] sm:w-96',
          '[&:where([data-state=open])]:slide-in-from-left [&:where([data-state=closed])]:slide-out-to-left',
        ],
      },
      right: {
        content: 'justify-end',
        dialog: [
          'h-full rounded-none w-80 max-w-[85vw] sm:w-96',
          '[&:where([data-state=open])]:slide-in-from-right [&:where([data-state=closed])]:slide-out-to-right',
        ],
      },
    },
    variant: {
      opaque: { backdrop: 'bg-backdrop' },
      blur: { backdrop: 'bg-backdrop backdrop-blur-md' },
      transparent: { backdrop: 'bg-transparent' },
    },
  },
  defaultVariants: {
    placement: 'bottom',
    variant: 'opaque',
  },
}
