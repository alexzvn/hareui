<script setup lang="ts">
import type { DropdownEntry, NavigationMenuItem } from '@hareui/vue'
import { Button, NavigationMenu } from '@hareui/vue'
import { Icon } from '@iconify/vue'
import { h, ref } from 'vue'

const icon = (name: string) => (attrs: Record<string, unknown>) => h(Icon, { ...attrs, icon: `gravity-ui:${name}` })

const collapsed = ref(false)
const status = ref('Select a page to get started.')

// The ⋮ menu of a project row: shown on hover, keyboard focus and on touch screens.
const actions = (name: string): DropdownEntry[] => [
  { value: 'open', label: 'Open', icon: icon('folder-open'), onSelect: () => status.value = `Opened ${name}.` },
  { value: 'duplicate', label: 'Duplicate', icon: icon('copy'), onSelect: () => status.value = `Duplicated ${name}.` },
  { value: 'delete', label: 'Delete', icon: icon('trash-bin'), variant: 'danger', onSelect: () => status.value = `Deleted ${name}.` },
]

const items: NavigationMenuItem[][] = [
  [
    { label: 'Home', icon: icon('house'), active: true },
    { label: 'Inbox', icon: icon('envelope'), badge: 12 },
    { label: 'Reports', icon: icon('chart-column') },
  ],
  [
    { label: 'Projects', type: 'label' },
    {
      label: 'Design System',
      icon: icon('folder'),
      defaultOpen: true,
      actions: actions('Design System'),
      children: [
        { label: 'Foundations', actions: actions('Foundations') },
        { label: 'Components', active: true, actions: actions('Components') },
        { label: 'Patterns', actions: actions('Patterns') },
      ],
    },
    { label: 'Travel', icon: icon('folder'), actions: actions('Travel'), children: [{ label: 'Itinerary' }, { label: 'Bookings' }] },
  ],
  [
    { label: 'Settings', icon: icon('gear'), kbds: ['command', ','] },
    { label: 'Help', icon: icon('circle-question') },
  ],
]
</script>

<template>
  <!-- Tall enough for every row, so Settings and Help aren't hidden below the fold. -->
  <div class="flex h-[520px] w-full overflow-hidden rounded-3xl border border-separator bg-surface">
    <!-- Only the width animates when the sidebar collapses. On phones the expanded sidebar takes the whole card. -->
    <aside
      class="flex shrink-0 flex-col gap-2 overflow-hidden py-2 transition-[width] duration-200 ease-[ease] motion-reduce:transition-none"
      :class="collapsed ? 'w-12' : 'w-60 max-sm:w-full'"
    >
      <!-- The padding lives on the scroll container so the rows' focus rings are not clipped. -->
      <NavigationMenu
        :collapsed="collapsed"
        orientation="vertical"
        tooltip
        popover
        :items="items"
        class="flex-1 overflow-y-auto py-1"
        :class="collapsed ? 'px-1.5' : 'px-3'"
      />
      <div :class="collapsed ? 'px-1.5' : 'px-3'">
        <!-- `mx-0.5` lines the glyph up with the menu icons, expanded and collapsed. -->
        <Button aria-label="Toggle sidebar" icon-only size="sm" variant="ghost" class="mx-0.5" @click="collapsed = !collapsed">
          <Icon icon="gravity-ui:layout-side-content-left" />
        </Button>
      </div>
    </aside>
    <!-- The divider is the content's border so it doesn't add to the sidebar's width. -->
    <div class="flex-1 border-s border-separator p-6 text-sm text-muted" :class="{ 'max-sm:hidden': !collapsed }">
      {{ status }}
    </div>
  </div>
</template>
