// Translated from @heroui/styles components/checkbox-group.css.
// Items reuse the `checkbox` theme's control/indicator/content classes verbatim (HeroUI's CheckboxGroup
// renders the same `<Checkbox>` component as its children); this theme only covers the group's own
// `flex flex-col` layout and the `mt-4` row spacing.
export default {
  slots: {
    base: [
      'flex flex-col',
      // `:where()` keeps specificity low, so a plain user utility (`**:data-[slot=checkbox]:mt-0`) can
      // still win, mirroring HeroUI's `@layer components` rule.
      '[:where(&)_[data-slot=checkbox]]:mt-4',
    ],
  },
  variants: {
    variant: {
      primary: { base: '' },
      secondary: { base: '' },
    },
  },
  defaultVariants: {
    variant: 'primary',
  },
}
