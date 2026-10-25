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
      <!-- Reka puts `role="menu"` on the content (HeroUI's popover); the inner element carries the menu classes -->
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
import { computed, onBeforeUnmount, onMounted, provide, ref } from 'vue'

import descriptionTheme from '@/components/description/theme'
import labelTheme from '@/components/label/theme'
import { useComponentUI } from '@/composables/useComponentUI'
import { useInertOutside } from '@/composables/useInertOutside'
import { useLayerDismiss } from '@/composables/useLayerDismiss'
import { usePortal } from '@/composables/usePortal'

import type { DropdownContext, DropdownSelectionGroup } from './context'
import { dropdownContextKey, enabledMenuItems } from './context'
import type {
  DropdownEmits,
  DropdownEntry,
  DropdownItem,
  DropdownProps,
  DropdownSection,
  DropdownSlots,
  DropdownValue,
} from './Dropdown.types'
import { ensureLongPressDescription, LONG_PRESS_DESCRIPTION_ID } from './dropdown.utils'
import DropdownMenuItems from './DropdownMenuItems.vue'
import theme from './theme'

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

const portalTarget = usePortal(() => props.portal)
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

// Same classes the Label / Description components would build, resolved once for every item.
const labelUI = useComponentUI('label', { theme: labelTheme, variantProps: () => ({}) })

const disabledLabelUI = useComponentUI('label', {
  theme: labelTheme,
  variantProps: () => ({ disabled: true }),
})

const descriptionUI = useComponentUI('description', {
  theme: descriptionTheme,
  variantProps: () => ({}),
})

const contentRef = ref<{ $el: HTMLElement } | null>(null)

const openState = ref(props.defaultOpen)
const isOpen = computed(() => props.open ?? openState.value)

const setOpen = (value: boolean) => {
  openState.value = value
  emit('update:open', value)
}

// Reka hides the page for the root menu only (submenus portal in later, after this runs, and stay
// interactive). `isOpen` turns false synchronously in `setOpen` and with the `open` prop. The content
// instance stays mounted while closed and its `$el` isn't reactive, so re-read it on every open.
useInertOutside(() => (isOpen.value ? contentRef.value?.$el : null), isOpen)

// Reka's menu dismisses on any button outside (unlike Popover) and on every Escape; only the Layer stack is checked here.
const { onInteractOutside } = useLayerDismiss({ content: () => contentRef.value?.$el })

const selectedState = ref<DropdownValue[]>(props.defaultValue ?? [])
const selected = computed(() => props.modelValue ?? selectedState.value)

const setSelected = (value: DropdownValue[]) => {
  selectedState.value = value
  emit('update:modelValue', value)
}

const isSection = (entry: DropdownEntry): entry is DropdownSection =>
  (entry as DropdownSection).type === 'section'

type SelectionScope = {
  mode: DropdownSelectionGroup['mode']
  indicator: DropdownSelectionGroup['indicator']
  /** The values this scope owns: `single` mode replaces only these. */
  values: () => DropdownValue[]
}

/**
 * A selection scope (RAC's `SelectionManager` / `GroupSelectionManager`). `single` replaces only
 * this scope's values and deselects on re-select, as React Aria does without `disallowEmptySelection`.
 */
const makeGroup = ({ mode, indicator, values }: SelectionScope): DropdownSelectionGroup => ({
  mode,
  indicator,
  isSelected: (value) => selected.value.includes(value),
  toggle(value) {
    const current = selected.value
    if (current.includes(value)) {
      setSelected(current.filter((v) => v !== value))
      return
    }

    const kept = mode === 'single' ? current.filter((v) => !values().includes(v)) : current
    setSelected([...kept, value])
  },
})

// Values whose selection scope is the menu itself: top-level items plus sections without their own mode.
const rootValues = computed(() =>
  (props.items ?? []).flatMap((entry) => {
    if (isSection(entry)) return entry.selectionMode ? [] : entry.items.map((item) => item.value)
    return 'value' in entry ? [entry.value] : []
  }),
)

const rootGroup = computed(() =>
  makeGroup({
    mode: props.selectionMode,
    indicator: props.indicator,
    values: () => rootValues.value,
  }),
)

const sectionGroups = new WeakMap<DropdownSection, DropdownSelectionGroup>()

// RAC's global interaction modality: the key of the last keyboard interaction, `null` after a pointer one.
const lastKey = ref<string | null>(null)
const onKeydown = (event: KeyboardEvent) => {
  lastKey.value = event.key
}

const onPointerdown = () => {
  lastKey.value = null
}

// RAC pages through the menu with PageUp / PageDown; the menu never outgrows one page, so that is the
// first / last enabled item (as in ComboBox). Reka only handles them while the content itself is focused.
const onMenuKeydown = (event: KeyboardEvent) => {
  if (event.key !== 'PageUp' && event.key !== 'PageDown') return
  const items = enabledMenuItems(event.currentTarget as HTMLElement)
  const item = event.key === 'PageUp' ? items[0] : items.at(-1)
  if (!item) return
  event.preventDefault()
  item.focus()
}

const ctx: DropdownContext = {
  classes: () => menuUI.value,
  labelClass: (disabled) => (disabled ? disabledLabelUI : labelUI).value.base(),
  descriptionClass: () => descriptionUI.value.base(),
  portal: () => portalTarget.value,
  slots,
  rootGroup: () => rootGroup.value,
  sectionGroup(section, parent) {
    if (!section.selectionMode) return parent

    const indicator = section.indicator ?? 'checkmark'
    const cached = sectionGroups.get(section)
    if (cached?.mode === section.selectionMode && cached.indicator === indicator) return cached

    const group = makeGroup({
      mode: section.selectionMode,
      indicator,
      values: () => section.items.map((item) => item.value),
    })

    sectionGroups.set(section, group)

    return group
  },
  lastKey: () => lastKey.value,
  action: (item) => emit('action', item.value),
  slotProps: (item, group) => ({
    item,
    selected: group.mode !== 'none' && group.isSelected(item.value),
    disabled: !!item.disabled,
  }),
  onMenuKeydown,
}

provide(dropdownContextKey, ctx)

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

// RAC's `useSelectableCollection` focuses the first selected item whenever the menu opens (pointer or
// keyboard), else the item of the focus strategy; Reka focuses the content, or the first item when opened
// from the keyboard.
const onOpenAutoFocus = (event: Event) => {
  const strategy = focusOnOpen
  focusOnOpen = null

  const content = event.target as HTMLElement
  const selectedItem = content.querySelector<HTMLElement>(
    '[data-slot=menu-item][aria-checked=true]:not([data-disabled])',
  )

  const item = selectedItem ?? strategyItem(enabledMenuItems(content), strategy)
  if (!item) return

  event.preventDefault()
  item.focus()
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
  document.addEventListener('keydown', onKeydown, true)
  document.addEventListener('pointerdown', onPointerdown, true)

  if (props.trigger === 'longPress') {
    ensureLongPressDescription()
    describedBy.value = LONG_PRESS_DESCRIPTION_ID
  }
})

onBeforeUnmount(() => {
  document.removeEventListener('keydown', onKeydown, true)
  document.removeEventListener('pointerdown', onPointerdown, true)
  cancelLongPress()
})
</script>
