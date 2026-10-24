<template>
  <Primitive
    ref="root"
    :as="as"
    :class="ui.base({ class: [props.ui?.base, props.class] })"
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
import { computed, onBeforeUnmount, ref, watch } from 'vue'

import { useComponentUI } from '@/composables/useComponentUI'

import type { ScrollShadowProps, ScrollShadowSlots, ScrollShadowEmits } from './ScrollShadow.types'
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

const ui = useComponentUI('scrollShadow', theme, () => ({
  orientation: props.orientation,
  variant: props.variant,
  hideScrollBar: props.hideScrollBar,
}))

const root = ref<{ $el: HTMLElement } | null>(null)
const auto = computed(() => props.enabled && props.visibility === 'auto')

// Ported from HeroUI's `useScrollShadow`: measure on scroll / resize / content mutation and
// publish the `data-*-scroll` flags one frame later. `null` until the first measurement, so
// the flags are absent on the first paint like HeroUI's.
const state = ref<{ before: boolean; after: boolean } | null>(null)
let frame: number | null = null

const measure = () => {
  const el = root.value?.$el
  if (!el) return
  const vertical = props.orientation === 'vertical'
  const start = vertical ? el.scrollTop : Math.abs(el.scrollLeft)
  const size = vertical ? el.scrollHeight : el.scrollWidth
  const client = vertical ? el.clientHeight : el.clientWidth
  const before = start > props.offset
  const after = start + client + props.offset < size - 1
  const prev = state.value
  if (prev && prev.before === before && prev.after === after) return
  if (frame !== null) cancelAnimationFrame(frame)

  frame = requestAnimationFrame(() => {
    frame = null
    state.value = { before, after }
    const [start, end] = vertical ? (['top', 'bottom'] as const) : (['left', 'right'] as const)
    emit('visibilityChange', before && after ? 'both' : before ? start : after ? end : 'none')
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
