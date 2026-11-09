// Maps the slots to the BEM classes of ./slider.css (ported from @heroui/styles components/slider.css).
export default {
  slots: {
    base: 'h-slider',
    // Styled by the root's `[data-slot=label]` rules; the slot exists so `:ui.label` can target the Label
    label: '',
    output: 'h-slider__output',
    track: 'h-slider__track',
    fill: 'h-slider__fill',
    thumb: 'h-slider__thumb',
  },
}
