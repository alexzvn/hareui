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
      @update:open="
        openSubmenu = $event ? entry.value : openSubmenu === entry.value ? null : openSubmenu
      "
    >
      <DropdownMenuOption :item="entry" :group="group" submenu />
      <DropdownMenuPortal :disabled="ctx.portal().disabled" :to="ctx.portal().to">
        <!-- RAC submenu popover: placement "end top", offset 8, 12px container padding -->
        <DropdownMenuSubContent
          :ref="
            (instance) => setSubmenuContent(entry.value, instance as ComponentPublicInstance | null)
          "
          loop
          :side-offset="8"
          :collision-padding="12"
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
import type {
  DropdownEntry,
  DropdownItem,
  DropdownSection,
  DropdownSeparator,
} from './Dropdown.types'
import DropdownMenuOption from './DropdownMenuOption.vue'

defineProps<{
  entries: DropdownEntry[]
  group: DropdownSelectionGroup
}>()

const ctx = inject(dropdownContextKey)!
const baseId = useId(undefined, 'hareui-dropdown-section')

const isSeparator = (entry: DropdownEntry): entry is DropdownSeparator =>
  (entry as DropdownSeparator).type === 'separator'

const isSection = (entry: DropdownEntry): entry is DropdownSection =>
  (entry as DropdownSection).type === 'section'

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

// Mounted submenu contents by item value, for the nested-layer guard.
const submenuContents = new Map<DropdownItem['value'], Element>()
const setSubmenuContent = (
  value: DropdownItem['value'],
  instance: Element | ComponentPublicInstance | null,
) => {
  if (instance && '$el' in instance) {
    submenuContents.set(value, instance.$el)
    return
  }

  submenuContents.delete(value)
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
