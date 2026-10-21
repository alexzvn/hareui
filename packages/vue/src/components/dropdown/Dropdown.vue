<script lang="ts">
import type { PortalTarget } from '../../config'
import type { ComponentSlots } from '../../types/tv'
import type { KbdKey } from '../kbd/kbdKeys'
import theme from './theme'

type Dropdown = typeof theme

export type DropdownValue = string | number

export interface DropdownItem {
  /** Unique key of the item across the whole menu. Emitted by `action` and stored in `v-model`. */
  value: DropdownValue
  /** The item text, shown unless the `#item` / `#item-label` slot is used. */
  label?: string
  /** Secondary text under the label. */
  description?: string
  /** Text used for typeahead. Defaults to `label`. */
  textValue?: string
  disabled?: boolean
  /** `danger` colours the label (and indicators) for destructive actions. */
  variant?: 'default' | 'danger'
  /** Keyboard shortcut rendered at the end of the item (as `<Kbd variant="light">`). */
  kbd?: { keys?: KbdKey | KbdKey[], content?: string }
  /** Nested entries: the item becomes a submenu trigger. */
  items?: DropdownEntry[]
  /** Classes merged onto the item element. */
  class?: any
  /** Extra fields (icons, ...) are passed through to the slots as `item`. */
  [key: string]: any
}

export interface DropdownSection {
  type: 'section'
  /** Rendered as the section `<header>`, which also labels the group. */
  label?: string
  items: DropdownItem[]
  /**
   * Section-level selection, independent of the rest of the menu (React Aria's section
   * `selectionMode`). Selected values still live in the Dropdown's `v-model`.
   */
  selectionMode?: 'none' | 'single' | 'multiple'
  /** Indicator for this section's selectable items. @defaultValue 'checkmark' */
  indicator?: 'checkmark' | 'dot' | false
  class?: any
}

export interface DropdownSeparator {
  type: 'separator'
}

export type DropdownEntry = DropdownItem | DropdownSection | DropdownSeparator

export interface DropdownProps {
  /**
   * Renders the menu in a portal. `true` portals to `document.body`, a selector string or element is used as the teleport target, and `false` disables portalling.
   * Falls back to `createHareUI({ portal })`, then `true`.
   */
  portal?: PortalTarget
  /** The menu entries: items, `{ type: 'section' }` groups and `{ type: 'separator' }` dividers. */
  items?: DropdownEntry[]
  /** The controlled open state of the menu. Use with `v-model:open`. */
  open?: boolean
  /** The open state when initially rendered. Use when you do not need to control the open state. */
  defaultOpen?: boolean
  /**
   * The selected values (`v-model`). Always an array, as sections can carry their own selection.
   */
  modelValue?: DropdownValue[]
  /** The initially selected values, when uncontrolled. */
  defaultValue?: DropdownValue[]
  /** The type of selection allowed in the menu. @defaultValue 'none' */
  selectionMode?: 'none' | 'single' | 'multiple'
  /**
   * The indicator rendered on selectable items: a checkmark, a dot, or nothing.
   * @defaultValue 'checkmark'
   */
  indicator?: 'checkmark' | 'dot' | false
  /**
   * How the menu opens: on press, or on long press (and `Alt + ArrowDown` / `Alt + ArrowUp`)
   * so the trigger can keep its own press action. @defaultValue 'press'
   */
  trigger?: 'press' | 'longPress'
  /** Disables the trigger. */
  disabled?: boolean
  /** The preferred side of the trigger to render against when open. @defaultValue 'bottom' */
  side?: 'top' | 'right' | 'bottom' | 'left'
  /** The preferred alignment against the trigger. @defaultValue 'start' */
  align?: 'start' | 'center' | 'end'
  /** The distance in pixels from the trigger. @defaultValue 8 */
  sideOffset?: number
  /** Classes merged onto the popover. */
  class?: any
  ui?: ComponentSlots<Dropdown>
}

export interface DropdownItemSlotProps {
  item: DropdownItem
  selected: boolean
  disabled: boolean
}

export interface DropdownSlots {
  /** The trigger. Merged onto its single root element (`as-child`). */
  'default'?: () => any
  /** Content above the menu, inside the popover (e.g. a user card). */
  'content-top'?: () => any
  /** Replaces the whole item content. */
  'item'?: (props: DropdownItemSlotProps) => any
  'item-leading'?: (props: DropdownItemSlotProps) => any
  'item-label'?: (props: DropdownItemSlotProps) => any
  'item-description'?: (props: DropdownItemSlotProps) => any
  /** Replaces the keyboard shortcut. */
  'item-trailing'?: (props: DropdownItemSlotProps) => any
  /** Custom selection indicator content (rendered inside the indicator box). */
  'indicator'?: (props: DropdownItemSlotProps) => any
  /** Custom submenu chevron. */
  'submenu-indicator'?: (props: DropdownItemSlotProps) => any
  'section-label'?: (props: { section: DropdownSection }) => any
}

export interface DropdownEmits {
  'update:open': [value: boolean]
  'update:modelValue': [value: DropdownValue[]]
  /** An action item (not a selectable one, not a submenu trigger) was selected. */
  'action': [value: DropdownValue]
}

// React Aria's `useLongPress` accessibility description, shared by every long-press trigger.
const LONG_PRESS_DESCRIPTION_ID = 'hareui-dropdown-long-press-description'
function ensureLongPressDescription() {
  if (document.getElementById(LONG_PRESS_DESCRIPTION_ID))
    return
  const el = document.createElement('div')
  el.id = LONG_PRESS_DESCRIPTION_ID
  el.style.display = 'none'
  el.textContent = 'Long press or press Alt + ArrowDown to open menu'
  document.body.appendChild(el)
}
</script>

<script setup lang="ts">
import type { DropdownContext, DropdownSelectionGroup } from './context'
import { DropdownMenuContent, DropdownMenuPortal, DropdownMenuRoot, DropdownMenuTrigger } from 'reka-ui'
import { computed, onBeforeUnmount, onMounted, provide, ref } from 'vue'
import { preventNestedLayerDismiss } from '../../composables/nestedLayer'
import { useComponentUI } from '../../composables/useComponentUI'
import { usePortal } from '../../composables/usePortal'
import { dropdownContextKey, enabledMenuItems } from './context'
import DropdownMenuItems from './DropdownMenuItems.vue'

const props = withDefaults(defineProps<DropdownProps>(), {
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
const slots = defineSlots<DropdownSlots>()

const ui = useComponentUI('dropdown', theme, () => ({}))
const contentRef = ref<{ $el: HTMLElement } | null>(null)

const openState = ref(props.defaultOpen)
const isOpen = computed(() => props.open ?? openState.value)
function setOpen(value: boolean) {
  openState.value = value
  emit('update:open', value)
}

const selectedState = ref<DropdownValue[]>(props.defaultValue ?? [])
const selected = computed(() => props.modelValue ?? selectedState.value)
function setSelected(value: DropdownValue[]) {
  selectedState.value = value
  emit('update:modelValue', value)
}

const isSection = (entry: DropdownEntry): entry is DropdownSection => (entry as DropdownSection).type === 'section'

/**
 * A selection scope (RAC's `SelectionManager` / `GroupSelectionManager`). `single` replaces only
 * this scope's values and deselects on re-select, as React Aria does without `disallowEmptySelection`.
 */
function makeGroup(mode: DropdownSelectionGroup['mode'], indicator: DropdownSelectionGroup['indicator'], values: () => DropdownValue[]): DropdownSelectionGroup {
  return {
    mode,
    indicator,
    isSelected: value => selected.value.includes(value),
    toggle(value) {
      const current = selected.value
      if (current.includes(value))
        setSelected(current.filter(v => v !== value))
      else if (mode === 'single')
        setSelected([...current.filter(v => !values().includes(v)), value])
      else
        setSelected([...current, value])
    },
  }
}

// Values whose selection scope is the menu itself: top-level items plus sections without their own mode.
const rootValues = computed(() => (props.items ?? []).flatMap((entry) => {
  if (isSection(entry))
    return entry.selectionMode ? [] : entry.items.map(item => item.value)
  return 'value' in entry ? [entry.value] : []
}))
const rootGroup = computed(() => makeGroup(props.selectionMode, props.indicator, () => rootValues.value))
const sectionGroups = new WeakMap<DropdownSection, DropdownSelectionGroup>()

// RAC's global interaction modality: the key of the last keyboard interaction, `null` after a pointer one.
const lastKey = ref<string | null>(null)
const onKeydown = (event: KeyboardEvent) => { lastKey.value = event.key }
const onPointerdown = () => { lastKey.value = null }

const ctx: DropdownContext = {
  classes: () => ui.value as any,
  ui: () => props.ui,
  portal: () => portalTarget.value,
  slots,
  rootGroup: () => rootGroup.value,
  sectionGroup(section, parent) {
    if (!section.selectionMode)
      return parent
    let group = sectionGroups.get(section)
    if (!group || group.mode !== section.selectionMode || group.indicator !== (section.indicator ?? 'checkmark')) {
      group = makeGroup(section.selectionMode, section.indicator ?? 'checkmark', () => section.items.map(item => item.value))
      sectionGroups.set(section, group)
    }
    return group
  },
  lastKey: () => lastKey.value,
  action: item => emit('action', item.value),
  slotProps: (item, group) => ({ item, selected: group.mode !== 'none' && group.isSelected(item.value), disabled: !!item.disabled }),
  onMenuKeydown,
}
provide(dropdownContextKey, ctx)

// RAC's `menuTriggerState.open(focusStrategy)`: ArrowUp opens on the last item, a long press on the first.
// Reka only knows "first item when opened from the keyboard", so the strategy is applied on open below.
let focusOnOpen: 'first' | 'last' | null = null
function openWithFocus(strategy: 'first' | 'last') {
  focusOnOpen = strategy
  setOpen(true)
}

// RAC's `useSelectableCollection` focuses the first selected item whenever the menu opens (pointer or
// keyboard), else the item of the focus strategy; Reka focuses the content, or the first item when opened
// from the keyboard.
function onOpenAutoFocus(event: Event) {
  const strategy = focusOnOpen
  focusOnOpen = null
  const content = event.target as HTMLElement
  const items = enabledMenuItems(content)
  const item = content.querySelector<HTMLElement>('[data-slot=menu-item][aria-checked=true]:not([data-disabled])')
    ?? (strategy === 'first' ? items[0] : strategy === 'last' ? items.at(-1) : undefined)
  if (!item)
    return
  event.preventDefault()
  item.focus()
}

// RAC pages through the menu with PageUp / PageDown; the menu never outgrows one page, so that is the
// first / last enabled item (as in ComboBox). Reka only handles them while the content itself is focused.
function onMenuKeydown(event: KeyboardEvent) {
  if (event.key !== 'PageUp' && event.key !== 'PageDown')
    return
  const items = enabledMenuItems(event.currentTarget as HTMLElement)
  const item = event.key === 'PageUp' ? items[0] : items.at(-1)
  if (!item)
    return
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

function cancelLongPress() {
  clearTimeout(longPressTimer)
  longPressTimer = undefined
}

function onTriggerPointerdownCapture(event: PointerEvent) {
  if (props.trigger !== 'longPress' || props.disabled || event.button !== 0)
    return
  cancelLongPress()
  longPressTimer = setTimeout(() => openWithFocus('first'), LONG_PRESS_THRESHOLD)
}

// The toggle Reka requests while a trigger click dispatches (a short press, or the release after a
// long press) is dropped. Cleared on a task, not a microtask: browsers run a microtask checkpoint
// after each listener, which would clear the flag before Reka's bubble-phase listener runs.
let suppressTriggerToggle = false
function onTriggerClickCapture() {
  if (props.trigger !== 'longPress')
    return
  suppressTriggerToggle = true
  setTimeout(() => suppressTriggerToggle = false)
}

function onRootOpenChange(open: boolean) {
  if (!suppressTriggerToggle)
    setOpen(open)
}

function onTriggerKeydownCapture(event: KeyboardEvent) {
  if (props.trigger !== 'longPress') {
    // Reka's trigger ignores ArrowUp; RAC opens the menu on its last item.
    if (event.key === 'ArrowUp' && !props.disabled && !isOpen.value) {
      event.preventDefault()
      openWithFocus('last')
    }
    return
  }
  if (event.altKey && (event.key === 'ArrowDown' || event.key === 'ArrowUp')) {
    event.preventDefault()
    event.stopImmediatePropagation()
    if (!props.disabled)
      openWithFocus(event.key === 'ArrowDown' ? 'first' : 'last')
  }
  else if (event.key === 'Enter' || event.key === ' ' || event.key === 'ArrowDown') {
    event.stopImmediatePropagation()
  }
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
        :class="ui.popover({ class: [props.ui?.popover, props.class] })"
        @interact-outside="preventNestedLayerDismiss($event, contentRef?.$el)"
        @open-auto-focus="onOpenAutoFocus"
        @keydown="onMenuKeydown"
      >
        <slot name="content-top" />
        <div
          data-slot="dropdown-menu"
          :data-selection-mode="selectionMode !== 'none' ? selectionMode : undefined"
          :class="ui.menu({ class: props.ui?.menu })"
        >
          <DropdownMenuItems :entries="items ?? []" :group="rootGroup" />
        </div>
      </DropdownMenuContent>
    </DropdownMenuPortal>
  </DropdownMenuRoot>
</template>
