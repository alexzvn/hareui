<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { Switch } from '@hareui/vue'
import { reactive } from 'vue'

const icons = [
  { key: 'check', off: 'gravity-ui:power', on: 'gravity-ui:check', selectedControlClass: 'bg-green-500/80' },
  { key: 'darkMode', off: 'gravity-ui:moon', on: 'gravity-ui:sun', selectedControlClass: '' },
  { key: 'microphone', off: 'gravity-ui:microphone', on: 'gravity-ui:microphone-slash', selectedControlClass: 'bg-red-500/80' },
  { key: 'notification', off: 'gravity-ui:bell-slash', on: 'gravity-ui:bell-fill', selectedControlClass: 'bg-purple-500/80' },
  { key: 'volume', off: 'gravity-ui:volume-fill', on: 'gravity-ui:volume-slash-fill', selectedControlClass: 'bg-blue-500/80' },
]

const selected = reactive<Record<string, boolean>>(
  Object.fromEntries(icons.map(icon => [icon.key, true])),
)
</script>

<template>
  <div class="flex gap-3">
    <Switch
      v-for="icon in icons"
      :key="icon.key"
      v-model="selected[icon.key]"
      :aria-label="icon.key"
      size="lg"
      :ui="{ control: selected[icon.key] ? icon.selectedControlClass : '' }"
    >
      <template #icon="{ checked }">
        <Icon
          :icon="checked ? icon.on : icon.off"
          class="size-3 text-inherit"
          :class="checked ? 'opacity-100' : 'opacity-70'"
        />
      </template>
    </Switch>
  </div>
</template>
