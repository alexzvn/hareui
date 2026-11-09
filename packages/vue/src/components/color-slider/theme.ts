// Maps props to the BEM classes of ./color-slider.css (ported from @heroui/styles components/color-slider.css).
// `hasLabel` / `hasOutput` add no class: color-slider.css reads the parts with `:has()`. The empty variants keep them
// overridable through `ui`.
export default {
  slots: {
    base: 'h-color-slider',
    label: 'h-color-slider__label',
    output: 'h-color-slider__output',
    track: 'h-color-slider__track',
    thumb: 'h-color-slider__thumb',
  },
  variants: {
    orientation: {
      horizontal: { base: 'h-color-slider--horizontal' },
      vertical: { base: 'h-color-slider--vertical' },
    },
    hasLabel: { true: {}, false: {} },
    hasOutput: { true: {}, false: {} },
  },
  defaultVariants: {
    orientation: 'horizontal',
    hasLabel: false,
    hasOutput: false,
  },
}
