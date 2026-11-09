// Maps props to the BEM classes of ./disclosure.css (ported from @heroui/styles components/disclosure.css).
export default {
  slots: {
    base: 'h-disclosure',
    // `.disclosure__heading` has no rules in HeroUI's CSS: a plain structural wrapper.
    heading: '',
    trigger: 'h-disclosure__trigger',
    indicator: 'h-disclosure__indicator',
    content: 'h-disclosure__content',
    body: 'h-disclosure__body',
    // A structural wrapper carrying the consumer's classes (HeroUI's `Disclosure.Body className`).
    bodyInner: '',
  },
  variants: {},
  defaultVariants: {},
}
