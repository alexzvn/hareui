<script setup lang="ts">
import type { Time } from '@internationalized/date'
import { parseTime } from '@internationalized/date'
import { TimeField } from '@hareui/vue'
import { computed, shallowRef } from 'vue'

const value = shallowRef<Time | null>(null)
const minTime = parseTime('09:00')
const maxTime = parseTime('17:00')
const isInvalid = computed(() => value.value !== null && (value.value.compare(minTime) < 0 || value.value.compare(maxTime) > 0))
</script>

<template>
  <div class="flex flex-col gap-4">
    <TimeField
      v-model="value"
      required
      class="w-[256px]"
      :invalid="isInvalid"
      :min-value="minTime"
      :max-value="maxTime"
      name="time"
      label="Time"
      error-message="Time must be between 9:00 AM and 5:00 PM"
      description="Enter a time between 9:00 AM and 5:00 PM"
    />
  </div>
</template>
