import type { EmblaPluginType } from 'embla-carousel'

import type { CarouselProps } from './Carousel.types'

type PluginProps = Pick<
  CarouselProps,
  'autoplay' | 'autoScroll' | 'autoHeight' | 'classNames' | 'fade' | 'wheelGestures'
>

type CarouselPluginKey = keyof PluginProps

type PluginLoader = {
  key: CarouselPluginKey
  load: () => Promise<EmblaPluginType>
}

// `true` enables a plugin with its defaults; an object passes its options.
const getPluginOptions = <O extends object>(value: boolean | O | undefined) =>
  typeof value === 'object' ? value : ({} as O)

/** Whether the arrows, dots and arrow keys stop a running plugin: unless its `stopOnInteraction` is `false`. */
export const isStoppedOnInteraction = (
  value: boolean | { stopOnInteraction?: boolean } | undefined,
) => {
  if (typeof value !== 'object') return true

  return value.stopOnInteraction ?? true
}

/**
 * One loader per plugin prop, in plugin order. Each package is imported only when its prop is set, so an app
 * installs only the plugins it uses.
 */
export const createPluginLoaders = (getProps: () => PluginProps): PluginLoader[] => [
  {
    key: 'autoplay',
    load: async () => {
      const { default: Autoplay } = await import('embla-carousel-autoplay')

      return Autoplay(getPluginOptions(getProps().autoplay))
    },
  },
  {
    key: 'autoScroll',
    load: async () => {
      const { default: AutoScroll } = await import('embla-carousel-auto-scroll')

      return AutoScroll(getPluginOptions(getProps().autoScroll))
    },
  },
  {
    key: 'autoHeight',
    load: async () => {
      const { default: AutoHeight } = await import('embla-carousel-auto-height')

      return AutoHeight(getPluginOptions(getProps().autoHeight))
    },
  },
  {
    key: 'classNames',
    load: async () => {
      const { default: ClassNames } = await import('embla-carousel-class-names')

      return ClassNames(getPluginOptions(getProps().classNames))
    },
  },
  {
    key: 'fade',
    load: async () => {
      const { default: Fade } = await import('embla-carousel-fade')

      return Fade(getPluginOptions(getProps().fade))
    },
  },
  {
    key: 'wheelGestures',
    load: async () => {
      const { WheelGesturesPlugin } = await import('embla-carousel-wheel-gestures')

      return WheelGesturesPlugin(getPluginOptions(getProps().wheelGestures))
    },
  },
]
