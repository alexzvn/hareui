<script setup lang="ts">
import { CheckboxButtonGroup, CheckboxButtonGroupItem } from '@hareui/vue'
import { Icon } from '@iconify/vue'

const channels = [
  { value: 'email', label: 'Email', description: 'A daily digest of task updates', icon: 'gravity-ui:envelope' },
  { value: 'push', label: 'Push', description: 'Instant alerts on your phone', icon: 'gravity-ui:bell' },
  { value: 'chat', label: 'Chat', description: 'Messages in your team channel', icon: 'gravity-ui:comment' },
]
</script>

<template>
  <CheckboxButtonGroup
    class="w-[340px]"
    name="channels"
    label="Notify me by"
    variant="secondary"
    :default-value="['email', 'chat']"
  >
    <CheckboxButtonGroupItem
      v-for="channel in channels"
      :key="channel.value"
      :indicator="false"
      :value="channel.value"
      :label="channel.label"
      :description="channel.description"
    >
      <template #icon>
        <Icon :icon="channel.icon" />
      </template>
    </CheckboxButtonGroupItem>
  </CheckboxButtonGroup>
</template>
