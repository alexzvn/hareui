<template>
  <Primitive
    ref="root"
    :as="as"
    :class="ui.base()"
    :data-orientation="orientation"
    :data-scroll-shadow-mode="auto ? 'auto' : 'manual'"
    :data-scroll-shadow-size="size"
    data-slot="scroll-shadow"
    :style="{ '--scroll-shadow-size': `${size}px`, '--scroll-shadow-offset': `${offset}px` }"
    v-bind="scrollAttrs"
  >
    <slot />
  </Primitive>
</template>

<script setup lang="ts">
import { Primitive } from 'reka-ui'
import { computed, onBeforeUnmount, ref, useTemplateRef, watch } from 'vue'

import { useComponentUI } from '@/composables/useComponentUI'

import type {
  ScrollShadowProps,
  ScrollShadowSlots,
  ScrollShadowEmits,
  ScrollShadowVisibility,
} from './ScrollShadow.types'
import theme from './theme'

const props = withDefaults(defineProps<ScrollShadowProps>(), {
  as: 'div',
  size: 40,
  offset: 0,
  orientation: 'vertical',
  variant: 'fade',
  hideScrollBar: false,
  visibility: 'auto',
  enabled: true,
})

const emit = defineEmits<ScrollShadowEmits>()
defineSlots<ScrollShadowSlots>()

const ui = useComponentUI('scrollShadow', {
  theme,
  variantProps: () => ({
    orientation: props.orientation,
    variant: props.variant,
    hideScrollBar: props.hideScrollBar,
  }),
  props,
})

const root = useTemplateRef<{ $el: HTMLElement }>('root')
const auto = computed(() => props.enabled && props.visibility === 'auto')

// Ported from HeroUI's `useScrollShadow`: measure on scroll / resize / content mutation and
// publish the `data-*-scroll` flags one frame later. `null` until the first measurement, so
// the flags are absent on the first paint like HeroUI's.
const state = ref<{ before: boolean; after: boolean } | null>(null)
let frame: number | null = null

type EdgeState = { isVertical: boolean; hasHiddenBefore: boolean; hasHiddenAfter: boolean }

const toVisibility = (edges: EdgeState): ScrollShadowVisibility => {
  const [start, end] = edges.isVertical
    ? (['top', 'bottom'] as const)
    : (['left', 'right'] as const)

  if (edges.hasHiddenBefore && edges.hasHiddenAfter) return 'both'
  if (edges.hasHiddenBefore) return start

  return edges.hasHiddenAfter ? end : 'none'
}

const measure = () => {
  const el = root.value?.$el
  if (!el) return
  const isVertical = props.orientation === 'vertical'
  const start = isVertical ? el.scrollTop : Math.abs(el.scrollLeft)
  const size = isVertical ? el.scrollHeight : el.scrollWidth
  const client = isVertical ? el.clientHeight : el.clientWidth
  const hasHiddenBefore = start > props.offset
  const hasHiddenAfter = start + client + props.offset < size - 1
  const prev = state.value
  if (prev && prev.before === hasHiddenBefore && prev.after === hasHiddenAfter) return
  if (frame !== null) cancelAnimationFrame(frame)

  frame = requestAnimationFrame(() => {
    frame = null
    state.value = { before: hasHiddenBefore, after: hasHiddenAfter }
    emit('visibilityChange', toVisibility({ isVertical, hasHiddenBefore, hasHiddenAfter }))
  })
}

let cleanup: (() => void) | undefined
watch(
  [
    () => root.value?.$el as HTMLElement | undefined,
    auto,
    () => props.orientation,
    () => props.offset,
  ],
  ([el, isAuto]) => {
    cleanup?.()
    cleanup = undefined
    state.value = null
    if (!el || !isAuto) return
    measure()
    el.addEventListener('scroll', measure, { passive: true })
    const resize = new ResizeObserver(measure)
    resize.observe(el)
    const mutation = new MutationObserver(measure)
    mutation.observe(el, {
      attributeFilter: ['class', 'style'],
      attributes: true,
      characterData: true,
      childList: true,
      subtree: true,
    })

    cleanup = () => {
      el.removeEventListener('scroll', measure)
      resize.disconnect()
      mutation.disconnect()
      if (frame !== null) cancelAnimationFrame(frame)
      frame = null
    }
  },
  { flush: 'post' },
)

onBeforeUnmount(() => cleanup?.())

const scrollAttrs = computed<Record<string, string>>(() => {
  const [start, end] = props.orientation === 'vertical' ? ['top', 'bottom'] : ['left', 'right']
  if (props.visibility !== 'auto') {
    if (props.visibility === 'both') return { [`data-${start}-${end}-scroll`]: 'true' }
    return props.visibility === 'none' ? {} : { [`data-${props.visibility}-scroll`]: 'true' }
  }

  if (!auto.value || !state.value) return {}
  const { before, after } = state.value

  return before && after
    ? { [`data-${start}-${end}-scroll`]: 'true' }
    : { [`data-${start}-scroll`]: String(before), [`data-${end}-scroll`]: String(after) }
})

defineExpose({
  /** The scroll container element. */
  get el() {
    return root.value?.$el as HTMLElement | undefined
  },
})
</script>
