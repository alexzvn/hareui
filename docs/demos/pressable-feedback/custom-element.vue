<template>
  <div class="grid w-full max-w-sm gap-3">
    <PressableFeedback
      v-for="item in items"
      :key="item.title"
      as="div"
      :ripple="{ hoverOpacity: 0.04, pressedOpacity: 0.08 }"
      class="flex w-full items-center gap-3 rounded-2xl bg-surface p-4 text-start shadow-surface"
      @click="selected = item.title"
    >
      <span
        class="flex size-10 shrink-0 items-center justify-center rounded-xl bg-default text-foreground"
      >
        <Icon :icon="item.icon" class="size-5" />
      </span>
      <span class="flex min-w-0 flex-col">
        <span class="text-sm font-medium text-foreground">{{ item.title }}</span>
        <span class="text-xs text-muted">{{ item.description }}</span>
      </span>
    </PressableFeedback>
    <p class="text-xs text-muted">Selected: {{ selected }}</p>
  </div>
</template>

<script setup lang="ts">
import { PressableFeedback } from '@hareui/vue'
import { Icon } from '@iconify/vue'
import { ref } from 'vue'

const items = [
  { icon: 'gravity-ui:bell', title: 'Notifications', description: 'Email, push and in-app alerts' },
  { icon: 'gravity-ui:lock', title: 'Security', description: 'Password, passkeys and sessions' },
  { icon: 'gravity-ui:globe', title: 'Language', description: 'English (United States)' },
]

const selected = ref('None')
</script>
