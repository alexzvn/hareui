// Translated from @heroui/styles components/modal.css + modal.styles.ts
export default {
  slots: {
    backdrop: [
      'fixed inset-0 z-(--z-index-overlay) flex flex-row items-center justify-center',
      'h-(--visual-viewport-height) w-full',
      'data-[state=open]:animate-in data-[state=open]:[--tw-duration:150ms] data-[state=open]:ease-out data-[state=open]:fade-in-0',
      'data-[state=closed]:animate-out data-[state=closed]:[--tw-duration:100ms] data-[state=closed]:ease-out data-[state=closed]:fade-out-0',
      'data-[state=open]:will-change-[opacity] data-[state=closed]:will-change-[opacity]',
      'motion-reduce:data-[state=open]:animate-none motion-reduce:data-[state=closed]:animate-none',
    ],
    container: [
      'flex flex-col items-center',
      'h-(--visual-viewport-height) min-w-0 flex-1',
      'w-(--modal-container-width) [--modal-container-width:100%] sm:[--modal-container-width:fit-content]',
      'p-(--modal-container-padding) [--modal-container-padding:--spacing(4)] sm:[--modal-container-padding:--spacing(10)]',
      'pointer-events-none',
      'data-[state=open]:animate-in data-[state=open]:[--tw-duration:250ms] data-[state=open]:ease-out-quad data-[state=open]:fade-in-0 data-[state=open]:zoom-in-105',
      'data-[state=closed]:animate-out data-[state=closed]:[--tw-duration:100ms] data-[state=closed]:ease-out-quad data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
      'data-[state=open]:will-change-[opacity,transform] data-[state=closed]:will-change-[opacity,transform]',
      'motion-reduce:data-[state=open]:animate-none motion-reduce:data-[state=closed]:animate-none',
    ],
    dialog: [
      'relative',
      'flex w-full flex-col',
      'bg-overlay shadow-overlay outline-none',
      '[border-radius:min(32px,var(--radius-3xl))]',
      'p-6',
      'pointer-events-auto',
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
        container: 'data-[state=open]:slide-in-from-bottom-1 sm:data-[state=open]:slide-in-from-bottom-0',
        dialog: 'mt-auto mb-(--modal-dialog-margin-bottom) [--modal-dialog-margin-bottom:0px] sm:[--modal-dialog-margin-bottom:auto]',
      },
      top: {
        container: 'data-[state=open]:slide-in-from-top-1',
        dialog: 'mt-0',
      },
      center: {
        container: 'data-[state=open]:slide-in-from-top-0',
        dialog: 'my-auto',
      },
      bottom: {
        container: 'data-[state=open]:slide-in-from-bottom-1',
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
        container: [
          'p-0',
          'data-[state=open]:slide-in-from-bottom-0 data-[state=open]:zoom-in-100 sm:data-[state=open]:slide-in-from-bottom-0',
          'data-[state=closed]:zoom-out-100',
        ],
        dialog: 'h-full min-h-full w-full rounded-none shadow-none',
      },
    },
  },
  defaultVariants: {
    scroll: 'inside',
    size: 'md',
    variant: 'opaque',
    placement: 'auto',
  },
}
