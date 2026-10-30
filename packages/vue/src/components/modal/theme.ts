// Translated from @heroui/styles components/modal.css + modal.styles.ts
// State/side variants use `[&:where([data-…])]:` (zero added specificity): HeroUI keeps these animations in
// @layer components, so user utilities such as `data-[state=open]:zoom-in-95` must win over the theme.
export default {
  slots: {
    backdrop: [
      'fixed inset-x-0 top-(--visual-viewport-top) z-(--z-index-overlay) flex flex-row items-center justify-center',
      'h-(--visual-viewport-height) w-full',
      '[&:where([data-state=open])]:animate-in [&:where([data-state=open])]:[--tw-duration:150ms] [&:where([data-state=open])]:ease-out [&:where([data-state=open])]:fade-in-0',
      '[&:where([data-state=closed])]:animate-out [&:where([data-state=closed])]:[--tw-duration:100ms] [&:where([data-state=closed])]:ease-out [&:where([data-state=closed])]:fade-out-0',
      // HeroUI sets will-change only while entering/exiting; Reka has no entering state, so only exiting gets it
      // (a permanent will-change puts the open dialog on its own layer and changes text rasterization).
      '[&:where([data-state=closed])]:will-change-[opacity]',
      'motion-reduce:[&:where([data-state=open])]:animate-none motion-reduce:[&:where([data-state=closed])]:animate-none',
    ],
    container: [
      'flex flex-col items-center',
      'h-(--visual-viewport-height) min-w-0 flex-1',
      'w-(--modal-container-width) [--modal-container-width:100%] sm:[--modal-container-width:fit-content]',
      'p-(--modal-container-padding) [--modal-container-padding:--spacing(4)] sm:[--modal-container-padding:--spacing(10)]',
      'pointer-events-none',
      '[&:where([data-state=open])]:animate-in [&:where([data-state=open])]:[--tw-duration:250ms] [&:where([data-state=open])]:ease-out-quad [&:where([data-state=open])]:fade-in-0',
      '[&:where([data-state=closed])]:animate-out [&:where([data-state=closed])]:[--tw-duration:100ms] [&:where([data-state=closed])]:ease-out-quad [&:where([data-state=closed])]:fade-out-0',
      '[&:where([data-state=closed])]:will-change-[opacity,transform]',
      'motion-reduce:[&:where([data-state=open])]:animate-none motion-reduce:[&:where([data-state=closed])]:animate-none',
    ],
    dialog: [
      'relative',
      'flex w-full flex-col',
      'bg-overlay shadow-overlay outline-none',
      '[border-radius:min(32px,var(--radius-3xl))]',
      'p-6',
      'pointer-events-auto',
      // Keeps the dialog mounted through the container's exit (see `presence-hold` in styles/keyframes.css).
      '[&:where([data-state=closed])]:animate-presence-hold',
    ],
    header: 'flex flex-col gap-3 mb-0',
    heading: 'align-middle text-base font-medium text-foreground',
    icon: 'flex items-center justify-center size-10 shrink-0 rounded-3xl select-none mb-0',
    body: [
      'min-h-0 flex-1',
      'text-sm leading-[1.43] text-muted',
      '-m-[3px] my-0 overflow-visible p-[3px]',
      '[[data-slot=modal-header]+&]:mt-2',
    ],
    footer: [
      'flex flex-row items-center justify-end gap-2 mt-0',
      '[[data-slot=modal-header]+&]:mt-5',
      '[[data-slot=modal-body]+&]:mt-5',
    ],
    closeTrigger: 'absolute end-4 top-4',
  },
  variants: {
    scroll: {
      inside: {
        dialog: 'max-h-full min-h-0 overflow-clip',
        body: 'scrollbar overflow-y-auto overscroll-contain [-webkit-overflow-scrolling:touch]',
      },
      outside: {
        backdrop: 'scrollbar items-start overflow-y-auto [-webkit-overflow-scrolling:touch]',
        container: 'h-auto min-h-(--visual-viewport-height) overflow-y-visible',
        dialog: 'h-auto min-h-0 shrink-0',
        body: 'overflow-y-visible',
      },
    },
    variant: {
      opaque: { backdrop: 'bg-backdrop' },
      blur: { backdrop: 'bg-backdrop backdrop-blur-md' },
      transparent: { backdrop: 'bg-transparent' },
    },
    placement: {
      auto: {
        dialog:
          'mt-auto mb-(--modal-dialog-margin-bottom) [--modal-dialog-margin-bottom:0px] sm:[--modal-dialog-margin-bottom:auto]',
      },
      top: {
        dialog: 'mt-0',
      },
      center: {
        dialog: 'my-auto',
      },
      bottom: {
        dialog: 'mt-auto',
      },
    },
    size: {
      xs: { dialog: 'max-w-xs' },
      sm: { dialog: 'max-w-sm' },
      md: { dialog: 'max-w-md' },
      lg: { dialog: 'max-w-lg' },
      cover: { dialog: 'h-full min-h-full w-full' },
      full: {
        // No zoom or slide: the enter/exit transforms are only added for the other sizes (compoundVariants below).
        container: 'p-0',
        dialog: 'h-full min-h-full w-full rounded-none shadow-none',
      },
    },
  },
  // The zoom and placement slide live here, not in the base/placement classes, so `size="full"` gets none:
  // overriding them with `zoom-in-100` loses in stylesheet order (`zoom-in-105` is emitted later).
  compoundVariants: [
    {
      size: ['xs', 'sm', 'md', 'lg', 'cover'],
      class: {
        container:
          '[&:where([data-state=open])]:zoom-in-105 [&:where([data-state=closed])]:zoom-out-95',
      },
    },
    {
      size: ['xs', 'sm', 'md', 'lg', 'cover'],
      placement: 'auto',
      class: {
        container:
          '[&:where([data-state=open])]:slide-in-from-bottom-1 sm:[&:where([data-state=open])]:slide-in-from-bottom-0',
      },
    },
    {
      size: ['xs', 'sm', 'md', 'lg', 'cover'],
      placement: 'top',
      class: { container: '[&:where([data-state=open])]:slide-in-from-top-1' },
    },
    {
      size: ['xs', 'sm', 'md', 'lg', 'cover'],
      placement: 'center',
      class: { container: '[&:where([data-state=open])]:slide-in-from-top-0' },
    },
    {
      size: ['xs', 'sm', 'md', 'lg', 'cover'],
      placement: 'bottom',
      class: { container: '[&:where([data-state=open])]:slide-in-from-bottom-1' },
    },
  ],
  defaultVariants: {
    scroll: 'inside',
    size: 'md',
    variant: 'opaque',
    placement: 'auto',
  },
}
