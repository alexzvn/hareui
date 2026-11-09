// Maps props to the BEM classes of ./toolbar.css (ported from @heroui/styles components/toolbar.css).
export default {
  slots: {
    base: 'h-toolbar',
    // Merged into each Separator inside the toolbar; `.h-toolbar .h-separator--*` sizes them.
    separatorVertical: '',
    separatorHorizontal: '',
    // Merged into each ButtonGroup inside the toolbar; `.h-toolbar--vertical .h-button-group` aligns them.
    buttonGroup: '',
  },
  variants: {
    orientation: {
      horizontal: {},
      vertical: { base: 'h-toolbar--vertical' },
    },
    attached: {
      true: { base: 'h-toolbar--attached' },
    },
  },
  defaultVariants: {
    orientation: 'horizontal',
    attached: false,
  },
}
