import { h, isVNode, toRaw } from 'vue'
import type { FunctionalComponent } from 'vue'

import type { IconValue } from '@/types/icon'

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

/**
 * Renders an `IconValue` with `aria-hidden="true"`: a class string on an empty `<span>`, a component as is. Attributes
 * (`class`, `data-slot`, …) fall through onto the rendered element and can override `aria-hidden`. A component read
 * from reactive state (a toast in the queue, items in a `ref`) is unwrapped, so Vue renders it without a warning.
 */
export const IconRenderer: FunctionalComponent<{ icon: IconValue }> = ({ icon }) => {
  if (typeof icon === 'string') return h('span', { class: icon, 'aria-hidden': 'true' })

  if (isVNode(icon)) return icon

  return h(toRaw(icon), { 'aria-hidden': 'true' })
}

IconRenderer.props = ['icon']
