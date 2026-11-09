// Map to the BEM classes of ./combo-box.css (ported from
// @heroui/styles components/combo-box.css). Its `[data-slot=input]` rules are nested under the root as in HeroUI, so
// they outrank the Input classes by specificity.
export default {
  slots: {
    base: 'h-combo-box',
    // Extra classes for the Label (HeroUI renders a `Label` here; its own theme still applies)
    label: '',
    inputGroup: 'h-combo-box__input-group',
    // Extra classes for the `<input>` (HeroUI renders an `Input` here; its own theme still applies)
    input: '',
    value: 'h-combo-box__value',
    trigger: 'h-combo-box__trigger',
    popover: 'h-combo-box__popover',
  },
  variants: {
    fullWidth: {
      false: {},
      true: { base: 'h-combo-box--full-width', inputGroup: 'h-combo-box__input-group--full-width' },
    },
  },
  defaultVariants: {
    fullWidth: false,
  },
}
