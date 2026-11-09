// Maps props to the BEM classes of ./toast-provider.css (ported from @heroui/styles components/toast.css).
export default {
  slots: {
    region: 'h-toast-region',
    toast: 'h-toast',
    content: 'h-toast__content',
    indicator: 'h-toast__indicator',
    title: 'h-toast__title',
    description: 'h-toast__description',
    close: [
      'h-toast__close-button',
      // Utilities, not CSS: they go to CloseButton's `class` and must beat its own `.h-close-button` position, size,
      // background and transition, which a components-layer rule here would tie with.
      'absolute size-5 bg-default sm:bg-overlay hover:bg-default',
      '[transition:opacity_150ms_var(--ease-smooth)] motion-reduce:transition-none',
      '[&_[data-slot=close-button-icon]]:size-3.5 sm:[&_[data-slot=close-button-icon]]:size-3',
    ],
    action: 'h-toast__action',
  },
  variants: {
    placement: {
      bottom: { region: 'h-toast-region--bottom', toast: 'h-toast--bottom' },
      'bottom start': { region: 'h-toast-region--bottom-start', toast: 'h-toast--bottom-start' },
      'bottom end': { region: 'h-toast-region--bottom-end', toast: 'h-toast--bottom-end' },
      top: { region: 'h-toast-region--top', toast: 'h-toast--top' },
      'top start': { region: 'h-toast-region--top-start', toast: 'h-toast--top-start' },
      'top end': { region: 'h-toast-region--top-end', toast: 'h-toast--top-end' },
    },
    variant: {
      default: {},
      accent: { toast: 'h-toast--accent' },
      success: { toast: 'h-toast--success' },
      warning: { toast: 'h-toast--warning' },
      danger: { toast: 'h-toast--danger' },
    },
  },
  defaultVariants: {
    placement: 'bottom',
    variant: 'default',
  },
}
