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
        data-slot="alert-dialog-backdrop"
        :style="visualViewportStyle"
        :class="ui.backdrop()"
      >
        <!-- No force-mount: see Modal.vue - the dialog's `presence-hold` keeps it through the container's exit animation -->
        <div
          data-slot="alert-dialog-container"
          :data-state="isOpen ? 'open' : 'closed'"
          :data-placement="placement"
          :class="ui.container()"
        >
          <DialogContent
            ref="dialogContent"
            data-slot="alert-dialog-dialog"
            role="alertdialog"
            :data-placement="placement"
            :aria-describedby="undefined"
            :class="ui.dialog()"
            @escape-key-down="onEscapeKeyDown"
            @interact-outside="onInteractOutside"
            @open-auto-focus="onOpenAutoFocus"
          >
            <VisuallyHidden v-if="slots.content && title" as-child>
              <DialogTitle>{{ title }}</DialogTitle>
            </VisuallyHidden>
            <slot name="content" :close="close">
              <DialogClose v-if="closeButton" as-child>
                <slot name="close" :close="close">
                  <CloseButton data-slot="alert-dialog-close-trigger" :class="ui.closeTrigger()" />
                </slot>
              </DialogClose>
              <!-- Before the header so `header + body` / `header + footer` spacing selectors still match -->
              <VisuallyHidden v-if="!showHeaderTitle" as-child>
                <DialogTitle>{{ title }}</DialogTitle>
              </VisuallyHidden>
              <div v-if="hasHeader" data-slot="alert-dialog-header" :class="ui.header()">
                <slot name="header">
                  <div v-if="icon" data-slot="alert-dialog-icon" :class="ui.icon()">
                    <slot name="icon">
                      <svg
                        v-if="status === 'success'"
                        data-slot="alert-dialog-default-icon"
                        aria-hidden="true"
                        fill="none"
                        height="16"
                        role="presentation"
                        viewBox="0 0 16 16"
                        width="16"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          clip-rule="evenodd"
                          d="M13.5 8a5.5 5.5 0 1 1-11 0a5.5 5.5 0 0 1 11 0M15 8A7 7 0 1 1 1 8a7 7 0 0 1 14 0m-3.9-1.55a.75.75 0 1 0-1.2-.9L7.419 8.858L6.03 7.47a.75.75 0 0 0-1.06 1.06l2 2a.75.75 0 0 0 1.13-.08z"
                          fill="currentColor"
                          fill-rule="evenodd"
                        />
                      </svg>
                      <svg
                        v-else-if="status === 'warning'"
                        data-slot="alert-dialog-default-icon"
                        aria-hidden="true"
                        fill="none"
                        height="16"
                        role="presentation"
                        viewBox="0 0 16 16"
                        width="16"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          clip-rule="evenodd"
                          d="M7.134 2.994L2.217 11.5a1 1 0 0 0 .866 1.5h9.834a1 1 0 0 0 .866-1.5L8.866 2.993a1 1 0 0 0-1.732 0m3.03-.75c-.962-1.665-3.366-1.665-4.329 0L.918 10.749c-.963 1.666.24 3.751 2.165 3.751h9.834c1.925 0 3.128-2.085 2.164-3.751zM8 5a.75.75 0 0 1 .75.75v2a.75.75 0 0 1-1.5 0v-2A.75.75 0 0 1 8 5m1 5.75a1 1 0 1 1-2 0a1 1 0 0 1 2 0"
                          fill="currentColor"
                          fill-rule="evenodd"
                        />
                      </svg>
                      <svg
                        v-else-if="status === 'default' || status === 'accent'"
                        data-slot="alert-dialog-default-icon"
                        aria-hidden="true"
                        fill="none"
                        height="16"
                        role="presentation"
                        viewBox="0 0 16 16"
                        width="16"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          clip-rule="evenodd"
                          d="M8 13.5a5.5 5.5 0 1 0 0-11a5.5 5.5 0 0 0 0 11M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14m1-9.5a1 1 0 1 1-2 0a1 1 0 0 1 2 0m-.25 3a.75.75 0 0 0-1.5 0V11a.75.75 0 0 0 1.5 0z"
                          fill="currentColor"
                          fill-rule="evenodd"
                        />
                      </svg>
                      <svg
                        v-else
                        data-slot="alert-dialog-default-icon"
                        aria-hidden="true"
                        fill="none"
                        height="16"
                        role="presentation"
                        viewBox="0 0 16 16"
                        width="16"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          clip-rule="evenodd"
                          d="M8 13.5a5.5 5.5 0 1 0 0-11a5.5 5.5 0 0 0 0 11M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14m1-4.5a1 1 0 1 1-2 0a1 1 0 0 1 2 0M8.75 5a.75.75 0 0 0-1.5 0v2.5a.75.75 0 0 0 1.5 0z"
                          fill="currentColor"
                          fill-rule="evenodd"
                        />
                      </svg>
                    </slot>
                  </div>
                  <DialogTitle
                    v-if="showHeaderTitle"
                    data-slot="alert-dialog-heading"
                    :class="ui.heading()"
                  >
                    <slot name="title">
                      {{ title }}
                    </slot>
                  </DialogTitle>
                </slot>
              </div>
              <div v-if="!!slots.body" data-slot="alert-dialog-body" :class="ui.body()">
                <slot name="body" :close="close" />
              </div>
              <div v-if="!!slots.footer" data-slot="alert-dialog-footer" :class="ui.footer()">
                <slot name="footer" :close="close" />
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
import { useSlots, useTemplateRef } from 'vue'

import CloseButton from '@/components/close-button/CloseButton.vue'
import { useComponentUI } from '@/composables/useComponentUI'
import { useDialogShell } from '@/composables/useDialogShell'

import type { AlertDialogEmits, AlertDialogProps, AlertDialogSlots } from './AlertDialog.types'
import theme from './theme'

// `open: undefined` stops Vue casting an absent boolean prop to `false`, so uncontrolled mode and `defaultOpen` apply
const props = withDefaults(defineProps<AlertDialogProps>(), {
  open: undefined,
  portal: undefined,
  icon: true,
  closeButton: true,
  placement: 'auto',
})

const emit = defineEmits<AlertDialogEmits>()
const slots = useSlots()
defineSlots<AlertDialogSlots>()

const ui = useComponentUI('alertDialog', {
  theme,
  variantProps: () => ({
    status: props.status,
    size: props.size,
    variant: props.variant,
    placement: props.placement,
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
  // HeroUI's AlertDialog.Backdrop: `isDismissable = false`, `isKeyboardDismissDisabled = true`.
  keyboardDismissible: () => props.keyboardDismissible,
  headerExtras: () => props.icon,
})
</script>
