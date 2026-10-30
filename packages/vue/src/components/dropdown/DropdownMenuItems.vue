<template>
  <template v-for="(entry, index) in entries" :key="key(entry, index)">
    <hr
      v-if="isSeparator(entry)"
      data-slot="separator"
      data-orientation="horizontal"
      :class="ctx.classes().separator!()"
    />
    <DropdownMenuGroup
      v-else-if="isSection(entry)"
      as="section"
      :aria-labelledby="
        entry.label || ctx.slots['section-label'] ? `${baseId}-${index}` : undefined
      "
      :class="ctx.classes().section!({ override: entry.class })"
    >
      <!-- RAC `useMenuSection`: menus can't own headings, so the header is presentational and only labels the group -->
      <DropdownMenuLabel
        v-if="entry.label || ctx.slots['section-label']"
        :id="`${baseId}-${index}`"
        as="header"
        role="presentation"
        data-slot="header"
        :class="ctx.classes().header!()"
      >
        <component
          :is="ctx.slots['section-label']"
          v-if="ctx.slots['section-label']"
          :section="entry"
        />
        <template v-else>
          {{ entry.label }}
        </template>
      </DropdownMenuLabel>
      <DropdownMenuItems :entries="entry.items" :group="ctx.sectionGroup(entry, group)" />
    </DropdownMenuGroup>
    <DropdownMenuSub
      v-else-if="hasSubmenu(entry)"
      :open="openSubmenu === entry.value"
      @update:open="setSubmenuOpen(entry.value, $event)"
    >
      <DropdownMenuOption
        :ref="(instance) => trackTrigger(entry.value, instance)"
        :item="entry"
        :group="group"
        submenu
      />
      <DropdownMenuPortal :disabled="ctx.portal().disabled" :to="ctx.portal().to">
        <!-- RAC submenu popover: placement "end top", 12px container padding; the root menu sets the offset -->
        <DropdownMenuSubContent
          :ref="(instance) => trackContent(entry.value, instance)"
          loop
          :side-offset="ctx.submenuSideOffset"
          :align-offset="openSubmenu === entry.value ? submenuAlignOffset : 0"
          :collision-padding="COLLISION_PADDING"
          data-slot="dropdown-popover"
          :class="ctx.classes().popover!()"
          @interact-outside="preventNestedLayerDismiss($event, submenuContents.get(entry.value))"
          @keydown="onSubmenuContentKeydown"
        >
          <div data-slot="dropdown-menu" :class="ctx.classes().menu!()">
            <DropdownMenuItems :entries="entry.items" :group="submenuGroup" />
          </div>
        </DropdownMenuSubContent>
      </DropdownMenuPortal>
    </DropdownMenuSub>
    <DropdownMenuOption v-else :item="entry" :group="group" />
  </template>
</template>

<script setup lang="ts">
import {
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  useId,
} from 'reka-ui'
// Internal: renders a list of Dropdown entries (items, sections, separators, submenus). Recursive
// for submenus. Not exported.
import type { ComponentPublicInstance } from 'vue'
import { inject, ref } from 'vue'

import { preventNestedLayerDismiss } from '@/composables/nestedLayer'

import type { DropdownSelectionGroup } from './context'
import { dropdownContextKey } from './context'
import type { DropdownEntry, DropdownItem } from './Dropdown.types'
import { isSection, isSeparator } from './dropdown.utils'
import DropdownMenuOption from './DropdownMenuOption.vue'

defineProps<{
  entries: DropdownEntry[]
  group: DropdownSelectionGroup
}>()

const ctx = inject(dropdownContextKey)!
const baseId = useId(undefined, 'hareui-dropdown-section')

const hasSubmenu = (entry: DropdownEntry): entry is DropdownItem & { items: DropdownEntry[] } =>
  !!(entry as DropdownItem).items?.length

// Submenus are separate menus without a selection mode (RAC: a nested `Menu` has its own selection).
const submenuGroup: DropdownSelectionGroup = {
  mode: 'none',
  indicator: false,
  isSelected: () => false,
  toggle: () => {},
}

// The open submenu of this level (one at a time, as in RAC's `SubmenuTriggerState`).
const openSubmenu = ref<DropdownItem['value'] | null>(null)

// Mounted submenu triggers and contents by item value: the triggers to measure the room beside their
// menu, the contents for the nested-layer guard.
const submenuTriggers = new Map<DropdownItem['value'], Element>()
const submenuContents = new Map<DropdownItem['value'], Element>()

const track =
  (elements: Map<DropdownItem['value'], Element>) =>
  (value: DropdownItem['value'], instance: Element | ComponentPublicInstance | null) => {
    if (instance && '$el' in instance) {
      elements.set(value, instance.$el)
      return
    }

    elements.delete(value)
  }

const trackTrigger = track(submenuTriggers)
const trackContent = track(submenuContents)

// RAC submenu popover: 12px container padding
const COLLISION_PADDING = 12

// How far the open submenu moves down from its trigger row's top: the row's height when it fits on
// neither side of its menu and `submenuClearsTrigger` is set, or 0.
const submenuAlignOffset = ref(0)

const clearingOffset = (trigger: Element | undefined): number => {
  const menu = trigger?.closest('[role=menu]')
  if (!ctx.submenuClearsTrigger || !trigger || !menu) return 0

  // The submenu has at least its parent menu's width
  const row = trigger.getBoundingClientRect()
  const needed = menu.getBoundingClientRect().width + ctx.submenuSideOffset + COLLISION_PADDING
  const hasRoom = row.right + needed <= window.innerWidth || row.left - needed >= 0

  return hasRoom ? 0 : row.height
}

const setSubmenuOpen = (value: DropdownItem['value'], open: boolean) => {
  if (open) {
    submenuAlignOffset.value = clearingOffset(submenuTriggers.get(value))
    openSubmenu.value = value

    return
  }

  if (openSubmenu.value === value) openSubmenu.value = null
}

// Reka closes the whole menu on Escape inside a submenu; RAC closes only that submenu and refocuses
// its trigger. Stopping the event here keeps it from Reka's document-level Escape listener.
const onSubmenuKeydown = (event: KeyboardEvent) => {
  if (event.key !== 'Escape') return
  const content = event.currentTarget as HTMLElement
  event.preventDefault()
  event.stopPropagation()
  openSubmenu.value = null
  const root = content.getRootNode() as Document | ShadowRoot
  root.querySelector<HTMLElement>(`[aria-controls="${content.id}"]`)?.focus()
}

const onSubmenuContentKeydown = (event: KeyboardEvent) => {
  ctx.onMenuKeydown(event)
  onSubmenuKeydown(event)
}

const key = (entry: DropdownEntry, index: number) => {
  return isSeparator(entry) || isSection(entry) ? `${entry.type}-${index}` : `item-${entry.value}`
}
</script>
