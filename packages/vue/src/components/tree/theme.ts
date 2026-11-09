// Maps props to the BEM classes of ./tree.css.
// Rows are `rounded-lg` (8px) with a 2px gap between the optional 16px checkbox, a 20px chevron slot (14px chevron,
// `text-muted`, rotating 90° in 150ms), the icon (`text-muted`) and the label (2px side padding).
// Hover, pressed and selected rows get `bg-default`; adjacent selected rows merge into one
// block. Nesting indents by `--tree-indent` per level and draws a 1px guide line (`currentColor` at 10%) 10px from the
// start of every ancestor level: through its chevron, or through its checkbox when rows have one. Nested lists animate
// their height and opacity over 200ms `ease-out`.
// A dragged row fades to 40%. A drop inside a folder tints it `bg-accent-soft` with a 2px inner `accent` outline; a
// drop before or after a row draws a 2px `accent` line on that edge, from the row's indent to its end.
// Sizes (row padding / font / icon / indent): sm 6×2px, 12px, 14px, 10px · md 8×4px, 14px, 16px, 12px ·
// lg 10×6px, 16px, 20px, 24px; rows are 20, 28 and 36px tall.
// Icon and checkbox slots stay utilities: an icon's own classes (an iconify class string) or the Checkbox's must not
// outrank them.
export default {
  slots: {
    root: 'group/tree h-tree',
    item: 'h-tree__item',
    listWithChildren: 'h-tree__group',
    link: 'group/row h-tree__link',
    guideLine: 'h-tree__guide-line',
    linkCheckbox: 'shrink-0',
    linkChevron: 'h-tree__chevron',
    linkIndicator: 'h-tree__link-indicator',
    linkLeadingIcon: 'shrink-0 text-muted',
    linkLabel: 'h-tree__label',
    linkTrailing: 'h-tree__trailing',
    linkTrailingIcon: 'shrink-0',
    dropIndicator: 'h-tree__drop-indicator',
    empty: 'h-tree__empty',
  },
  variants: {
    color: {
      default: {},
      accent: {
        root: 'h-tree--accent',
        linkLeadingIcon: 'group-data-selected/row:text-accent-soft-foreground',
      },
    },
    size: {
      sm: {
        root: 'h-tree--sm',
        linkLeadingIcon: 'size-3.5',
        linkTrailingIcon: 'size-3.5',
      },
      md: {
        root: 'h-tree--md',
        linkLeadingIcon: 'size-4',
        linkTrailingIcon: 'size-4',
      },
      lg: {
        root: 'h-tree--lg',
        linkLeadingIcon: 'size-5',
        linkTrailingIcon: 'size-5',
      },
    },
    showGuideLines: {
      true: {},
      false: { root: 'h-tree--guide-lines-false' },
      hover: { root: 'h-tree--guide-lines-hover' },
    },
  },
  defaultVariants: {
    color: 'default',
    size: 'md',
    showGuideLines: true,
  },
}
