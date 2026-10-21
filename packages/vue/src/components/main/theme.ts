// Main: fills the viewport below the page header. Set `--header-height` on an ancestor to reserve its height.
export default {
  slots: {
    base: 'min-h-[calc(100vh-var(--header-height,0px))]',
  },
}
