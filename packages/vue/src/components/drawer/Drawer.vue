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
        :style="{ '--visual-viewport-height': visualViewportHeight }"
        :class="ui.backdrop({ class: props.ui?.backdrop })"
      >
        <div
          data-slot="drawer-content"
          :data-state="isOpen ? 'open' : 'closed'"
          :data-placement="placement"
          :class="ui.content({ class: props.ui?.content })"
        >
          <DialogContent
            ref="dialogContent"
            data-slot="drawer-dialog"
            :data-placement="placement"
            :aria-describedby="undefined"
            :style="dismissible ? { touchAction: 'none' } : undefined"
            :class="ui.dialog({ class: [props.ui?.dialog, props.class] })"
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
                    :class="ui.closeTrigger({ class: props.ui?.closeTrigger })"
                  />
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
                :class="ui.handle({ class: props.ui?.handle })"
              >
                <div data-slot="drawer-handle-bar" />
              </div>
              <div
                v-if="hasHeader"
                data-slot="drawer-header"
                :class="ui.header({ class: props.ui?.header })"
              >
                <slot name="header">
                  <DialogTitle
                    v-if="showHeaderTitle"
                    data-slot="drawer-heading"
                    :class="ui.heading({ class: props.ui?.heading })"
                  >
                    <slot name="title">
                      {{ title }}
                    </slot>
                  </DialogTitle>
                </slot>
              </div>
              <div
                v-if="!!slots.body"
                data-slot="drawer-body"
                :class="ui.body({ class: props.ui?.body })"
              >
                <slot name="body" :close="close" />
              </div>
              <div
                v-if="!!slots.footer"
                data-slot="drawer-footer"
                :class="ui.footer({ class: props.ui?.footer })"
              >
                <slot name="footer" :close="close" />
              </div>
              <div
                v-if="handle && placement === 'top'"
                aria-hidden="true"
                data-slot="drawer-handle"
                :class="ui.handle({ class: props.ui?.handle })"
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

<script lang="ts">
import type { PortalTarget } from '@/config'
import type { ComponentSlots, ComponentVariants } from '@/types/tv'

import theme from './theme'

type Drawer = typeof theme

export type DrawerProps = {
  /** The controlled open state of the drawer. Use with `v-model:open`. */
  open?: boolean
  /** The open state of the drawer when it is initially rendered. Use when you do not need to control its open state. */
  defaultOpen?: boolean
  /** Title rendered in the header. */
  title?: string
  /**
   * Edge of the screen the drawer slides in from.
   * @defaultValue 'bottom'
   */
  placement?: ComponentVariants<Drawer>['placement']
  /**
   * Visual style of the backdrop.
   * @defaultValue 'opaque'
   */
  variant?: ComponentVariants<Drawer>['variant']
  /**
   * Whether clicking the backdrop or dragging the drawer towards its edge closes it.
   * @defaultValue true
   */
  dismissible?: boolean
  /**
   * Whether pressing Escape closes the drawer.
   * @defaultValue true
   */
  keyboardDismissible?: boolean
  /**
   * Whether the drag handle bar is rendered (at the top, or at the bottom for `placement="top"`).
   * @defaultValue false
   */
  handle?: boolean
  /**
   * Whether the default close button is rendered.
   * @defaultValue true
   */
  closeButton?: boolean
  /**
   * Renders the drawer in a portal. `true` portals to `document.body`, a selector string or element is used as the teleport target, and `false` disables portalling.
   * Falls back to `createHareUI({ portal })`, then `true`.
   */
  portal?: PortalTarget
  /** Additional classes merged into the dialog (panel) element. */
  class?: any
  /** Per-slot class overrides. */
  ui?: ComponentSlots<Drawer>
}

export type DrawerSlots = {
  /** The trigger element. Omit to control the drawer purely via `v-model:open`. */
  default?: (props: { open: boolean }) => any
  /** Replaces the whole header (title). */
  header?: () => any
  /** Replaces the title text. */
  title?: () => any
  /** The drawer body (scrollable; drag-to-dismiss is excluded from it). */
  body?: (props: { close: () => void }) => any
  /** The drawer footer (actions). */
  footer?: (props: { close: () => void }) => any
  /** Replaces the default close button. */
  close?: (props: { close: () => void }) => any
  /** Replaces the entire drawer content (handle, header, body, footer, close trigger). */
  content?: (props: { close: () => void }) => any
}

export type DrawerEmits = {
  /** Emitted when the open state changes. */
  'update:open': [value: boolean]
}
</script>

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

// `open: undefined` stops Vue casting an absent boolean prop to `false`, so uncontrolled mode and `defaultOpen` apply
const props = withDefaults(defineProps<DrawerProps>(), {
  open: undefined,
  portal: undefined,
  closeButton: true,
  dismissible: true,
  keyboardDismissible: true,
  placement: 'bottom',
})
const emit = defineEmits<DrawerEmits>()
const slots = useSlots()
defineSlots<DrawerSlots>()

const ui = useComponentUI('drawer', theme, () => ({
  placement: props.placement,
  variant: props.variant,
}))

const dialogContent = useTemplateRef<{ $el: HTMLElement }>('dialogContent')
const {
  portalTarget,
  visualViewportHeight,
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
let dragging = false
let active = false
let startPos = 0
let offset = 0
let velocity = 0
let lastTime = 0
let lastPos = 0

function pointerPos(event: PointerEvent) {
  return isVertical.value ? event.clientY : event.clientX
}
function clampDelta(delta: number) {
  switch (props.placement) {
    case 'top':
    case 'left':
      return Math.min(0, delta)
    default:
      return Math.max(0, delta)
  }
}
function onDragStart(event: PointerEvent) {
  if (!props.dismissible || event.button !== 0) return
  const target = event.target as HTMLElement
  const dialog = event.currentTarget as HTMLElement
  if (target.closest('[data-slot="drawer-dialog"]') !== dialog) return
  if (
    target.closest("input, textarea, button, [role='button'], select, a, [data-slot='drawer-body']")
  )
    return
  dragging = true
  active = false
  startPos = pointerPos(event)
  lastPos = startPos
  lastTime = Date.now()
  offset = 0
  velocity = 0
}
function onDragMove(event: PointerEvent) {
  if (!dragging) return
  const el = event.currentTarget as HTMLElement
  const pos = pointerPos(event)
  const rawDelta = pos - startPos
  const delta = clampDelta(rawDelta)
  if (!active) {
    if (Math.abs(rawDelta) < DRAG_THRESHOLD) return
    active = true
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
function onDragEnd(event: PointerEvent, close: () => void) {
  if (!dragging) return
  dragging = false
  const el = event.currentTarget as HTMLElement
  if (!active) return
  active = false
  try {
    el.releasePointerCapture(event.pointerId)
  } catch {}
  const size = isVertical.value ? el.offsetHeight : el.offsetWidth
  if (Math.abs(offset) > size * DISMISS_FRACTION || Math.abs(velocity) > VELOCITY_THRESHOLD) {
    close()
  } else {
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
  offset = 0
  velocity = 0
}
</script>
