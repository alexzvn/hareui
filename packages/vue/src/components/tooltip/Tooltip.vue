<template>
  <TooltipProvider>
    <TooltipRoot
      :open="isOpen"
      :delay-duration="delay"
      :disabled="disabled"
      @update:open="onRootUpdate"
    >
      <template #default="{ open: rootOpen }">
        <TooltipTrigger
          :ref="
            (c: any) => {
              triggerEl = c?.$el
            }
          "
          as-child
          @pointerenter="onPointerEnter"
          @pointerleave="onPointerLeave"
        >
          <slot :open="rootOpen" />
        </TooltipTrigger>
        <TooltipPortal :disabled="portalTarget.disabled" :to="portalTarget.to">
          <TooltipContent
            :side="side"
            :align="align"
            :side-offset="sideOffset"
            :class="ui.base({ class: [props.ui?.base, props.class] })"
            @pointerenter="onPointerEnter"
            @pointerleave="onPointerLeave"
          >
            <slot name="content">
              <span v-if="text">{{ text }}</span>
            </slot>
            <TooltipArrow v-if="arrow" as-child>
              <svg
                data-slot="overlay-arrow"
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                :class="ui.arrow({ class: props.ui?.arrow })"
              >
                <path d="M0 0C5.48483 8 6.5 8 12 0Z" />
              </svg>
            </TooltipArrow>
          </TooltipContent>
        </TooltipPortal>
      </template>
    </TooltipRoot>
  </TooltipProvider>
</template>

<script lang="ts">
import type { VNode } from 'vue'

import type { PortalTarget } from '@/config'
import type { ComponentSlots } from '@/types/tv'
import type { ClassValue } from '@/utils/tv'

import theme from './theme'

type Tooltip = typeof theme

export type TooltipProps = {
  /** The text content of the tooltip. Ignored when the `content` slot is used. */
  text?: string
  /** The controlled open state of the tooltip. Use with `v-model:open`. */
  open?: boolean
  /** The open state of the tooltip when it is initially rendered. Use when you do not need to control its open state. */
  defaultOpen?: boolean
  /**
   * Delay in milliseconds before the tooltip opens after the pointer enters the trigger.
   * @defaultValue 1500
   */
  delay?: number
  /**
   * Delay in milliseconds before the tooltip closes after the pointer leaves the trigger (and the
   * tooltip). Blur, press, Escape and opening another tooltip still close it immediately, as in
   * React Aria.
   * @defaultValue 500
   */
  closeDelay?: number
  /**
   * What opens the tooltip. `'hover'` opens it on hover and on focus; `'focus'` opens it only when
   * the trigger receives focus (hovering neither opens nor closes it).
   * @defaultValue 'hover'
   */
  trigger?: 'hover' | 'focus'
  /**
   * The preferred side of the trigger to render against.
   * @defaultValue 'top'
   */
  side?: 'top' | 'right' | 'bottom' | 'left'
  /**
   * The preferred alignment against the trigger.
   * @defaultValue 'center'
   */
  align?: 'start' | 'center' | 'end'
  /**
   * The distance in pixels from the trigger.
   * @defaultValue 7 when `arrow` is true, otherwise 3
   */
  sideOffset?: number
  /**
   * Whether to render an arrow pointing at the trigger.
   * @defaultValue false
   */
  arrow?: boolean
  /**
   * Whether the tooltip is disabled.
   * @defaultValue false
   */
  disabled?: boolean
  /**
   * Renders the tooltip in a portal. `true` portals to `document.body`, a selector string or element is used as the teleport target, and `false` disables portalling.
   * Falls back to `createHareUI({ portal })`, then `true`.
   */
  portal?: PortalTarget
  /** Additional classes merged into the tooltip content element. */
  class?: ClassValue
  /** Per-slot class overrides. */
  ui?: ComponentSlots<Tooltip>
}

export type TooltipSlots = {
  /** The trigger element. */
  default?: (props: { open: boolean }) => VNode[]
  /** Replaces the default `text` content. */
  content?: () => VNode[]
}

export type TooltipEmits = {
  /** Emitted when the open state changes. */
  'update:open': [value: boolean]
}
</script>

<script setup lang="ts">
import {
  TooltipArrow,
  TooltipContent,
  TooltipPortal,
  TooltipProvider,
  TooltipRoot,
  TooltipTrigger,
} from 'reka-ui'
import { computed, onBeforeUnmount, ref, watch } from 'vue'

import { TOOLTIP_OPEN_EVENT } from '@/composables/nestedLayer'
import { useComponentUI } from '@/composables/useComponentUI'
import { usePortal } from '@/composables/usePortal'

// `open: undefined` stops Vue casting an absent boolean prop to `false`, so uncontrolled mode and `defaultOpen` apply
const props = withDefaults(defineProps<TooltipProps>(), {
  open: undefined,
  defaultOpen: false,
  delay: 1500,
  closeDelay: 500,
  trigger: 'hover',
  side: 'top',
  align: 'center',
  arrow: false,
  portal: undefined,
})
const portalTarget = usePortal(() => props.portal)
const emit = defineEmits<TooltipEmits>()
defineSlots<TooltipSlots>()

const ui = useComponentUI('tooltip', theme, () => ({}))

// The arrow SVG is 12px tall. Reka's PopperContent adds the arrow's height to `sideOffset`, but
// React Aria measures `offset` from the trigger to the tooltip body (the arrow overlaps the gap),
// so subtract it to keep the HeroUI distance.
const ARROW_HEIGHT = 12
const sideOffset = computed(
  () => (props.sideOffset ?? (props.arrow ? 7 : 3)) - (props.arrow ? ARROW_HEIGHT : 0),
)

// Reka's TooltipRoot has neither a close delay nor a focus-only mode, so it is driven as a controlled
// component and its open/close requests are filtered here. A request is "hover-driven" when the
// pointer last left the trigger/content and nothing else (press, key, blur, another tooltip opening)
// happened since; capture-phase document listeners run before Reka's own trigger handlers.
// `tooltip.open` is Reka's TOOLTIP_OPEN event: another tooltip opening closes this one immediately.
const internalOpen = ref(props.open ?? props.defaultOpen)
watch(
  () => props.open,
  (value) => {
    if (value !== undefined) internalOpen.value = value
  },
)
const isOpen = computed(() => props.open ?? internalOpen.value)

const triggerEl = ref<HTMLElement>()
const pointerLeft = ref(false)
let closeTimer: ReturnType<typeof setTimeout> | undefined

const cancelClose = () => {
  clearTimeout(closeTimer)
  closeTimer = undefined
}
const commit = (value: boolean) => {
  cancelClose()
  if (value === isOpen.value) return
  if (props.open === undefined) internalOpen.value = value
  emit('update:open', value)
}

const onRootUpdate = (value: boolean) => {
  if (value) {
    // Focus-only: ignore hover-driven opens (Reka opens on pointermove after `delay`).
    const el = triggerEl.value
    if (props.trigger === 'focus' && !(el && el.contains(document.activeElement))) return
    pointerLeft.value = false
    commit(true)
    return
  }
  if (pointerLeft.value) {
    // Focus-only: hovering never closes a focus-opened tooltip.
    if (props.trigger === 'focus') return
    // A second close request while one is pending comes from something else: close now.
    if (props.closeDelay > 0 && closeTimer === undefined) {
      closeTimer = setTimeout(() => commit(false), props.closeDelay)
      return
    }
  }
  commit(false)
}

const onPointerLeave = (event: PointerEvent) => {
  if (event.pointerType !== 'touch') pointerLeft.value = true
}
const onPointerEnter = () => {
  // Re-entering the trigger or the still-visible tooltip cancels a pending delayed close (RAC keeps
  // a tooltip open while it is hovered).
  pointerLeft.value = false
  cancelClose()
}
const resetPointerLeft = () => {
  pointerLeft.value = false
}

// Only needed while a delayed close is possible: any other interaction clears `pointerLeft`.
const RESET_EVENTS = ['pointerdown', 'keydown', 'blur', 'focus', TOOLTIP_OPEN_EVENT]
const toggleResetListeners = (on: boolean) => {
  for (const type of RESET_EVENTS) {
    if (on) document.addEventListener(type, resetPointerLeft, true)
    else document.removeEventListener(type, resetPointerLeft, true)
  }
}
watch(pointerLeft, toggleResetListeners, { flush: 'sync' })
onBeforeUnmount(() => {
  cancelClose()
  toggleResetListeners(false)
})
</script>
