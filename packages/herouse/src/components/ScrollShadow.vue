<script lang="ts">
import type { PrimitiveProps } from 'reka-ui'
import type { ComponentSlots, ComponentVariants } from '../types/tv'
import theme from '../theme/scrollShadow'

type ScrollShadow = typeof theme

export type ScrollShadowVisibility = 'auto' | 'both' | 'top' | 'bottom' | 'left' | 'right' | 'none'

export interface ScrollShadowProps {
  /**
   * The element or component to render the root as.
   * @defaultValue 'div'
   */
  as?: PrimitiveProps['as']
  /**
   * The shadow size in pixels.
   * @defaultValue 40
   */
  size?: number
  /**
   * The scroll offset (px) before the shadow appears.
   * @defaultValue 0
   */
  offset?: number
  /**
   * The scroll orientation.
   * @defaultValue 'vertical'
   */
  orientation?: ComponentVariants<ScrollShadow>['orientation']
  /**
   * The visual variant.
   * @defaultValue 'fade'
   */
  variant?: ComponentVariants<ScrollShadow>['variant']
  /**
   * Whether to hide the scrollbar.
   * @defaultValue false
   */
  hideScrollBar?: boolean
  /**
   * Which shadows to show. `auto` follows the scroll position; anything else forces the
   * shadows (manual mode).
   * @defaultValue 'auto'
   */
  visibility?: ScrollShadowVisibility
  /**
   * Whether scroll detection is enabled (HeroUI's `isEnabled`).
   * @defaultValue true
   */
  enabled?: boolean
  /** Additional classes merged into the root element. */
  class?: any
  /** Per-slot class overrides. */
  ui?: ComponentSlots<ScrollShadow>
}

export interface ScrollShadowSlots {
  /** The scrollable content. */
  default?: () => any
}

export interface ScrollShadowEmits {
  /** Emitted when the visible shadows change (auto mode only). */
  visibilityChange: [visibility: ScrollShadowVisibility]
}
</script>

<script setup lang="ts">
import { Primitive } from 'reka-ui'
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { useComponentUI } from '../composables/useComponentUI'

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
const state = ref<{ before: boolean, after: boolean } | null>(null)
let frame: number | null = null

function measure() {
  const el = root.value?.$el
  if (!el)
    return
  const vertical = props.orientation === 'vertical'
  const start = vertical ? el.scrollTop : Math.abs(el.scrollLeft)
  const size = vertical ? el.scrollHeight : el.scrollWidth
  const client = vertical ? el.clientHeight : el.clientWidth
  const before = start > props.offset
  const after = start + client + props.offset < size - 1
  const prev = state.value
  if (prev && prev.before === before && prev.after === after)
    return
  if (frame !== null)
    cancelAnimationFrame(frame)
  frame = requestAnimationFrame(() => {
    frame = null
    state.value = { before, after }
    const [start, end] = vertical ? ['top', 'bottom'] as const : ['left', 'right'] as const
    emit('visibilityChange', before && after ? 'both' : before ? start : after ? end : 'none')
  })
}

let cleanup: (() => void) | undefined
watch([() => root.value?.$el as HTMLElement | undefined, auto, () => props.orientation, () => props.offset], ([el, isAuto]) => {
  cleanup?.()
  cleanup = undefined
  state.value = null
  if (!el || !isAuto)
    return
  measure()
  el.addEventListener('scroll', measure, { passive: true })
  const resize = new ResizeObserver(measure)
  resize.observe(el)
  const mutation = new MutationObserver(measure)
  mutation.observe(el, { attributeFilter: ['class', 'style'], attributes: true, characterData: true, childList: true, subtree: true })
  cleanup = () => {
    el.removeEventListener('scroll', measure)
    resize.disconnect()
    mutation.disconnect()
    if (frame !== null)
      cancelAnimationFrame(frame)
    frame = null
  }
}, { flush: 'post' })
onBeforeUnmount(() => cleanup?.())

const scrollAttrs = computed<Record<string, string>>(() => {
  const [start, end] = props.orientation === 'vertical' ? ['top', 'bottom'] : ['left', 'right']
  if (props.visibility !== 'auto') {
    if (props.visibility === 'both')
      return { [`data-${start}-${end}-scroll`]: 'true' }
    return props.visibility === 'none' ? {} : { [`data-${props.visibility}-scroll`]: 'true' }
  }
  if (!auto.value || !state.value)
    return {}
  const { before, after } = state.value
  return before && after
    ? { [`data-${start}-${end}-scroll`]: 'true' }
    : { [`data-${start}-scroll`]: String(before), [`data-${end}-scroll`]: String(after) }
})

defineExpose({
  /** The scroll container element. */
  get el() { return root.value?.$el as HTMLElement | undefined },
})
</script>

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
