<script setup lang="ts">
import { TimeField } from '@hareui/vue'
import { getLocalTimeZone, now, Time } from '@internationalized/date'

const currentTime = now(getLocalTimeZone())
const timeValue = new Time(currentTime.hour, currentTime.minute, currentTime.second)
</script>

<template>
  <div class="flex flex-col gap-4">
    <TimeField
      disabled
      class="w-[256px]"
      name="time"
      label="Time"
      :default-value="timeValue"
      description="This time field is disabled"
    />
    <TimeField
      disabled
      class="w-[256px]"
      name="time-empty"
      label="Time"
      description="This time field is disabled"
    />
  </div>
</template>
