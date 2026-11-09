// Maps props to the BEM classes of ./drawer.css (ported from @heroui/styles components/drawer.css).
export default {
  slots: {
    backdrop: 'h-drawer__backdrop',
    content: 'h-drawer__content',
    dialog: 'h-drawer__dialog',
    header: 'h-drawer__header',
    heading: 'h-drawer__heading',
    body: 'h-drawer__body',
    footer: 'h-drawer__footer',
    handle: 'h-drawer__handle',
    // Utilities, not CSS: they go to CloseButton's `class`, where they win over its own BEM classes.
    closeTrigger: 'absolute end-4 top-4',
  },
  variants: {
    placement: {
      bottom: { content: 'h-drawer__content--bottom', dialog: 'h-drawer__dialog--bottom' },
      top: { content: 'h-drawer__content--top', dialog: 'h-drawer__dialog--top' },
      left: { content: 'h-drawer__content--left', dialog: 'h-drawer__dialog--left' },
      right: { content: 'h-drawer__content--right', dialog: 'h-drawer__dialog--right' },
    },
    variant: {
      opaque: { backdrop: 'h-drawer__backdrop--opaque' },
      blur: { backdrop: 'h-drawer__backdrop--blur' },
      transparent: { backdrop: 'h-drawer__backdrop--transparent' },
    },
  },
  defaultVariants: {
    placement: 'bottom',
    variant: 'opaque',
  },
}
