<script setup lang="ts">
import { RadioButtonGroup, RadioButtonGroupItem } from '@hareui/vue'
import { Icon } from '@iconify/vue'
import { h } from 'vue'

const channels = [
  {
    value: 'email',
    title: 'Email',
    description: 'A daily digest at 9:00',
    icon: 'gravity-ui:envelope',
  },
  {
    value: 'sms',
    title: 'Text message',
    description: 'Only for urgent alerts',
    icon: 'gravity-ui:comment',
  },
  {
    value: 'push',
    title: 'Push',
    description: 'On your phone, right away',
    icon: 'gravity-ui:smartphone',
  },
  {
    value: 'in-app',
    title: 'In-app',
    description: 'In the bell menu, no sound',
    icon: 'gravity-ui:bell',
  },
]
</script>

<template>
  <RadioButtonGroup
    class="w-full max-w-2xl grid-cols-1 sm:grid-cols-2"
    default-value="email"
    layout="grid"
    name="notification-channel"
    variant="secondary"
    label="Notify me by"
  >
    <RadioButtonGroupItem
      v-for="channel in channels"
      :key="channel.value"
      :value="channel.value"
      :label="channel.title"
      :description="channel.description"
      :icon="() => h(Icon, { icon: channel.icon })"
      :indicator="false"
    />
  </RadioButtonGroup>
</template>
