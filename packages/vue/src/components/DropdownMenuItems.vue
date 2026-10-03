<script setup lang="ts">
// Internal: renders a list of Dropdown entries (items, sections, separators, submenus). Recursive
// for submenus. Not exported.
import type { DropdownEntry, DropdownItem, DropdownSection, DropdownSeparator } from './Dropdown.vue'
import type { DropdownSelectionGroup } from './dropdownContext'
import { DropdownMenuGroup, DropdownMenuLabel, DropdownMenuPortal, DropdownMenuSub, DropdownMenuSubContent, useId } from 'reka-ui'
import { inject } from 'vue'
import { dropdownContextKey } from './dropdownContext'
import DropdownMenuOption from './DropdownMenuOption.vue'

defineProps<{
  entries: DropdownEntry[]
  group: DropdownSelectionGroup
}>()

const ctx = inject(dropdownContextKey)!
const baseId = useId(undefined, 'hareui-dropdown-section')

const isSeparator = (entry: DropdownEntry): entry is DropdownSeparator => (entry as DropdownSeparator).type === 'separator'
const isSection = (entry: DropdownEntry): entry is DropdownSection => (entry as DropdownSection).type === 'section'
const hasSubmenu = (entry: DropdownEntry): entry is DropdownItem & { items: DropdownEntry[] } => !!(entry as DropdownItem).items?.length

// Submenus are separate menus without a selection mode (RAC: a nested `Menu` has its own selection).
const submenuGroup: DropdownSelectionGroup = { mode: 'none', indicator: false, isSelected: () => false, toggle: () => {} }

function key(entry: DropdownEntry, index: number) {
  return isSeparator(entry) || isSection(entry) ? `${entry.type}-${index}` : `item-${entry.value}`
}
</script>

<template>
  <template v-for="(entry, index) in entries" :key="key(entry, index)">
    <hr
      v-if="isSeparator(entry)"
      data-slot="separator"
      data-orientation="horizontal"
      :class="ctx.classes().separator!({ class: ctx.ui()?.separator })"
    >
    <DropdownMenuGroup
      v-else-if="isSection(entry)"
      as="section"
      :aria-labelledby="entry.label || ctx.slots['section-label'] ? `${baseId}-${index}` : undefined"
      :class="ctx.classes().section!({ class: [ctx.ui()?.section, entry.class] })"
    >
      <DropdownMenuLabel
        v-if="entry.label || ctx.slots['section-label']"
        :id="`${baseId}-${index}`"
        as="header"
        data-slot="header"
        :class="ctx.classes().header!({ class: ctx.ui()?.header })"
      >
        <component :is="ctx.slots['section-label']" v-if="ctx.slots['section-label']" :section="entry" />
        <template v-else>
          {{ entry.label }}
        </template>
      </DropdownMenuLabel>
      <DropdownMenuItems :entries="entry.items" :group="ctx.sectionGroup(entry, group)" />
    </DropdownMenuGroup>
    <DropdownMenuSub v-else-if="hasSubmenu(entry)">
      <DropdownMenuOption :item="entry" :group="group" submenu />
      <DropdownMenuPortal>
        <!-- RAC submenu popover: placement "end top", offset 8, 12px container padding -->
        <DropdownMenuSubContent
          :side-offset="8"
          :collision-padding="12"
          data-slot="dropdown-popover"
          :class="ctx.classes().popover!({ class: ctx.ui()?.popover })"
        >
          <div data-slot="dropdown-menu" :class="ctx.classes().menu!({ class: ctx.ui()?.menu })">
            <DropdownMenuItems :entries="entry.items" :group="submenuGroup" />
          </div>
        </DropdownMenuSubContent>
      </DropdownMenuPortal>
    </DropdownMenuSub>
    <DropdownMenuOption v-else :item="entry" :group="group" />
  </template>
</template>
