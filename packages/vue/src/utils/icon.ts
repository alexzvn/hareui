import { h } from 'vue'
import type { FunctionalComponent } from 'vue'

type SvgIconOptions = {
  /** One or more path definitions. */
  d: string | readonly string[]
  viewBox?: string
  /** Fill with the even-odd rule (glyphs with cut-outs). */
  isEvenOdd?: boolean
  /** Rendered as the `width` and `height` attributes; CSS sizing still wins. */
  size?: number
}

/**
 * A decorative `currentColor` SVG icon. It spreads its attributes onto the `svg`: a functional component without
 * declared props would otherwise only inherit `class` and `style`, dropping attributes such as `data-slot`.
 */
export const createSvgIcon = ({
  d,
  viewBox = '0 0 16 16',
  isEvenOdd = true,
  size,
}: SvgIconOptions): FunctionalComponent => {
  const paths = typeof d === 'string' ? [d] : d
  const fillRule = isEvenOdd ? { 'clip-rule': 'evenodd', 'fill-rule': 'evenodd' } : {}

  const icon: FunctionalComponent = (_, { attrs }) =>
    h(
      'svg',
      {
        'aria-hidden': 'true',
        fill: 'none',
        height: size,
        viewBox,
        width: size,
        xmlns: 'http://www.w3.org/2000/svg',
        ...attrs,
      },
      paths.map((path) => h('path', { d: path, fill: 'currentColor', ...fillRule })),
    )

  icon.inheritAttrs = false

  return icon
}
