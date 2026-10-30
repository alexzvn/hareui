<template>
  <Card class="w-full max-w-sm">
    <template #header>
      <div class="flex items-center justify-between">
        <span class="text-sm text-muted">Return #RT-20931</span>
        <Chip size="sm" color="accent">In progress</Chip>
      </div>
      <h3 class="mt-2 text-xl font-semibold text-foreground">Refund on its way</h3>
      <p class="text-sm text-muted">Usually lands within 3 working days</p>
    </template>

    <Stepper
      :items="items"
      orientation="vertical"
      :default-value="2"
      disabled
      :ui="{ header: 'flex-1', wrapper: 'flex-1 items-stretch' }"
    >
      <template #indicator="{ state, ui }">
        <Icon v-if="state === 'completed'" icon="gravity-ui:check" :class="ui.icon()" />
        <span v-else-if="state === 'active'" class="size-2 rounded-full bg-current" />
        <span v-else />
      </template>

      <template #title="{ item, state }">
        <span class="flex justify-between gap-4" :class="state === 'active' && 'text-accent'">
          <span>{{ item.title }}</span>
          <span class="font-normal" :class="state === 'active' ? 'font-medium' : 'text-muted'">
            {{ item.time ?? '—' }}
          </span>
        </span>
      </template>
    </Stepper>
  </Card>
</template>

<script setup lang="ts">
import type { StepperItem } from '@hareui/vue'
import { Card, Chip, Stepper } from '@hareui/vue'
import { Icon } from '@iconify/vue'

const items: StepperItem[] = [
  { title: 'Return requested', description: 'Reason: wrong size', time: 'Oct 12, 9:14 AM' },
  { title: 'Parcel received', description: 'Checked at our warehouse', time: 'Oct 15, 2:40 PM' },
  {
    title: 'Refund approved',
    description: 'Sent to your Visa ending 4417',
    time: 'Oct 16, 11:05 AM',
    progress: 0.35,
  },
  { title: 'Money in your account', description: 'Waiting on your bank' },
]
</script>
