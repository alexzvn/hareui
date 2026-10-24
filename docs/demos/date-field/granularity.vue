<template>
  <div class="flex gap-4">
    <DateField
      class="w-[256px]"
      :default-value="defaultValue"
      :granularity="granularity"
      name="granularity-date"
      label="Appointment Date"
    />
    <div class="flex flex-col gap-1">
      <div class="flex items-center gap-2">
        <Label>Granularity</Label>
        <Tooltip :delay="0">
          <template #default>
            <Icon
              aria-label="Granularity information"
              class="size-4 text-muted"
              icon="gravity-ui:circle-question"
            />
          </template>
          <template #content>
            <p>
              Determines the smallest unit displayed in the date picker. By default, this is "day"
              for dates, and "minute" for times.
            </p>
          </template>
        </Tooltip>
      </div>
      <Select
        v-model="selectValue"
        aria-label="Granularity"
        class="w-[110px]"
        placeholder="Select granularity"
        variant="secondary"
        :items="granularityOptions"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ListBoxItem } from '@hareui/vue'
import { DateField, Label, Select, Tooltip } from '@hareui/vue'
import { Icon } from '@iconify/vue'
import type { DateValue } from '@internationalized/date'
import { parseDate, parseZonedDateTime } from '@internationalized/date'
import { computed, ref } from 'vue'

const granularityOptions: ListBoxItem[] = [
  { value: 'day', label: 'Day' },
  { value: 'hour', label: 'Hour' },
  { value: 'minute', label: 'Minute' },
  { value: 'second', label: 'Second' },
]

const granularity = ref<'day' | 'hour' | 'minute' | 'second'>('day')
const selectValue = computed({
  get: () => granularity.value,
  set: (value) => {
    granularity.value = value as typeof granularity.value
  },
})

// Determine appropriate default value based on granularity
const defaultValue = computed<DateValue>(() =>
  granularity.value === 'day'
    ? parseDate('2025-02-03')
    : parseZonedDateTime('2025-02-03T08:45:00[America/Los_Angeles]'),
)
</script>
