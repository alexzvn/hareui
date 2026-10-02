// Translated from @heroui/styles components/toolbar.css
export default {
  slots: {
    base: 'grid w-fit grid-flow-col items-center gap-2',
    // `.toolbar .separator--vertical` / `.separator--horizontal`: merged into each Separator inside the toolbar.
    separatorVertical: 'h-1/2 self-center',
    separatorHorizontal: 'w-1/2 justify-center justify-self-center',
    // `.toolbar--vertical .button-group`: merged into each ButtonGroup inside the toolbar.
    buttonGroup: '',
  },
  variants: {
    orientation: {
      horizontal: { base: '' },
      vertical: { base: 'grid-flow-row items-start justify-start', buttonGroup: 'justify-start' },
    },
    attached: {
      true: { base: 'rounded-3xl bg-surface p-1 shadow-overlay' },
    },
  },
  defaultVariants: {
    orientation: 'horizontal',
    attached: false,
  },
}
