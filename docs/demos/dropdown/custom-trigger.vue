<script setup lang="ts">
import type { DropdownEntry } from '@hareui/vue'
import { Avatar, Dropdown, Label } from '@hareui/vue'
import { Icon } from '@iconify/vue'

// Equivalent of HeroUI's `Dropdown.Trigger` (a pressable wrapper styled by `.dropdown__trigger`)
// around non-button content.
const triggerClass = [
  'inline-block rounded-full outline-none transform-gpu cursor-(--cursor-interactive)',
  '[transition:transform_250ms_var(--ease-out-quart),background-color_150ms_var(--ease-smooth),box-shadow_150ms_var(--ease-out)] motion-reduce:transition-none',
  'focus-visible:status-focused active:[transform:scale(0.97)]',
].join(' ')

const items: DropdownEntry[] = [
  { value: 'dashboard', label: 'Dashboard' },
  { value: 'profile', label: 'Profile' },
  { value: 'settings', label: 'Settings', icon: 'gravity-ui:gear' },
  { value: 'new-project', label: 'Create Team', icon: 'gravity-ui:persons' },
  { value: 'logout', label: 'Log Out', icon: 'gravity-ui:arrow-right-from-square', variant: 'danger' },
]
</script>

<template>
  <Dropdown :items="items">
    <button data-slot="dropdown-trigger" type="button" :class="triggerClass">
      <Avatar alt="Junior Garcia" :delay-ms="600" fallback="JD" src="https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/orange.jpg" />
    </button>
    <template #content-top>
      <div class="px-3 pt-3 pb-1">
        <div class="flex items-center gap-2">
          <Avatar alt="" :delay-ms="600" fallback="JD" size="sm" src="https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/orange.jpg" />
          <div class="flex flex-col gap-0">
            <p class="text-sm leading-5 font-medium">
              Jane Doe
            </p>
            <p class="text-xs leading-none text-muted">
              jane@example.com
            </p>
          </div>
        </div>
      </div>
    </template>
    <template #item="{ item }">
      <div v-if="item.icon" class="flex w-full items-center justify-between gap-2">
        <Label>{{ item.label }}</Label>
        <Icon class="size-3.5" :class="item.variant === 'danger' ? 'text-danger' : 'text-muted'" :icon="item.icon" />
      </div>
      <Label v-else>
        {{ item.label }}
      </Label>
    </template>
  </Dropdown>
</template>
