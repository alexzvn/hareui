// Maps props to the BEM classes of ./modal.css (ported from @heroui/styles components/modal.css).
// `placement` adds no class: modal.css reads the `data-placement` the container and dialog carry.
export default {
  slots: {
    backdrop: 'h-modal__backdrop',
    container: 'h-modal__container',
    dialog: 'h-modal__dialog',
    header: 'h-modal__header',
    heading: 'h-modal__heading',
    icon: 'h-modal__icon',
    body: 'h-modal__body',
    footer: 'h-modal__footer',
    // Utilities, not CSS: they go to CloseButton's `class`, where they win over its own BEM classes.
    closeTrigger: 'absolute end-4 top-4',
  },
  variants: {
    scroll: {
      inside: {
        dialog: 'h-modal__dialog--scroll-inside',
        body: 'h-modal__body--scroll-inside',
      },
      outside: {
        container: 'h-modal__container--scroll-outside',
        dialog: 'h-modal__dialog--scroll-outside',
        body: 'h-modal__body--scroll-outside',
      },
    },
    variant: {
      opaque: { backdrop: 'h-modal__backdrop--opaque' },
      blur: { backdrop: 'h-modal__backdrop--blur' },
      transparent: { backdrop: 'h-modal__backdrop--transparent' },
    },
    placement: {
      auto: {},
      top: {},
      center: {},
      bottom: {},
    },
    size: {
      xs: { dialog: 'h-modal__dialog--xs' },
      sm: { dialog: 'h-modal__dialog--sm' },
      md: { dialog: 'h-modal__dialog--md' },
      lg: { dialog: 'h-modal__dialog--lg' },
      cover: { dialog: 'h-modal__dialog--cover' },
      full: {
        container: 'h-modal__container--full',
        dialog: 'h-modal__dialog--full',
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
