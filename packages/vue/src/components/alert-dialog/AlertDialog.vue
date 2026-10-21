<script lang="ts">
import type { PortalTarget } from '../../config'
import type { ComponentSlots, ComponentVariants } from '../../types/tv'
import theme from './theme'

type AlertDialog = typeof theme

export interface AlertDialogProps {
  /** The controlled open state of the alert dialog. Use with `v-model:open`. */
  open?: boolean
  /** The open state of the alert dialog when it is initially rendered. Use when you do not need to control its open state. */
  defaultOpen?: boolean
  /** Title rendered in the header. */
  title?: string
  /**
   * Status color of the header icon. Also picks the default icon.
   * @defaultValue 'danger'
   */
  status?: ComponentVariants<AlertDialog>['status']
  /**
   * Whether the status icon is rendered in the header. The `#icon` slot replaces its content.
   * @defaultValue true
   */
  icon?: boolean
  /**
   * Size of the dialog.
   * @defaultValue 'md'
   */
  size?: ComponentVariants<AlertDialog>['size']
  /**
   * Visual style of the backdrop.
   * @defaultValue 'opaque'
   */
  variant?: ComponentVariants<AlertDialog>['variant']
  /**
   * Vertical position of the dialog within the viewport.
   * @defaultValue 'auto'
   */
  placement?: ComponentVariants<AlertDialog>['placement']
  /**
   * Whether clicking the backdrop closes the alert dialog. Alert dialogs require an explicit action by default.
   * @defaultValue false
   */
  dismissible?: boolean
  /**
   * Whether pressing Escape closes the alert dialog.
   * @defaultValue false
   */
  keyboardDismissible?: boolean
  /**
   * Whether the default close button is rendered.
   * @defaultValue true
   */
  closeButton?: boolean
  /**
   * Renders the alert dialog in a portal. `true` portals to `document.body`, a selector string or element is used as the teleport target, and `false` disables portalling.
   * Falls back to `createHareUI({ portal })`, then `true`.
   */
  portal?: PortalTarget
  /** Additional classes merged into the dialog element. */
  class?: any
  /** Per-slot class overrides. */
  ui?: ComponentSlots<AlertDialog>
}

export interface AlertDialogSlots {
  /** The trigger element. Omit to control the alert dialog purely via `v-model:open`. */
  default?: (props: { open: boolean }) => any
  /** Replaces the whole header (icon and title). */
  header?: () => any
  /** Replaces the default status icon inside the icon wrapper. */
  icon?: () => any
  /** Replaces the title text. */
  title?: () => any
  /** The dialog body. */
  body?: (props: { close: () => void }) => any
  /** The dialog footer (actions). */
  footer?: (props: { close: () => void }) => any
  /** Replaces the default close button. */
  close?: (props: { close: () => void }) => any
  /** Replaces the entire dialog content (header, body, footer, close trigger). */
  content?: (props: { close: () => void }) => any
}

export interface AlertDialogEmits {
  /** Emitted when the open state changes. */
  'update:open': [value: boolean]
}
</script>

<script setup lang="ts">
import type { FocusOutsideEvent, PointerDownOutsideEvent } from 'reka-ui'
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
import { computed, onBeforeUnmount, onMounted, ref, useSlots } from 'vue'
import { preventNestedLayerDismiss } from '../../composables/nestedLayer'
import { useComponentUI } from '../../composables/useComponentUI'
import { usePortal } from '../../composables/usePortal'
import { useTabbableFocusLoop } from '../../composables/useTabbableFocusLoop'
import CloseButton from '../close-button/CloseButton.vue'

// `open: undefined` stops Vue casting an absent boolean prop to `false`, so uncontrolled mode and `defaultOpen` apply
const props = withDefaults(defineProps<AlertDialogProps>(), {
  open: undefined,
  portal: undefined,
  icon: true,
  closeButton: true,
  placement: 'auto',
})
const portalTarget = usePortal(() => props.portal)
const emit = defineEmits<AlertDialogEmits>()
const slots = useSlots()
defineSlots<AlertDialogSlots>()

const ui = useComponentUI('alertDialog', theme, () => ({
  status: props.status,
  size: props.size,
  variant: props.variant,
  placement: props.placement,
}))

const hasTitle = computed(() => !!(props.title || slots.title))
const showHeaderTitle = computed(() => !slots.header && hasTitle.value)
const hasHeader = computed(() => !!(slots.header || props.icon || hasTitle.value))

// HeroUI's AlertDialog.Backdrop: `isDismissable = false`, `isKeyboardDismissDisabled = true`.
function onEscapeKeyDown(event: KeyboardEvent) {
  if (!props.keyboardDismissible)
    event.preventDefault()
}
function onPointerDownOutside(event: PointerDownOutsideEvent) {
  if (!props.dismissible)
    event.preventDefault()
}
function onInteractOutside(event: PointerDownOutsideEvent | FocusOutsideEvent) {
  preventNestedLayerDismiss(event, dialogContent.value?.$el)
  if (!props.dismissible)
    event.preventDefault()
}

// Tab skips scrollable containers such as an overflowing body, as React Aria's FocusScope does.
const dialogContent = ref<{ $el: HTMLElement } | null>(null)
useTabbableFocusLoop(() => dialogContent.value?.$el)

// React Aria's Dialog focuses the dialog container itself on open (see Modal.vue).
function onOpenAutoFocus(event: Event) {
  event.preventDefault()
  ;(event.target as HTMLElement | null)?.focus({ preventScroll: true })
}

// HeroUI's visual-viewport-aware overlay height (see Modal.vue).
const visualViewportHeight = ref(typeof window !== 'undefined' ? `${window.innerHeight}px` : '100dvh')
function updateVisualViewportHeight() {
  visualViewportHeight.value = `${window.visualViewport?.height ?? window.innerHeight}px`
}
onMounted(() => {
  updateVisualViewportHeight()
  window.visualViewport?.addEventListener('resize', updateVisualViewportHeight)
  window.addEventListener('resize', updateVisualViewportHeight)
})
onBeforeUnmount(() => {
  window.visualViewport?.removeEventListener('resize', updateVisualViewportHeight)
  window.removeEventListener('resize', updateVisualViewportHeight)
})
</script>

<template>
  <DialogRoot :open="open" :default-open="defaultOpen" modal v-slot="{ open: isOpen, close }" @update:open="emit('update:open', $event)">
    <DialogTrigger v-if="!!slots.default" as-child>
      <slot :open="isOpen" />
    </DialogTrigger>
    <DialogPortal :disabled="portalTarget.disabled" :to="portalTarget.to">
      <DialogOverlay
        data-slot="alert-dialog-backdrop"
        :style="{ '--visual-viewport-height': visualViewportHeight }"
        :class="ui.backdrop({ class: props.ui?.backdrop })"
      >
        <!-- No force-mount: see Modal.vue - the dialog's `presence-hold` keeps it through the container's exit animation -->
        <div data-slot="alert-dialog-container" :data-state="isOpen ? 'open' : 'closed'" :data-placement="placement" :class="ui.container({ class: props.ui?.container })">
          <DialogContent
            ref="dialogContent"
            data-slot="alert-dialog-dialog"
            role="alertdialog"
            :data-placement="placement"
            :aria-describedby="undefined"
            :class="ui.dialog({ class: [props.ui?.dialog, props.class] })"
            @escape-key-down="onEscapeKeyDown"
            @pointer-down-outside="onPointerDownOutside"
            @interact-outside="onInteractOutside"
            @open-auto-focus="onOpenAutoFocus"
          >
            <VisuallyHidden v-if="slots.content && title" as-child>
              <DialogTitle>{{ title }}</DialogTitle>
            </VisuallyHidden>
            <slot name="content" :close="close">
              <DialogClose v-if="closeButton" as-child>
                <slot name="close" :close="close">
                  <CloseButton data-slot="alert-dialog-close-trigger" :class="ui.closeTrigger({ class: props.ui?.closeTrigger })" />
                </slot>
              </DialogClose>
              <!-- Before the header so `header + body` / `header + footer` spacing selectors still match -->
              <VisuallyHidden v-if="!showHeaderTitle" as-child>
                <DialogTitle />
              </VisuallyHidden>
              <div v-if="hasHeader" data-slot="alert-dialog-header" :class="ui.header({ class: props.ui?.header })">
                <slot name="header">
                  <div v-if="icon" data-slot="alert-dialog-icon" :class="ui.icon({ class: props.ui?.icon })">
                    <slot name="icon">
                      <svg v-if="status === 'success'" data-slot="alert-dialog-default-icon" aria-hidden="true" fill="none" height="16" role="presentation" viewBox="0 0 16 16" width="16" xmlns="http://www.w3.org/2000/svg">
                        <path clip-rule="evenodd" d="M13.5 8a5.5 5.5 0 1 1-11 0a5.5 5.5 0 0 1 11 0M15 8A7 7 0 1 1 1 8a7 7 0 0 1 14 0m-3.9-1.55a.75.75 0 1 0-1.2-.9L7.419 8.858L6.03 7.47a.75.75 0 0 0-1.06 1.06l2 2a.75.75 0 0 0 1.13-.08z" fill="currentColor" fill-rule="evenodd" />
                      </svg>
                      <svg v-else-if="status === 'warning'" data-slot="alert-dialog-default-icon" aria-hidden="true" fill="none" height="16" role="presentation" viewBox="0 0 16 16" width="16" xmlns="http://www.w3.org/2000/svg">
                        <path clip-rule="evenodd" d="M7.134 2.994L2.217 11.5a1 1 0 0 0 .866 1.5h9.834a1 1 0 0 0 .866-1.5L8.866 2.993a1 1 0 0 0-1.732 0m3.03-.75c-.962-1.665-3.366-1.665-4.329 0L.918 10.749c-.963 1.666.24 3.751 2.165 3.751h9.834c1.925 0 3.128-2.085 2.164-3.751zM8 5a.75.75 0 0 1 .75.75v2a.75.75 0 0 1-1.5 0v-2A.75.75 0 0 1 8 5m1 5.75a1 1 0 1 1-2 0a1 1 0 0 1 2 0" fill="currentColor" fill-rule="evenodd" />
                      </svg>
                      <svg v-else-if="status === 'default' || status === 'accent'" data-slot="alert-dialog-default-icon" aria-hidden="true" fill="none" height="16" role="presentation" viewBox="0 0 16 16" width="16" xmlns="http://www.w3.org/2000/svg">
                        <path clip-rule="evenodd" d="M8 13.5a5.5 5.5 0 1 0 0-11a5.5 5.5 0 0 0 0 11M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14m1-9.5a1 1 0 1 1-2 0a1 1 0 0 1 2 0m-.25 3a.75.75 0 0 0-1.5 0V11a.75.75 0 0 0 1.5 0z" fill="currentColor" fill-rule="evenodd" />
                      </svg>
                      <svg v-else data-slot="alert-dialog-default-icon" aria-hidden="true" fill="none" height="16" role="presentation" viewBox="0 0 16 16" width="16" xmlns="http://www.w3.org/2000/svg">
                        <path clip-rule="evenodd" d="M8 13.5a5.5 5.5 0 1 0 0-11a5.5 5.5 0 0 0 0 11M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14m1-4.5a1 1 0 1 1-2 0a1 1 0 0 1 2 0M8.75 5a.75.75 0 0 0-1.5 0v2.5a.75.75 0 0 0 1.5 0z" fill="currentColor" fill-rule="evenodd" />
                      </svg>
                    </slot>
                  </div>
                  <DialogTitle v-if="showHeaderTitle" data-slot="alert-dialog-heading" :class="ui.heading({ class: props.ui?.heading })">
                    <slot name="title">
                      {{ title }}
                    </slot>
                  </DialogTitle>
                </slot>
              </div>
              <div v-if="!!slots.body" data-slot="alert-dialog-body" :class="ui.body({ class: props.ui?.body })">
                <slot name="body" :close="close" />
              </div>
              <div v-if="!!slots.footer" data-slot="alert-dialog-footer" :class="ui.footer({ class: props.ui?.footer })">
                <slot name="footer" :close="close" />
              </div>
            </slot>
          </DialogContent>
        </div>
      </DialogOverlay>
    </DialogPortal>
  </DialogRoot>
</template>
