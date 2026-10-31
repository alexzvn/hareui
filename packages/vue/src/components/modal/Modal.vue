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
      <DialogOverlay data-slot="modal-backdrop" :style="visualViewportStyle" :class="ui.backdrop()">
        <!-- data-state mirrors Reka's overlay/content so container enter/exit animations (theme and user `data-[state=…]:` classes) run.
             The dialog has no visible exit animation; its theme runs `presence-hold` while closed so its own Presence keeps it
             mounted and the overlay's Presence removes it with the backdrop. Not `force-mount`: Reka's modal content then
             undoes `hideOthers` twice (on close and on unmount), leaving `aria-hidden` on the page after a few cycles. -->
        <div
          data-slot="modal-container"
          :data-state="isOpen ? 'open' : 'closed'"
          :data-placement="placement"
          :class="ui.container()"
        >
          <DialogContent
            ref="dialogContent"
            data-slot="modal-dialog"
            :data-placement="placement"
            v-bind="slots.description ? {} : { 'aria-describedby': undefined }"
            :class="ui.dialog()"
            @escape-key-down="onEscapeKeyDown"
            @interact-outside="onInteractOutside"
            @open-auto-focus="onOpenAutoFocus"
          >
            <VisuallyHidden v-if="slots.content && title" as-child>
              <DialogTitle>{{ title }}</DialogTitle>
            </VisuallyHidden>
            <slot name="content" :close="close">
              <div v-if="hasHeader" data-slot="modal-header" :class="ui.header()">
                <slot name="header">
                  <div v-if="!!slots.icon" data-slot="modal-icon" :class="ui.icon()">
                    <slot name="icon" />
                  </div>
                  <DialogTitle
                    v-if="showHeaderTitle"
                    data-slot="modal-heading"
                    :class="ui.heading()"
                  >
                    <slot name="title">
                      {{ title }}
                    </slot>
                  </DialogTitle>
                  <DialogDescription v-if="!!slots.description" as-child>
                    <slot name="description" />
                  </DialogDescription>
                </slot>
              </div>
              <div v-if="!!slots.body" data-slot="modal-body" :class="ui.body()">
                <slot name="body" :close="close" />
              </div>
              <div v-if="!!slots.footer" data-slot="modal-footer" :class="ui.footer()">
                <slot name="footer" :close="close" />
              </div>
              <!-- after header/body/footer so the theme's `header + body` / `body + footer` sibling margins still apply -->
              <VisuallyHidden v-if="!showHeaderTitle" as-child>
                <DialogTitle>{{ title }}</DialogTitle>
              </VisuallyHidden>
              <DialogClose v-if="closeButton" as-child>
                <slot name="close" :close="close">
                  <CloseButton
                    data-slot="modal-close-trigger"
                    :aria-label="closeButtonOptions.label"
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
  DialogDescription,
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
import { resolveCloseButton } from '@/utils/closeButton'
import { IconRenderer } from '@/utils/icon'

import type { ModalProps, ModalSlots, ModalEmits } from './Modal.types'
import theme from './theme'

// `open: undefined` stops Vue casting an absent boolean prop to `false`, so uncontrolled mode and `defaultOpen` apply
const props = withDefaults(defineProps<ModalProps>(), {
  open: undefined,
  portal: undefined,
  closeButton: true,
  dismissible: true,
  placement: 'auto',
})

const closeButtonOptions = computed(() => resolveCloseButton(props.closeButton))

const emit = defineEmits<ModalEmits>()
const slots = useSlots()
defineSlots<ModalSlots>()

const ui = useComponentUI('modal', {
  theme,
  variantProps: () => ({
    scroll: props.scroll,
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
  // A modal has one switch for both the backdrop and Escape.
  keyboardDismissible: () => props.dismissible,
  headerExtras: () => !!(slots.icon || slots.description),
})
</script>
