<template>
  <div class="w-[min(440px,calc(100vw-2rem))] rounded-3xl bg-default p-4">
    <RadioButtonGroup
      class="grid-cols-2 gap-2"
      default-value="daily"
      layout="grid"
      name="backup-schedule"
      label="Back up my files"
    >
      <RadioButtonGroupItem
        v-for="(schedule, every) in schedules"
        :key="every"
        class="px-4 py-3"
        :value="every"
        :label="every"
        :description="`${schedule.copies} copies · ${schedule.storage}`"
        :ui="{ itemLabel: 'capitalize' }"
      >
        <template #indicator>
          <Icon icon="gravity-ui:shield-check" />
        </template>
      </RadioButtonGroupItem>
    </RadioButtonGroup>
  </div>
</template>

<script setup lang="ts">
import { RadioButtonGroup, RadioButtonGroupItem } from '@hareui/vue'
import { Icon } from '@iconify/vue'

const schedules = {
  hourly: { copies: 24, storage: '18 GB' },
  daily: { copies: 30, storage: '7.5 GB' },
  weekly: { copies: 12, storage: '3.2 GB' },
  monthly: { copies: 6, storage: '1.1 GB' },
}
</script>
