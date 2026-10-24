<script setup lang="ts">
import type { CheckboxGroupItem } from '@hareui/vue'
import { CheckboxGroup } from '@hareui/vue'

const controlClass = 'bg-success-soft before:bg-success'
const indicatorClass =
  '**:data-[slot=checkbox-default-indicator--checkmark]:text-success-foreground'

const channels: CheckboxGroupItem[] = [
  { label: 'Email', value: 'email' },
  { label: 'SMS', value: 'sms' },
  { label: 'Push', value: 'push' },
]
</script>

<template>
  <CheckboxGroup
    name="notification-channels"
    label="Notification channels"
    description="Choose how we should reach you for account updates."
    class="gap-3 **:data-[slot=checkbox]:mt-0"
    :default-value="['email']"
    :items="channels"
    :ui="{ control: controlClass, indicator: indicatorClass }"
  />
</template>
