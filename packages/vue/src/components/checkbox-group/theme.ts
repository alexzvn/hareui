// Maps to the BEM class of ./checkbox-group.css (ported from @heroui/styles components/checkbox-group.css).
// Items reuse the `checkbox` theme's classes verbatim (HeroUI's CheckboxGroup renders the same `<Checkbox>` as its
// children); the variant reaches them, not the group.
export default {
  slots: {
    base: 'h-checkbox-group',
  },
  variants: {
    variant: {
      primary: {},
      secondary: {},
    },
  },
  defaultVariants: {
    variant: 'primary',
  },
}
