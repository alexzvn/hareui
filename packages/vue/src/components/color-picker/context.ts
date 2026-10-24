import type { Color } from 'reka-ui'
import { inject, type InjectionKey, type Ref } from 'vue'

/**
 * Shared colour state a `ColorPicker` provides to the colour components rendered inside it,
 * mirroring RAC's ColorPicker, which feeds ColorArea/ColorSlider/ColorField/ColorSwatch/ColorSwatchPicker
 * through context. A child uses it only when it has no `modelValue` of its own.
 */
export type ColorPickerContext = {
  /** The picker's current colour. */
  color: Readonly<Ref<Color>>
  /** Updates the picker's colour (accepts any CSS colour string Reka's `parseColor` understands). */
  setColor: (color: Color | string) => void
}

export const ColorPickerContextKey: InjectionKey<ColorPickerContext> = Symbol('hareui.ColorPicker')

/** The enclosing ColorPicker's colour state, or `undefined` outside a ColorPicker. */
export const useColorPickerContext = (): ColorPickerContext | undefined => {
  return inject(ColorPickerContextKey, undefined)
}
