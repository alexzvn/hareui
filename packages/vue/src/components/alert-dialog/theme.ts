// Translated from @heroui/styles components/alert-dialog.css + alert-dialog.styles.ts
// State variants use `[&:where([data-…])]:` (zero added specificity), as in theme/modal.ts, so user
// utilities such as `data-[state=open]:zoom-in-95` win over the theme.
export default {
  slots: {
    backdrop: [
      'fixed inset-x-0 top-(--visual-viewport-top) z-(--z-index-overlay) flex flex-row items-center justify-center',
      'h-(--visual-viewport-height) w-full',
      '[&:where([data-state=open])]:animate-in [&:where([data-state=open])]:[--tw-duration:150ms] [&:where([data-state=open])]:ease-out [&:where([data-state=open])]:fade-in-0',
      '[&:where([data-state=closed])]:animate-out [&:where([data-state=closed])]:[--tw-duration:100ms] [&:where([data-state=closed])]:ease-out [&:where([data-state=closed])]:fade-out-0',
      // Reka has no entering state, so only exiting gets will-change (see theme/modal.ts).
      '[&:where([data-state=closed])]:will-change-[opacity]',
      'motion-reduce:[&:where([data-state=open])]:animate-none motion-reduce:[&:where([data-state=closed])]:animate-none',
    ],
    container: [
      'flex flex-col items-center',
      'h-(--visual-viewport-height) w-full min-w-0 flex-1',
      'p-4 sm:w-fit sm:p-10',
      'pointer-events-none',
      '[&:where([data-state=open])]:animate-in [&:where([data-state=open])]:[--tw-duration:250ms] [&:where([data-state=open])]:ease-out-quad [&:where([data-state=open])]:fade-in-0 [&:where([data-state=open])]:zoom-in-105',
      '[&:where([data-state=closed])]:animate-out [&:where([data-state=closed])]:[--tw-duration:100ms] [&:where([data-state=closed])]:ease-out-quad [&:where([data-state=closed])]:fade-out-0 [&:where([data-state=closed])]:zoom-out-95',
      '[&:where([data-state=closed])]:will-change-[opacity,transform]',
      'motion-reduce:[&:where([data-state=open])]:animate-none motion-reduce:[&:where([data-state=closed])]:animate-none',
    ],
    dialog: [
      'relative',
      'flex min-h-0 w-full flex-col',
      'max-h-full',
      'bg-overlay shadow-overlay outline-none',
      '[border-radius:min(32px,var(--radius-3xl))]',
      'p-6',
      'overflow-clip',
      'pointer-events-auto',
      // Keeps the dialog mounted through the container's exit (see `presence-hold` in styles/keyframes.css).
      '[&:where([data-state=closed])]:animate-presence-hold',
    ],
    header: 'flex flex-col gap-3 mb-0',
    heading: 'align-middle text-base font-medium text-foreground',
    icon: [
      'flex items-center justify-center size-10 shrink-0 rounded-3xl select-none',
      '[&_[data-slot=alert-dialog-default-icon]]:box-content [&_[data-slot=alert-dialog-default-icon]]:size-5',
    ],
    body: [
      'min-h-0 flex-1 scrollbar',
      'text-sm leading-[1.43] text-muted',
      '-m-[3px] my-0 p-[3px]',
      'overflow-y-auto overscroll-contain [-webkit-overflow-scrolling:touch]',
      '[[data-slot=alert-dialog-header]+&]:mt-2',
    ],
    footer: [
      'flex flex-row items-center justify-end gap-2 mt-0',
      '[[data-slot=alert-dialog-header]+&]:mt-5',
      '[[data-slot=alert-dialog-body]+&]:mt-5',
    ],
    closeTrigger: 'absolute end-4 top-4',
  },
  variants: {
    status: {
      default: { icon: 'bg-default text-foreground' },
      accent: { icon: 'bg-accent-soft text-accent-soft-foreground' },
      success: { icon: 'bg-success-soft text-success-soft-foreground' },
      warning: { icon: 'bg-warning-soft text-warning-soft-foreground' },
      danger: { icon: 'bg-danger-soft text-danger-soft-foreground' },
    },
    variant: {
      opaque: { backdrop: 'bg-backdrop' },
      blur: { backdrop: 'bg-backdrop backdrop-blur-md' },
      transparent: { backdrop: 'bg-transparent' },
    },
    placement: {
      auto: {
        container:
          '[&:where([data-state=open])]:slide-in-from-bottom-1 sm:[&:where([data-state=open])]:slide-in-from-bottom-0',
        dialog: 'mt-auto sm:my-auto',
      },
      top: {
        container: '[&:where([data-state=open])]:slide-in-from-top-1',
        dialog: 'mt-0',
      },
      center: {
        container: '[&:where([data-state=open])]:slide-in-from-top-0',
        dialog: 'my-auto',
      },
      bottom: {
        container: '[&:where([data-state=open])]:slide-in-from-bottom-1',
        dialog: 'mt-auto',
      },
    },
    size: {
      xs: { dialog: 'max-w-xs' },
      sm: { dialog: 'max-w-sm' },
      md: { dialog: 'max-w-md' },
      lg: { dialog: 'max-w-lg' },
      cover: { dialog: 'h-full min-h-full w-full' },
    },
  },
  defaultVariants: {
    status: 'danger',
    size: 'md',
    variant: 'opaque',
    placement: 'auto',
  },
}
