<template>
  <div
    ref="rootEl"
    role="alertdialog"
    aria-modal="false"
    data-slot="toast"
    :aria-labelledby="labelledBy"
    :aria-describedby="describedBy"
    :tabindex="tabIndex"
    :data-entering="isEntering ? 'true' : undefined"
    :data-exiting="isExiting ? 'true' : undefined"
    :data-expanded="isExpanded ? 'true' : undefined"
    :data-frontmost="isFrontmost ? 'true' : undefined"
    :data-hidden="isHidden ? 'true' : undefined"
    :data-index="index"
    :data-placement="placement"
    :style="styleVars"
    :class="ui.toast({ class: providerUi?.toast })"
  >
    <template v-if="toastSlot">
      <component
        :is="renderValue"
        :value="toastSlot({ content, close: props.close, titleId, descriptionId: descId })"
      />
    </template>
    <template v-else>
      <div
        v-if="hasIndicator"
        data-slot="toast-indicator"
        :data-swapped="hasSwapped ? 'true' : undefined"
        :class="ui.indicator({ class: providerUi?.indicator })"
      >
        <Spinner v-if="content.isLoading" color="current" size="sm" />
        <component
          :is="renderValue"
          v-else-if="content.indicator !== undefined"
          :value="content.indicator"
        />
        <svg
          v-else
          aria-hidden="true"
          data-slot="toast-default-icon"
          fill="none"
          height="16"
          role="presentation"
          viewBox="0 0 16 16"
          width="16"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path clip-rule="evenodd" :d="defaultIconPath" fill="currentColor" fill-rule="evenodd" />
        </svg>
      </div>
      <div
        data-slot="toast-content"
        role="alert"
        aria-atomic="true"
        :aria-hidden="isContentVisible ? undefined : 'true'"
        :class="ui.content({ class: providerUi?.content })"
      >
        <p
          v-if="hasTitle"
          :id="titleId"
          data-slot="toast-title"
          :class="ui.title({ class: providerUi?.title })"
        >
          <component :is="renderValue" :value="content.title" />
        </p>
        <p
          v-if="hasDescription"
          :id="descId"
          data-slot="toast-description"
          :class="ui.description({ class: providerUi?.description })"
        >
          <component :is="renderValue" :value="content.description" />
        </p>
        <Button
          v-if="isMobile && content.action"
          data-slot="toast-action-button"
          :variant="content.action.variant ?? 'secondary'"
          :class="[ui.action({ class: providerUi?.action }), content.action.class]"
          @click="onActionClick"
        >
          <component :is="renderValue" :value="content.action.label" />
        </Button>
      </div>
      <Button
        v-if="!isMobile && content.action"
        data-slot="toast-action-button"
        :variant="content.action.variant ?? 'secondary'"
        :class="[ui.action({ class: providerUi?.action }), content.action.class]"
        @click="onActionClick"
      >
        <component :is="renderValue" :value="content.action.label" />
      </Button>
      <CloseButton
        data-slot="toast-close"
        :class="ui.close({ class: providerUi?.close })"
        @click="props.close"
      />
    </template>
  </div>
</template>

<script lang="ts">
import type { VNode } from 'vue'

import type { ComponentSlots } from '@/types/tv'

import theme from './theme'
import type { QueuedToast, ToastContentValue } from './toastQueue'

type Toast = typeof theme

// Not exported: HeroUI's Toast/ToastContent/ToastIndicator/Toast* compound parts collapse
// into ToastProvider's single `#toast` slot (see ToastProvider.vue), per the "no compound
// parts" rule. This renders one stack entry, used only from ToastProvider's `v-for`.
export type ToastItemProps = {
  toast: QueuedToast<ToastContentValue>
  index: number
  isFrontmost: boolean
  isExiting: boolean
  isHidden: boolean
  isExpanded: boolean
  isMobile: boolean
  placement: 'bottom' | 'bottom start' | 'bottom end' | 'top' | 'top start' | 'top end'
  zIndex: number
  offsetCollapsed: number
  offsetExpanded: number
  scaleCollapsed: number
  frontHeight: number
  /** Closes this toast on its owning queue. */
  close: () => void
  providerUi?: ComponentSlots<Toast>
  toastSlot?: (props: {
    content: ToastContentValue
    close: () => void
    titleId: string
    descriptionId: string
  }) => VNode[]
}
</script>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, onUpdated, ref, useId, watch } from 'vue'

import Button from '@/components/button/Button.vue'
import CloseButton from '@/components/close-button/CloseButton.vue'
import Spinner from '@/components/spinner/Spinner.vue'
import { useComponentUI } from '@/composables/useComponentUI'

import renderValue from './renderValue'

const props = defineProps<ToastItemProps>()

const emit = defineEmits<{
  'height-change': [key: string, height: number]
  'height-remove': [key: string]
  /** The toast held focus and is leaving the stack (exiting or pushed past the visible limit). */
  'focus-leave': [el: HTMLElement]
}>()

const content = computed(() => (props.toast.content ?? {}) as ToastContentValue)

const ui = useComponentUI('toast', theme, () => ({
  placement: props.placement,
  variant: content.value.variant ?? 'default',
}))

const titleId = useId()
const descId = useId()

const hasTitle = computed(
  () =>
    content.value.title !== undefined && content.value.title !== null && content.value.title !== '',
)

const hasDescription = computed(
  () =>
    content.value.description !== undefined &&
    content.value.description !== null &&
    content.value.description !== '',
)

// A #toast slot renders its own title / description: reference the ids handed to it only once an element carries
// them (as RAC's useSlotId does), so the toast never points at a missing element.
const slotHasTitle = ref(false)
const slotHasDescription = ref(false)
const syncSlotIds = () => {
  const el = rootEl.value
  if (!el || !props.toastSlot) return
  slotHasTitle.value = !!el.querySelector(`[id="${titleId}"]`)
  slotHasDescription.value = !!el.querySelector(`[id="${descId}"]`)
}

onMounted(syncSlotIds)
onUpdated(syncSlotIds)

const labelledBy = computed(() =>
  (props.toastSlot ? slotHasTitle.value : hasTitle.value) ? titleId : undefined,
)

const describedBy = computed(() =>
  (props.toastSlot ? slotHasDescription.value : hasDescription.value) ? descId : undefined,
)

// React Aria's `contentProps`: the content is the live `role="alert"` region. It starts aria-hidden and is revealed
// right after mount; NVDA only announces the toast on that change.
const isContentVisible = ref(false)
onMounted(() => {
  isContentVisible.value = true
})

const tabIndex = computed(() =>
  props.isFrontmost || (props.isExpanded && !props.isHidden && !props.isExiting) ? 0 : -1,
)

const styleVars = computed(() => {
  const vars: Record<string, string> = {
    '--offset-collapsed': `${props.offsetCollapsed}px`,
    '--offset-expanded': `${props.offsetExpanded}px`,
    '--scale-collapsed': `${props.scaleCollapsed}`,
    '--front-height': `${props.frontHeight}px`,
    'z-index': `${props.zIndex}`,
  }

  if (toastHeight.value != null) vars['--toast-height'] = `${toastHeight.value}px`

  return vars
})

/* ------------------------------------------------------------------------------------------------
 * Entering: starts translated fully out of place, then transitions in on the next frame.
 * -------------------------------------------------------------------------------------------- */
const isEntering = ref(true)
let enterOuterFrame = 0
let enterInnerFrame = 0
onMounted(() => {
  enterOuterFrame = requestAnimationFrame(() => {
    enterInnerFrame = requestAnimationFrame(() => {
      isEntering.value = false
    })
  })
})

onBeforeUnmount(() => {
  cancelAnimationFrame(enterOuterFrame)
  cancelAnimationFrame(enterInnerFrame)
})

/* ------------------------------------------------------------------------------------------------
 * Height measurement: reported up so siblings can compute their collapsed/expanded offsets.
 * -------------------------------------------------------------------------------------------- */
const rootEl = ref<HTMLElement | null>(null)
const toastHeight = ref<number | undefined>()

// Same as HeroUI's useMeasuredHeight: `scrollHeight` at `height: auto` (padding box, no border),
// re-measured on DOM mutations and on inline-size changes only, not on the animated block size.
let mutationObserver: MutationObserver | null = null
let resizeObserver: ResizeObserver | null = null
let measureFrame = 0

const measure = () => {
  const el = rootEl.value
  if (!el) return
  const previous = el.style.height
  el.style.height = 'auto'
  const measured = el.scrollHeight
  el.style.height = previous
  if (toastHeight.value !== measured) toastHeight.value = measured
}

const scheduleMeasure = () => {
  if (measureFrame) return

  measureFrame = requestAnimationFrame(() => {
    measureFrame = 0
    measure()
  })
}

onMounted(() => {
  const el = rootEl.value
  if (!el) return
  measure()
  mutationObserver = new MutationObserver(scheduleMeasure)

  mutationObserver.observe(el, {
    attributeFilter: ['class'],
    attributes: true,
    characterData: true,
    childList: true,
    subtree: true,
  })

  if (typeof ResizeObserver === 'undefined') return
  let lastWidth = el.getBoundingClientRect().width
  resizeObserver = new ResizeObserver(([entry]) => {
    const width = entry?.contentRect.width
    if (width === undefined || Math.abs(width - lastWidth) < 0.5) return
    lastWidth = width
    scheduleMeasure()
  })

  resizeObserver.observe(el)
})

onBeforeUnmount(() => {
  mutationObserver?.disconnect()
  resizeObserver?.disconnect()
  cancelAnimationFrame(measureFrame)
  emit('height-remove', props.toast.key)
})

watch(
  toastHeight,
  (height) => {
    if (height != null) emit('height-change', props.toast.key, height)
  },
  { immediate: true },
)

/* ------------------------------------------------------------------------------------------------
 * Focus / a11y: hidden and exiting toasts drop out of the tab order; browsers block
 * aria-hidden around a focused element, so focus moves out first: the provider moves it to a
 * neighbouring toast (RAC's useToastRegion), and it is blurred if it is still inside.
 * -------------------------------------------------------------------------------------------- */
const syncHidden = (shouldHide: boolean) => {
  const el = rootEl.value
  if (!el) return

  if (shouldHide) {
    if (el.contains(document.activeElement)) emit('focus-leave', el)
    if (el.contains(document.activeElement)) (document.activeElement as HTMLElement | null)?.blur()
    el.setAttribute('aria-hidden', 'true')

    if (props.isExiting) {
      for (const control of el.querySelectorAll<HTMLElement>('button, a')) control.tabIndex = -1
    } else {
      el.setAttribute('inert', '')
    }
  } else {
    el.removeAttribute('aria-hidden')
    el.removeAttribute('inert')
  }
}

watch(() => props.isHidden || props.isExiting, syncHidden)

// A toast can mount already hidden (several shown in one tick, or queued before the provider mounted);
// the root element only exists from here on.
onMounted(() => syncHidden(props.isHidden || props.isExiting))

/* ------------------------------------------------------------------------------------------------
 * Indicator: tracks the "kind" of content shown so the swap between a spinner, a default icon,
 * and a custom indicator (a promise toast settling) can fade in without animating first paint.
 * -------------------------------------------------------------------------------------------- */
const DEFAULT_ICON_PATHS: Record<string, string> = {
  default:
    'M8 13.5a5.5 5.5 0 1 0 0-11a5.5 5.5 0 0 0 0 11M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14m1-9.5a1 1 0 1 1-2 0a1 1 0 0 1 2 0m-.25 3a.75.75 0 0 0-1.5 0V11a.75.75 0 0 0 1.5 0z',
  accent:
    'M8 13.5a5.5 5.5 0 1 0 0-11a5.5 5.5 0 0 0 0 11M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14m1-9.5a1 1 0 1 1-2 0a1 1 0 0 1 2 0m-.25 3a.75.75 0 0 0-1.5 0V11a.75.75 0 0 0 1.5 0z',
  success:
    'M13.5 8a5.5 5.5 0 1 1-11 0a5.5 5.5 0 0 1 11 0M15 8A7 7 0 1 1 1 8a7 7 0 0 1 14 0m-3.9-1.55a.75.75 0 1 0-1.2-.9L7.419 8.858L6.03 7.47a.75.75 0 0 0-1.06 1.06l2 2a.75.75 0 0 0 1.13-.08z',
  warning:
    'M7.134 2.994L2.217 11.5a1 1 0 0 0 .866 1.5h9.834a1 1 0 0 0 .866-1.5L8.866 2.993a1 1 0 0 0-1.732 0m3.03-.75c-.962-1.665-3.366-1.665-4.329 0L.918 10.749c-.963 1.666.24 3.751 2.165 3.751h9.834c1.925 0 3.128-2.085 2.164-3.751zM8 5a.75.75 0 0 1 .75.75v2a.75.75 0 0 1-1.5 0v-2A.75.75 0 0 1 8 5m1 5.75a1 1 0 1 1-2 0a1 1 0 0 1 2 0',
  danger:
    'M8 13.5a5.5 5.5 0 1 0 0-11a5.5 5.5 0 0 0 0 11M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14m1-4.5a1 1 0 1 1-2 0a1 1 0 0 1 2 0M8.75 5a.75.75 0 0 0-1.5 0v2.5a.75.75 0 0 0 1.5 0z',
}

const hasIndicator = computed(() => content.value.indicator !== null)

const defaultIconPath = computed(
  () => DEFAULT_ICON_PATHS[content.value.variant ?? 'default'] ?? DEFAULT_ICON_PATHS.default,
)

const indicatorKind = computed(() => {
  if (content.value.isLoading) return 'loading'
  if (content.value.indicator !== undefined) return 'custom'

  return `default-${content.value.variant ?? 'default'}`
})

const hasSwapped = ref(false)
let previousKind = indicatorKind.value
watch(indicatorKind, (kind) => {
  if (kind !== previousKind) {
    previousKind = kind
    hasSwapped.value = true
  }
})

/* ------------------------------------------------------------------------------------------------
 * Action button: HeroUI swaps its DOM position with a real media query instead of CSS display,
 * so only one instance (inside content on mobile, after content on desktop) is ever mounted.
 * -------------------------------------------------------------------------------------------- */
const onActionClick = (event: MouseEvent) => {
  content.value.action?.onClick?.(event)
}
</script>
