<template>
  <DropdownMenuRoot :open="isOpen" @update:open="onRootOpenChange">
    <DropdownMenuTrigger
      as-child
      :disabled="disabled"
      :data-pressed="isOpen ? 'true' : undefined"
      :aria-describedby="trigger === 'longPress' ? describedBy : undefined"
      @pointerdown.capture="onTriggerPointerdownCapture"
      @click.capture="onTriggerClickCapture"
      @keydown.capture="onTriggerKeydownCapture"
      @pointerup="cancelLongPress"
      @pointerleave="cancelLongPress"
      @pointercancel="cancelLongPress"
    >
      <slot />
    </DropdownMenuTrigger>
    <DropdownMenuPortal :disabled="portalTarget.disabled" :to="portalTarget.to">
      <!-- Reka puts `role="menu"` on the content; the inner element carries the menu classes -->
      <!-- `loop`: React Aria wraps keyboard focus from the last item to the first and back -->
      <DropdownMenuContent
        ref="contentRef"
        loop
        :side="side"
        :align="align"
        :side-offset="sideOffset"
        :collision-padding="12"
        data-slot="dropdown-popover"
        :class="ui.popover()"
        @interact-outside="onInteractOutside"
        @open-auto-focus="onOpenAutoFocus"
        @keydown="onMenuKeydown"
      >
        <slot name="content-top" />
        <div
          data-slot="dropdown-menu"
          :data-selection-mode="selectionMode !== 'none' ? selectionMode : undefined"
          :class="ui.menu()"
        >
          <DropdownMenuItems :entries="items ?? []" :group="rootGroup" />
        </div>
      </DropdownMenuContent>
    </DropdownMenuPortal>
  </DropdownMenuRoot>
</template>

<script setup lang="ts" generic="T extends DropdownItem = DropdownItem">
import {
  DropdownMenuContent,
  DropdownMenuPortal,
  DropdownMenuRoot,
  DropdownMenuTrigger,
} from 'reka-ui'
import { onBeforeUnmount, onMounted, ref } from 'vue'

import { useComponentUI } from '@/composables/useComponentUI'
import { useControllableOpen } from '@/composables/useControllableOpen'
import { useLocale } from '@/composables/useLocale'

import type { DropdownEmits, DropdownItem, DropdownProps, DropdownSlots } from './Dropdown.types'
import { ensureLongPressDescription, LONG_PRESS_DESCRIPTION_ID } from './dropdown.utils'
import DropdownMenuItems from './DropdownMenuItems.vue'
import theme from './theme'
import { useDropdownMenu } from './useDropdownMenu'

const { t } = useLocale()

const props = withDefaults(defineProps<DropdownProps<T>>(), {
  portal: undefined,
  open: undefined,
  modelValue: undefined,
  selectionMode: 'none',
  indicator: 'checkmark',
  trigger: 'press',
  side: 'bottom',
  align: 'start',
  sideOffset: 8,
})

const emit = defineEmits<DropdownEmits>()
const slots = defineSlots<DropdownSlots<T>>()

const ui = useComponentUI('dropdown', {
  theme: theme,
  variantProps: () => ({}),
  props,
  classSlot: 'popover',
})

// Submenus and items layer `ui` too, but the `class` prop only styles the root popover.
const menuUI = useComponentUI('dropdown', {
  theme: theme,
  variantProps: () => ({}),
  props: {
    get ui() {
      return props.ui
    },
  },
})

const contentRef = ref<{ $el: HTMLElement } | null>(null)

const { isOpen, setOpen } = useControllableOpen({
  open: () => props.open,
  defaultOpen: props.defaultOpen,
  onUpdate: (value) => emit('update:open', value),
})

const { portalTarget, onInteractOutside, rootGroup, onMenuKeydown, focusInitialItem } =
  useDropdownMenu({
    entries: () => props.items ?? [],
    selection: () => ({ mode: props.selectionMode, indicator: props.indicator }),
    modelValue: () => props.modelValue,
    defaultValue: props.defaultValue,
    onUpdateModelValue: (value) => emit('update:modelValue', value),
    onAction: (value) => emit('action', value),
    isOpen: () => isOpen.value,
    content: () => contentRef.value?.$el,
    portal: () => props.portal,
    context: {
      classes: () => menuUI.value,
      submenuSideOffset: 8,
      slots,
    },
  })

// RAC's `menuTriggerState.open(focusStrategy)`: ArrowUp opens on the last item, a long press on the first.
// Reka only knows "first item when opened from the keyboard", so the strategy is applied on open below.
let focusOnOpen: 'first' | 'last' | null = null
const openWithFocus = (strategy: 'first' | 'last') => {
  focusOnOpen = strategy
  setOpen(true)
}

const strategyItem = (items: HTMLElement[], strategy: 'first' | 'last' | null) => {
  if (strategy === 'first') return items[0]
  if (strategy === 'last') return items.at(-1)

  return undefined
}

// RAC's `useSelectableCollection` falls back to the item of the focus strategy when none is selected.
const onOpenAutoFocus = (event: Event) => {
  const strategy = focusOnOpen
  focusOnOpen = null
  focusInitialItem(event, (items) => strategyItem(items, strategy))
}

// Long press: keep Reka's trigger from toggling on press; open after RAC's 500ms threshold instead.
// Reka 2.10's trigger toggles on every `click` (it doesn't check `defaultPrevented`) and on
// Enter / Space / ArrowDown keydown. The trigger's own click and press handlers still run, as RAC's
// long-press trigger keeps its `onPress` action.
const LONG_PRESS_THRESHOLD = 500
let longPressTimer: ReturnType<typeof setTimeout> | undefined
const describedBy = ref<string>()

const cancelLongPress = () => {
  clearTimeout(longPressTimer)
  longPressTimer = undefined
}

const onTriggerPointerdownCapture = (event: PointerEvent) => {
  if (props.trigger !== 'longPress' || props.disabled || event.button !== 0) return
  cancelLongPress()
  longPressTimer = setTimeout(() => openWithFocus('first'), LONG_PRESS_THRESHOLD)
}

// The toggle Reka requests while a trigger click dispatches (a short press, or the release after a
// long press) is dropped. Cleared on a task, not a microtask: browsers run a microtask checkpoint
// after each listener, which would clear the flag before Reka's bubble-phase listener runs.
let shouldSuppressTriggerToggle = false
const onTriggerClickCapture = () => {
  if (props.trigger !== 'longPress') return
  shouldSuppressTriggerToggle = true
  setTimeout(() => (shouldSuppressTriggerToggle = false))
}

const onRootOpenChange = (open: boolean) => {
  if (!shouldSuppressTriggerToggle) setOpen(open)
}

const onTriggerKeydownCapture = (event: KeyboardEvent) => {
  if (props.trigger !== 'longPress') {
    // Reka's trigger ignores ArrowUp; RAC opens the menu on its last item.
    if (event.key === 'ArrowUp' && !props.disabled && !isOpen.value) {
      event.preventDefault()
      openWithFocus('last')
    }

    return
  }

  const isAltArrow = event.altKey && (event.key === 'ArrowDown' || event.key === 'ArrowUp')
  if (isAltArrow) {
    event.preventDefault()
    event.stopImmediatePropagation()
    if (!props.disabled) openWithFocus(event.key === 'ArrowDown' ? 'first' : 'last')

    return
  }

  // Keys Reka's trigger toggles on: a long-press trigger opens only on a hold or Alt + Arrow
  const isRekaToggleKey = event.key === 'Enter' || event.key === ' ' || event.key === 'ArrowDown'
  if (isRekaToggleKey) event.stopImmediatePropagation()
}

onMounted(() => {
  if (props.trigger === 'longPress') {
    ensureLongPressDescription(t('dropdown.longPress'))
    describedBy.value = LONG_PRESS_DESCRIPTION_ID
  }
})

onBeforeUnmount(() => {
  cancelLongPress()
})
</script>
