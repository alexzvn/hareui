<script lang="ts">
import type { FocusOutsideEvent, PointerDownOutsideEvent } from 'reka-ui'
import type { ComponentSlots, ComponentVariants } from '../../types/tv'
import theme from './theme'

type Modal = typeof theme

export interface ModalProps {
  /** The controlled open state of the modal. Use with `v-model:open`. */
  open?: boolean
  /** The open state of the modal when it is initially rendered. Use when you do not need to control its open state. */
  defaultOpen?: boolean
  /** Title rendered in the header. */
  title?: string
  /**
   * Where the dialog scrolls when its content overflows the viewport.
   * @defaultValue 'inside'
   */
  scroll?: ComponentVariants<Modal>['scroll']
  /**
   * Size of the dialog.
   * @defaultValue 'md'
   */
  size?: ComponentVariants<Modal>['size']
  /**
   * Visual style of the backdrop.
   * @defaultValue 'opaque'
   */
  variant?: ComponentVariants<Modal>['variant']
  /**
   * Vertical position of the dialog within the viewport.
   * @defaultValue 'auto'
   */
  placement?: ComponentVariants<Modal>['placement']
  /**
   * Whether clicking the backdrop or pressing Escape closes the modal.
   * @defaultValue true
   */
  dismissible?: boolean
  /**
   * Whether the default close button is rendered.
   * @defaultValue true
   */
  closeButton?: boolean
  /**
   * Where the modal is teleported. `true` teleports to `body`, `false` renders in place,
   * a string or element teleports to that target.
   * @defaultValue true
   */
  portal?: boolean | string | HTMLElement
  /** Additional classes merged into the dialog element. */
  class?: any
  /** Per-slot class overrides. */
  ui?: ComponentSlots<Modal>
}

export interface ModalSlots {
  /** The trigger element. Omit to control the modal purely via `v-model:open`. */
  default?: (props: { open: boolean }) => any
  /** Replaces the whole header (icon and title). */
  header?: () => any
  /** Icon rendered before the title in the header. */
  icon?: () => any
  /** Replaces the title text. */
  title?: () => any
  /** Supporting text after the title, linked to the dialog as its description. Pass one element (e.g. a `<p>`). */
  description?: () => any
  /** The dialog body. */
  body?: (props: { close: () => void }) => any
  /** The dialog footer (actions). */
  footer?: (props: { close: () => void }) => any
  /** Replaces the default close button. */
  close?: (props: { close: () => void }) => any
  /** Replaces the entire dialog content (header, body, footer, close trigger). */
  content?: (props: { close: () => void }) => any
}

export interface ModalEmits {
  /** Emitted when the open state changes. */
  'update:open': [value: boolean]
}
</script>

<script setup lang="ts">
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
  VisuallyHidden,
} from 'reka-ui'
import { computed, onBeforeUnmount, onMounted, ref, useSlots } from 'vue'
import { useComponentUI } from '../../composables/useComponentUI'
import { useTabbableFocusLoop } from '../../composables/useTabbableFocusLoop'
import CloseButton from '../close-button/CloseButton.vue'

// `open: undefined` stops Vue casting an absent boolean prop to `false`, so uncontrolled mode and `defaultOpen` apply
const props = withDefaults(defineProps<ModalProps>(), {
  open: undefined,
  portal: true,
  closeButton: true,
  dismissible: true,
  placement: 'auto',
})
const emit = defineEmits<ModalEmits>()
const slots = useSlots()
defineSlots<ModalSlots>()

const ui = useComponentUI('modal', theme, () => ({
  scroll: props.scroll,
  size: props.size,
  variant: props.variant,
  placement: props.placement,
}))

const hasTitle = computed(() => !!(props.title || slots.title))
const showHeaderTitle = computed(() => !slots.header && hasTitle.value)
const hasHeader = computed(() => !!(slots.header || slots.icon || slots.description || hasTitle.value))

function onEscapeKeyDown(event: KeyboardEvent) {
  if (!props.dismissible)
    event.preventDefault()
}
function onPointerDownOutside(event: PointerDownOutsideEvent) {
  if (!props.dismissible)
    event.preventDefault()
}
function onInteractOutside(event: PointerDownOutsideEvent | FocusOutsideEvent) {
  if (!props.dismissible)
    event.preventDefault()
}

// Tab skips scrollable containers such as an overflowing body, as React Aria's FocusScope does.
const dialogContent = ref<{ $el: HTMLElement } | null>(null)
useTabbableFocusLoop(() => dialogContent.value?.$el)

// React Aria's Dialog focuses the dialog container itself on open, not the first
// tabbable descendant (Reka's FocusScope default). Match that so e.g. a footer
// button doesn't pick up an unwanted focus ring when the modal opens.
function onOpenAutoFocus(event: Event) {
  event.preventDefault()
  ;(event.target as HTMLElement | null)?.focus({ preventScroll: true })
}

// Mirrors HeroUI's visual-viewport-aware height so the overlay never gets clipped by
// mobile browser chrome / the on-screen keyboard, instead of a static `100dvh`.
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
    <DialogPortal :disabled="portal === false" :to="portal === true ? 'body' : (portal === false ? undefined : portal)">
      <DialogOverlay
        data-slot="modal-backdrop"
        :style="{ '--visual-viewport-height': visualViewportHeight }"
        :class="ui.backdrop({ class: props.ui?.backdrop })"
      >
        <!-- data-state mirrors Reka's overlay/content so container enter/exit animations (theme and user `data-[state=…]:` classes) run.
             The dialog has no visible exit animation; its theme runs `presence-hold` while closed so its own Presence keeps it
             mounted and the overlay's Presence removes it with the backdrop. Not `force-mount`: Reka's modal content then
             undoes `hideOthers` twice (on close and on unmount), leaving `aria-hidden` on the page after a few cycles. -->
        <div data-slot="modal-container" :data-state="isOpen ? 'open' : 'closed'" :data-placement="placement" :class="ui.container({ class: props.ui?.container })">
          <DialogContent
            ref="dialogContent"
            data-slot="modal-dialog"
            :data-placement="placement"
            v-bind="slots.description ? {} : { 'aria-describedby': undefined }"
            :class="ui.dialog({ class: [props.ui?.dialog, props.class] })"
            @escape-key-down="onEscapeKeyDown"
            @pointer-down-outside="onPointerDownOutside"
            @interact-outside="onInteractOutside"
            @open-auto-focus="onOpenAutoFocus"
          >
            <slot name="content" :close="close">
              <div v-if="hasHeader" data-slot="modal-header" :class="ui.header({ class: props.ui?.header })">
                <slot name="header">
                  <div v-if="!!slots.icon" data-slot="modal-icon" :class="ui.icon({ class: props.ui?.icon })">
                    <slot name="icon" />
                  </div>
                  <DialogTitle v-if="showHeaderTitle" data-slot="modal-heading" :class="ui.heading({ class: props.ui?.heading })">
                    <slot name="title">
                      {{ title }}
                    </slot>
                  </DialogTitle>
                  <DialogDescription v-if="!!slots.description" as-child>
                    <slot name="description" />
                  </DialogDescription>
                </slot>
              </div>
              <div v-if="!!slots.body" data-slot="modal-body" :class="ui.body({ class: props.ui?.body })">
                <slot name="body" :close="close" />
              </div>
              <div v-if="!!slots.footer" data-slot="modal-footer" :class="ui.footer({ class: props.ui?.footer })">
                <slot name="footer" :close="close" />
              </div>
              <!-- after header/body/footer so the theme's `header + body` / `body + footer` sibling margins still apply -->
              <VisuallyHidden v-if="!showHeaderTitle" as-child>
                <DialogTitle>{{ title }}</DialogTitle>
              </VisuallyHidden>
              <DialogClose v-if="closeButton" as-child>
                <slot name="close" :close="close">
                  <CloseButton data-slot="modal-close-trigger" :class="ui.closeTrigger({ class: props.ui?.closeTrigger })" />
                </slot>
              </DialogClose>
            </slot>
          </DialogContent>
        </div>
      </DialogOverlay>
    </DialogPortal>
  </DialogRoot>
</template>
