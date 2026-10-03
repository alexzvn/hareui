<script setup lang="ts">
import type { DateValue } from '@internationalized/date'
import { getLocalTimeZone, today } from '@internationalized/date'
import { DateField } from '@hareui/vue'
import { computed, shallowRef } from 'vue'

const value = shallowRef<DateValue | null>(null)
const todayDate = today(getLocalTimeZone())
const isInvalid = computed(() => value.value !== null && value.value.compare(todayDate) < 0)
</script>

<template>
  <div class="flex flex-col gap-4">
    <DateField
      v-model="value"
      required
      class="w-[256px]"
      :invalid="isInvalid"
      :min-value="todayDate"
      name="date"
      label="Date"
      error-message="Date must be today or in the future"
      description="Enter a date from today onwards"
    />
  </div>
</template>
