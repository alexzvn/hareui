<template>
  <component
    :is="shadow ? ScrollShadow : Primitive"
    ref="root"
    v-bind="rootProps"
    :class="ui.root()"
    data-slot="root"
    :data-orientation="orientation"
  >
    <div
      v-if="virtualizer"
      :class="ui.viewport()"
      data-slot="viewport"
      :style="virtualViewportStyle"
    >
      <div
        v-for="virtualItem in virtualItems"
        :key="String(virtualItem.key)"
        :ref="measureElement"
        :class="ui.item()"
        :data-index="virtualItem.index"
        data-slot="item"
        :style="getVirtualItemStyle(virtualItem)"
      >
        <slot
          :index="virtualItem.index"
          :item="itemList[virtualItem.index] as T"
          :virtual-item="virtualItem"
        />
      </div>
    </div>
    <div v-else ref="viewport" :class="ui.viewport()" data-slot="viewport">
      <template v-if="props.items">
        <div
          v-for="(item, index) in props.items"
          :key="String(getItemKey(index))"
          :class="ui.item()"
          :data-index="index"
          data-slot="item"
        >
          <slot :index="index" :item="item" />
        </div>
      </template>
      <slot v-else v-bind="emptySlotProps" />
    </div>
  </component>
</template>

<script setup lang="ts" generic="T = unknown">
import type { VirtualItem } from '@tanstack/vue-virtual'
import { useVirtualizer } from '@tanstack/vue-virtual'
import { defu } from 'defu'
import { Primitive } from 'reka-ui'
import type { ComponentPublicInstance, CSSProperties } from 'vue'
import { computed, nextTick, onBeforeUnmount, useTemplateRef, watch } from 'vue'

import { ScrollShadow } from '@/components/scroll-shadow'
import { useComponentUI } from '@/composables/useComponentUI'
import { useLocale } from '@/composables/useLocale'

import type {
  ScrollAreaEmits,
  ScrollAreaProps,
  ScrollAreaScrollToIndexOptions,
  ScrollAreaSlotProps,
  ScrollAreaSlots,
  ScrollAreaVirtualizeOptions,
} from './ScrollArea.types'
import theme from './theme'

const props = withDefaults(defineProps<ScrollAreaProps<T>>(), {
  as: 'div',
  orientation: 'vertical',
  items: undefined,
  virtualize: false,
  shadow: false,
})

const emit = defineEmits<ScrollAreaEmits>()
defineSlots<ScrollAreaSlots<T>>()

const DEFAULT_SHADOW_SIZE = 40

const VIRTUALIZE_DEFAULTS = {
  estimateSize: 100,
  overscan: 12,
  gap: 0,
  paddingStart: 0,
  paddingEnd: 0,
  scrollMargin: 0,
} satisfies ScrollAreaVirtualizeOptions

const { dir } = useLocale()

const virtualizeOptions = computed(() => {
  const options: ScrollAreaVirtualizeOptions =
    typeof props.virtualize === 'object' ? props.virtualize : {}

  return defu(options, VIRTUALIZE_DEFAULTS)
})

// With an outer scroll element the root grows to the list's full size and that element scrolls
const isExternalScroll = computed(() => !!virtualizeOptions.value.getScrollElement)

const ui = useComponentUI('scrollArea', {
  theme,
  variantProps: () => ({
    orientation: props.orientation,
    externalScroll: isExternalScroll.value,
  }),
  props,
  classSlot: 'root',
})

// The fade reuses ScrollShadow, which measures the scroll position where scroll-driven animations are unsupported
const rootProps = computed(() => {
  if (!props.shadow) return { as: props.as }

  const size = typeof props.shadow === 'object' ? props.shadow.size : undefined

  return { as: props.as, orientation: props.orientation, size: size ?? DEFAULT_SHADOW_SIZE }
})

const root = useTemplateRef<ComponentPublicInstance>('root')
const getRootElement = () => root.value?.$el as HTMLElement | undefined

const isHorizontal = computed(() => props.orientation === 'horizontal')
const itemList = computed(() => props.items ?? [])

// Without items the slot is the content, rendered once; an empty item keeps the slot props in one shape
const emptySlotProps: ScrollAreaSlotProps<T> = { index: 0, item: {} as unknown as T }

const getScrollElement = () => {
  const external = virtualizeOptions.value.getScrollElement

  return (external ? external() : getRootElement()) ?? null
}

const getItemKey = (index: number) => {
  const custom = virtualizeOptions.value.getItemKey
  if (custom) return custom(index)

  const item = itemList.value[index]
  const id = item && typeof item === 'object' && 'id' in item ? item.id : undefined

  return typeof id === 'string' || typeof id === 'number' ? id : index
}

const lanes = computed(() => virtualizeOptions.value.lanes)
const hasLanes = computed(() => lanes.value !== undefined && lanes.value > 1)

const virtualizer = props.virtualize
  ? useVirtualizer<Element, Element>(
      computed(() => {
        const { estimateSize } = virtualizeOptions.value

        // `getScrollElement` and `estimateSize` are wrapped below; `skipMeasurement` is ours, ignored by TanStack
        return {
          ...virtualizeOptions.value,
          count: itemList.value.length,
          horizontal: isHorizontal.value,
          isRtl: dir.value === 'rtl',
          getScrollElement,
          getItemKey,
          estimateSize: (index: number) =>
            typeof estimateSize === 'function' ? estimateSize(index) : estimateSize,
        }
      }),
    )
  : undefined

const virtualItems = computed<VirtualItem[]>(() => virtualizer?.value.getVirtualItems() ?? [])

const virtualViewportStyle = computed<CSSProperties>(() => {
  const totalSize = `${virtualizer?.value.getTotalSize() ?? 0}px`

  return {
    position: 'relative',
    inlineSize: isHorizontal.value ? totalSize : '100%',
    blockSize: isHorizontal.value ? '100%' : totalSize,
  }
})

// Each lane takes an equal share of the cross axis after the gaps between lanes
const getLaneStyle = (lane: number) => {
  const count = lanes.value ?? 1
  const gaps = (count - 1) * virtualizeOptions.value.gap
  const size = `calc((100% - ${gaps}px) / ${count})`

  return { size, position: `calc(${lane} * (${size} + ${virtualizeOptions.value.gap}px))` }
}

const getVirtualItemStyle = (virtualItem: VirtualItem): CSSProperties => {
  const lane = hasLanes.value ? getLaneStyle(virtualItem.lane) : { size: '100%', position: 0 }

  // `start` counts the scroll margin; items sit inside the list, past that margin
  const offset = virtualItem.start - virtualizeOptions.value.scrollMargin

  if (isHorizontal.value) {
    return {
      position: 'absolute',
      insetBlockStart: lane.position,
      insetInlineStart: 0,
      blockSize: lane.size,
      transform: `translateX(${dir.value === 'rtl' ? -offset : offset}px)`,
    }
  }

  return {
    position: 'absolute',
    insetBlockStart: 0,
    insetInlineStart: lane.position,
    inlineSize: lane.size,
    transform: `translateY(${offset}px)`,
  }
}

const measureElement = (el: Element | ComponentPublicInstance | null) => {
  if (!virtualizer || !el || virtualizeOptions.value.skipMeasurement) return

  const element = el instanceof Element ? el : (el.$el as Element)
  virtualizer.value.measureElement(element)
}

// Re-measure when the scroll element resizes: estimates may depend on the lane width
let resizeObserver: ResizeObserver | undefined
let frame: number | null = null

const onScrollElementResize = () => {
  if (frame !== null) return

  frame = requestAnimationFrame(() => {
    frame = null
    virtualizer?.value.measure()
  })
}

watch(
  getScrollElement,
  (el) => {
    resizeObserver?.disconnect()
    resizeObserver = undefined
    if (!virtualizer || !el) return

    resizeObserver = new ResizeObserver(onScrollElementResize)
    resizeObserver.observe(el)
  },
  { immediate: true, flush: 'post' },
)

onBeforeUnmount(() => {
  if (frame !== null) cancelAnimationFrame(frame)
  resizeObserver?.disconnect()
})

watch(
  () => virtualizer?.value.isScrolling ?? false,
  (isScrolling) => emit('scroll', isScrolling),
)

// An item's start and end along the scroll axis, growing in the reading direction
type Span = { start: number; end: number }

type ScrollAlign = NonNullable<ScrollAreaScrollToIndexOptions['align']>

// How far to scroll so the item lands where `align` puts it
const ALIGN_DELTAS = {
  start: (item, view) => item.start - view.start,
  end: (item, view) => item.end - view.end,
  center: (item, view) => (item.start + item.end - view.start - view.end) / 2,
  auto: (item, view) => {
    if (item.start < view.start) return item.start - view.start
    if (item.end <= view.end) return 0

    // An item taller than the view keeps its start in view
    return Math.min(item.end - view.end, item.start - view.start)
  },
} satisfies Record<ScrollAlign, (item: Span, view: Span) => number>

const viewport = useTemplateRef<HTMLElement>('viewport')

// Right to left, a horizontal list grows leftwards: x is flipped so `start` still comes first
const isFlipped = computed(() => isHorizontal.value && dir.value === 'rtl')

const getSpan = (start: number, size: number): Span =>
  isFlipped.value ? { start: -(start + size), end: -start } : { start, end: start + size }

// Plain lists scroll only the root; `scrollIntoView` would also scroll the page to it
const scrollPlainItemIntoView = (
  index: number,
  { align = 'auto', behavior }: ScrollAreaScrollToIndexOptions,
) => {
  const rootElement = getRootElement()
  const item = viewport.value?.querySelector(`:scope > [data-index="${index}"]`)
  if (!rootElement || !item) return

  const itemRect = item.getBoundingClientRect()
  const rootRect = rootElement.getBoundingClientRect()

  const itemSpan = isHorizontal.value
    ? getSpan(itemRect.left, itemRect.width)
    : getSpan(itemRect.top, itemRect.height)

  // The view is the root's client box: inside its borders, without its scrollbar
  const viewSpan = isHorizontal.value
    ? getSpan(rootRect.left + rootElement.clientLeft, rootElement.clientWidth)
    : getSpan(rootRect.top + rootElement.clientTop, rootElement.clientHeight)

  const delta = ALIGN_DELTAS[align](itemSpan, viewSpan)
  if (delta === 0) return

  const offset = isHorizontal.value ? { left: isFlipped.value ? -delta : delta } : { top: delta }
  rootElement.scrollBy({ ...offset, behavior })
}

const scrollToIndex = async (index: number, options: ScrollAreaScrollToIndexOptions = {}) => {
  if (!virtualizer) {
    scrollPlainItemIntoView(index, options)
    return
  }

  // The virtualizer attaches to its scroll element a tick after mount, so a call from `onMounted` waits for it
  if (!virtualizer.value.scrollElement) await nextTick()

  virtualizer.value.scrollToIndex(index, options)
}

defineExpose({
  /** The scroll container element. */
  get $el() {
    return getRootElement()
  },
  /** Scrolls the item at `index` into view. */
  scrollToIndex,
  /** The TanStack virtualizer, when virtualized. */
  virtualizer,
})
</script>
