<script setup lang="ts">
import type { CheckboxGroupItem } from '@hareui/vue'
import { CheckboxGroup } from '@hareui/vue'
import { Icon } from '@iconify/vue'

const contentClass = 'w-full items-start gap-3 rounded-xl border border-border/50 bg-default px-4 py-3 transition-colors hover:bg-default-hover data-[selected=true]:border-primary/30 data-[selected=true]:bg-primary-soft'
const controlClass = 'mt-0.5'

interface AddOn extends CheckboxGroupItem {
  icon: string
  desc: string
}

const addOns: AddOn[] = [
  { icon: 'gravity-ui:envelope', label: 'Email alerts', desc: 'Get notified by email about important changes', value: 'email-alerts' },
  { icon: 'gravity-ui:comment', label: 'Comment mentions', desc: 'Receive a notification when someone mentions you', value: 'comment-mentions' },
  { icon: 'gravity-ui:bell', label: 'Push notifications', desc: 'Get push notifications on your devices', value: 'push-notifications' },
]
</script>

<template>
  <CheckboxGroup
    name="addons"
    label="Notification add-ons"
    class="w-full max-w-sm gap-2 **:data-[slot=checkbox]:mt-0"
    :default-value="['email-alerts']"
    :items="addOns"
    :ui="{ content: contentClass, control: controlClass }"
  >
    <template #item-label="{ item }">
      <div class="flex flex-1 items-start gap-3">
        <Icon :icon="item.icon" class="mt-0.5 size-5 shrink-0 text-muted" />
        <div class="flex flex-col gap-0.5">
          <span class="font-medium text-foreground">{{ item.label }}</span>
          <span class="text-sm text-muted">{{ item.desc }}</span>
        </div>
      </div>
    </template>
  </CheckboxGroup>
</template>
