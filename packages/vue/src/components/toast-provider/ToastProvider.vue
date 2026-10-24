<template>
  <Teleport :disabled="portalTarget.disabled" :to="portalTarget.to">
    <div
      v-if="visibleToasts.length > 0"
      v-bind="$attrs"
      ref="regionEl"
      role="region"
      :aria-label="regionLabel"
      tabindex="-1"
      data-slot="toast-region"
      :data-expanded="resolvedIsExpanded ? 'true' : undefined"
      :style="{
        '--gap': `${gap}px`,
        '--placement': placement,
        '--scale-factor': scaleFactor,
        '--toast-width': typeof width === 'number' ? `${width}px` : width,
      }"
      :class="ui.region({ class: [props.ui?.region, props.class] })"
      @pointerenter="onPointerEnterOrMove"
      @pointermove="onPointerEnterOrMove"
      @pointerleave="onPointerLeave"
      @focusin="onFocusIn"
      @focusout="onFocusOut"
      @keydown="onRegionKeyDown"
    >
      <ToastItem
        v-for="item in renderItems"
        :key="item.toast.key"
        :toast="item.toast"
        :index="item.index"
        :is-frontmost="item.isFrontmost"
        :is-exiting="item.isExiting"
        :is-hidden="item.isHidden"
        :is-expanded="resolvedIsExpanded"
        :is-mobile="isMobile"
        :placement="placement!"
        :z-index="item.zIndex"
        :offset-collapsed="item.offsetCollapsed"
        :offset-expanded="item.offsetExpanded"
        :scale-collapsed="item.scaleCollapsed"
        :front-height="item.frontHeight"
        :close="() => activeQueue.close(item.toast.key)"
        :provider-ui="props.ui"
        :toast-slot="slots.toast"
        @height-change="onHeightChange"
        @height-remove="onHeightRemove"
        @focus-leave="onFocusLeave"
      />
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, reactive, ref, useSlots, watch } from 'vue'

import { useComponentUI } from '@/composables/useComponentUI'
import { usePortal } from '@/composables/usePortal'

import theme from './theme'
import ToastItem from './ToastItem.vue'
import type { ToastProviderProps, ToastProviderSlots } from './ToastProvider.types'
import {
  DEFAULT_GAP,
  DEFAULT_HOTKEY,
  DEFAULT_MAX_VISIBLE_TOAST,
  DEFAULT_SCALE_FACTOR,
  DEFAULT_TOAST_WIDTH,
  MODIFIER_PROPS,
} from './toastProvider.utils'
import type { QueuedToast, ToastContentValue as ToastContentValueType } from './toastQueue'
import { toastQueue as defaultToastQueue } from './useToast'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<ToastProviderProps>(), {
  placement: 'bottom',
  gap: DEFAULT_GAP,
  isExpanded: false,
  hotkey: () => DEFAULT_HOTKEY,
  scaleFactor: DEFAULT_SCALE_FACTOR,
  width: DEFAULT_TOAST_WIDTH,
  portal: undefined,
})

const portalTarget = usePortal(() => props.portal)
const slots = useSlots()
defineSlots<ToastProviderSlots>()

const ui = useComponentUI('toast', theme, () => ({ placement: props.placement }))

const activeQueue = computed(() => props.queue ?? defaultToastQueue)
const visibleToasts = computed(() => activeQueue.value.visibleToasts)
const exitingKeys = computed(() => activeQueue.value.exitingKeys)

const resolvedMaxVisibleToasts = computed(
  () => props.maxVisibleToasts ?? activeQueue.value.maxVisibleToasts ?? DEFAULT_MAX_VISIBLE_TOAST,
)

/* ------------------------------------------------------------------------------------------------
 * Expansion: hover, keyboard focus, or the `isExpanded` prop. Native listeners on the region
 * node mirror HeroUI's toast.tsx exactly, since Vue has no built-in region hover/focus-within.
 * -------------------------------------------------------------------------------------------- */
const regionEl = ref<HTMLElement | null>(null)
const isPointerOrFocusWithin = ref(false)
let isPointerWithin = false

const collapseIfOutside = () => {
  const node = regionEl.value
  const isFocusInside = node?.contains(document.activeElement)
  if (node && !isPointerWithin && !isFocusInside) isPointerOrFocusWithin.value = false
}

const onPointerEnterOrMove = (event: PointerEvent) => {
  if (event.pointerType === 'touch') return

  isPointerWithin = true
  isPointerOrFocusWithin.value = true
}

const onPointerLeave = (event: PointerEvent) => {
  if (event.pointerType === 'touch') return

  isPointerWithin = false
  collapseIfOutside()
}

const onFocusIn = (event: FocusEvent) => {
  isPointerOrFocusWithin.value = true

  const node = regionEl.value
  if (!node) return

  const target = event.target as HTMLElement
  if (target !== node) lastFocusedInRegion = target

  const from = event.relatedTarget
  if (from instanceof HTMLElement && !node.contains(from)) lastFocusedOutside = from
}

const onFocusOut = (event: FocusEvent) => {
  const node = regionEl.value
  if (node && event.relatedTarget instanceof Node && node.contains(event.relatedTarget)) return

  lastFocusedOutside = null
  collapseIfOutside()
}

const onGlobalPointerOver = (event: PointerEvent) => {
  const node = regionEl.value
  if (!node || event.pointerType === 'touch') return

  // The composed path's first node: inside a shadow root `event.target` is the shadow host.
  const target = event.composedPath()[0]
  if (target instanceof Node && node.contains(target)) return

  isPointerWithin = false
  collapseIfOutside()
}

const onRegionKeyDown = (event: KeyboardEvent) => {
  const node = regionEl.value
  if (!node || event.key !== 'Escape') return

  const focused = document.activeElement as HTMLElement | null
  if (node.contains(focused)) focused?.blur()

  isPointerWithin = false
  isPointerOrFocusWithin.value = false
}

/* ------------------------------------------------------------------------------------------------
 * Focus management (RAC useToastRegion / useLandmark). The region is the page's only landmark, so
 * F6 / Shift+F6 move focus into it, back to the element last focused there when it still exists.
 * A focused toast leaving the stack hands focus to a neighbouring toast, preferring the newer one,
 * or back to where focus came from when none is left or the last interaction was a pointer one.
 * -------------------------------------------------------------------------------------------- */
let lastFocusedInRegion: HTMLElement | null = null
let lastFocusedOutside: HTMLElement | null = null
let isPointerModality = false

const onModalityPointer = () => {
  isPointerModality = true
}

const onModalityKey = () => {
  isPointerModality = false
}

const onLandmarkKeyDown = (event: KeyboardEvent) => {
  const node = regionEl.value
  if (!node || event.key !== 'F6' || event.altKey || node.closest('[aria-hidden=true]')) return

  event.preventDefault()

  const previous = lastFocusedInRegion
  if (previous?.isConnected && node.contains(previous)) {
    previous.focus()
    return
  }

  node.focus()
}

const restoreOutsideFocus = () => {
  if (lastFocusedOutside?.isConnected) lastFocusedOutside.focus({ preventScroll: true })
}

const onFocusLeave = (el: HTMLElement) => {
  const node = regionEl.value
  if (!node) return

  if (isPointerModality && lastFocusedOutside?.isConnected) {
    restoreOutsideFocus()
    return
  }

  const isAvailable = (toast: HTMLElement) =>
    toast !== el &&
    !toast.hasAttribute('data-exiting') &&
    toast.getAttribute('aria-hidden') !== 'true'

  const toasts = [...node.querySelectorAll<HTMLElement>('[data-slot=toast]')]
  const index = toasts.indexOf(el)
  const newer = toasts.slice(0, index).reverse().find(isAvailable)
  const next = newer ?? toasts.slice(index + 1).find(isAvailable)

  if (!next) {
    restoreOutsideFocus()
    return
  }

  next.focus({ preventScroll: true })
}

const onDocumentKeyDown = (event: KeyboardEvent) => {
  onLandmarkKeyDown(event)

  const node = regionEl.value
  const hotkey = props.hotkey
  if (!node || hotkey.length === 0) return

  const hasExpectedModifiers = MODIFIER_PROPS.every(
    (modifier) => event[modifier] === hotkey.includes(modifier),
  )

  const hasExpectedCodes = hotkey.every(
    (key) => (MODIFIER_PROPS as readonly string[]).includes(key) || event.code === key,
  )

  if (!hasExpectedModifiers || !hasExpectedCodes) return

  event.preventDefault()
  node.focus()
}

onMounted(() => {
  document.addEventListener('pointerover', onGlobalPointerOver, true)
  document.addEventListener('keydown', onDocumentKeyDown)
  document.addEventListener('pointerdown', onModalityPointer, true)
  document.addEventListener('keydown', onModalityKey, true)
})

onBeforeUnmount(() => {
  document.removeEventListener('pointerover', onGlobalPointerOver, true)
  document.removeEventListener('keydown', onDocumentKeyDown)
  document.removeEventListener('pointerdown', onModalityPointer, true)
  document.removeEventListener('keydown', onModalityKey, true)
})

// A single remaining toast never expands; exiting toasts don't count.
const activeToastCount = computed(() => visibleToasts.value.length - exitingKeys.value.size)

// RAC's default region label (`toastRegion.notifications` in @react-aria/toast's en-US strings).
const regionLabel = computed(
  () =>
    props.ariaLabel ??
    `${activeToastCount.value} notification${activeToastCount.value === 1 ? '' : 's'}.`,
)

const resolvedIsExpanded = computed(
  () => (props.isExpanded || isPointerOrFocusWithin.value) && activeToastCount.value > 1,
)

// Interacting with the stack pauses every timer. A closing toast vanishing under the cursor
// must not resume it early, so this isn't keyed on `resolvedIsExpanded` (forced expansion
// via the `isExpanded` prop does not pause timers, per that prop's contract).
watch(isPointerOrFocusWithin, (within) => {
  const queue = activeQueue.value
  if (within) {
    queue.suspendTimers('interaction')
    return
  }

  queue.resumeTimers('interaction')
})

// Pause timers while the page is hidden so toasts aren't missed in a background tab.
const onVisibilityChange = () => {
  const queue = activeQueue.value
  if (document.hidden) {
    queue.suspendTimers('visibility')
    return
  }

  queue.resumeTimers('visibility')
}

onMounted(() => document.addEventListener('visibilitychange', onVisibilityChange))

onBeforeUnmount(() => {
  document.removeEventListener('visibilitychange', onVisibilityChange)
  activeQueue.value.resumeTimers('visibility')
})

/* ------------------------------------------------------------------------------------------------
 * Mobile: HeroUI swaps the action button's DOM position with a real media query (not CSS
 * display), so only one instance is ever mounted. Mirrored here with a matchMedia listener.
 * -------------------------------------------------------------------------------------------- */
const isMobile = ref(
  typeof window !== 'undefined' ? window.matchMedia('(max-width: 768px)').matches : false,
)

let mobileQuery: MediaQueryList | null = null

const onMobileChange = (event: MediaQueryListEvent) => {
  isMobile.value = event.matches
}

onMounted(() => {
  mobileQuery = window.matchMedia('(max-width: 768px)')
  isMobile.value = mobileQuery.matches
  mobileQuery.addEventListener('change', onMobileChange)
})

onBeforeUnmount(() => {
  mobileQuery?.removeEventListener('change', onMobileChange)
})

/* ------------------------------------------------------------------------------------------------
 * Stacking layout: each toast's collapsed/expanded offset and scale depend on its measured
 * height and the measured heights of every toast ahead of it in the stack.
 * -------------------------------------------------------------------------------------------- */
const heights = reactive<Record<string, number>>({})

const onHeightChange = (key: string, height: number) => {
  heights[key] = height
}

const onHeightRemove = (key: string) => {
  delete heights[key]
}

type RenderItem = {
  toast: QueuedToast<ToastContentValueType>
  index: number
  isFrontmost: boolean
  isExiting: boolean
  isHidden: boolean
  zIndex: number
  offsetCollapsed: number
  offsetExpanded: number
  scaleCollapsed: number
  frontHeight: number
}

const renderItems = computed<RenderItem[]>(() => {
  const vis = visibleToasts.value
  const exiting = exitingKeys.value

  // Exiting toasts are excluded from layout (siblings reposition during the exit animation)
  // but keep their own slot while fading out.
  const common = vis.filter((t) => !exiting.has(t.key))
  const frontKey = common[0]?.key
  const frontHeight = (frontKey ? heights[frontKey] : undefined) ?? 0

  // The summed height of the laid-out toasts ahead of each one
  const heightsAhead: number[] = []
  let sum = 0

  for (const t of common) {
    heightsAhead.push(sum)
    sum += heights[t.key] ?? frontHeight
  }

  const items: RenderItem[] = []
  let nonExitingBefore = 0

  for (let i = 0; i < vis.length; i++) {
    const toast = vis[i]!
    const isExiting = exiting.has(toast.key)
    const index = nonExitingBefore
    if (!isExiting) nonExitingBefore++

    const heightsBefore = heightsAhead[index] ?? index * frontHeight
    items.push({
      toast,
      index,
      isFrontmost: index <= 0,
      isExiting,
      isHidden: !isExiting && index >= resolvedMaxVisibleToasts.value,
      zIndex: isExiting ? 0 : vis.length - i,
      offsetCollapsed: index * props.gap,
      offsetExpanded: heightsBefore + index * props.gap,
      scaleCollapsed: 1 - index * props.scaleFactor,
      frontHeight,
    })
  }

  return items
})
</script>
