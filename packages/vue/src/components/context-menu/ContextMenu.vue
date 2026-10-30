<template>
  <ContextMenuRoot :modal="modal" :press-open-delay="pressOpenDelay" @update:open="setOpen">
    <ContextMenuOpenState :open="isOpen">
      <ContextMenuTrigger
        as="div"
        v-bind="$attrs"
        :disabled="disabled"
        data-slot="context-menu-trigger"
        :class="ui.trigger()"
      >
        <slot />
      </ContextMenuTrigger>
    </ContextMenuOpenState>
    <ContextMenuPortal :disabled="portalTarget.disabled" :to="portalTarget.to">
      <!-- Reka puts `role="menu"` on the content; the inner element carries the menu classes -->
      <!-- `loop`: keyboard focus wraps from the last item to the first and back -->
      <ContextMenuContent
        ref="content"
        loop
        side="bottom"
        align="start"
        :side-offset="position.sideOffset"
        :align-offset="position.alignOffset"
        :avoid-collisions="position.avoidCollisions"
        :collision-padding="position.collisionPadding"
        data-slot="context-menu-popover"
        :class="ui.popover()"
        @interact-outside="onInteractOutside"
        @open-auto-focus="focusInitialItem"
        @keydown="onMenuKeydown"
      >
        <slot name="content-top" />
        <div
          data-slot="context-menu-menu"
          :data-selection-mode="selectionMode !== 'none' ? selectionMode : undefined"
          :class="ui.menu()"
        >
          <DropdownMenuItems :entries="entries" :group="rootGroup" />
        </div>
        <slot name="content-bottom" />
      </ContextMenuContent>
    </ContextMenuPortal>
  </ContextMenuRoot>
</template>

<script setup lang="ts" generic="T extends ContextMenuItem = ContextMenuItem">
import { defu } from 'defu'
import { ContextMenuContent, ContextMenuPortal, ContextMenuRoot, ContextMenuTrigger } from 'reka-ui'
import type { ComponentPublicInstance } from 'vue'
import { computed, useTemplateRef } from 'vue'

import type { DropdownEntry } from '@/components/dropdown/Dropdown.types'
import { joinGroups, toGroups } from '@/components/dropdown/dropdown.utils'
import DropdownMenuItems from '@/components/dropdown/DropdownMenuItems.vue'
import { useDropdownMenu } from '@/components/dropdown/useDropdownMenu'
import { useComponentUI } from '@/composables/useComponentUI'
import { useControllableOpen } from '@/composables/useControllableOpen'

import type {
  ContextMenuContentOptions,
  ContextMenuEmits,
  ContextMenuItem,
  ContextMenuProps,
  ContextMenuSlots,
} from './ContextMenu.types'
import ContextMenuOpenState from './ContextMenuOpenState.vue'
import theme from './theme'

defineOptions({ inheritAttrs: false })

// Vue casts an absent boolean prop to `false`; `undefined` keeps `open` uncontrolled and lets `portal` fall back
// to the app-wide target.
const props = withDefaults(defineProps<ContextMenuProps<T>>(), {
  portal: undefined,
  open: undefined,
  items: () => [],
  selectionMode: 'none',
  indicator: 'checkmark',
  modal: true,
  pressOpenDelay: 700,
})

const emit = defineEmits<ContextMenuEmits>()
const slots = defineSlots<ContextMenuSlots<T>>()

const CONTENT_DEFAULTS: Required<ContextMenuContentOptions> = {
  sideOffset: 2,
  alignOffset: 0,
  avoidCollisions: true,
  collisionPadding: 12,
}

const position = computed(() => defu(props.content, CONTENT_DEFAULTS))

const ui = useComponentUI('contextMenu', {
  theme: theme,
  variantProps: () => ({}),
  props,
  classSlot: 'trigger',
})

const contentRef = useTemplateRef<ComponentPublicInstance>('content')

const { isOpen, setOpen } = useControllableOpen({
  open: () => props.open,
  defaultOpen: props.defaultOpen,
  onUpdate: (value) => emit('update:open', value),
})

// An array of groups renders as one list with a separator between groups.
const entries = computed<DropdownEntry[]>(() => joinGroups(toGroups(props.items)))

// Submenus open 2px past their trigger item, which overlaps the parent menu's 6px padding by 4px.
const { portalTarget, onInteractOutside, rootGroup, onMenuKeydown, focusInitialItem } =
  useDropdownMenu({
    entries: () => entries.value,
    selection: () => ({ mode: props.selectionMode, indicator: props.indicator }),
    modelValue: () => props.modelValue,
    defaultValue: props.defaultValue,
    onUpdateModelValue: (value) => emit('update:modelValue', value),
    onAction: (value) => emit('action', value),
    isOpen: () => isOpen.value,
    isModal: () => props.modal,
    content: () => contentRef.value?.$el,
    portal: () => props.portal,
    context: {
      classes: () => ui.value,
      submenuSideOffset: 2,
      submenuClearsTrigger: true,
      slots,
    },
  })
</script>
