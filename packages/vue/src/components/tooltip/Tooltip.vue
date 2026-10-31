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
          ref="triggerInstance"
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
            :class="ui.base()"
            @pointerenter="onPointerEnter"
            @pointerleave="onPointerLeave"
          >
            <slot name="content">
              <span v-if="text">{{ text }}</span>
              <span v-if="kbds?.length" data-slot="kbds" :class="ui.kbds()">
                <Kbd
                  v-for="(kbd, index) in kbds"
                  :key="index"
                  v-bind="typeof kbd === 'string' ? {} : kbd"
                  :ui="
                    typeof kbd === 'string'
                      ? { base: ui.kbd() }
                      : { ...kbd.ui, base: ui.kbd({ class: kbd.ui?.base }) }
                  "
                >
                  <template v-if="typeof kbd === 'string'">{{ kbd }}</template>
                </Kbd>
              </span>
            </slot>
            <TooltipArrow v-if="arrow" as-child>
              <svg
                data-slot="overlay-arrow"
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                :class="ui.arrow()"
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

<script setup lang="ts">
import {
  TooltipArrow,
  TooltipContent,
  TooltipPortal,
  TooltipProvider,
  TooltipRoot,
  TooltipTrigger,
} from 'reka-ui'
import { computed, onBeforeUnmount, ref, useTemplateRef, watch } from 'vue'

import { Kbd } from '@/components/kbd'
import { TOOLTIP_OPEN_EVENT } from '@/composables/nestedLayer'
import { useComponentUI } from '@/composables/useComponentUI'
import { usePortal } from '@/composables/usePortal'

import theme from './theme'
import type { TooltipProps, TooltipSlots, TooltipEmits } from './Tooltip.types'

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

const ui = useComponentUI('tooltip', { theme: theme, variantProps: () => ({}), props })

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

const triggerInstance = useTemplateRef<{ $el?: HTMLElement }>('triggerInstance')
const hasPointerLeft = ref(false)
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
    const el = triggerInstance.value?.$el
    if (props.trigger === 'focus' && !(el && el.contains(document.activeElement))) return
    hasPointerLeft.value = false
    commit(true)

    return
  }

  if (hasPointerLeft.value) {
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
  if (event.pointerType !== 'touch') hasPointerLeft.value = true
}

const onPointerEnter = () => {
  // Re-entering the trigger or the still-visible tooltip cancels a pending delayed close (RAC keeps
  // a tooltip open while it is hovered).
  hasPointerLeft.value = false
  cancelClose()
}

const resetPointerLeft = () => {
  hasPointerLeft.value = false
}

// Only needed while a delayed close is possible: any other interaction clears `hasPointerLeft`.
const RESET_EVENTS = ['pointerdown', 'keydown', 'blur', 'focus', TOOLTIP_OPEN_EVENT]
const toggleResetListeners = (isOn: boolean) => {
  const method = isOn ? 'addEventListener' : 'removeEventListener'
  for (const type of RESET_EVENTS) document[method](type, resetPointerLeft, true)
}

watch(hasPointerLeft, toggleResetListeners, { flush: 'sync' })

onBeforeUnmount(() => {
  cancelClose()
  toggleResetListeners(false)
})
</script>
