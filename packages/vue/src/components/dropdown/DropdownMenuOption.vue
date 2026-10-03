<script setup lang="ts">
// Internal: one Dropdown menu item (action item, selectable item or submenu trigger). Not exported.
import type { DropdownItem } from './Dropdown.vue'
import type { DropdownSelectionGroup } from './context'
import { DropdownMenuCheckboxItem, DropdownMenuItem, DropdownMenuSubTrigger, useId } from 'reka-ui'
import { computed, h, inject, ref, renderSlot } from 'vue'
import Description from '../description/Description.vue'
import { dropdownContextKey } from './context'
import Kbd from '../kbd/Kbd.vue'
import Label from '../label/Label.vue'

const props = defineProps<{
  item: DropdownItem
  group: DropdownSelectionGroup
  /** Renders the item as the trigger of its `item.items` submenu. */
  submenu?: boolean
}>()

const ctx = inject(dropdownContextKey)!
const classes = computed(() => ctx.classes())
const slots = ctx.slots

// RAC interaction states that Reka doesn't expose
const hovered = ref(false)
const pressed = ref(false)
const focused = ref(false)
const focusVisible = ref(false)

// RAC `useMenuItem`: the label names the item; description and keyboard shortcut describe it.
const id = useId(undefined, 'hareui-dropdown-item')
const aria = computed(() => slots.item
  ? {}
  : {
      'aria-labelledby': `${id}-label`,
      'aria-describedby': [
        props.item.description || slots['item-description'] ? `${id}-description` : '',
        props.item.kbd && !slots['item-trailing'] ? `${id}-kbd` : '',
      ].filter(Boolean).join(' ') || undefined,
    })

const selectable = computed(() => !props.submenu && props.group.mode !== 'none')
const state = computed(() => ctx.slotProps(props.item, props.group))
const component = computed(() => props.submenu ? DropdownMenuSubTrigger : selectable.value ? DropdownMenuCheckboxItem : DropdownMenuItem)
// Only bound when set: an `undefined` fallthrough attr would erase Reka's own `role="menuitemcheckbox"`
const extraAttrs = computed(() => ({
  ...aria.value,
  ...(selectable.value
    ? { 'modelValue': state.value.selected, 'role': props.group.mode === 'single' ? 'menuitemradio' : 'menuitemcheckbox', 'data-selection-mode': props.group.mode }
    : {}),
}))

function onFocus(event: FocusEvent) {
  focused.value = true
  focusVisible.value = event.target instanceof Element && event.target.matches(':focus-visible')
}

// RAC `useMenuItem`: pointer selection closes unless the selection is multiple; keyboard selection
// closes only on Enter (Space keeps the menu open to toggle more items) or for plain actions.
function onSelect(event: Event) {
  if (!selectable.value) {
    ctx.action(props.item)
    return
  }
  props.group.toggle(props.item.value)
  const key = ctx.lastKey()
  const shouldClose = key !== null ? key === 'Enter' : props.group.mode !== 'multiple'
  if (!shouldClose)
    event.preventDefault()
}

// HeroUI's IconChevronRight. `renderSlot` falls back to it when `#submenu-indicator` renders nothing
// (e.g. a `v-if` that doesn't match this item), so a custom indicator can be applied per item.
function chevron() {
  return h('svg', { 'aria-hidden': 'true', 'fill': 'none', 'height': '16', 'role': 'presentation', 'viewBox': '0 0 16 16', 'width': '16', 'xmlns': 'http://www.w3.org/2000/svg' }, [
    h('path', { 'clip-rule': 'evenodd', 'd': 'M5.47 2.97a.75.75 0 0 1 1.06 0l4.5 4.5a.75.75 0 0 1 0 1.06l-4.5 4.5a.75.75 0 1 1-1.06-1.06L9.44 8 5.47 4.03a.75.75 0 0 1 0-1.06Z', 'fill': 'currentColor', 'fill-rule': 'evenodd' }),
  ])
}
const SubmenuIndicatorContent = () => renderSlot(slots as Record<string, any>, 'submenu-indicator', { ...state.value }, () => [chevron()])
</script>

<template>
  <component
    :is="component"
    v-bind="extraAttrs"
    :disabled="item.disabled"
    :text-value="item.textValue ?? item.label"
    data-slot="menu-item"
    :data-selected="state.selected ? 'true' : undefined"
    :data-has-submenu="submenu ? 'true' : undefined"
    :data-hovered="hovered ? 'true' : undefined"
    :data-pressed="pressed ? 'true' : undefined"
    :data-focused="focused ? 'true' : undefined"
    :data-focus-visible="focusVisible ? 'true' : undefined"
    :class="classes.item!({ variant: item.variant, class: [ctx.ui()?.item, item.class] })"
    @select="onSelect"
    @pointerenter="hovered = $event.pointerType === 'mouse'"
    @pointerleave="hovered = false; pressed = false"
    @pointerdown="pressed = true"
    @pointerup="pressed = false"
    @pointercancel="pressed = false"
    @focus="onFocus"
    @blur="focused = false; focusVisible = false"
  >
    <component :is="slots.item" v-if="slots.item" v-bind="state" />
    <template v-else>
      <span
        v-if="selectable && group.indicator"
        aria-hidden="true"
        data-slot="menu-item-indicator"
        :data-type="group.indicator"
        :data-visible="state.selected || undefined"
        :class="classes.indicator!({ variant: item.variant, class: ctx.ui()?.indicator })"
      >
        <component :is="slots.indicator" v-if="slots.indicator" v-bind="state" />
        <svg
          v-else-if="group.indicator === 'dot'"
          aria-hidden="true"
          data-slot="menu-item-indicator--dot"
          fill="currentColor"
          fill-rule="evenodd"
          role="presentation"
          viewBox="0 0 16 16"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path clip-rule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14" fill-rule="evenodd" />
        </svg>
        <svg
          v-else
          aria-hidden="true"
          data-slot="menu-item-indicator--checkmark"
          fill="none"
          role="presentation"
          stroke="currentColor"
          stroke-dasharray="22"
          :stroke-dashoffset="state.selected ? 44 : 66"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          viewBox="0 0 17 18"
        >
          <polyline points="1 9 7 14 15 4" />
        </svg>
      </span>
      <component :is="slots['item-leading']" v-if="slots['item-leading']" v-bind="state" />
      <div v-if="item.description || slots['item-description']" class="flex flex-col">
        <Label :id="`${id}-label`" :disabled="item.disabled">
          <component :is="slots['item-label']" v-if="slots['item-label']" v-bind="state" />
          <template v-else>
            {{ item.label }}
          </template>
        </Label>
        <Description :id="`${id}-description`">
          <component :is="slots['item-description']" v-if="slots['item-description']" v-bind="state" />
          <template v-else>
            {{ item.description }}
          </template>
        </Description>
      </div>
      <Label v-else :id="`${id}-label`" :disabled="item.disabled">
        <component :is="slots['item-label']" v-if="slots['item-label']" v-bind="state" />
        <template v-else>
          {{ item.label }}
        </template>
      </Label>
      <component :is="slots['item-trailing']" v-if="slots['item-trailing']" v-bind="state" />
      <Kbd v-else-if="item.kbd" :id="`${id}-kbd`" class="ms-auto" variant="light" :keys="item.kbd.keys">
        <template v-if="item.kbd.content">
          {{ item.kbd.content }}
        </template>
      </Kbd>
      <span
        v-if="submenu"
        aria-hidden="true"
        data-slot="submenu-indicator"
        :class="classes.submenuIndicator!({ variant: item.variant, class: ctx.ui()?.submenuIndicator })"
      >
        <SubmenuIndicatorContent />
      </span>
    </template>
  </component>
</template>
