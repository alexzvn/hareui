<template>
  <PopoverRoot :open="isOpen" modal v-slot="{ close }" @update:open="setOpen">
    <PopoverTrigger v-if="!!slots.default" as-child :data-pressed="isOpen ? 'true' : undefined">
      <slot :open="isOpen" />
    </PopoverTrigger>
    <PopoverPortal :disabled="portalTarget.disabled" :to="portalTarget.to">
      <PopoverContent
        ref="contentRef"
        data-slot="popover"
        :side="side"
        :align="align"
        :side-offset="contentOffset"
        :avoid-collisions="flip"
        :collision-padding="8"
        :class="ui.base()"
        @escape-key-down="onEscapeKeyDown"
        @interact-outside="onInteractOutside"
        @open-auto-focus="onOpenAutoFocus"
      >
        <div ref="dialogRef" data-slot="popover-dialog" tabindex="-1" :class="ui.dialog()">
          <h2 v-if="hasHeading" :id="headingId" data-slot="popover-heading" :class="ui.heading()">
            <slot name="title">{{ title }}</slot>
          </h2>
          <slot name="content" :close="close" />
        </div>
        <PopoverArrow v-if="arrow" as-child>
          <svg
            data-slot="popover-overlay-arrow"
            fill="none"
            height="12"
            viewBox="0 0 12 12"
            width="12"
            xmlns="http://www.w3.org/2000/svg"
            :class="ui.arrow()"
          >
            <path d="M0 0C5.48483 8 6.5 8 12 0Z" />
          </svg>
        </PopoverArrow>
      </PopoverContent>
    </PopoverPortal>
  </PopoverRoot>
</template>

<script setup lang="ts">
import { PopoverArrow, PopoverContent, PopoverPortal, PopoverRoot, PopoverTrigger } from 'reka-ui'
import { computed, useId, useSlots, useTemplateRef, watch } from 'vue'

import { useComponentUI } from '@/composables/useComponentUI'
import { useControllableOpen } from '@/composables/useControllableOpen'
import { useInertOutside } from '@/composables/useInertOutside'
import { useLayerDismiss } from '@/composables/useLayerDismiss'
import { usePortal } from '@/composables/usePortal'

import type { PopoverProps, PopoverSlots, PopoverEmits } from './Popover.types'
import theme from './theme'

// `open: undefined` stops Vue casting an absent boolean prop to `false`, so uncontrolled mode and `defaultOpen` apply
const props = withDefaults(defineProps<PopoverProps>(), {
  open: undefined,
  side: 'bottom',
  align: 'center',
  sideOffset: 8,
  flip: true,
  arrow: false,
  dismissible: true,
  portal: undefined,
})

const portalTarget = usePortal(() => props.portal)
const emit = defineEmits<PopoverEmits>()
const slots = useSlots()
defineSlots<PopoverSlots>()

const ui = useComponentUI('popover', { theme: theme, variantProps: () => ({}), props })

const contentRef = useTemplateRef<{ $el: HTMLElement }>('contentRef')
const dialogRef = useTemplateRef<HTMLElement>('dialogRef')
const hasHeading = computed(() => !!(props.title || slots.title))

// React Aria labels the dialog by its title heading (Reka labels it by the trigger).
const headingId = useId()

const { isOpen, setOpen } = useControllableOpen({
  open: () => props.open,
  defaultOpen: props.defaultOpen,
  onUpdate: (value) => emit('update:open', value),
})

// `isOpen` turns false synchronously in `setOpen` (Reka's `update:open`) and with the `open` prop. The
// content instance stays mounted while closed and its `$el` isn't reactive, so re-read it on every open.
useInertOutside(() => (isOpen.value ? contentRef.value?.$el : null), isOpen)

// React Aria's useInteractOutside only reacts to the primary button, so a right click outside keeps the popover open.
const { onEscapeKeyDown, onInteractOutside } = useLayerDismiss({
  content: () => contentRef.value?.$el,
  isDismissible: () => props.dismissible,
  shouldIgnoreSecondaryButton: true,
  onPrevent: () => emit('close:prevent'),
  earlyPress: { isOpen, onDismiss: () => setOpen(false) },
})

// Reka hard-codes `aria-labelledby` to the trigger id below any attrs we pass, so relabel the dialog
// here; Vue never re-patches it because Reka's value doesn't change between renders.
watch(dialogRef, (el) => {
  if (el && hasHeading.value)
    el.closest('[role=dialog]')?.setAttribute('aria-labelledby', headingId)
})

// React Aria moves focus into the dialog element itself when the popover opens;
// Reka's PopperContent otherwise focuses its own root, so redirect it here to match.
const onOpenAutoFocus = (event: Event) => {
  event.preventDefault()
  dialogRef.value?.focus()
}

// The arrow SVG is 12px tall. Reka's PopperContent adds the arrow's height to `sideOffset`, but
// React Aria measures `offset` from the trigger to the popover body (the arrow overlaps the gap),
// so subtract it to keep the HeroUI distance.
const ARROW_HEIGHT = 12
const contentOffset = computed(() => props.sideOffset - (props.arrow ? ARROW_HEIGHT : 0))
</script>
