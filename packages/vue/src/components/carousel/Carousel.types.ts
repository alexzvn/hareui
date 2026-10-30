import type { EmblaCarouselType, EmblaOptionsType } from 'embla-carousel'
import type { AutoHeightOptionsType } from 'embla-carousel-auto-height'
import type { AutoScrollOptionsType } from 'embla-carousel-auto-scroll'
import type { AutoplayOptionsType } from 'embla-carousel-autoplay'
import type { ClassNamesOptionsType } from 'embla-carousel-class-names'
import type { FadeOptionsType } from 'embla-carousel-fade'
import type { WheelGesturesPluginOptions } from 'embla-carousel-wheel-gestures'
import type { PrimitiveProps } from 'reka-ui'
import type { VNode } from 'vue'

import type { ButtonProps } from '@/components/button/Button.types'
import type { ComponentSlots, ComponentVariants } from '@/types/tv'
import type { ClassValue } from '@/utils/tv'

import type theme from './theme'

type Carousel = typeof theme

/** A primitive slide value, e.g. an image URL. */
export type CarouselValue = string | number

/** A slide described by an object. Any other key is passed through to the slots untouched. */
export type CarouselItemObject = {
  /** Classes added to this slide's `item` element, over the `ui.item` classes. */
  class?: ClassValue
  /** Per-slide class overrides. */
  ui?: { item?: ClassValue }
  /** Image URL rendered by the default `thumbnail` slot. */
  thumbnail?: string
  /** Alternative text of the default thumbnail image. */
  alt?: string
  [key: string]: unknown
}

/** One slide of the carousel: a primitive value (a string item is used as the default thumbnail image) or an object. */
export type CarouselItem = CarouselValue | CarouselItemObject

/** Embla options of the carousel. `axis` and `direction` follow the `orientation` and `dir` props. */
export type CarouselOptions = Omit<EmblaOptionsType, 'axis' | 'container' | 'slides' | 'direction'>

/** Props of a prev / next arrow button. */
export type CarouselArrowProps = Omit<ButtonProps, 'as'> & {
  /** The accessible name of the button. */
  'aria-label'?: string
}

/** Props of `Carousel`: a scrollable row (or column) of slides with optional arrows, dots and thumbnails. */
export type CarouselProps<T extends CarouselItem = CarouselItem> = {
  /**
   * The element or component to render the root as.
   * @defaultValue 'div'
   */
  as?: PrimitiveProps['as']
  /** The slides, rendered through the default slot. */
  items?: T[]
  /**
   * The scroll axis of the carousel. A vertical carousel needs a fixed height on its `container`.
   * @defaultValue 'horizontal'
   */
  orientation?: ComponentVariants<Carousel>['orientation']
  /**
   * Where the arrows sit: `in-place` inside the slide edges (20px inset), `modal` 60px outside them, `miniatures`
   * in one row with the dots or thumbnails below the slides.
   * @defaultValue 'in-place'
   */
  type?: ComponentVariants<Carousel>['type']
  /**
   * The reading direction, set on the root. Swaps the arrow keys and the scroll direction of a horizontal
   * carousel. Unset, it follows the `App` (or reka-ui `ConfigProvider`) direction.
   * @defaultValue 'ltr'
   */
  dir?: 'ltr' | 'rtl'
  /**
   * Shows the previous and next buttons. They are disabled at either end unless `options.loop` is set.
   * @defaultValue false
   */
  arrows?: boolean
  /**
   * Shows one dot per scroll position. Hidden while every slide fits in view. An object sets the accessible `label`
   * of the dots list.
   * `{ label: 'Slide indicators' }`{lang="ts-type"}
   * @defaultValue false
   */
  dots?: boolean | { label?: string }
  /**
   * Shows a scrollable row of 64px thumbnail buttons, one per slide. A string item, or an item's `thumbnail` key, is
   * rendered as the image; use the `thumbnail` slot for anything else. An object sets the accessible `label` of the
   * thumbnails list.
   * `{ label: 'Slide thumbnails' }`{lang="ts-type"}
   * @defaultValue false
   */
  thumbnails?: boolean | { label?: string }
  /** Props of the previous button (a tertiary, small, icon-only `Button`). */
  prev?: CarouselArrowProps
  /** Props of the next button (a tertiary, small, icon-only `Button`). */
  next?: CarouselArrowProps
  /**
   * The accessible name of a dot or thumbnail, from its 1-based slide number.
   * @defaultValue (slide) => `Go to slide ${slide}`
   */
  goToLabel?: (slide: number) => string
  /** Embla options: `loop`, `align`, `slidesToScroll`, `dragFree`, `startIndex`, `breakpoints`... */
  options?: CarouselOptions
  /**
   * Advances the slides on a timer (`embla-carousel-autoplay`, loaded when set). Stops when the user navigates
   * unless `stopOnInteraction` is `false`.
   * @defaultValue false
   */
  autoplay?: boolean | AutoplayOptionsType
  /**
   * Scrolls the slides continuously (`embla-carousel-auto-scroll`, loaded when set). Stops when the user navigates
   * unless `stopOnInteraction` is `false`.
   * @defaultValue false
   */
  // oxlint-disable-next-line hareui/prop-group -- named after its plugin package, as `autoplay` is; an `auto: { scroll, height }` group would hide the package names
  autoScroll?: boolean | AutoScrollOptionsType
  /**
   * Resizes the viewport to the tallest slide in view (`embla-carousel-auto-height`, loaded when set).
   * @defaultValue false
   */
  autoHeight?: boolean | AutoHeightOptionsType
  /**
   * Toggles state classes on the slides, such as `is-snapped` (`embla-carousel-class-names`, loaded when set).
   * @defaultValue false
   */
  classNames?: boolean | ClassNamesOptionsType
  /**
   * Cross-fades between slides instead of sliding them (`embla-carousel-fade`, loaded when set).
   * @defaultValue false
   */
  fade?: boolean | FadeOptionsType
  /**
   * Navigates with the mouse wheel or trackpad (`embla-carousel-wheel-gestures`, loaded when set).
   * @defaultValue false
   */
  wheelGestures?: boolean | WheelGesturesPluginOptions
  /** Additional classes merged into the root element. */
  class?: ClassValue
  /** Per-slot class overrides. */
  ui?: ComponentSlots<Carousel>
}

/** Events emitted by `Carousel`. */
export type CarouselEmits = {
  /** Emitted when the selected scroll position changes, with its index. */
  select: [selectedIndex: number]
}

/** Slots of `Carousel`. */
export type CarouselSlots<T extends CarouselItem = CarouselItem> = {
  /** The content of a slide. */
  default?: (props: { item: T; index: number }) => VNode[]
  /** The content of a thumbnail button. Defaults to the item's image. */
  thumbnail?: (props: { item: T; index: number; selected: boolean }) => VNode[]
  /** The icon of the previous button. Defaults to the gravity-ui `chevron-left` icon. */
  prevIcon?: () => VNode[]
  /** The icon of the next button. Defaults to the gravity-ui `chevron-right` icon. */
  nextIcon?: () => VNode[]
}

/** What a template ref on `Carousel` exposes (refs are unwrapped on the component instance). */
export type CarouselExposed = {
  /** The viewport element Embla is mounted on. */
  emblaRef: HTMLElement | undefined
  /** The Embla API (`scrollTo`, `scrollNext`, `selectedScrollSnap`, `on`...), set once the carousel is mounted. */
  emblaApi: EmblaCarouselType | undefined
}
