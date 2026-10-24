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

<script lang="ts">
import type { PortalTarget } from '../../config'
import type { ComponentSlots, ComponentVariants } from '../../types/tv'
import theme from './theme'
import type { ToastQueue, ToastContentValue as ToastContentValueType } from './toastQueue'

type Toast = typeof theme

export interface ToastProviderProps {
  /**
   * Placement of the toast region.
   * @defaultValue 'bottom'
   */
  placement?: ComponentVariants<Toast>['placement']
  /**
   * The gap between toasts in pixels.
   * @defaultValue 12
   */
  gap?: number
  /**
   * Keeps the stack in its expanded layout instead of expanding only on hover
   * or keyboard focus. Forced expansion does not pause toast timers.
   * @defaultValue false
   */
  isExpanded?: boolean
  /**
   * The maximum number of toasts to display at a time (visual only).
   * @defaultValue 3, or the queue's own `maxVisibleToasts`
   */
  maxVisibleToasts?: number
  /**
   * Hotkey that focuses the toast region. Modifiers match `KeyboardEvent`
   * boolean props, other keys match `event.code`. Pass `[]` to disable.
   * @defaultValue ['altKey', 'KeyT']
   */
  hotkey?: string[]
  /**
   * How much each toast behind the front one scales down.
   * @defaultValue 0.05
   */
  scaleFactor?: number
  /**
   * The width of the toast region; numbers are pixels.
   * @defaultValue 460
   */
  width?: number | string
  /** Custom toast queue instance; defaults to the shared default queue used by `toast()`. */
  queue?: ToastQueue<ToastContentValueType>
  /**
   * Accessible label for the region landmark. Defaults to the toast count, as React Aria does
   * (e.g. "2 notifications.").
   */
  ariaLabel?: string
  /**
   * Renders the toast region in a portal. `true` portals to `document.body`, a selector string or element is used as the teleport target, and `false` disables portalling.
   * Falls back to `createHareUI({ portal })`, then `true`.
   */
  portal?: PortalTarget
  /** Additional classes merged into the region element. */
  class?: any
  /** Per-slot class overrides, shared by every rendered toast. */
  ui?: ComponentSlots<Toast>
}

export interface ToastProviderSlots {
  /**
   * Replaces a toast's inner content (indicator, title, description, action,
   * close button). The positioned, animated stack wrapper is still rendered
   * by the provider; style it with the `ui.toast` slot override.
   * Put `titleId` / `descriptionId` on the elements holding the title and description to name and describe
   * the toast, and wrap the message in a `role="alert"` element so screen readers announce it.
   */
  toast?: (props: {
    content: ToastContentValueType
    close: () => void
    titleId: string
    descriptionId: string
  }) => any
}

// Module scope (not <script setup>): withDefaults() is hoisted out of setup() and can't see setup locals.
const DEFAULT_GAP = 12
const DEFAULT_MAX_VISIBLE_TOAST = 3
const DEFAULT_SCALE_FACTOR = 0.05
const DEFAULT_TOAST_WIDTH = 460
const DEFAULT_HOTKEY = ['altKey', 'KeyT']
const MODIFIER_PROPS = ['altKey', 'ctrlKey', 'metaKey', 'shiftKey'] as const
</script>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, reactive, ref, useSlots, watch } from 'vue'

import { useComponentUI } from '../../composables/useComponentUI'
import { usePortal } from '../../composables/usePortal'
import ToastItem from './ToastItem.vue'
import type { QueuedToast } from './toastQueue'
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
let pointerWithin = false

function collapseIfOutside() {
  const node = regionEl.value
  if (node && !pointerWithin && !node.contains(document.activeElement))
    isPointerOrFocusWithin.value = false
}
function onPointerEnterOrMove(event: PointerEvent) {
  if (event.pointerType === 'touch') return
  pointerWithin = true
  isPointerOrFocusWithin.value = true
}
function onPointerLeave(event: PointerEvent) {
  if (event.pointerType === 'touch') return
  pointerWithin = false
  collapseIfOutside()
}
function onFocusIn(event: FocusEvent) {
  isPointerOrFocusWithin.value = true
  const node = regionEl.value
  const target = event.target as HTMLElement
  if (node && target !== node) lastFocusedInRegion = target
  if (node && event.relatedTarget instanceof HTMLElement && !node.contains(event.relatedTarget))
    lastFocusedOutside = event.relatedTarget
}
function onFocusOut(event: FocusEvent) {
  const node = regionEl.value
  if (node && event.relatedTarget instanceof Node && node.contains(event.relatedTarget)) return
  lastFocusedOutside = null
  collapseIfOutside()
}
function onGlobalPointerOver(event: PointerEvent) {
  const node = regionEl.value
  // The composed path's first node: inside a shadow root `event.target` is the shadow host.
  const target = event.composedPath()[0]
  if (!node || event.pointerType === 'touch' || (target instanceof Node && node.contains(target)))
    return
  pointerWithin = false
  collapseIfOutside()
}
function onRegionKeyDown(event: KeyboardEvent) {
  const node = regionEl.value
  if (!node || event.key !== 'Escape') return
  if (node.contains(document.activeElement)) (document.activeElement as HTMLElement | null)?.blur()
  pointerWithin = false
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
let pointerModality = false
const onModalityPointer = () => {
  pointerModality = true
}
const onModalityKey = () => {
  pointerModality = false
}

function onLandmarkKeyDown(event: KeyboardEvent) {
  const node = regionEl.value
  if (!node || event.key !== 'F6' || event.altKey || node.closest('[aria-hidden=true]')) return
  event.preventDefault()
  if (lastFocusedInRegion?.isConnected && node.contains(lastFocusedInRegion))
    lastFocusedInRegion.focus()
  else node.focus()
}

function restoreOutsideFocus() {
  if (lastFocusedOutside?.isConnected) lastFocusedOutside.focus({ preventScroll: true })
}

function onFocusLeave(el: HTMLElement) {
  const node = regionEl.value
  if (!node) return
  if (pointerModality && lastFocusedOutside?.isConnected) return restoreOutsideFocus()
  const toasts = [...node.querySelectorAll<HTMLElement>('[data-slot=toast]')]
  const index = toasts.indexOf(el)
  const available = (toast: HTMLElement) =>
    toast !== el &&
    !toast.hasAttribute('data-exiting') &&
    toast.getAttribute('aria-hidden') !== 'true'
  const next =
    toasts.slice(0, index).reverse().find(available) ?? toasts.slice(index + 1).find(available)
  if (next) next.focus({ preventScroll: true })
  else restoreOutsideFocus()
}

function onDocumentKeyDown(event: KeyboardEvent) {
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
  if (within) activeQueue.value.suspendTimers('interaction')
  else activeQueue.value.resumeTimers('interaction')
})

// Pause timers while the page is hidden so toasts aren't missed in a background tab.
function onVisibilityChange() {
  if (document.hidden) activeQueue.value.suspendTimers('visibility')
  else activeQueue.value.resumeTimers('visibility')
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
function onMobileChange(event: MediaQueryListEvent) {
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
function onHeightChange(key: string, height: number) {
  heights[key] = height
}
function onHeightRemove(key: string) {
  delete heights[key]
}

interface RenderItem {
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
  const frontHeightVal = (frontKey ? heights[frontKey] : undefined) ?? 0

  const prefix: number[] = []
  let sum = 0
  for (const t of common) {
    prefix.push(sum)
    sum += heights[t.key] ?? frontHeightVal
  }

  const items: RenderItem[] = []
  let nonExitingBefore = 0
  for (let i = 0; i < vis.length; i++) {
    const t = vis[i]!
    const isExiting = exiting.has(t.key)
    const index = nonExitingBefore
    if (!isExiting) nonExitingBefore++
    const heightsBefore = prefix[index] ?? index * frontHeightVal
    items.push({
      toast: t,
      index,
      isFrontmost: index <= 0,
      isExiting,
      isHidden: !isExiting && index >= resolvedMaxVisibleToasts.value,
      zIndex: isExiting ? 0 : vis.length - i,
      offsetCollapsed: index * props.gap,
      offsetExpanded: heightsBefore + index * props.gap,
      scaleCollapsed: 1 - index * props.scaleFactor,
      frontHeight: frontHeightVal,
    })
  }
  return items
})
</script>
