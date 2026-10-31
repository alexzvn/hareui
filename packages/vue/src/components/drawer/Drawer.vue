<template>
  <DialogRoot
    :open="open"
    :default-open="defaultOpen"
    modal
    v-slot="{ open: isOpen, close }"
    @update:open="onOpenChange"
  >
    <DialogTrigger v-if="!!slots.default" as-child>
      <slot :open="isOpen" />
    </DialogTrigger>
    <DialogPortal :disabled="portalTarget.disabled" :to="portalTarget.to">
      <DialogOverlay
        data-slot="drawer-backdrop"
        :style="visualViewportStyle"
        :class="ui.backdrop()"
      >
        <div
          data-slot="drawer-content"
          :data-state="isOpen ? 'open' : 'closed'"
          :data-placement="placement"
          :class="ui.content()"
        >
          <DialogContent
            ref="dialogContent"
            data-slot="drawer-dialog"
            :data-placement="placement"
            :aria-describedby="undefined"
            :style="dismissible ? { touchAction: 'none' } : undefined"
            :class="ui.dialog()"
            @escape-key-down="onEscapeKeyDown"
            @interact-outside="onInteractOutside"
            @open-auto-focus="onOpenAutoFocus"
            @pointerdown="onDragStart"
            @pointermove="onDragMove"
            @pointerup="onDragEnd($event, close)"
          >
            <VisuallyHidden v-if="slots.content && title" as-child>
              <DialogTitle>{{ title }}</DialogTitle>
            </VisuallyHidden>
            <slot name="content" :close="close">
              <DialogClose v-if="closeButton" as-child>
                <slot name="close" :close="close">
                  <CloseButton
                    data-slot="drawer-close-trigger"
                    :aria-label="closeButtonOptions.label ?? t('drawer.close')"
                    :class="ui.closeTrigger()"
                  >
                    <IconRenderer
                      v-if="closeButtonOptions.icon"
                      :icon="closeButtonOptions.icon"
                      data-slot="close-button-icon"
                    />
                  </CloseButton>
                </slot>
              </DialogClose>
              <!-- Before the header so `handle + header` / `header + body` spacing selectors still match -->
              <VisuallyHidden v-if="!showHeaderTitle" as-child>
                <DialogTitle>{{ title }}</DialogTitle>
              </VisuallyHidden>
              <div
                v-if="handle && placement !== 'top'"
                aria-hidden="true"
                data-slot="drawer-handle"
                :class="ui.handle()"
              >
                <div data-slot="drawer-handle-bar" />
              </div>
              <div v-if="hasHeader" data-slot="drawer-header" :class="ui.header()">
                <slot name="header">
                  <DialogTitle
                    v-if="showHeaderTitle"
                    data-slot="drawer-heading"
                    :class="ui.heading()"
                  >
                    <slot name="title">
                      {{ title }}
                    </slot>
                  </DialogTitle>
                </slot>
              </div>
              <div v-if="!!slots.body" data-slot="drawer-body" :class="ui.body()">
                <slot name="body" :close="close" />
              </div>
              <div v-if="!!slots.footer" data-slot="drawer-footer" :class="ui.footer()">
                <slot name="footer" :close="close" />
              </div>
              <div
                v-if="handle && placement === 'top'"
                aria-hidden="true"
                data-slot="drawer-handle"
                :class="ui.handle()"
              >
                <div data-slot="drawer-handle-bar" />
              </div>
            </slot>
          </DialogContent>
        </div>
      </DialogOverlay>
    </DialogPortal>
  </DialogRoot>
</template>

<script setup lang="ts">
import {
  DialogClose,
  DialogContent,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
  VisuallyHidden,
} from 'reka-ui'
import { computed, useSlots, useTemplateRef } from 'vue'

import CloseButton from '@/components/close-button/CloseButton.vue'
import { useComponentUI } from '@/composables/useComponentUI'
import { useDialogShell } from '@/composables/useDialogShell'
import { useLocale } from '@/composables/useLocale'
import { resolveCloseButton } from '@/utils/closeButton'
import { IconRenderer } from '@/utils/icon'

import type { DrawerProps, DrawerSlots, DrawerEmits } from './Drawer.types'
import theme from './theme'

// `open: undefined` stops Vue casting an absent boolean prop to `false`, so uncontrolled mode and `defaultOpen` apply
const { t } = useLocale()

const props = withDefaults(defineProps<DrawerProps>(), {
  open: undefined,
  portal: undefined,
  closeButton: true,
  dismissible: true,
  keyboardDismissible: true,
  placement: 'bottom',
})

const closeButtonOptions = computed(() => resolveCloseButton(props.closeButton))

const emit = defineEmits<DrawerEmits>()
const slots = useSlots()
defineSlots<DrawerSlots>()

const ui = useComponentUI('drawer', {
  theme,
  variantProps: () => ({
    placement: props.placement,
    variant: props.variant,
  }),
  props,
  classSlot: 'dialog',
})

const dialogContent = useTemplateRef<{ $el: HTMLElement }>('dialogContent')
const {
  portalTarget,
  visualViewportStyle,
  showHeaderTitle,
  hasHeader,
  onOpenChange,
  onEscapeKeyDown,
  onInteractOutside,
  onOpenAutoFocus,
} = useDialogShell({
  props,
  slots,
  emit,
  dialogContent,
  keyboardDismissible: () => props.keyboardDismissible,
})

// Drag to dismiss, ported from HeroUI's `useDrawerDrag`: past an 8px threshold the panel follows the
// pointer towards its edge; releasing beyond 30% of its size, or flicking faster than 0.5px/ms,
// closes it, otherwise it springs back. Controls and the body are excluded so they keep working.
const DRAG_THRESHOLD = 8
const DISMISS_FRACTION = 0.3
const VELOCITY_THRESHOLD = 0.5
const isVertical = computed(() => props.placement === 'top' || props.placement === 'bottom')
let isDragging = false
let isDragActive = false
let startPos = 0
let offset = 0
let velocity = 0
let lastTime = 0
let lastPos = 0

const pointerPos = (event: PointerEvent) => {
  return isVertical.value ? event.clientY : event.clientX
}

const clampDelta = (delta: number) => {
  const isTowardsNegative = props.placement === 'top' || props.placement === 'left'

  return isTowardsNegative ? Math.min(0, delta) : Math.max(0, delta)
}

const springBack = (el: HTMLElement) => {
  el.style.transition = 'transform 300ms cubic-bezier(0.32, 0.72, 0, 1)'
  el.style.transform = ''

  el.addEventListener(
    'transitionend',
    () => {
      el.style.transition = ''
    },
    { once: true },
  )
}

const onDragStart = (event: PointerEvent) => {
  if (!props.dismissible || event.button !== 0) return
  const target = event.target as HTMLElement
  const dialog = event.currentTarget as HTMLElement
  if (target.closest('[data-slot="drawer-dialog"]') !== dialog) return

  if (
    target.closest("input, textarea, button, [role='button'], select, a, [data-slot='drawer-body']")
  )
    return

  isDragging = true
  isDragActive = false
  startPos = pointerPos(event)
  lastPos = startPos
  lastTime = Date.now()
  offset = 0
  velocity = 0
}

const onDragMove = (event: PointerEvent) => {
  if (!isDragging) return
  const el = event.currentTarget as HTMLElement
  const pos = pointerPos(event)
  const rawDelta = pos - startPos
  const delta = clampDelta(rawDelta)

  if (!isDragActive) {
    if (Math.abs(rawDelta) < DRAG_THRESHOLD) return
    isDragActive = true
    el.style.transition = 'none'
    el.setPointerCapture(event.pointerId)
  }

  offset = delta
  const now = Date.now()
  const dt = now - lastTime
  if (dt > 0) {
    velocity = (pos - lastPos) / dt
    lastTime = now
    lastPos = pos
  }

  el.style.transform = `translate${isVertical.value ? 'Y' : 'X'}(${delta}px)`
}

const onDragEnd = (event: PointerEvent, close: () => void) => {
  if (!isDragging) return
  isDragging = false
  const el = event.currentTarget as HTMLElement
  if (!isDragActive) return
  isDragActive = false

  try {
    el.releasePointerCapture(event.pointerId)
  } catch {
    // The capture may already be gone (pointer cancelled / element detached); nothing to release.
  }

  const size = isVertical.value ? el.offsetHeight : el.offsetWidth
  const shouldDismiss =
    Math.abs(offset) > size * DISMISS_FRACTION || Math.abs(velocity) > VELOCITY_THRESHOLD

  offset = 0
  velocity = 0

  if (shouldDismiss) {
    close()
    return
  }

  springBack(el)
}
</script>
