// Translated from @heroui/styles components/toast.css + toast.styles.ts
// State variants use `[&:where([data-…])]:` (zero added specificity): HeroUI keeps these animations in
// @layer components, so user utilities such as `data-[exiting=true]:opacity-100` must win over the theme.
export default {
  slots: {
    region: [
      'pointer-events-none fixed z-(--z-index-toast) block outline-none',
      'w-[calc(100vw-2rem)] sm:w-auto sm:min-w-(--toast-width)',
      'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus',
    ],
    toast: [
      'absolute start-0 end-0 pointer-events-auto flex flex-row items-start justify-start gap-1.5 bg-surface px-4 py-3 shadow-overlay',
      'rounded-[min(32px,var(--radius-3xl))]',
      '[--toast-y:var(--offset-collapsed,0px)] [--toast-enter:0%] [--toast-scale:var(--scale-collapsed,1)]',
      '[transform:translateY(calc(var(--dir,1)*(var(--toast-y)+var(--toast-enter))))_scale(var(--toast-scale))]',
      '[height:var(--toast-height,auto)]',
      '[--toast-ease:var(--ease-out-fluid)] [--toast-enter-duration:350ms] [--toast-exit-duration:250ms]',
      '[--toast-translate-duration:var(--toast-enter-duration)] [--toast-height-duration:var(--toast-enter-duration)] [--toast-opacity-duration:150ms]',
      '[transition:transform_var(--toast-translate-duration)_var(--toast-ease),height_var(--toast-height-duration)_var(--toast-ease),opacity_var(--toast-opacity-duration)_var(--toast-ease)]',
      'motion-reduce:animate-none motion-reduce:transition-none',
      // Enter
      '[&:where([data-entering=true])]:[--toast-enter:-100%]',
      // Content fade between collapsed / expanded
      '[&>*:not([data-slot=toast-close])]:[transition:opacity_200ms_var(--toast-ease)] [&>*:not([data-slot=toast-close])]:motion-reduce:transition-none',
      // Collapsed non-front: force height to front toast (Sonner-style unified stack height)
      '[&:where(:not([data-frontmost=true]))]:[&:where(:not([data-expanded=true]))]:[--toast-y:var(--offset-collapsed,0px)]',
      '[&:where(:not([data-frontmost=true]))]:[&:where(:not([data-expanded=true]))]:[height:var(--front-height,0px)]',
      '[&:where(:not([data-frontmost=true]))]:[&:where(:not([data-expanded=true]))]:overflow-hidden',
      '[&:where(:not([data-frontmost=true]))]:[&:where(:not([data-expanded=true]))]:[&>*:not([data-slot=toast-close])]:opacity-0',
      '[&:where(:not([data-frontmost=true]))]:[&:where(:not([data-expanded=true]))]:[&_[data-slot=toast-close]]:pointer-events-none [&:where(:not([data-frontmost=true]))]:[&:where(:not([data-expanded=true]))]:[&_[data-slot=toast-close]]:opacity-0 [&:where(:not([data-frontmost=true]))]:[&:where(:not([data-expanded=true]))]:[&_[data-slot=toast-close]]:outline-none',
      // Expanded
      '[&:where([data-expanded=true])]:[--toast-y:var(--offset-expanded,0px)] [&:where([data-expanded=true])]:[--toast-scale:1] [&:where([data-expanded=true])]:[height:var(--toast-height,auto)]',
      // Expanded hit area that covers the gap between toasts
      "[&:where([data-expanded=true])]:after:content-[''] [&:where([data-expanded=true])]:after:absolute [&:where([data-expanded=true])]:after:z-[-1] [&:where([data-expanded=true])]:after:start-0 [&:where([data-expanded=true])]:after:end-0",
      // Exit
      '[&:where([data-exiting=true])]:opacity-0',
      '[&:where([data-exiting=true])]:[&:where([data-frontmost=true])]:[--toast-translate-duration:var(--toast-exit-duration)] [&:where([data-exiting=true])]:[&:where([data-frontmost=true])]:[--toast-opacity-duration:150ms] [&:where([data-exiting=true])]:[&:where([data-frontmost=true])]:[--toast-enter:-100%] [&:where([data-exiting=true])]:[&:where([data-frontmost=true])]:[--toast-scale:1]',
      '[&:where([data-exiting=true])]:[&:where([data-expanded=true])]:[&:where(:not([data-frontmost=true]))]:[--toast-translate-duration:200ms] [&:where([data-exiting=true])]:[&:where([data-expanded=true])]:[&:where(:not([data-frontmost=true]))]:[--toast-opacity-duration:150ms] [&:where([data-exiting=true])]:[&:where([data-expanded=true])]:[&:where(:not([data-frontmost=true]))]:[--toast-scale:0.96]',
      '[&:where([data-exiting=true])]:[&:where(:not([data-expanded=true]))]:[&:where(:not([data-frontmost=true]))]:[--toast-translate-duration:200ms] [&:where([data-exiting=true])]:[&:where(:not([data-expanded=true]))]:[&:where(:not([data-frontmost=true]))]:[--toast-opacity-duration:150ms] [&:where([data-exiting=true])]:[&:where(:not([data-expanded=true]))]:[&:where(:not([data-frontmost=true]))]:[--toast-scale:calc(var(--scale-collapsed,1)*0.96)]',
      // Hidden (beyond maxVisibleToasts)
      '[&:where([data-hidden=true])]:pointer-events-none [&:where([data-hidden=true])]:flex [&:where([data-hidden=true])]:opacity-0',
      'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus',
      // Reveal / hide the close button based on the toast's own state
      '[&:hover:where([data-frontmost=true])_[data-slot=toast-close]]:pointer-events-auto [&:hover:where([data-frontmost=true])_[data-slot=toast-close]]:opacity-100',
      '[&:hover:where([data-expanded=true])_[data-slot=toast-close]]:pointer-events-auto [&:hover:where([data-expanded=true])_[data-slot=toast-close]]:opacity-100',
      '[&:where([data-exiting=true])_[data-slot=toast-close]]:pointer-events-none [&:where([data-exiting=true])_[data-slot=toast-close]]:opacity-0',
    ],
    content: 'flex grow flex-col items-start self-center',
    indicator: [
      'flex shrink-0 items-center justify-center p-1 text-overlay-foreground select-none',
      '[&_[data-slot=toast-default-icon]]:box-content [&_[data-slot=toast-default-icon]]:size-4',
      '[&_[data-slot=spinner]]:size-4 [&_[data-slot=spinner-icon]]:size-4',
      // Settled promise icon (data-swapped skips first paint)
      '[&:where([data-swapped=true])]:[&>*:not([data-slot=spinner])]:animate-toast-indicator-swap [&:where([data-swapped=true])]:[&>*:not([data-slot=spinner])]:motion-reduce:animate-none',
    ],
    title: 'text-sm leading-5 font-medium text-overlay-foreground',
    description: 'text-sm text-muted',
    close: [
      'pointer-events-none absolute -end-1 -top-1 size-5 border-border bg-default opacity-0 sm:border sm:bg-overlay',
      '[transition:opacity_150ms_var(--ease-smooth)] motion-reduce:transition-none',
      '[&_[data-slot=close-button-icon]]:size-3.5 sm:[&_[data-slot=close-button-icon]]:size-3',
      'hover:bg-default',
    ],
    action: 'mt-2 sm:mt-0',
  },
  variants: {
    placement: {
      bottom: {
        region: 'bottom-4 left-1/2 -translate-x-1/2',
        toast:
          '[--dir:-1] bottom-0 [transform-origin:bottom_center] [&:where([data-expanded=true])]:after:top-[calc(-1*var(--gap,12px)-1px)] [&:where([data-expanded=true])]:after:bottom-0',
      },
      'bottom start': {
        region: 'start-4 bottom-4',
        toast:
          '[--dir:-1] bottom-0 [transform-origin:bottom_center] [&:where([data-expanded=true])]:after:top-[calc(-1*var(--gap,12px)-1px)] [&:where([data-expanded=true])]:after:bottom-0',
      },
      'bottom end': {
        region: 'end-4 bottom-4',
        toast:
          '[--dir:-1] bottom-0 [transform-origin:bottom_center] [&:where([data-expanded=true])]:after:top-[calc(-1*var(--gap,12px)-1px)] [&:where([data-expanded=true])]:after:bottom-0',
      },
      top: {
        region: 'top-4 left-1/2 -translate-x-1/2',
        toast:
          '[--dir:1] top-0 [transform-origin:top_center] [&:where([data-expanded=true])]:after:top-0 [&:where([data-expanded=true])]:after:bottom-[calc(-1*var(--gap,12px)-1px)]',
      },
      'top start': {
        region: 'start-4 top-4',
        toast:
          '[--dir:1] top-0 [transform-origin:top_center] [&:where([data-expanded=true])]:after:top-0 [&:where([data-expanded=true])]:after:bottom-[calc(-1*var(--gap,12px)-1px)]',
      },
      'top end': {
        region: 'end-4 top-4',
        toast:
          '[--dir:1] top-0 [transform-origin:top_center] [&:where([data-expanded=true])]:after:top-0 [&:where([data-expanded=true])]:after:bottom-[calc(-1*var(--gap,12px)-1px)]',
      },
    },
    variant: {
      default: {},
      accent: { title: 'text-accent-soft-foreground' },
      success: { title: 'text-success-soft-foreground', indicator: 'text-success-soft-foreground' },
      warning: { title: 'text-warning-soft-foreground', indicator: 'text-warning-soft-foreground' },
      danger: { title: 'text-danger-soft-foreground', indicator: 'text-danger-soft-foreground' },
    },
  },
  defaultVariants: {
    placement: 'bottom',
    variant: 'default',
  },
}
