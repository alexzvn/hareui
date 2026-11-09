// Maps props to the BEM classes of ./sheet.css (ported from @heroui/styles 3.2.7 components/sheet.css).
// `detached` and `snap` add no class: sheet.css reads the content's `data-detached` / `data-snap-points`. The empty
// variants keep them overridable through `ui`.
export default {
  slots: {
    overlay: 'h-sheet__overlay',
    backdrop: 'h-sheet__backdrop',
    // The scroll container the sheet moves in
    scroller: '',
    content: 'h-sheet__content',
    dialog: 'h-sheet__dialog',
    header: 'h-sheet__header',
    heading: 'h-sheet__heading',
    body: 'h-sheet__body',
    footer: 'h-sheet__footer',
    handle: 'h-sheet__handle',
    handleBar: 'h-sheet__handle-bar',
    // Utilities, not CSS: they go to CloseButton's `class`, where they win over its own BEM classes.
    closeTrigger: [
      'absolute top-3 right-3 z-10 cursor-(--cursor-interactive) text-muted outline-none no-highlight',
      'focus-visible:not-data-focused:status-focused data-[focus-visible=true]:status-focused',
      'disabled:status-disabled aria-disabled:status-disabled',
      'hover:text-foreground',
    ],
  },
  variants: {
    placement: {
      bottom: { content: 'h-sheet__content--bottom', dialog: 'h-sheet__dialog--bottom' },
      top: { content: 'h-sheet__content--top', dialog: 'h-sheet__dialog--top' },
      left: { content: 'h-sheet__content--left', dialog: 'h-sheet__dialog--left' },
      right: { content: 'h-sheet__content--right', dialog: 'h-sheet__dialog--right' },
    },
    variant: {
      opaque: { backdrop: 'h-sheet__backdrop--opaque' },
      blur: { backdrop: 'h-sheet__backdrop--blur' },
      transparent: { backdrop: 'h-sheet__backdrop--transparent' },
    },
    detached: {
      true: {},
    },
    snap: {
      true: {},
    },
  },
  defaultVariants: {
    placement: 'bottom',
    variant: 'opaque',
  },
}
