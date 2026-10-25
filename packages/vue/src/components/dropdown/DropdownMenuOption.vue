<template>
  <component
    :is="component"
    v-bind="extraAttrs"
    :disabled="item.disabled"
    :text-value="item.textValue ?? item.label"
    data-slot="menu-item"
    :data-selected="state.selected ? 'true' : undefined"
    :data-has-submenu="submenu ? 'true' : undefined"
    :data-hovered="interaction.isHovered ? 'true' : undefined"
    :data-pressed="interaction.isPressed ? 'true' : undefined"
    :data-focused="interaction.isFocused ? 'true' : undefined"
    :data-focus-visible="interaction.isFocusVisible ? 'true' : undefined"
    :class="classes.item!({ variant: item.variant, override: item.class })"
    @select="onSelect"
    @pointerenter="interaction.isHovered = $event.pointerType === 'mouse'"
    @pointerleave="onPointerleave"
    @pointerdown="interaction.isPressed = true"
    @pointerup="interaction.isPressed = false"
    @pointercancel="interaction.isPressed = false"
    @focus="onFocus"
    @blur="onBlur"
  >
    <component :is="slots.item" v-if="slots.item" v-bind="state" />
    <template v-else>
      <span
        v-if="isSelectable && group.indicator"
        aria-hidden="true"
        data-slot="menu-item-indicator"
        :data-type="group.indicator"
        :data-visible="state.selected || undefined"
        :class="classes.indicator!({ variant: item.variant })"
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
        <label
          data-slot="label"
          :class="ctx.labelClass(item.disabled)"
          :id="`${id}-label`"
          @mousedown="onLabelMousedown"
        >
          <component :is="slots['item-label']" v-if="slots['item-label']" v-bind="state" />
          <template v-else>
            {{ item.label }}
          </template>
        </label>
        <span :id="`${id}-description`" data-slot="description" :class="ctx.descriptionClass()">
          <component
            :is="slots['item-description']"
            v-if="slots['item-description']"
            v-bind="state"
          />
          <template v-else>
            {{ item.description }}
          </template>
        </span>
      </div>
      <label
        v-else
        data-slot="label"
        :class="ctx.labelClass(item.disabled)"
        :id="`${id}-label`"
        @mousedown="onLabelMousedown"
      >
        <component :is="slots['item-label']" v-if="slots['item-label']" v-bind="state" />
        <template v-else>
          {{ item.label }}
        </template>
      </label>
      <component :is="slots['item-trailing']" v-if="slots['item-trailing']" v-bind="state" />
      <Kbd
        v-else-if="item.kbd"
        :id="`${id}-kbd`"
        class="ms-auto"
        variant="light"
        :keys="item.kbd.keys"
      >
        <template v-if="item.kbd.content">
          {{ item.kbd.content }}
        </template>
      </Kbd>
      <span
        v-if="submenu"
        aria-hidden="true"
        data-slot="submenu-indicator"
        :class="classes.submenuIndicator!({ variant: item.variant })"
      >
        <SubmenuIndicatorContent />
      </span>
    </template>
  </component>
</template>

<script setup lang="ts">
import { DropdownMenuCheckboxItem, DropdownMenuItem, DropdownMenuSubTrigger, useId } from 'reka-ui'
import { computed, h, inject, renderSlot, shallowReactive } from 'vue'

import Kbd from '@/components/kbd/Kbd.vue'

import type { DropdownSelectionGroup } from './context'
import { dropdownContextKey } from './context'
// Internal: one Dropdown menu item (action item, selectable item or submenu trigger). Not exported.
import type { DropdownItem } from './Dropdown.types'

const props = defineProps<{
  item: DropdownItem
  group: DropdownSelectionGroup
  /** Renders the item as the trigger of its `item.items` submenu. */
  submenu?: boolean
}>()

const ctx = inject(dropdownContextKey)!
const classes = computed(() => ctx.classes())
const slots = ctx.slots

// Reka's Label guard: a double click on the label must not select its text.
const onLabelMousedown = (event: MouseEvent) => {
  if (!event.defaultPrevented && event.detail > 1) event.preventDefault()
}

// RAC interaction states that Reka doesn't expose
const interaction = shallowReactive({
  isHovered: false,
  isPressed: false,
  isFocused: false,
  isFocusVisible: false,
})

// RAC `useMenuItem`: the label names the item; description and keyboard shortcut describe it.
const id = useId(undefined, 'hareui-dropdown-item')
const aria = computed(() =>
  slots.item
    ? {}
    : {
        'aria-labelledby': `${id}-label`,
        'aria-describedby':
          [
            props.item.description || slots['item-description'] ? `${id}-description` : '',
            props.item.kbd && !slots['item-trailing'] ? `${id}-kbd` : '',
          ]
            .filter(Boolean)
            .join(' ') || undefined,
      },
)

const isSelectable = computed(() => !props.submenu && props.group.mode !== 'none')
const state = computed(() => ctx.slotProps(props.item, props.group))

const component = computed(() => {
  if (props.submenu) return DropdownMenuSubTrigger

  return isSelectable.value ? DropdownMenuCheckboxItem : DropdownMenuItem
})

// Only bound when set: an `undefined` fallthrough attr would erase Reka's own `role="menuitemcheckbox"`
const extraAttrs = computed(() => ({
  ...aria.value,
  ...(isSelectable.value
    ? {
        modelValue: state.value.selected,
        role: props.group.mode === 'single' ? 'menuitemradio' : 'menuitemcheckbox',
        'data-selection-mode': props.group.mode,
      }
    : {}),
}))

const onFocus = (event: FocusEvent) => {
  interaction.isFocused = true

  interaction.isFocusVisible =
    event.target instanceof Element && event.target.matches(':focus-visible')
}

const onBlur = () => {
  interaction.isFocused = false
  interaction.isFocusVisible = false
}

const onPointerleave = () => {
  interaction.isHovered = false
  interaction.isPressed = false
}

// RAC `useMenuItem`: pointer selection closes unless the selection is multiple; keyboard selection
// closes only on Enter (Space keeps the menu open to toggle more items) or for plain actions.
const onSelect = (event: Event) => {
  if (!isSelectable.value) {
    ctx.action(props.item)
    return
  }

  props.group.toggle(props.item.value)
  const key = ctx.lastKey()
  const shouldClose = key !== null ? key === 'Enter' : props.group.mode !== 'multiple'
  if (!shouldClose) event.preventDefault()
}

// HeroUI's IconChevronRight. `renderSlot` falls back to it when `#submenu-indicator` renders nothing
// (e.g. a `v-if` that doesn't match this item), so a custom indicator can be applied per item.
const chevron = () => {
  return h(
    'svg',
    {
      'aria-hidden': 'true',
      fill: 'none',
      height: '16',
      role: 'presentation',
      viewBox: '0 0 16 16',
      width: '16',
      xmlns: 'http://www.w3.org/2000/svg',
    },
    [
      h('path', {
        'clip-rule': 'evenodd',
        d: 'M5.47 2.97a.75.75 0 0 1 1.06 0l4.5 4.5a.75.75 0 0 1 0 1.06l-4.5 4.5a.75.75 0 1 1-1.06-1.06L9.44 8 5.47 4.03a.75.75 0 0 1 0-1.06Z',
        fill: 'currentColor',
        'fill-rule': 'evenodd',
      }),
    ],
  )
}

const SubmenuIndicatorContent = () =>
  renderSlot(slots, 'submenu-indicator', { ...state.value }, () => [chevron()])
</script>
