<template>
  <div class="w-full max-w-md">
    <ListView :items="items" aria-label="Recipes">
      <template #item-action="{ item }">
        <Dropdown :items="menu" @action="(action) => (last = `${item.label}: ${action}`)">
          <Button
            icon-only
            size="sm"
            variant="ghost"
            :aria-label="`More actions for ${item.label}`"
          >
            <Icon icon="gravity-ui:ellipsis" />
          </Button>
        </Dropdown>
      </template>
    </ListView>
    <p class="mt-3 text-sm text-muted">Last action: {{ last ?? 'none' }}</p>
  </div>
</template>

<script setup lang="ts">
import type { DropdownEntry, ListViewItem } from '@hareui/vue'
import { Button, Dropdown, ListView } from '@hareui/vue'
import { Icon } from '@iconify/vue'
import { ref } from 'vue'

const items: ListViewItem[] = [
  { value: 'shakshuka', label: 'Shakshuka', description: '25 min · Breakfast' },
  { value: 'miso', label: 'Miso soup', description: '15 min · Starter' },
  { value: 'risotto', label: 'Mushroom risotto', description: '40 min · Main' },
  { value: 'tart', label: 'Lemon tart', description: '1 h 10 min · Dessert' },
]

const menu: DropdownEntry[] = [
  { value: 'open', label: 'Open' },
  { value: 'share', label: 'Share' },
  { value: 'delete', label: 'Delete', variant: 'danger' },
]

const last = ref<string>()
</script>
