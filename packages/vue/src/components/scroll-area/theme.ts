// ScrollArea: a scroll container that renders `items` in a flex column (or row), all of them or only the window in
// view when virtualized.
// - The root scrolls along `orientation` only and clips the other axis; with an external scroll element
//   (`virtualize.getScrollElement`) it grows inline instead and lets that element scroll.
// - Virtualized items are absolutely positioned inside a viewport sized to the whole list, so the viewport's flex
//   layout only applies to plain items.
// - Keyboard users can focus the root (it is a scroll region), so it shows the focus ring.
export default {
  slots: {
    root: 'relative scrollbar outline-none focus-visible:status-focused',
    viewport: 'relative flex',
    item: '',
  },
  variants: {
    orientation: {
      vertical: {
        root: 'overflow-x-hidden overflow-y-auto',
        viewport: 'flex-col',
      },
      horizontal: {
        root: 'overflow-x-auto overflow-y-hidden',
        viewport: 'flex-row',
      },
    },
    externalScroll: {
      true: { root: 'overflow-visible' },
    },
  },
  defaultVariants: {
    orientation: 'vertical',
    externalScroll: false,
  },
}
