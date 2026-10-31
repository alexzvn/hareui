<template>
  <div class="flex w-full max-w-md flex-col gap-3">
    <ItemCard
      :icon="icon('calendar')"
      title="Week starts on"
      description="Applies to every calendar"
    >
      <template #action>
        <InlineSelect v-model="weekStart" aria-label="Week starts on" :items="days" />
      </template>
    </ItemCard>
    <ItemCard :icon="icon('bell')" title="Reminders" description="Where reminders reach you">
      <template #action>
        <InlineSelect
          v-model="channels"
          aria-label="Reminder channels"
          selection-mode="multiple"
          :items="channelOptions"
          :ui="{ popover: 'w-44' }"
        />
      </template>
    </ItemCard>
  </div>
</template>

<script setup lang="ts">
import type { ListBoxItem, SelectValue } from '@hareui/vue'
import { InlineSelect, ItemCard } from '@hareui/vue'
import { Icon } from '@iconify/vue'
import { h, ref } from 'vue'

const icon = (name: string) => (attrs: Record<string, unknown>) =>
  h(Icon, { ...attrs, icon: `gravity-ui:${name}` })

const days: ListBoxItem[] = [
  { value: 'saturday', label: 'Saturday' },
  { value: 'sunday', label: 'Sunday' },
  { value: 'monday', label: 'Monday' },
]

const channelOptions: ListBoxItem[] = [
  { value: 'email', label: 'Email' },
  { value: 'sms', label: 'SMS' },
  { value: 'push', label: 'Push' },
]

const weekStart = ref<SelectValue>('monday')
const channels = ref<SelectValue>(['push'])
</script>
