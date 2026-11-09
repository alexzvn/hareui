// Maps props to the BEM classes of ./alert-dialog.css (ported from @heroui/styles components/alert-dialog.css).
// `placement` adds no class: alert-dialog.css reads the `data-placement` the container and dialog carry.
export default {
  slots: {
    backdrop: 'h-alert-dialog__backdrop',
    container: 'h-alert-dialog__container',
    dialog: 'h-alert-dialog__dialog',
    header: 'h-alert-dialog__header',
    heading: 'h-alert-dialog__heading',
    icon: 'h-alert-dialog__icon',
    body: 'h-alert-dialog__body',
    footer: 'h-alert-dialog__footer',
    // Utilities, not CSS: they go to CloseButton's `class`, where they win over its own BEM classes.
    closeTrigger: 'absolute end-4 top-4',
  },
  variants: {
    status: {
      default: { icon: 'h-alert-dialog__icon--default' },
      accent: { icon: 'h-alert-dialog__icon--accent' },
      success: { icon: 'h-alert-dialog__icon--success' },
      warning: { icon: 'h-alert-dialog__icon--warning' },
      danger: { icon: 'h-alert-dialog__icon--danger' },
    },
    variant: {
      opaque: { backdrop: 'h-alert-dialog__backdrop--opaque' },
      blur: { backdrop: 'h-alert-dialog__backdrop--blur' },
      transparent: { backdrop: 'h-alert-dialog__backdrop--transparent' },
    },
    placement: {
      auto: {},
      top: {},
      center: {},
      bottom: {},
    },
    size: {
      xs: { dialog: 'h-alert-dialog__dialog--xs' },
      sm: { dialog: 'h-alert-dialog__dialog--sm' },
      md: { dialog: 'h-alert-dialog__dialog--md' },
      lg: { dialog: 'h-alert-dialog__dialog--lg' },
      cover: { dialog: 'h-alert-dialog__dialog--cover' },
    },
  },
  defaultVariants: {
    status: 'danger',
    size: 'md',
    variant: 'opaque',
    placement: 'auto',
  },
}
