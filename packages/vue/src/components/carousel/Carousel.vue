<template>
  <Primitive
    :as="as"
    role="region"
    aria-roledescription="carousel"
    tabindex="0"
    data-slot="carousel"
    :dir="dir"
    :data-orientation="orientation"
    :data-type="type"
    :class="ui.root()"
    @keydown="onKeyDown"
  >
    <div data-slot="carousel-wrapper" :class="ui.wrapper()">
      <div ref="emblaRef" data-slot="carousel-viewport" :class="ui.viewport()">
        <div data-slot="carousel-container" :class="ui.container()">
          <div
            v-for="(item, index) in items"
            :key="index"
            role="group"
            aria-roledescription="slide"
            data-slot="carousel-item"
            :class="ui.item({ override: getItemClass(item) })"
          >
            <slot :item="item" :index="index" />
          </div>
        </div>
      </div>

      <template v-if="arrows && type !== 'miniatures'">
        <Arrow side="prev" />
        <Arrow side="next" />
      </template>
    </div>

    <div v-if="hasControls" data-slot="carousel-controls" :class="ui.controls()">
      <Arrow v-if="arrows && type === 'miniatures'" side="prev" />

      <div
        v-if="isDotsVisible"
        role="tablist"
        :aria-label="dotsOptions.label"
        data-slot="carousel-dots"
        :class="ui.dots()"
      >
        <button
          v-for="(_, index) in state.scrollSnaps"
          :key="index"
          type="button"
          role="tab"
          :aria-label="goToLabel(index + 1)"
          :aria-selected="state.selectedIndex === index"
          :data-selected="state.selectedIndex === index || undefined"
          data-slot="carousel-dot"
          :class="ui.dot()"
          @click="scrollTo(index)"
        />
      </div>

      <ScrollShadow
        v-if="thumbnails && items.length > 0"
        ref="thumbnailsScroller"
        orientation="horizontal"
        hide-scroll-bar
        role="tablist"
        :aria-label="thumbnailsOptions.label"
        data-slot="carousel-thumbnails"
        :class="ui.thumbnails()"
      >
        <button
          v-for="(item, index) in items"
          :key="index"
          type="button"
          role="tab"
          :aria-label="goToLabel(index + 1)"
          :aria-selected="state.selectedIndex === index"
          :data-selected="state.selectedIndex === index || undefined"
          data-slot="carousel-thumbnail"
          :class="ui.thumbnail()"
          @click="scrollTo(index)"
          @focus="revealFocusedThumbnail"
        >
          <slot
            name="thumbnail"
            :item="item"
            :index="index"
            :selected="state.selectedIndex === index"
          >
            <img
              v-if="getThumbnail(item)"
              :src="getThumbnail(item)"
              :alt="getThumbnailAlt(item)"
              draggable="false"
            />
          </slot>
        </button>
      </ScrollShadow>

      <Arrow v-if="arrows && type === 'miniatures'" side="next" />
    </div>
  </Primitive>
</template>

<script setup lang="ts" generic="T extends CarouselItem = CarouselItem">
import { defu } from 'defu'
import type { EmblaCarouselType, EmblaOptionsType, EmblaPluginType } from 'embla-carousel'
import useEmblaCarousel from 'embla-carousel-vue'
import { Primitive, useDirection } from 'reka-ui'
import type { FunctionalComponent } from 'vue'
import {
  computed,
  h,
  nextTick,
  onBeforeUnmount,
  onMounted,
  shallowReactive,
  shallowRef,
  toRef,
  useTemplateRef,
  watch,
} from 'vue'

import Button from '@/components/button/Button.vue'
import ScrollShadow from '@/components/scroll-shadow/ScrollShadow.vue'
import { useComponentUI } from '@/composables/useComponentUI'
import { prefersReducedMotion } from '@/utils/motion'

import type {
  CarouselArrowProps,
  CarouselEmits,
  CarouselItem,
  CarouselItemObject,
  CarouselProps,
  CarouselSlots,
} from './Carousel.types'
import { createPluginLoaders, isStoppedOnInteraction } from './carouselPlugins'
import theme from './theme'

const props = withDefaults(defineProps<CarouselProps<T>>(), {
  as: 'div',
  items: () => [],
  orientation: 'horizontal',
  type: 'in-place',
  arrows: false,
  dots: false,
  thumbnails: false,
  goToLabel: (slide: number) => `Go to slide ${slide}`,
  autoplay: false,
  autoScroll: false,
  autoHeight: false,
  classNames: false,
  fade: false,
  wheelGestures: false,
})

const slots = defineSlots<CarouselSlots<T>>()
const emit = defineEmits<CarouselEmits>()

const ui = useComponentUI('carousel', {
  theme,
  variantProps: () => ({ orientation: props.orientation, type: props.type }),
  props,
  classSlot: 'root',
})

const direction = useDirection(toRef(() => props.dir))

const emblaOptions = computed<EmblaOptionsType>(() => ({
  // A fade keeps every slide stacked in place, which only works centred and without trimmed snaps.
  ...(props.fade ? { align: 'center', containScroll: false } : {}),
  ...props.options,
  axis: props.orientation === 'horizontal' ? 'x' : 'y',
  direction: direction.value,
}))

const plugins = shallowRef<EmblaPluginType[]>([])
const pluginLoaders = createPluginLoaders(() => props)

// A newer prop change may resolve its imports first; only the latest load is applied.
let pluginLoad = 0

const loadPlugins = async () => {
  const run = ++pluginLoad
  const enabled = pluginLoaders.filter(({ key }) => Boolean(props[key]))
  const loaded = await Promise.all(enabled.map(({ load }) => load()))
  if (run !== pluginLoad) return

  plugins.value = loaded
}

// `useEmblaCarousel` watches `plugins` and reinitialises only when the plugin set really changes, so inline option
// objects (a new reference on every parent render) don't reset the carousel to its first slide.
watch(() => pluginLoaders.map(({ key }) => props[key]), loadPlugins, { immediate: true })

const [emblaRef, emblaApi] = useEmblaCarousel(emblaOptions, plugins)

const state = shallowReactive({
  scrollSnaps: [] as number[],
  selectedIndex: 0,
  canScrollPrev: false,
  canScrollNext: false,
})

const dotsOptions = computed(() =>
  defu(typeof props.dots === 'object' ? props.dots : {}, { label: 'Slide indicators' }),
)

const thumbnailsOptions = computed(() =>
  defu(typeof props.thumbnails === 'object' ? props.thumbnails : {}, { label: 'Slide thumbnails' }),
)

const isDotsVisible = computed(() => !!props.dots && state.scrollSnaps.length > 1)

const hasControls = computed(
  () =>
    isDotsVisible.value ||
    (!!props.thumbnails && props.items.length > 0) ||
    (props.arrows && props.type === 'miniatures'),
)

const thumbnailsScroller = useTemplateRef<{ el?: HTMLElement }>('thumbnailsScroller')

// Scrolls the thumbnail row (never the page) just enough to bring the selected thumbnail into view.
const revealThumbnail = (index: number) => {
  const scroller = thumbnailsScroller.value?.el
  const thumbnail = scroller?.children[index] as HTMLElement | undefined
  if (!scroller || !thumbnail) return

  const start = thumbnail.offsetLeft - scroller.clientWidth / 2 + thumbnail.offsetWidth / 2
  scroller.scrollTo({ left: start, behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
}

// The browser leaves a partly hidden thumbnail where it is when the keyboard focuses it, cutting off its focus ring.
const revealFocusedThumbnail = (event: FocusEvent) => {
  const thumbnail = event.currentTarget as HTMLElement
  if (thumbnail.matches(':focus-visible'))
    thumbnail.scrollIntoView({ block: 'nearest', inline: 'nearest' })
}

const syncState = (api: EmblaCarouselType) => {
  state.scrollSnaps = api.scrollSnapList()
  state.selectedIndex = api.selectedScrollSnap()
  state.canScrollPrev = api.canScrollPrev()
  state.canScrollNext = api.canScrollNext()
}

const onSelect = (api: EmblaCarouselType) => {
  syncState(api)
  emit('select', state.selectedIndex)
  if (props.thumbnails) nextTick(() => revealThumbnail(state.selectedIndex))
}

onMounted(() => {
  const api = emblaApi.value
  if (!api) return

  syncState(api)
  api.on('reInit', syncState)
  api.on('select', onSelect)
})

onBeforeUnmount(() => {
  emblaApi.value?.off('reInit', syncState)
  emblaApi.value?.off('select', onSelect)
})

// Pressing an arrow or arrow key stops autoplay / auto scroll, unless their `stopOnInteraction` is `false`.
const stopOnInteraction = () => {
  const running = emblaApi.value?.plugins()
  if (isStoppedOnInteraction(props.autoplay)) running?.autoplay?.stop()
  if (isStoppedOnInteraction(props.autoScroll)) running?.autoScroll?.stop()
}

const scrollPrev = () => {
  emblaApi.value?.scrollPrev()
  stopOnInteraction()
}

const scrollNext = () => {
  emblaApi.value?.scrollNext()
  stopOnInteraction()
}

const scrollTo = (index: number) => {
  emblaApi.value?.scrollTo(index)
  stopOnInteraction()
}

const KEYS = {
  horizontal: {
    ltr: { prev: 'ArrowLeft', next: 'ArrowRight' },
    rtl: { prev: 'ArrowRight', next: 'ArrowLeft' },
  },
  vertical: {
    ltr: { prev: 'ArrowUp', next: 'ArrowDown' },
    rtl: { prev: 'ArrowUp', next: 'ArrowDown' },
  },
} as const

// Arrow keys inside a slide's text field move its caret, and a slide widget that handled the key owns it.
const isKeyOwnedBySlide = (event: KeyboardEvent) => {
  if (event.defaultPrevented) return true

  const target = event.target as HTMLElement

  return target.isContentEditable || target.matches('input, textarea, select')
}

const onKeyDown = (event: KeyboardEvent) => {
  if (isKeyOwnedBySlide(event)) return

  const keys = KEYS[props.orientation][direction.value]
  if (event.key === keys.prev) {
    event.preventDefault()
    scrollPrev()

    return
  }

  if (event.key !== keys.next) return

  event.preventDefault()
  scrollNext()
}

const isItemObject = (item: CarouselItem): item is CarouselItemObject =>
  typeof item === 'object' && item !== null

const getItemClass = (item: CarouselItem) => {
  if (!isItemObject(item)) return undefined

  return [item.ui?.item, item.class]
}

const getThumbnail = (item: CarouselItem) => {
  if (typeof item === 'string') return item
  if (!isItemObject(item)) return undefined

  return item.thumbnail
}

const getThumbnailAlt = (item: CarouselItem) => (isItemObject(item) ? (item.alt ?? '') : '')

// gravity-ui `chevron-left` / `chevron-right`.
const CHEVRON_PATHS = {
  prev: 'M10.53 2.97a.75.75 0 0 1 0 1.06L6.56 8l3.97 3.97a.75.75 0 1 1-1.06 1.06l-4.5-4.5a.75.75 0 0 1 0-1.06l4.5-4.5a.75.75 0 0 1 1.06 0',
  next: 'M5.47 13.03a.75.75 0 0 1 0-1.06L9.44 8 5.47 4.03a.75.75 0 0 1 1.06-1.06l4.5 4.5a.75.75 0 0 1 0 1.06l-4.5 4.5a.75.75 0 0 1-1.06 0',
} as const

const ARROW_LABELS = { prev: 'Previous slide', next: 'Next slide' } as const

const renderChevron = (side: 'prev' | 'next') =>
  h('svg', { 'aria-hidden': 'true', width: 16, height: 16, viewBox: '0 0 16 16', fill: 'none' }, [
    h('path', {
      d: CHEVRON_PATHS[side],
      fill: 'currentColor',
      'fill-rule': 'evenodd',
      'clip-rule': 'evenodd',
    }),
  ])

// Rendered on the slides or in the controls row depending on `type`, hence a functional component.
const Arrow: FunctionalComponent<{ side: 'prev' | 'next' }> = ({ side }) => {
  const isPrev = side === 'prev'
  const custom: CarouselArrowProps = (isPrev ? props.prev : props.next) ?? {}
  const { class: customClass, ...rest } = custom
  const icon = isPrev ? slots.prevIcon : slots.nextIcon

  return h(
    Button,
    {
      variant: 'tertiary',
      size: 'sm',
      iconOnly: true,
      'aria-label': ARROW_LABELS[side],
      disabled: isPrev ? !state.canScrollPrev : !state.canScrollNext,
      ...rest,
      'data-slot': `carousel-${side}`,
      class: ui.value[side]({ override: customClass }),
      onClick: isPrev ? scrollPrev : scrollNext,
    },
    () => icon?.() ?? renderChevron(side),
  )
}

defineExpose({ emblaRef, emblaApi })
</script>
